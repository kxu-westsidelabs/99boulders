const Generator = require("./generate.js");
const fs = require("fs").promises;
const path = require("path");

const BASE_URL = "./pages";
const SKUS = [
    // 134072,     // osprey atmos 65
    // 177492,     // osprey aether 55
    // 126707,     // osprey atmos 50
    // 177493,     // osprey aether 65
    // 126705,     // osprey exos 48
    // 126709,     // osprey exos 58
    // 126716,     // osprey aura 50
    // 126717,     // osprey aura 65
    // 177498,     // osprey ariel 55
    // 177499,     // osprey ariel 65
    // 184887,     // osprey talon 44
    // 177495,     // Osprey Aether Plus 70
    // 126710,     // Osprey Aether Pro 70
    // 141491,     // Osprey Kestrel 48
    // 184888,     // Osprey Kestrel 58
    // 141492,     // Osprey Kyte 46
    // 184890,     // Osprey Kyte 56
    // 126718,     // Osprey Eja 48
    // 126719,     // Osprey Eja 58
    // 126706,     // Osprey Levity 45
    // 142359,     // Osprey Levity 60
    177500,     // Osprey Ariel Plus 60
    126715,     // Osprey Ariel Pro 65
    177571,     // Osprey Ariel Plus 70
    126714,     // Osprey Lumina 45
    142360,     // Osprey Lumina 60
    177497,     // Osprey Aether Plus 85
    177496,     // Osprey Aether Plus 100
];

(async () => {
    // load all products
    const filePath = path.resolve(__dirname, `../../data/products/`);
    const allProducts = await loadProductsData(filePath);

    for (const sku of SKUS) {
        await generate(sku, allProducts);
    }
})();

async function loadProductsData(url) {
    var products = [];
    const files = await fs.readdir(url);
    for (const file of files) {
        if ([ '.DS_Store' ].includes(file)) {
            continue;
        }
        products.push(JSON.parse(
            await fs.readFile(`${url}/${file}`, "utf-8")
        ));
    }
    return products;
}

/**
 * Generate the file path for the sku
 * getFileName(177499) --> ./pages/osprey-men's-atmos-ag-65-pack.html
 */
async function generate(sku, products) {
    const product = products.find(product => product.sku == sku);
    const html = await Generator.generate(product, products);

    // build output file path from product name
    const name = product.name.toLowerCase().replace(/ /g, "-");
    const fileName = `${BASE_URL}/${name}.html`;
    await fs.writeFile(fileName, html);
    console.log(`✅ ${fileName}...`);
}
