const BarChart = require("./charts/bar.js");
const PriceChart = require("./charts/price-history.js");
const ScatterPlot = require("./charts/scatter.js");
const fs = require("fs").promises;
const convert = require('convert-units');

/************************************************
 * Entry Point
 ***********************************************/

async function generate(product) {
    return generateHTML(product) + generateJS(product);
}

/************************************************
 * Madlibs
 ***********************************************/

// Cost / Liter
const CPL_BUDGET = 0;
const CPL_MIDRANGE = 3.5;
const CPL_PREMIUM = 5.25;

// "The Osprey Women's Aura AG 50 Pack is a premium backpacking pack that comes in three sizes (XS, S, M), while the Gregory Men's Baltoro 65 Pack is a midrange backpacking pack that comes in three sizes (S, M, L)."
function madlibsIntro(product) {
    var numVariants = "one size";
    if (product.sizes.data.length === 2) {
        numVariants = `two sizes (${product.sizes.data.join(", ")})`;
    }
    if (product.sizes.data.length === 3) {
        numVariants = `three sizes (${product.sizes.data.join(", ")})`;
    }

    var segment = "midrange";
    if (product.volume.data.length !== 0) {
        const cpl = product.price / product.volume.data[0].val;
        if (cpl < CPL_MIDRANGE)  segment = "budget";
        if (cpl > CPL_PREMIUM)   segment = "premium";
    }

    const bestUsedFor = (product.best_used_for == 'Hiking') ? "hiking" : "backpacking";
    return `${product.name} is a ${segment} ${bestUsedFor} backpack that comes in ${numVariants}`;
}


/**
 * "See the weight breakdodwn for the Osprey Women's Aura AG 50 Pack."
 * The Osprey Women's Aura AG 50 Pack weighs 3 lbs (4.5 kg)."
 */
function madlibsWeight(p1) {
    var madlib = `<p>See the weight breakdown for the ${p1.name}.</p>`;
    const w1_lbs = convert(p1.weight.data[0].val).from('oz').to('lb');
    const w1_kg = convert(p1.weight.data[0].val).from('oz').to('kg');
    return madlib + `<p>The ${p1.name} weighs ${w1_lbs} lbs (${w1_kg} kg).</p>`;
}

/**
 * "See the volume breakdown for the Osprey Women's Aura AG 50 Pack.
 * The Osprey Women's Aura AG 50 Pack holds 4 liters."
 */
function madlibsVolume(p1) {
    var madlib = `<p>See the volume breakdown for the ${p1.name}.</p>`;

    const v1_l = p1.volume.data[0].val;
    return `<p>The ${p1.name} holds ${v1_l} liters.</p>`;
}

function madlibsPriceTable(p1) {
    const price1 = parseFloat(p1.price);
    return `<p>At the time of publishing, the ${p1.name} retails for ${price1}.</p><p>See the latest deals at top retailers:</p>`;
}


/************************************************
 * Rankings
 ***********************************************/

