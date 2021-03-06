const fetch = require("node-fetch");
const xml = require("xml-js");
const util = require('util')

const RETAILERS = {
    rei: {
        name: 'rei',
        datafeed_id: 115,
    },
    backcountry: {
        name: 'backcountry',
        datafeed_id: 52,
    },
    osprey: {
        name: 'osprey',
        datafeed_id: 6969,
    },
};


main();

async function main() {
    const rei = process.argv[2];
    const bc = process.argv[3];
    const osprey = process.argv[4];

    var affiliates = [];
    if (rei !== "-") {
        affiliates.push({
            ...RETAILERS.rei,
            sku: rei,
        });
    }
    if (bc !== "-") {
        affiliates.push({
            ...RETAILERS.backcountry,
            sku: bc,
        });
    }
    if (osprey !== "-") {
        affiliates.push({
            ...RETAILERS.osprey,
            sku: osprey,
        });
    }

    const productContent = await extractProductContent(affiliates);
    const priceHistory = await extractProductPriceHistory(affiliates);

    var name = "";
    if (Object.keys(productContent.rei).length > 0) {
        name = productContent.rei.Product.Product_Name._text;
    } else if (Object.keys(productContent.backcountry).length > 0) {
        name = productContent.backcountry.Product.Product_Name._text;
    }

    const data = {
        uid: rei,
        name: name,
        product_content: productContent,
        price_history: priceHistory,
    };
    console.log(JSON.stringify(data, null, 2));
}

async function fetchAvantlink(endpoint) {
    return await fetch(endpoint, {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "upgrade-insecure-requests": "1",
            "cookie": "userDeviceId=dbce491c-835d-4aca-ab58-8e520d3e26e4; merchant_id_10060=179682_d2071bc05-_-10060-pl-52-179682-1177900-52%7E; merchant_id_10248=179682_d2079b0a1-_-10248-pl-115-179682-631830-115%7E"
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors"
    });
}

/************************************************
 * Product Content
 ***********************************************/

async function extractProductContent(affiliates) {
    var data = {};
    for (const affiliate of affiliates) {
        const productData = await fetchAndParseAffiliateProductContent(
            affiliate.datafeed_id,
            affiliate.sku,
        );
        data[affiliate.name] = productData;
    }
    return data;
}

async function fetchAndParseAffiliateProductContent(datafeed_id, sku) {
    if (sku === "null") {
        return {};
    }
    const productContentEndpoint = `http://classic.avantlink.com/api.php?affiliate_id=144850&module=ProductContent&output=xml&website_id=179682&merchant_id=16517&datafeed_id=${datafeed_id}&sku=${sku}`;

    const response = await fetchAvantlink(productContentEndpoint);
    const data = await response.text();

    if (data.includes("error")) {
        return {};
    }

    const obj = xml.xml2js(data, {compact: true, spaces: 4});
    return obj.Root;
}


/************************************************
 * Price History
 ***********************************************/

async function extractProductPriceHistory(affiliates) {
    var data = {};
    for (const affiliate of affiliates) {
        const affiliatePriceData = await fetchAndParseAffiliatePriceHistory(
            affiliate.datafeed_id,
            affiliate.sku,
        );
        data[affiliate.name] = affiliatePriceData;
    }
    return data;
}

async function fetchAndParseAffiliatePriceHistory(datafeed_id, sku) {
    if (sku === "null") {
        return { data: [], labels: [] };
    }

    const priceCheckEndpoint = `http://classic.avantlink.com/api.php?affiliate_id=144850&module=ProductPriceCheck&output=csv&merchant_id=16517&datafeed_id=${datafeed_id}&sku=${sku}&show_retail_price=1&show_pricing_history=1`;

    const response = await fetchAvantlink(priceCheckEndpoint);
    const data = await response.text();

    // convert avantlink price data format to:
    //   [{t,y}, {t,y}, ...]
    // this will be used as configs for the chartjs price chart
    const rows = data.split('\n');
    rows.shift();

    var arr = [];
    var labels = [];
    for (const row of rows) {
        if (!row) break;
        const elements = row.split(',');
        arr.push({
            t: elements[0].split(' ')[0],
            y: elements[2].trim()
        });
        labels.push(elements[0].split(' ')[0]);
    }

    return {
        data: arr,
        labels: labels
    }
}
