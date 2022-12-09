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

// objects.package
let packages: z.infer<typeof FetchSchema>["objects"][number]["package"][] = []

for (let i = 0; i < 39; i++) {
  console.log("Going through page " + i);
  const request = await fetch(buildURL(i));

  const data = await request.json() as unknown;

  const { objects } = FetchSchema.parse(data);

  const newPackages = objects.map((obj) => obj.package);

  packages = [...packages, ...newPackages];
}

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
