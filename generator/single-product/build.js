const Generator = require("./generate.js");
const fs = require("fs").promises;
const path = require("path");

const BASE_URL = "./pages";
const SKUS = [
    134072,     // osprey atmos 65
    177492,     // osprey aether 55
    126707,     // osprey atmos 50
    177493,     // osprey aether 65
    126705,     // osprey exos 48
    126709,     // osprey exos 58
    126716,     // osprey aura 50
    126717,     // osprey aura 65
    177498,     // osprey ariel 55
    177499,     // osprey ariel 65
    184887,     // osprey talon 44
];

main();

async function main() {
    try {
        for (const sku of SKUS) {
            const html = await Generator.generate(sku);
            const fileName = await getFileName(sku);

            await fs.writeFile(fileName, html);
            console.log(`✅ ${fileName}...`);

            break;
        }

    } catch (err) {
        console.error("ERR while generating/writing vs.html", err);
    }

}

/**
 * Generate the file path for the sku
 * 
 * getFileName(177499) --> ./pages/osprey-men's-atmos-ag-65-pack.html
 */
async function getFileName(sku) {
    try {
        const filePath = path.resolve(__dirname, `../../data/products/${sku}.json`);
        const product = JSON.parse(
            await fs.readFile(filePath, "utf-8")
        );
        const name = product.name.toLowerCase().replace(/ /g, "-");
        return `${BASE_URL}/${name}.html`;
    } catch (err) {
        console.log("ERR:", err);
    }
}
