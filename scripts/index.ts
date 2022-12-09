function buildURL(page: number) {
    return `https://registry.npmjs.com/-/v1/search?size=250&popularity=1.0&quality=0.0&maintenance=0.0&text=boost-exact:false&from=${page * 250}`;
}

let packages: unknown[] = []

for (let i = 0; i < 3; i++) {
    const request = await fetch(buildURL(i));

    const data = await request.json();

    const objects = data.objects.map(pkg => pkg.package);

    packages = [...packages, objects]
}

packages = packages.flat()

await Deno.writeTextFile("./raw.txt", JSON.stringify(packages))

function optionallyFormat(arg: string | undefined, label: string): string {
    if (!arg) {
        return ""
    }

    return ` ([${label}](${arg}))`;
}

const mdContent = `# Packages

Ordered list of top 1000 NPM packages:

${
    packages.map(pkg => `- [${pkg.name}](${pkg.links.npm})
    - ${pkg.description}
    - v${pkg.version} ${optionallyFormat(pkg.links.homepage, "homepage")}${optionallyFormat(pkg.links.repository, "repository")}`).join("\n")
}
`

await Deno.writeTextFile("./src/PACKAGES.md", mdContent)

console.log("Wrote data!")