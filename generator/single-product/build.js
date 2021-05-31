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

(async () => {
    for (const sku of SKUS) {
        await generate(sku);
    }
})();

/**
 * Generate the file path for the sku
 * 
 * getFileName(177499) --> ./pages/osprey-men's-atmos-ag-65-pack.html
 */
async function generate(sku) {
    try {
        // build input file path (data/products/$sku.json)
        const filePath = path.resolve(
            __dirname,
            `../../data/products/${sku}.json`
        );
        const product = JSON.parse(
            await fs.readFile(filePath, "utf-8")
        );

        const html = await Generator.generate(product);

        // build output file path from product name
        const name = product.name.toLowerCase().replace(/ /g, "-");
        const fileName = `${BASE_URL}/${name}.html`;

        await fs.writeFile(fileName, html);
    } catch (err) {
        console.log("ERR while generating/writing single-page html:", err);
    }
}
