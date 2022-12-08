function buildURL(page: number) {
    return `https://registry.npmjs.com/-/v1/search?size=250&from=${page * 250}&popularity=1.0&quality=0.0&maintenance=0.0&text=boost-exact:false`;
}

let packages: unknown[] = []

for (let i = 0; i < 3; i++) {
    const request = await fetch(buildURL(i));

    const data = await request.json();

    const objects = data.objects.map(package => package.package)

    packages = [...packages, objects]
}

packages = packages.flat()

await Deno.writeTextFile("./data.txt", JSON.stringify(packages))


console.log("Wrote to data.txt")