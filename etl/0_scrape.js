const puppeteer = require("puppeteer");

(async () => {
    const browser = await puppeteer.launch({
        defaultViewport: null,
        //headless: false,
    });
    try {
        const sku = process.argv[2];
        const url = `https://www.rei.com/product/${sku}`;
        const page = await browser.newPage();

        await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: 0,
        });

        const html = await page.content();
        console.log(html);

    } catch (err) {
        console.log("ERR", err);
    } finally {
        await browser.close();
    }
})();
