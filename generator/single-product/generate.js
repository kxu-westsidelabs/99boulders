const charts = require("./charts.js");
const convert = require('convert-units');
const alasql = require("alasql");

/************************************************
 * Entry Point
 ***********************************************/

function generate(p, products) {

    //console.log(generateMadlibs(p, products));

    //const res = segmentByWeight('unisex', products);
    //console.log(res);

    //const res =  generateHTML(p, products) + generateJS(p, products);
    //console.log(res);
    return generateHTML(p, products) + generateJS(p, products);
}

/************************************************
 * Product Segmentation (brand, gender)
 ***********************************************/

function segmentByWeight(gender, products) {
	const sql = `
		SELECT *
		FROM ? WHERE name LIKE '%Osprey%' AND (gender = '${gender}' OR gender = 'unisex')
		ORDER BY weight->data->0->val ASC
	`;
	return alasql(sql, [products]);
}

function segmentByVolume(gender, products) {
	const sql = `
        SELECT *
		FROM ? WHERE name LIKE '%Osprey%' AND (gender = '${gender}' OR gender = 'unisex')
		ORDER BY volume->data->0->val DESC
	`;
	return alasql(sql, [products]);
}

/************************************************
 * Madlibs
 ***********************************************/

// Cost / Liter
const CPL_BUDGET = 0;
const CPL_MIDRANGE = 3.5;
const CPL_PREMIUM = 5.25;

function generateMadlibs(p, products) {
    return {
        intro:  generateMadlibsIntro(p),
        buy:    generateMadlibsBuy(p),
        volume: generateMadlibsVolume(p, products),
        weight: generateMadlibsWeight(p, products),
        specs: generateMadlibsSpecsTable(p, products),
    };
}

/**
 * Output:
 * | The Osprey Women's Aura AG 50 Pack is a premium backpacking pack that
 * | comes in three sizes (XS, S, M).
 */
function generateMadlibsIntro(product) {
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
    return `<p>The ${product.name} is a ${segment} ${bestUsedFor} backpack that comes in ${numVariants}.</p>`;
}

/**
 * Output:
 * | At the time of publishing, the Osprey Women's Aura AG 50 Pack retails for $290.
 * |
 * | See the latest deals from top retailers:
 */
function generateMadlibsBuy(p) {
    return `<p>At the time of publishing, the ${p.name} retails for $${parseFloat(p.price)}.</p>
            <p>See the latest deals at top retailers:</p>`;
}

/**
 * Output:
 * | See the weight breakdown for the Osprey Women's Aura AG 50 Pack.
 * |
 * | The Osprey Women's Aura AG 50 Pack weighs 3 lbs (4.5 kg), making it the
 * | 5th lightest backpacking backpack for women.
 */
function generateMadlibsWeight(p, products) {
    const lbs   = convert(p.weight.data[0].val).from('oz').to('lb');
    const kg    = Math.round(convert(p.weight.data[0].val).from('oz').to('kg') * 100) / 100;

    var clause = null;
    if (p.gender == 'male') {
        const weight = getStats(p, segmentByWeight(p.gender, products));
        clause = `making it the ${ordinal(weight.position)} lightest backpacking backpack for men in our database`;
    } else if (p.gender == 'female') {
        const weight = getStats(p, segmentByWeight(p.gender, products));
        clause = `making it the ${ordinal(weight.position)} lightest backpacking backpack for women in our database`;
    } else {    // unisex
        const weightFemale= getStats(p, segmentByWeight('female', products));
        const weightMale = getStats(p, segmentByWeight('male', products));
        clause = `making it the ${ordinal(weightMale.position)} lightest backpacking backpack for men and the ${ordinal(weightFemale.position)} lightest backpack for women in our database`;
    }

    return `<p>See the weight breakdown for the ${p.name}.</p>
            <p>The ${p.name} weighs ${lbs} lbs (${kg} kg), ${clause}.</p>`;
}

/**
 * Output:
 * | See the volume breakdown for the Osprey Women's Aura AG 50 Pack.
 * |
 * | The Osprey Women's Aura AG 50 Pack holds 55 liters, which is the 4th highest
 * | capacity backpacking backpack for women [, and the 3rd highest capacity pack for men].
 */
function generateMadlibsVolume(p, products) {
    var clause = null;
    if (p.gender == 'male') {
        const volume = getStats(p, segmentByVolume(p.gender, products));
        clause = `which is the ${ordinal(volume.position)} highest capacity backpacking backpack for men in our database`;
    } else if (p.gender == 'female') {
        const volume = getStats(p, segmentByVolume(p.gender, products));
        clause = `which is the ${ordinal(volume.position)} highest capacity backpacking backpack for women in our database`;
    } else {   
        // TODO: unisex
        // volume
        const volumeFemale= getStats(p, segmentByVolume('female', products));
        const volumeMale = getStats(p, segmentByVolume('male', products));
        clause = `which is the ${ordinal(volumeFemale.position)} highest capacity backpacking backpack for women and the ${ordinal(volumeMale.position)} highest capacity pack for men in our database`;
    }
    return `<p>See the volume breakdown for the ${p.name}.</p>
            <p>The ${p.name} holds ${p.volume.data[0].val} liters, ${clause}.</p>`;
}

function generateMadlibsSpecsTable(p, products) {
    if (p.gender == 'male' || p.gender == 'female') {
        const weight = getStats(p, segmentByWeight(p.gender, products));

        const volume = getStats(p, segmentByVolume(p.gender, products));
        const gender = (p.gender == 'male') ? "men's" : "women's";
        const weightP = (weight.percentage == 100) ? '' : `(top ${weight.percentage}%) `;
        const volumeP = (volume.percentage == 100) ? '' : `(top ${volume.percentage}%) `;

        return {
            weight: `<br><br><b>${ordinal(weight.position)}</b> lightest ${gender} pack ${weightP}in our database`,
            volume: `<br><br><b>${ordinal(volume.position)}</b> highest capacity ${gender} pack ${volumeP}in our database`,
        }
    } else {
        // TODO: unisex
        return {
            weight: '', volume: ''
        }
    }
}

