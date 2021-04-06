const fs = require("fs").promises;
const convert = require('convert-units');
const _ = require('lodash');

// TODO: Run this in 99boulders/
const BASE_URL = './data/products';

main();
async function main() {

    // load products json from file system
    var products = null;
    try {
        products = await loadProductsData(BASE_URL);
    } catch (err) {
        console.log("Error reading products data", err);
    }

    //const data = generateMadLibsData(products);
    //console.log(data);
    //const data = priceVsVolume(products);
    //console.log(JSON.stringify(data));

    const data = priceVsWeight(products);
    console.log(JSON.stringify(data));

    /*
    const data = {
        scatter: {
            ...weightVsVolume(products),
            ...createScatterData(products),
        },
        ...generateHistogramData(products),
    };
    console.log(JSON.stringify(data, null, 2));
    console.log(JSON.stringify(data));
    */
}

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

/************************************************
 * Rankings by Property (weight, volume, price)
 *  for use in Madlibs
 ***********************************************/

function generateMadLibsData(products) {

    // store minimal product data in array
    var data = [];
    for (const product of products) {
        const len = product.weight.data.length;
        const last = len - 1;

        console.log(product);
        const p = {
            sku: product.sku,
            price: parseFloat(product.price),

            best_used_for: product.best_used_for,
            weight_low:  _.get(product, 'weight.data[0].val', null),
            weight_high: _.get(product, `weight.data[${last}].val`, null),
            volume_low:  _.get(product, 'volume.data[0].val', null),
            volume_high: _.get(product, `volume.data[${last}].val`, null),
        }
        data.push(p);
    }
    return { rankings: data };

    /*
    const data = {
        count: 64,
        1234: {
            weight: {
                rank: 4,
                rank_adj: 7,
            },
            volume: {
                rank: 
                rank_adj: 
            }

            rank_weight: 2,
            rank_price: 3,
            rank_volume: 15,
        }
    }
    */
}

// sort by object property


/************************************************
 * Histogram
 ***********************************************/

/*
[
  { count: 0, low: 70, high: 102, data: [] },       // 0
  { count: 0, low: 102, high: 134, data: [] },      // 1
  { count: 0, low: 134, high: 166, data: [] },      // 2
  { count: 0, low: 166, high: 198, data: [] },      // 3
  { count: 0, low: 198, high: 230, data: [] },      // 4
  { count: 0, low: 230, high: 262, data: [] },      // 5
  { count: 0, low: 262, high: 294, data: [] },      // 6
  { count: 0, low: 294, high: 326, data: [] },      // 7
  { count: 0, low: 326, high: 358, data: [] },      // 8
  { count: 0, low: 358, high: 390, data: [] }       // 9
]
*/
function generateHistogramData(products) {
    const NUM_BUCKETS = 10;

    var stats = {
        count: 0,
        price_min: 1000,
        price_max: 0,
        price_avg: 0,
    };
    var total = 0;


    // first pass - figure out bucket sizes
    for (const product of products) {
        const price = parseFloat(product.price);

        total += price;

        stats.count++;
        if (price < stats.price_min) stats.price_min = price;
        if (price > stats.price_max) stats.price_max = price;
    }
    stats.price_avg = Math.round(total / stats.count);
    stats.bucket_size = (stats.price_max - stats.price_min) / NUM_BUCKETS;

    // create buckets
    var buckets = [];
    const start = stats.price_min;
    for (var i = 0; i < NUM_BUCKETS; i++) {
        buckets.push({
            count: 0,
            low: start + stats.bucket_size * i,
            high: start + stats.bucket_size * (i + 1),
            data: [],
        });
    }

    // second pass - count products / bucket
    for (const product of products) {
        const price = parseFloat(product.price);

        var idx = (price - stats.price_min) / stats.bucket_size;
        var ceil = Math.ceil(idx) - 1;
        if (ceil < 0) ceil = 0;

        buckets[ceil].data.push(price);
        buckets[ceil].count++;
    }
    stats.buckets = buckets;

    return { histogram: stats };
}


/************************************************
 * Scatter Plots
 ***********************************************/

function priceVsVolume(products) {
    var data = [];
    for (const product of products) {
        for (const variant of product.volume.data) {
            const name = (variant.key === 'One Size') ?
                product.name :
                `${product.name} - ${variant.key}`;

            data.push({
                x: variant.val,
                y: product.price,
                name: name,
            });
        }
    }
    return data;
}

// iterate over all files in ./data/products
// fetch the weight field
// aggregate them into a separate json object
function priceVsWeight(products) {
    var data = [];
    for (const product of products) {
        for (const variant of product.weight.data) {
            const name = (variant.key === 'One Size') ?
                product.name :
                `${product.name} - ${variant.key}`;

            const lbs = convert(variant.val).from('oz').to('lb');
            data.push({
                y: product.price,
                x: Math.round(lbs * 100) / 100,
                name: name,
            });
        }
    }
    return data;
}

function weightVsVolume(products) {
    var data = [];
    for (const product of products) {
        for (var i = 0; i < product.weight.data.length; i++) {
            if (!product.volume.data[i] || !product.weight.data[i]) {
                break;
            }
            const weight = product.weight.data[i].val;
            const volume = product.volume.data[i].val;

            const name = (product.weight.data[i].key === 'One Size') ?
                product.name :
                `${product.name} - ${product.weight.data[i].key}`;

            const lbs = convert(weight).from('oz').to('lb');
            data.push({
                x: weight,
                y: Math.round(lbs * 100) / 100,
                name: name,
            });

            //break;
        }
    }

    return { weight_vs_volume: data };
}