const packfire = `{"items":[{"id":278,"model":"ACE 38","producer":"Osprey","category":"Backpack","category_variant_a":"38","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/ace-38-ACE38S20_195.html","updated_at":"Jun 11, 2020","use_count":0,"weight_presentable":"2.91lb","weight":"2.91","weight_unit":"lb","price_presentable":"$140","price":"140.00","currency":"USD","in_gear_closet":false},{"id":279,"model":"ACE 50","producer":"Osprey","category":"Backpack","category_variant_a":"50","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/ace-50-ACE50S20_194.html","updated_at":"Jun 11, 2020","use_count":3,"weight_presentable":"3.7lb","weight":"3.70","weight_unit":"lb","price_presentable":"$170","price":"170.00","currency":"USD","in_gear_closet":false},{"id":280,"model":"ACE 75","producer":"Osprey","category":"Backpack","category_variant_a":"75","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/ace-75-ACE75S20_193.html","updated_at":"Jun 11, 2020","use_count":1,"weight_presentable":"4.12lb","weight":"4.12","weight_unit":"lb","price_presentable":"$190","price":"190.00","currency":"USD","in_gear_closet":false},{"id":281,"model":"Aether AG 60","producer":"Osprey","category":"Backpack","category_variant_a":"60","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/aether-ag-60-AETHER60_807.html","updated_at":"Jun 11, 2020","use_count":14,"weight_presentable":"5.19lb","weight":"5.19","weight_unit":"lb","price_presentable":"$290","price":"290.00","currency":"USD","in_gear_closet":false},{"id":282,"model":"Aether AG 70","producer":"Osprey","category":"Backpack","category_variant_a":"70","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/aether-ag-70-AETHER70_807.html","updated_at":"Jun 11, 2020","use_count":22,"weight_presentable":"5.21lb","weight":"5.21","weight_unit":"lb","price_presentable":"$310","price":"310.00","currency":"USD","in_gear_closet":false},{"id":283,"model":"Aether AG 85","producer":"Osprey","category":"Backpack","category_variant_a":"85","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/aether-ag-85-AETHER85_749.html","updated_at":"Jun 11, 2020","use_count":9,"weight_presentable":"5.36lb","weight":"5.36","weight_unit":"lb","price_presentable":"$330","price":"330.00","currency":"USD","in_gear_closet":false},{"id":284,"model":"Aether Pro 70","producer":"Osprey","category":"Backpack","category_variant_a":"70","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/aether-pro-70-AETHRPRO70_565.html","updated_at":"Jun 11, 2020","use_count":4,"weight_presentable":"3.94lb","weight":"3.94","weight_unit":"lb","price_presentable":"$375","price":"375.00","currency":"USD","in_gear_closet":false},{"id":285,"model":"Archeon 45 Men's","producer":"Osprey","category":"Backpack","category_variant_a":"45","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/archeon-45-men-s-ARCHEON45MS20_202.html","updated_at":"Jun 11, 2020","use_count":0,"weight_presentable":"4.84lb","weight":"4.84","weight_unit":"lb","price_presentable":"$290","price":"290.00","currency":"USD","in_gear_closet":false},{"id":286,"model":"Archeon 45 Womens","producer":"Osprey","category":"Backpack","category_variant_a":"45","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/archeon-45-women-s-ARCHEON45WS20_348.html","updated_at":"Jun 11, 2020","use_count":0,"weight_presentable":"4.42lb","weight":"4.42","weight_unit":"lb","price_presentable":"$290","price":"290.00","currency":"USD","in_gear_closet":false},{"id":287,"model":"Archeon 65 Womens","producer":"Osprey","category":"Backpack","category_variant_a":"65","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/archeon-65-women-s-ARCHEON65WS20_206.html","updated_at":"Jun 11, 2020","use_count":0,"weight_presentable":"5.67lb","weight":"5.67","weight_unit":"lb","price_presentable":"$340","price":"340.00","currency":"USD","in_gear_closet":false},{"id":288,"model":"Archeon 70 Men's","producer":"Osprey","category":"Backpack","category_variant_a":"70","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/archeon-70-men-s-ARCHEON70MS20_198.html","updated_at":"Jun 11, 2020","use_count":0,"weight_presentable":"6.1lb","weight":"6.10","weight_unit":"lb","price_presentable":"$340","price":"340.00","currency":"USD","in_gear_closet":false},{"id":289,"model":"Ariel  AG 55","producer":"Osprey","category":"Backpack","category_variant_a":"55","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/ariel-ag-55-ARIEL55_667.html","updated_at":"Jun 11, 2020","use_count":4,"weight_presentable":"4.93lb","weight":"4.93","weight_unit":"lb","price_presentable":"$290","price":"290.00","currency":"USD","in_gear_closet":false},{"id":290,"model":"Ariel  AG 75","producer":"Osprey","category":"Backpack","category_variant_a":"75","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/ariel-ag-75-ARIEL75_527.html","updated_at":"Jun 11, 2020","use_count":6,"weight_presentable":"5.08lb","weight":"5.08","weight_unit":"lb","price_presentable":"$330","price":"330.00","currency":"USD","in_gear_closet":false},{"id":291,"model":"Ariel  Pro 65","producer":"Osprey","category":"Backpack","category_variant_a":"65","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/ariel-pro-65-ARIELPRO65_566.html","updated_at":"Jun 11, 2020","use_count":8,"weight_presentable":"3.73lb","weight":"3.73","weight_unit":"lb","price_presentable":"$375","price":"375.00","currency":"USD","in_gear_closet":false},{"id":292,"model":"Atmos AG 50","producer":"Osprey","category":"Backpack","category_variant_a":"50","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/atmos-ag-50-ATMOS50S18_334.html","updated_at":"Jun 11, 2020","use_count":19,"weight_presentable":"4.21lb","weight":"4.21","weight_unit":"lb","price_presentable":"$240","price":"240.00","currency":"USD","in_gear_closet":false},{"id":293,"model":"Atmos AG 65","producer":"Osprey","category":"Backpack","category_variant_a":"65","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/atmos-ag-65-ATMOS65S18_684.html","updated_at":"Jun 11, 2020","use_count":101,"weight_presentable":"4.56lb","weight":"4.56","weight_unit":"lb","price_presentable":"$270","price":"270.00","currency":"USD","in_gear_closet":false},{"id":294,"model":"Aura AG 50","producer":"Osprey","category":"Backpack","category_variant_a":"40","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/aura-ag-50-AURA50S18_681.html","updated_at":"Jun 11, 2020","use_count":12,"weight_presentable":"4.18lb","weight":"4.18","weight_unit":"lb","price_presentable":"$240","price":"240.00","currency":"USD","in_gear_closet":false},{"id":295,"model":"Aura AG 65","producer":"Osprey","category":"Backpack","category_variant_a":"65","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/aura-ag-65-AURA65S18_568.html","updated_at":"Jun 11, 2020","use_count":23,"weight_presentable":"4.42lb","weight":"4.42","weight_unit":"lb","price_presentable":"$270","price":"270.00","currency":"USD","in_gear_closet":false},{"id":296,"model":"EJA  48","producer":"Osprey","category":"Backpack","category_variant_a":"48","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/eja-48-EJA48_682.html","updated_at":"Jun 11, 2020","use_count":6,"weight_presentable":"2.48lb","weight":"2.48","weight_unit":"lb","price_presentable":"$200","price":"200.00","currency":"USD","in_gear_closet":false},{"id":297,"model":"EJA  58","producer":"Osprey","category":"Backpack","category_variant_a":"58","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/eja-58-EJA58_576.html","updated_at":"Jun 11, 2020","use_count":12,"weight_presentable":"2.56lb","weight":"2.56","weight_unit":"lb","price_presentable":"$220","price":"220.00","currency":"USD","in_gear_closet":false},{"id":298,"model":"Exos 48","producer":"Osprey","category":"Backpack","category_variant_a":"48","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/exos-48-EXOS48S18_759.html","updated_at":"Jun 11, 2020","use_count":32,"weight_presentable":"2.57lb","weight":"2.57","weight_unit":"lb","price_presentable":"$200","price":"200.00","currency":"USD","in_gear_closet":false},{"id":299,"model":"Exos 58","producer":"Osprey","category":"Backpack","category_variant_a":"58","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/exos-58-EXOS58S18_759.html","updated_at":"Jun 11, 2020","use_count":69,"weight_presentable":"2.65lb","weight":"2.65","weight_unit":"lb","price_presentable":"$220","price":"220.00","currency":"USD","in_gear_closet":false},{"id":300,"model":"Kestrel 48","producer":"Osprey","category":"Backpack","category_variant_a":"48","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/kestrel-48-KESTREL48S19_132.html","updated_at":"Jun 11, 2020","use_count":25,"weight_presentable":"3.59lb","weight":"3.59","weight_unit":"lb","price_presentable":"$180","price":"180.00","currency":"USD","in_gear_closet":false},{"id":301,"model":"Kyte 46","producer":"Osprey","category":"Backpack","category_variant_a":"46","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/kyte-46-KYTE46S19_134.html","updated_at":"Jun 11, 2020","use_count":2,"weight_presentable":"3.38lb","weight":"3.38","weight_unit":"lb","price_presentable":"$180","price":"180.00","currency":"USD","in_gear_closet":false},{"id":302,"model":"Levity 45","producer":"Osprey","category":"Backpack","category_variant_a":"45","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/levity-45-LEVITY45_577.html","updated_at":"Jun 11, 2020","use_count":15,"weight_presentable":"1.85lb","weight":"1.85","weight_unit":"lb","price_presentable":"$250","price":"250.00","currency":"USD","in_gear_closet":false},{"id":303,"model":"Levity 60","producer":"Osprey","category":"Backpack","category_variant_a":"60","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/levity-60-LEVITY60_577.html","updated_at":"Jun 11, 2020","use_count":8,"weight_presentable":"1.95lb","weight":"1.95","weight_unit":"lb","price_presentable":"$270","price":"270.00","currency":"USD","in_gear_closet":false},{"id":304,"model":"Lumina  45","producer":"Osprey","category":"Backpack","category_variant_a":"45","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/lumina-45-LUMINA45_578.html","updated_at":"Jun 11, 2020","use_count":1,"weight_presentable":"1.85lb","weight":"1.85","weight_unit":"lb","price_presentable":"$250","price":"250.00","currency":"USD","in_gear_closet":false},{"id":305,"model":"Lumina  60","producer":"Osprey","category":"Backpack","category_variant_a":"60","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/lumina-60-LUMINA60_578.html","updated_at":"Jun 11, 2020","use_count":0,"weight_presentable":"1.94lb","weight":"1.94","weight_unit":"lb","price_presentable":"$270","price":"270.00","currency":"USD","in_gear_closet":false},{"id":306,"model":"Renn 50","producer":"Osprey","category":"Backpack","category_variant_a":"50","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/renn-50-RENN50_137.html","updated_at":"Jun 11, 2020","use_count":0,"weight_presentable":"3.31lb","weight":"3.31","weight_unit":"lb","price_presentable":"$155","price":"155.00","currency":"USD","in_gear_closet":false},{"id":307,"model":"Renn 65","producer":"Osprey","category":"Backpack","category_variant_a":"65","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/renn-65-RENN65_138.html","updated_at":"Jun 11, 2020","use_count":5,"weight_presentable":"3.44lb","weight":"3.44","weight_unit":"lb","price_presentable":"$165","price":"165.00","currency":"USD","in_gear_closet":false},{"id":308,"model":"Rook  50","producer":"Osprey","category":"Backpack","category_variant_a":"50","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/rook-50-ROOK50_136.html","updated_at":"Jun 11, 2020","use_count":0,"weight_presentable":"3.49lb","weight":"3.49","weight_unit":"lb","price_presentable":"$155","price":"155.00","currency":"USD","in_gear_closet":false},{"id":309,"model":"Rook  65","producer":"Osprey","category":"Backpack","category_variant_a":"65","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/rook-65-ROOK65_550.html","updated_at":"Jun 11, 2020","use_count":5,"weight_presentable":"3.52lb","weight":"3.52","weight_unit":"lb","price_presentable":"$165","price":"165.00","currency":"USD","in_gear_closet":false},{"id":310,"model":"Sirrus 50","producer":"Osprey","category":"Backpack","category_variant_a":"50","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/sirrus-50-SIRRUS50_406.html","updated_at":"Jun 11, 2020","use_count":0,"weight_presentable":"3.58lb","weight":"3.58","weight_unit":"lb","price_presentable":"$190","price":"190.00","currency":"USD","in_gear_closet":false},{"id":311,"model":"Stratos 50","producer":"Osprey","category":"Backpack","category_variant_a":"50","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/stratos-50-STRATOS50_144.html","updated_at":"Jun 11, 2020","use_count":2,"weight_presentable":"3.68lb","weight":"3.68","weight_unit":"lb","price_presentable":"$190","price":"190.00","currency":"USD","in_gear_closet":false},{"id":312,"model":"Talon 44","producer":"Osprey","category":"Backpack","category_variant_a":"44","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/talon-44-TALON44_329.html","updated_at":"Jun 11, 2020","use_count":11,"weight_presentable":"2.43lb","weight":"2.43","weight_unit":"lb","price_presentable":"$160","price":"160.00","currency":"USD","in_gear_closet":false},{"id":313,"model":"Tempest 40","producer":"Osprey","category":"Backpack","category_variant_a":"40","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/tempest-40-TEMPEST40_307.html","updated_at":"Jun 11, 2020","use_count":0,"weight_presentable":"2.38lb","weight":"2.38","weight_unit":"lb","price_presentable":"$160","price":"160.00","currency":"USD","in_gear_closet":false},{"id":314,"model":"Viva  50","producer":"Osprey","category":"Backpack","category_variant_a":"50","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/viva-50-VIVA50S19_141.html","updated_at":"Jun 11, 2020","use_count":0,"weight_presentable":"4.02lb","weight":"4.02","weight_unit":"lb","price_presentable":"$200","price":"200.00","currency":"USD","in_gear_closet":false},{"id":315,"model":"Viva  65","producer":"Osprey","category":"Backpack","category_variant_a":"65","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/viva-65-VIVA65S19_140.html","updated_at":"Jun 11, 2020","use_count":0,"weight_presentable":"4.21lb","weight":"4.21","weight_unit":"lb","price_presentable":"$220","price":"220.00","currency":"USD","in_gear_closet":false},{"id":316,"model":"Volt 60","producer":"Osprey","category":"Backpack","category_variant_a":"60","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/volt-60-VOLT60S19_139.html","updated_at":"Jun 11, 2020","use_count":0,"weight_presentable":"4.3lb","weight":"4.30","weight_unit":"lb","price_presentable":"$200","price":"200.00","currency":"USD","in_gear_closet":false},{"id":317,"model":"Volt 75","producer":"Osprey","category":"Backpack","category_variant_a":"75","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/volt-75-VOLT75S19_771.html","updated_at":"Jun 11, 2020","use_count":4,"weight_presentable":"4.55lb","weight":"4.55","weight_unit":"lb","price_presentable":"$220","price":"220.00","currency":"USD","in_gear_closet":false},{"id":318,"model":"Xena 70","producer":"Osprey","category":"Backpack","category_variant_a":"70","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/xena-70-XENA70S18_764.html","updated_at":"Jun 11, 2020","use_count":0,"weight_presentable":"5.26lb","weight":"5.26","weight_unit":"lb","price_presentable":"$350","price":"350.00","currency":"USD","in_gear_closet":false},{"id":319,"model":"Xena 85","producer":"Osprey","category":"Backpack","category_variant_a":"85","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/xena-85-XENA85S18_408.html","updated_at":"Jun 11, 2020","use_count":0,"weight_presentable":"5.32lb","weight":"5.32","weight_unit":"lb","price_presentable":"$380","price":"380.00","currency":"USD","in_gear_closet":false},{"id":320,"model":"Xenith 105","producer":"Osprey","category":"Backpack","category_variant_a":"105","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/xenith-105-XENITH105S18_564.html","updated_at":"Jun 11, 2020","use_count":4,"weight_presentable":"5.67lb","weight":"5.67","weight_unit":"lb","price_presentable":"$400","price":"400.00","currency":"USD","in_gear_closet":false},{"id":321,"model":"Xenith 75","producer":"Osprey","category":"Backpack","category_variant_a":"75","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/xenith-75-XENITH75S18_564.html","updated_at":"Jun 11, 2020","use_count":0,"weight_presentable":"5.45lb","weight":"5.45","weight_unit":"lb","price_presentable":"$350","price":"350.00","currency":"USD","in_gear_closet":false},{"id":322,"model":"Xenith 88","producer":"Osprey","category":"Backpack","category_variant_a":"88","category_variant_b":"","category_variant_c":"","link":"https:\/\/www.osprey.com\/us\/en\/product\/xenith-88-XENITH88S18_600.html","updated_at":"Jun 11, 2020","use_count":0,"weight_presentable":"5.5lb","weight":"5.50","weight_unit":"lb","price_presentable":"$380","price":"380.00","currency":"USD","in_gear_closet":false}],"current_page":1,"last_page":1,"per_page":100}`;





