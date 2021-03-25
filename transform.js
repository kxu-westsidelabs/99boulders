const fs = require("fs").promises;
const util = require('util')

main();

async function main() {
    try {

        const sku = process.argv[2];
        const stringify = process.argv[3];

        const api = JSON.parse(
            await fs.readFile(`./1_api/${sku}.json`, "utf-8")
        );
        const web = JSON.parse(
            await fs.readFile(`./2_web/${sku}.json`, "utf-8")
        );
        const product = api.product_content.rei.Product;

        const data = {
            sku: sku,
            name: product.Product_Name._text,
            image: product.Image_URL._text.split("?")[0] + "?size=1000",
            buy_link: product.Buy_Link._text,
            price: product.Retail_Price._text,
            product_specs: getTableData(api, web),
            price_history: api.price_history,
            purchase_info: getBuyData(api, web),
            // some manual data fetching required
        };

        if (stringify) {
            console.log(JSON.stringify(data));
        } else {
            console.log(JSON.stringify(data, null, 2));
        }
    } catch (err) {
        console.log(`Error: ${err}`);
    }
}

/************************************************
 * Product Specs
 ***********************************************/

function getTableData(api, web) {
    return [{
        field: "MSRP",
        value: "$" + api.product_content.rei.Product.Retail_Price._text,
    },{
        field: "Shop Online",
        value: api.product_content.rei.Product.Buy_Link._text,
    },{
        field: "Best Used For",
        value: web['best_use'],
    },{
        field: "Weight",
        value: web['weight'],
    },{
        field: "Volume",
        value: web['gear_capacity_(l)'],
    },{
        field: "Fit - Torso",
        value: web['fits_torso_length_(in.)'],
    },{
        field: "Fit - Waist",
        value: web['fits_waist/hips'],
    },{
        field: "Dimensions",
        value: web['dimensions'],
    },{
        field: "Sizes",
        value: web['sizes'],
    },{
        field: "Colors",
        value: web['colors'],
    },{
        field: "Materials",
        value: web['material(s)'],
    },{
        field: "Key Features",
        value: '',
    }];
}

/************************************************
 * Buy Data
 ***********************************************/

function getBuyData(api, web) {
    var buyData = {};

    // rei
    const rei = api.product_content.rei.Product;
    buyData.rei =  {
        retail_price: rei.Retail_Price._text,
        sale_price: rei.Sale_Price._text,
        buy_link: rei.Buy_Link._text,
        dividend: web.dividend,
    };

    // backcountry
    const bc = api.product_content.backcountry.Product;
    buyData.backcountry = {
        retail_price: bc.Retail_Price._text,
        sale_price: bc.Sale_Price._text,
        buy_link: bc.Buy_Link._text,
        availability: (bc.Availability._text === 'in-stock'),
    }

    // osprey
    const osprey = api.product_content.osprey.Product;
    buyData.osprey = {
        retail_price: osprey.Retail_Price._text,
        sale_price: osprey.Sale_Price._text,
        buy_link: osprey.Buy_Link._text,
        availability: (osprey.Product_Availability._text === 'in stock'),
        stock: osprey.Product_Quantity._text,
    }

    return buyData;
}

// this was already processed
function getPriceHistory(api) {
    return api.price_history;
}


/************************************************
 * Chart Data
 ***********************************************/

// MANUAL FIELDS
const loadData = {
    111298: { low: 30, high: 50 },      // stratos 24

    /*
    111298: { low: 30, high: 50 },      // stratos 24
    111298: { low: 30, high: 50 },      // stratos 24
    111298: { low: 30, high: 50 },      // stratos 24
    111298: { low: 30, high: 50 },      // stratos 24
    111298: { low: 30, high: 50 },      // stratos 24
    111298: { low: 30, high: 50 },      // stratos 24
    111298: { low: 30, high: 50 },      // stratos 24
    111298: { low: 30, high: 50 },      // stratos 24
    111298: { low: 30, high: 50 },      // stratos 24
    111298: { low: 30, high: 50 },      // stratos 24
    */
};

/*
data: {
    labels: ["Osprey Atmos 65 Pack", "Osprey Aether 65 Pack"],
    datalabels: ['30-50 lbs', '35-55 lbs'],
    datasets: [{
        data: [
            [30, 50],
            [35, 55]
        ],
    }]
},
*/


function getLoadData(product, load) {
    return {
        labels: product,
        datalabels: `${load.low}-${load.high} lbs`,
        data: [
            parseInt(load.low),
            parseInt(load.high)
        ],
    }
}

/************************************************
 * Suggested Products
 ***********************************************/

