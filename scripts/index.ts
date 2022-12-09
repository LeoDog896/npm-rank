import { z } from "https://deno.land/x/zod@v3.20.0/mod.ts";

function buildURL(page: number) {
  return `https://registry.npmjs.com/-/v1/search?size=250&popularity=1.0&quality=0.0&maintenance=0.0&text=boost-exact:false&from=${
    page * 250
  }`;
}

const FetchSchema = z.object({
  objects: z.array(z.object({
    package: z.object({
        name: z.string(),
        version: z.string(),
        description: z.string().optional(),
        links: z.object({
            npm: z.string(),
            homepage: z.string().optional(),
            repository: z.string().optional(),
        }),
    })
  })),
});

type Package = z.infer<typeof FetchSchema>["objects"][number]["package"];

async function getPage(page: number): Promise<Package[]> {
  console.log("Starting through page " + page);
  const request = await fetch(buildURL(page));

  const data = await request.json() as unknown;

  const { objects } = FetchSchema.parse(data);

  return objects.map((obj) => obj.package);
}

// 40 pages
const packageRequests = await Promise.allSettled(Array(40).fill(0).map((_, i) => {
    return getPage(i).then((packages) => ({ page: i, packages }));
}))

const packages: Package[] = packageRequests.flatMap((req) => {
    if (req.status === "fulfilled") {
        console.log(`Page ${req.value.page} was successful`);
        return req.value.packages;
    }

    throw req.reason;
})

await Deno.writeTextFile("./raw.txt", JSON.stringify(packages));

function optionallyFormat(arg: string | undefined, label: string): string {
  if (!arg) {
    return "";
  }

  return ` ([${label}](${arg}))`;
}

const mdContent = `# Packages

Ordered list of top 10000 NPM packages:

${
  packages.map((pkg) =>
    `- [${pkg.name}](${pkg.links.npm})
    - ${pkg.description}
    - v${pkg.version} ${optionallyFormat(pkg.links.homepage, "homepage")}${
      optionallyFormat(pkg.links.repository, "repository")
    }`
  ).join("\n")
}
`;

await Deno.writeTextFile("./src/PACKAGES.md", mdContent);

console.log("Wrote data!");
