const puppeteer = require("puppeteer");
const { parse } = require("node-html-parser");

(async () => {

    console.log("launching browser...");
    const browser = await puppeteer.launch({
        defaultViewport: null,
        headless: false,
    });
    try {

        const url = 'https://www.rei.com/product/114890';
        console.log(`fetching page: ${url} ...`);
        const page = await browser.newPage();

        await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: 0,
        });

        // parse and get html
        const html = await page.content();
        const dom = parse(html);

        const table = await parseProductTable(dom);
        console.log(table);

    } catch (err) {
        console.log("ERR", err);
    } finally {
        await browser.close();
    }
})();

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