/************************************************
 * HTML
 ***********************************************/

function generateHTML(p1, madlibs) {
    return `
    <div class="affiliate-link-disclosure">
        Just so you know, this page contains affiliate links. This means if you make a purchase after clicking through one, at no extra cost to you we may earn a commission.
    </div>

    <!-- Specs Table -->
    <p>The ${madlibsIntro(p1)}.</p>
    <div class="specs-table-wrapper">
        <table class="specs-table">
            <colgroup>
                <col>
                <col>
            </colgroup>
            <thead>
                <tr>
                    <th></th>
                    <th><a href="${p1.buy_link}&ctc=geartool"><img src="${p1.image}?size=1000"></a></th>
                </tr>
                <tr>
                    <th></th>
                    <th><a href="${p1.buy_link}&ctc=geartool">${p1.name}</a></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>MSRP</td>
                    <td>$${p1.price}</td>
                </tr>
                <tr>
                    <td>Shop Online</td>
                    <td>
                        <a class="specs-table-link" href="${p1.buy_link}&ctc=geartool">$${p1.price} at REI</a>
                    </td>
                </tr>
                <tr>
                    <td>Best Used For</td>
                    <td>${p1.best_used_for}</td>
                </tr>

                <!-- Variant Specs -->
                <tr>
                    <td>Weight</td>
                    <td>
                        ${formatVariantFields(p1.weight.data)}
                    </td>
                </tr>
                <tr>
                    <td>Volume</td>
                    <td>
                        ${formatVariantFields(p1.volume.data)}
                    </td>
                </tr>

                <!-- Full-Text -->
                <tr>
                    <td>Gender</td>
                    <td>${(p1.gender === "female") ? "Women's" : "Men's"}</td>
                </tr>
                <tr>
                    <td>Fit - Waist</td>
                    <td>${p1.fit_waist_in}</td>
                </tr>
                <tr>
                    <td>Dimensions</td>
                    <td>${p1.dimensions}</td>
                </tr>
                <tr>
                    <td>Sizes</td>
                    <td>${p1.sizes.raw}</td>
                </tr>
                <tr>
                    <td>Colors</td>
                    <td>${p1.colors.raw}</td>
                </tr>
                <tr>
                    <td>Materials</td>
                    <td>${p1.materials}</td>
                </tr>
                <tr>
                    <td>Description</td>
                    <td>${p1.long_description}</td>
                </tr>
            </tbody>
        </table>
    </div>

    [toc]

    <!-- Weight -->
    <h2>Weight</h2>
    ${madlibsWeight(p1)}
    <div class="chart-container">
        <canvas id="weight-bar-chart"></canvas>
    </div>

    <h2>Price vs. Weight</h2>
    <p>Compare the price-to-weight ratio of the ${p1.name} to all the other backpacking backpacks in our database.</p>
    <div class="scatter-container">
        <canvas id="scatter-price-weight-chart"></canvas>
    </div>

    <!-- Volume -->
    <h2>Volume</h2>
    ${madlibsVolume(p1)}
    <div class="chart-container">
        <canvas id="volume-bar-chart"></canvas>
    </div>

    <h2>Price vs. Volume</h2>
    <p>Compare the price-to-volume ratio of the ${p1.name} to all the other backpacking backpacks in our database.</p>
    <div class="scatter-container">
        <canvas id="scatter-price-volume-chart"></canvas>
    </div>

    <h2>Load Range</h2>
    <p>Compare how many pounds of gear each pack can comfortably carry.</p>
    <div class="chart-container">
        <canvas id="load-range-chart"></canvas>
    </div>

    <!-- Purchase Table -->
    <h2>Where to Buy</h2>
    ${madlibsPriceTable(p1)}
    <div class="specs-table-wrapper">
        <table class="specs-table">
            <colgroup>
                <col>
                <col>
            </colgroup>
            <thead>
                <tr>
                    <th></th>
                    <th></th>
                </tr>
                <tr>
                    <th></th>
                    <th><a href="${p1.buy_link}&ctc=geartool">${p1.name}</a></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>REI</td>
                    <td>
                        <a class="specs-table-link" href="${p1.buy_link}&ctc=geartool">$${p1.price}</a>
                    </td>
                </tr>
                ${insertBuyInfoBC(p1)}
                ${insertBuyInfoOsprey(p1)}

            </tbody>
        </table>
    </div>

    <!-- Price Charts -->
    <h2>Price History</h2>
    <p>Click on a retailer’s name to add or remove it from the chart.</p>
    <div>
        <div id="price1" class="price-chart-container">
            <canvas id="price-history-chart-p1"></canvas>
        </div>
    </div>
`;
}

