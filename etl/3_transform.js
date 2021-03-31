const fs = require("fs").promises;
const util = require('util')
const c = require("../generator/convert.js");

/************************************************
 * Data
 ***********************************************/

const LOAD = {
    // v1
    134072: { low: 30, high: 50 },      // osprey atmos ag 65
    126707: { low: 25, high: 40 },      // osprey atmos 50
    177493: { low: 30, high: 60 },      // osprey aether 65
    177492: { low: 30, high: 60 },      // osprey aether 55
    126705: { low: 20, high: 40 },      // osprey exos 48
    126709: { low: 20, high: 40 },      // osprey exos 58

    // v1.1
    126716: { low: 25, high: 40},       // osprey aura 50
    126717: { low: 30, high: 50},       // osprey aura 65
    177498: { low: 30, high: 60},       // osprey ariel 55
    177499: { low: 30, high: 60},       // osprey ariel 65
    186383: { low: 0, high: 0},         // osprey daylite plus
    184887: { low: 13, high: 30},       // osprey talon 44
    164404: { low: 23.7, high: 48.5},   // osprey poco
    164405: { low: 23.89, high: 48.5},  // osprey poco plus
    125754: { low: 30, high: 50},       // gregory baltoro 65
    123205: { low: 35, high: 55},       // gregory baltoro 75
    147418: { low: 25, high: 48.5},     // deuter kid comfort active

    // Not Active
    111298: { low: 10, high: 25 },    // osprey stratos 24
    113327: { low: 15, high: 35 },    // osprey stratos 34
    111299: { low: 15, high: 35 },    // osprey stratos 36
    177573: { low: 10, high: 20 },    // osprey talon 22
};

/************************************************
 * HTML
 ***********************************************/

(async function() {
    try {
        const sku = process.argv[2];

        const specs = JSON.parse(
            await fs.readFile(`./2_web/${sku}.json`, "utf-8")
        );
        const api = JSON.parse(
            await fs.readFile(`./1_api/${sku}.json`, "utf-8")
        );

        // some skus are not available from REI api
        // even if they were available before!
        if (Object.keys(api.product_content.rei).length == 0) {
            console.error("No REI API data, skipping...");
            return;
        }

        const product = api.product_content.rei.Product;
        const data = {
            sku: sku,

            // api data
            name: product.Product_Name._text,
            image: product.Image_URL._text.split("?")[0],
            buy_link: product.Buy_Link._text,
            price: product.Retail_Price._text,
            long_description: product.Long_Description._text,
            gender: product.Gender._text,
            age_group: product.Age_Group._text,
            category: product.Category._text,
            sub_category: product.SubCategory._text,
            product_group: product.Product_Group._text,

            // manual data
            load: LOAD[sku],

            // scraped data
            best_used_for: specs['best_use'],
            fit_torso_in: specs['fits_torso_length_(in.)'],
            fit_waist_in: specs['fits_waist/hips'],
            materials: specs['material(s)'],
            dimensions: specs['dimensions'],

            // format variants and variant options
            colors: {
                data: specs.colors.split(", "),
                raw: specs.colors
            },
            sizes: {
                data: specs.sizes.split(", "),
                raw: specs.sizes,
            },

            volume: {
                data: parseMultiVariants(
                    specs['gear_capacity_(l)'],
                    c.convertVolumeToL,
                ),
                unit: 'liters',
                raw: specs['gear_capacity_(l)'],
            },
            weight: {
                data: parseMultiVariants(
                    specs['weight'],
                    c.convertWeightToOz,
                ),
                unit: 'oz',
                raw: specs['weight'],
            },
        };

        const obj = {
            ...data,
            ...{ price_history: api.price_history },
            ...{ purchase_info: getBuyData(api, specs) },
        }
        console.log(JSON.stringify(obj, null, 2));
    } catch (err) {
        console.log(`Error: ${err}`);
    }
})();

function parseMultiVariants(str, convertFn) {
    var arr = [];
    if (!str) {         // str doesn't exist in specs
        return arr;
    }

    if (!str.includes(",")) {   // no variants
        return [{
            key: 'One Size',
            val: convertFn(str),
            raw: str,
        }];
    }

    for (const variant of str.split(", ")) {
        const e = variant.split(":");
        arr.push({
            key: e[0].trim(),
            val: convertFn(e[1].trim()),
            raw: e[1].trim(),
        });
    }
    arr.sort((a, b) => a.val - b.val);
    return arr;
}

/************************************************
 * Buy Data
 ***********************************************/

function getBuyData(api, specs) {
    var buyData = {};

    // rei
    const rei = api.product_content.rei.Product;
    buyData.rei =  {
        retail_price: rei.Retail_Price._text,
        sale_price: rei.Sale_Price._text,
        buy_link: rei.Buy_Link._text,
        dividend: specs.dividend,
    };

    // backcountry
    try {
        const bc = api.product_content.backcountry.Product;
        buyData.backcountry = {
            retail_price: bc.Retail_Price._text,
            sale_price: bc.Sale_Price._text,
            buy_link: bc.Buy_Link._text,
            availability: (bc.Availability._text === 'in-stock'),
        }
    } catch (err) {
        console.error("No purchase info for backcountry...");
    }

    // osprey
    try {
        const osprey = api.product_content.osprey.Product;
        buyData.osprey = {
            retail_price: osprey.Retail_Price._text,
            sale_price: osprey.Sale_Price._text,
            buy_link: osprey.Buy_Link._text,
            availability: (osprey.Product_Availability._text === 'in stock'),
            stock: osprey.Product_Quantity._text,
        }
    } catch (err) {
        console.error("No purchase info for osprey...");
    }

    return buyData;
}
