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
    186383: { low: 5, high: 15},         // osprey daylite plus
    184887: { low: 13, high: 30},       // osprey talon 44
    164404: { low: 23.7, high: 48.5},   // osprey poco
    164405: { low: 23.89, high: 48.5},  // osprey poco plus
    125754: { low: 30, high: 50},       // gregory baltoro 65
    123205: { low: 35, high: 55},       // gregory baltoro 75
    147418: { low: 25, high: 48.5},     // deuter kid comfort active

    // v1.2
    184890: { low: 30, high: 40 },      // Osprey Women's Kyte 56 Pack
    141492: { low: 20, high: 35 },      // Osprey Women's Kyte 46 Pack
    126719: { low: 20, high: 40 },      // Osprey Women's Eja 58 Pack
    126718: { low: 20, high: 40 },      // Osprey Women's Eja 48 Pack
    142360: { low: 10, high: 25 },      // Osprey Women's Lumina 60 Pack
    126714: { low: 5, high:  20 },      // Osprey Women's Lumina 45 Pack
    177500: { low: 30, high: 60 },      // Osprey Women's Ariel Plus 60 Pack
    126715: { low: 35, high: 60 },      // Osprey Women's Ariel Pro 65 Pack
    177571: { low: 30, high: 60 },      // Osprey Women's Ariel Plus 70 Pack
    177496: { low: 40, high: 70 },      // Osprey Men's Aether Plus 100 Pack
    177497: { low: 40, high: 70 },      // Osprey Men's Aether Plus 85 Pack
    177495: { low: 30, high: 60 },      // Osprey Men's Aether Plus 70 Pack
    126710: { low: 35, high: 60 },      // Osprey Men's Aether Pro 70 Pack
    177494: { low: 30, high: 60 },      // Osprey Men's Aether Plus 60 Pack
    142359: { low: 10, high: 25 },      // Osprey Men's Levity 60 Pack
    126706: { low: 5, high:  20 },      // Osprey Men's Levity 45 Pack
    184888: { low: 30, high: 45 },      // Osprey Men's Kestrel 58 Pack
    141491: { low: 20, high: 35 },      // Osprey Men's Kestrel 48 Pack
    127753: { low: 30, high: 50 },      // Deuter Men's Aircontact Lite 65 + 10 Pack
    125528: { low: 20, high: 40 },      // Deuter Men's Aircontact Lite 50 + 10 Pack
    167624: { low: 15, high: 33 },      // Deuter Men's Aircontact Lite 40 + 10 Pack
    127756: { low: 30, high: 50 },      // Deuter Women's Aircontact Lite 60 + 10 SL Pack
    125529: { low: 25, high: 45 },      // Deuter Women's Aircontact Lite 45 + 10 SL Pack
    167626: { low: 15, high: 25 },      // Deuter Women's Aircontact Lite 35 + 10 SL Pack
    126934: { low: 30, high: 50 },      // REI Co-op Men's Traverse 70 Pack
    185550: { low: 20, high: 40 },      // REI Co-op Men's Traverse 60 Pack
    185561: { low: 20, high: 40 },      // REI Co-op Women's Traverse 60 Pack
    148589: { low: 15, high: 30 },      // REI Co-op Men's Flash 55 Pack
    148588: { low: 15, high: 30 },      // REI Co-op Men's Flash 45 Pack
    148671: { low: 15, high: 30 },      // REI Co-op Women's Flash 55 Pack
    168252: { low: 15, high: 35 },      // REI Co-op Women's Trailbreak 60 Pack
    125758: { low: 30, high: 60 },      // Gregory Women's Deva 80 Pack
    123206: { low: 35, high: 55 },      // Gregory Women's Deva 70 Pack
    125757: { low: 30, high: 50 },      // Gregory Women's Deva 60 Pack
    125756: { low: 55, high: 75 },      // Gregory Men's Baltoro 95 Pro Pack
    125755: { low: 40, high: 60 },      // Gregory Men's Baltoro 85 Pack
    165341: { low: 30, high: 50 },      // Gregory Women's Maven 65 Pack
    159409: { low: 30, high: 50 },      // Gregory Women's Maven 55 Pack
    165338: { low: 20, high: 40 },      // Gregory Women's Maven 45 Pack
    165336: { low: 30, high: 50 },      // Gregory Men's Paragon 68 Pack
    159408: { low: 30, high: 50 },      // Gregory Men's Paragon 58 Pack
    165334: { low: 20, high: 40 },      // Gregory Men's Paragon 48 Pack
    145640: { low: 20, high: 40 },      // Gregory Men's Zulu 65 Pack
    145638: { low: 15, high: 35 },      // Gregory Men's Zulu 40 Pack
    145653: { low: 20, high: 40 },      // Gregory Women's Jade 63 Pack
    145651: { low: 15, high: 35 },      // Gregory Women's Jade 38 Pack

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

    if (!str.includes(",") && !str.includes(":")) {   // no variants
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
