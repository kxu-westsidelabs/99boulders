const fs = require("fs").promises;
const { parse } = require("node-html-parser");
const util = require('util')

main();

async function main() {
    try {
        const sku = process.argv[2];
        const stringify = process.argv[3];

        const html = await fs.readFile(`./0_html/${sku}.html`, "utf-8");
        const dom = parse(html);

        const data = {
            ...await parseProductTable(dom),
            ...await parseVariants(dom),
            ...await parseReviews(dom),
            ...await parseDividend(dom),
        };

        if (stringify) {
            console.log(JSON.stringify(data));
        } else {
            console.log(util.inspect(data, false, null, true));
        }
    } catch (err) {
        console.log("Error", err);
    }
}

/************************************************
 * Product Table
 ***********************************************/

async function parseProductTable(dom) {
    const rows = dom
        .querySelector('.product-specs-table')
        .querySelector('tbody')
        .querySelectorAll('tr');

    var specs = {};
    for (const row of rows) {
        const header = row.querySelector('th').text.toLowerCase().split(' ').join('_')
        const divs = row.querySelector('td').querySelectorAll('div');

        // handle multi-div values (S, M, L)
        var values = [];
        for (const div of divs) {
            values.push(div.childNodes[0].text.trim());
        }
        specs[header] = (values.length === 1) ? values[0] : values.join(", ");
    }
    return specs;
    //return { specs: specs };
}


/************************************************
 * Variants
 ***********************************************/

async function parseVariants(dom) {
    var variants = {
        colors: [],
        sizes: []
    };

    // colors
    const colors = dom
        .querySelector('.price-group')
        .querySelectorAll('.color-thumb-container');
    for (const color of colors) {
        variants.colors.push(
            color.querySelector('label').getAttribute('data-name')
        );
    }

    // size
    const sizes = dom
        .querySelector('.size-wrapper')
        .querySelector('.size-tile-list').childNodes;
    for (const size of sizes) {
        variants.sizes.push(
            size.querySelector('button').text.trim()
        );
    }

    return {
        colors: variants.colors.join(", "),
        sizes: variants.sizes.join(", "),
    };
}

/************************************************
 * Dividend
 ***********************************************/

async function parseDividend(dom) {
    const dividend = dom
        .querySelector('.dividend-message')
        .querySelector('b');
    return {
        dividend: dividend.text.trim()
    }
}


/************************************************
 * Reviews
 ***********************************************/

async function parseReviews(dom) {
    const reviews = dom.querySelector('.product-rating-navigable');
    const span = reviews.childNodes[1].childNodes[1];
    return {
        rating: span.childNodes[0].text,
        review_count: span.childNodes[1].text.replace(/.*\(|\).*/g, ''),
    }
}