function insertBuyInfoBC(p1) {
    if (!p1.purchase_info.backcountry) {
        return '';
    }

    const td1 = (!p1.purchase_info.backcountry) ?
        `<td></td>` :
        `<td>
            <a class="specs-table-link" href="${p1.purchase_info.backcountry.buy_link}&ctc=geartool">$${p1.purchase_info.backcountry.retail_price}</a>
        </td>`;

    return `
    <tr>
        <td>Backcountry</td>
        ${td1}
    </tr>`;
}

function insertBuyInfoOsprey(p1) {
    if (!p1.purchase_info.osprey) {
        return '';
    }

    const td1 = (!p1.purchase_info.osprey) ?
        `<td></td>` :
        `<td>
            <a class="specs-table-link" href="${p1.purchase_info.osprey.buy_link}&ctc=geartool">$${p1.purchase_info.osprey.retail_price}</a>
        </td>`;

    return `
    <tr>
        <td>Osprey</td>
        ${td1}
    </tr>`;
}

function formatVariantFields(val) {
    var out = '';
    for (const element of val) {
        out += `<b>${element.key}</b>: ${element.raw}<br>`;
    }
    return out.slice(0, -4);
}

/************************************************
 * Javascript
 ***********************************************/

function generateJS(p1) {
    return `
    <script type="text/javascript">
    <!--` +
        BarChart.generateChart(
            "volume-bar-chart", "Volume", "L",
            p1.name, p1.volume.data,
        ) +
        BarChart.generateChart(
            "weight-bar-chart", "Weight", "oz",
            p1.name, p1.weight.data,
        ) +
        generateLoadChartJS(p1) +
        PriceChart.generateChart(p1) +
        ScatterPlot.generatePriceVsWeight(p1) +
        ScatterPlot.generatePriceVsVolume(p1) + `
    //--></script>`;
}

function generateLoadChartJS(p1) {
    const label1 = `${Math.round(p1.load.low)}-${Math.round(p1.load.high)} lbs.`;

    return `
new Chart(
    document.getElementById('load-range-chart').getContext("2d"),
    {
        type: 'horizontalBar',
        data: {
            datasets: [
                {
                    label: "${p1.name}",
                    data: [[ ${p1.load.low}, ${p1.load.high}]],
                    backgroundColor: '#7AADE1',
                    barPercentage: 0.9,
                },
            ],
        },
        plugins: [{
            beforeLayout: function(context) {
                var fontSize = (context.chart.width < 900) ? 10 : 16;
                context.chart.options.plugins.datalabels.font.size = fontSize;
                context.chart.options.legend.labels.fontSize = fontSize;
            }
        }],
        options: {
            title: false,
            responsive: true,
            maintainAspectRatio: false,
            tooltips: false,
            legend: {
                display: false,
            },
            plugins: {
                datalabels: {
                    color: '#EDEDED',
                    formatter: function(value, context) {
                        var i = context.dataIndex;
                        var j = context.datasetIndex;
                        if (i == 0 && j == 0) return "${label1}";
                    }
                }
            }
        },
    }
);`;
}

module.exports = {
    generate
};