function ordinal(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

/************************************************
 * Rankings / Stats
 ***********************************************/

function getStats(p, products) {
	const position = getPosition(p.sku, products);
	const total = products.length;
	const percentage = getPercentage(position, total);
	return {
		position: position,
		total: total,
		percentage: percentage,
	};
}
function getPercentage(position, total) {
	const p = position / total;
	if (p < .05) 		return 5;
	else if (p < .1) 	return 10;
	else if (p < .25) 	return 25;
	else if (p < .5)	return 50;
	else return 100;
}
function getPosition(sku, products) {
	return products.findIndex(product => product.sku == sku) + 1;
}

/************************************************
 * HTML
 ***********************************************/

function generateHTML(p, products) {
    const madlibs = generateMadlibs(p, products);

    return `
    <div class="affiliate-link-disclosure">
        Just so you know, this page contains affiliate links. This means if you make a purchase after clicking through one, at no extra cost to you we may earn a commission.
    </div>

    <!-- Specs Table -->
    ${madlibs.intro}
    <div class="specs-table-wrapper">
        <table class="specs-table">
            <colgroup>
                <col>
                <col>
            </colgroup>
            <thead>
                <tr>
                    <th></th>
                    <th><a href="${p.buy_link}&ctc=geartool"><img src="${p.image}?size=1000"></a></th>
                </tr>
                <tr>
                    <th></th>
                    <th><a href="${p.buy_link}&ctc=geartool">${p.name}</a></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>MSRP</td>
                    <td>$${p.price}</td>
                </tr>
                <tr>
                    <td>Shop Online</td>
                    <td>
                        <a class="specs-table-link" href="${p.buy_link}&ctc=geartool">$${p.price} at REI</a>
                    </td>
                </tr>
                <tr>
                    <td>Best Used For</td>
                    <td>${p.best_used_for}</td>
                </tr>

                <!-- Variant Specs -->
                <tr>
                    <td>Weight</td>
                    <td>
                        ${formatVariantFields(p.weight.data)}
                        ${madlibs.specs.weight}
                    </td>
                </tr>
                <tr>
                    <td>Volume</td>
                    <td>
                        ${formatVariantFields(p.volume.data)}
                        ${madlibs.specs.volume}
                    </td>
                </tr>

                <!-- Full-Text -->
                <tr>
                    <td>Gender</td>
                    <td>${(p.gender === "female") ? "Women's" : "Men's"}</td>
                </tr>
                <tr>
                    <td>Fit - Waist</td>
                    <td>${p.fit_waist_in}</td>
                </tr>
                <tr>
                    <td>Dimensions</td>
                    <td>${p.dimensions}</td>
                </tr>
                <tr>
                    <td>Sizes</td>
                    <td>${p.sizes.raw}</td>
                </tr>
                <tr>
                    <td>Colors</td>
                    <td>${p.colors.raw}</td>
                </tr>
                <tr>
                    <td>Materials</td>
                    <td>${p.materials}</td>
                </tr>
                <tr>
                    <td>Description</td>
                    <td>${p.long_description}</td>
                </tr>
            </tbody>
        </table>
    </div>

    [toc]

    <!-- Weight -->
    <h2>Weight</h2>
    ${madlibs.weight}
    <div class="chart-container">
        <canvas id="weight-bar-chart"></canvas>
    </div>

    <h2>Weight Rankings</h2>
    <div class="chart-container-lg">
        <canvas id="weight-rankings-chart"></canvas>
    </div>

    <h2>Price vs. Weight</h2>
    <p>Compare the price-to-weight ratio of the ${p.name} to all the other backpacking backpacks in our database.</p>
    <div class="scatter-container">
        <canvas id="scatter-price-weight-chart"></canvas>
    </div>

    <!-- Volume -->
    <h2>Volume</h2>
    ${madlibs.volume}
    <div class="chart-container">
        <canvas id="volume-bar-chart"></canvas>
    </div>

    <h2>Volume Rankings</h2>
    <div class="chart-container-lg">
        <canvas id="volume-rankings-chart"></canvas>
    </div>

    <h2>Price vs. Volume</h2>
    <p>Compare the price-to-volume ratio of the ${p.name} to all the other backpacking backpacks in our database.</p>
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
    ${madlibs.buy}
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
                    <th><a href="${p.buy_link}&ctc=geartool">${p.name}</a></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>REI</td>
                    <td>
                        <a class="specs-table-link" href="${p.buy_link}&ctc=geartool">$${p.price}</a>
                    </td>
                </tr>
                ${insertBuyInfoBC(p)}
                ${insertBuyInfoOsprey(p)}

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

function generateJS(p, products) {

    const weight = (p.gender == 'unisex') ? products : segmentByWeight(p.gender, products);
    const volume = (p.gender == 'unisex') ? products : segmentByVolume(p.gender, products);

    return `
    <script type="text/javascript">
    <!--` +
        charts.generateBarChartVolume(p) +
        charts.generateBarChartWeight(p) +
        charts.generateLoadChart(p) +
        charts.generatePriceHistory(p) +
        charts.generateRankingsWeight(p, weight) +
        charts.generateScatterPriceVsWeight(p) +
        charts.generateRankingsVolume(p, volume) +
        charts.generateScatterPriceVsVolume(p) +
    `//--></script>`;
}

module.exports = {
    generate
};
