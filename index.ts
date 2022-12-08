function buildURL(page: number) {
    return `https://registry.npmjs.com/-/v1/search?size=250&from=${offset * 250}&popularity=1.0&quality=0.0&maintenance=0.0&text=boost-exact:false`;
}

const request = await fetch(buildURL(0));

const data = await request.json();

await Deno.writeTextFile("./data.txt", JSON.stringify(data))
