const GeneratorVs = require("./generate-vs.js");
const fs = require("fs").promises;

const BASE_URL = "./pages";
const PAIRS = [
    [134072, 126707],       //osprey atmos 65 osprey atmos 50
    [177492, 177493],       //osprey aether 55    osprey aether 65
    [126705, 126709],       //osprey exos 48  osprey exos 58
];

main();

async function main() {

    try {
        for (const pair of PAIRS) {
            const sku1 = pair[0];
            const sku2 = pair[1];

            const html = await GeneratorVs.generate(sku1, sku2);
            const fileName = await getFileName(sku1, sku2);
            await fs.writeFile(fileName, html);

            console.log(`✅ ${fileName}...`);
        }

    } catch (err) {
        console.error("ERR while generating/writing vs.html", err);
    }

}

async function getFileName(sku1, sku2) {
    try {
        const p1 = JSON.parse(
            await fs.readFile(`../data/products/${sku1}.json`, "utf-8")
        );
        const p2 = JSON.parse(
            await fs.readFile(`../data/products/${sku2}.json`, "utf-8")
        );

        const n1 = p1.name.toLowerCase().replace(/ /g, "-");
        const n2 = p2.name.toLowerCase().replace(/ /g, "-");

        return `${BASE_URL}/${n1}-vs-${n2}.html`;
    } catch (err) {
        console.log("ERR:", err);
    }
}
