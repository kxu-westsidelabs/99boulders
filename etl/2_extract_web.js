const fs = require("fs").promises;
const { parse } = require("node-html-parser");
const util = require('util')

main();

async function main() {
    try {
        const sku = process.argv[2];

        const html = await fs.readFile(`./0_html/${sku}.html`, "utf-8");
        const dom = parse(html);

        const data = {
            ...await parseProductTable(dom),
            ...await parseVariants(dom),
            ...await parseReviews(dom),
            ...await parseSliderData(dom),
            ...await parseDividend(dom),
        };
        console.log(JSON.stringify(data, null, 2));
    } catch (err) {
        console.log("Error", err);
    }
}

/************************************************
 * Product Table
 ***********************************************/

async function parseProductTitle(dom) {
    const spans = dom
        .querySelector('.product-buyable-area')
        .querySelector('.product-title')
        .querySelectorAll('span');
    const brandSpan = spans[0].childNodes[1].childNodes[1].childNodes[0];

    return {
        brand: brandSpan.text.trim(),
        product: spans[3].childNodes[0].text.trim(),
    };
}

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
        sizes: [],
    };
    try {

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
    } catch (err) {
        console.error("Error", err);
        return {
            colors: '',
            sizes: '',
        };
    }
}

/************************************************
 * Dividend
 ***********************************************/

async function parseDividend(dom) {
    try {
        const dividend = dom
            .querySelector('.dividend-message')
            .querySelector('b');
        return {
            dividend: dividend.text.trim()
        }
    } catch (err) {
        return { dividend: '' };
    }
}

/************************************************
 * Reviews
 ***********************************************/

async function parseReviews(dom) {
    try {
        const reviews = dom.querySelector('.product-rating-navigable');
        const span = reviews.childNodes[1].childNodes[1];
        return {
            rating: span.childNodes[0].text,
            review_count: span.childNodes[1].text.replace(/.*\(|\).*/g, ''),
        }
    } catch (err) {
        return { rating: '', review_count: 0 };
    }
}

async function parseSliderData(dom) {
    try {
        const bars = dom
            .querySelectorAll('.bv-secondary-rating-summary-bars-container');

        const fit = bars[0]
            .querySelector('.bv-content-slider-value')
            .getAttribute('data-bv-margin-from-stats');
        const ease = bars[1]
            .querySelector('.bv-content-slider-value')
            .getAttribute('data-bv-margin-from-stats');

        return {
            overall_fit_rating: Math.round(fit),
            ease_of_use: Math.round(ease),
        };
    } catch (err) {
        return {
            overall_fit_rating: '',
            ease_of_use: '',
        };
    }
}
