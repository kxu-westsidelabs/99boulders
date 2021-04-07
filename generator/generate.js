const BarChart = require("./charts/bar.js");
const PriceChart = require("./charts/price-history.js");
const ScatterPlot = require("./charts/scatter.js");
const fs = require("fs").promises;
const convert = require('convert-units');

(async function() {
    try {
        const sku1 = process.argv[2];
        const sku2 = process.argv[3];

        const p1 = JSON.parse(
            await fs.readFile(`../data/products/${sku1}.json`, "utf-8")
        );
        const p2 = JSON.parse(
            await fs.readFile(`../data/products/${sku2}.json`, "utf-8")
        );

        const html = generateHTML(p1, p2) + generateJS(p1, p2);
        console.log(html);

    } catch (err) {
        console.log(err);
    }

})();

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
        numVariants = `two variations (${product.sizes.data.join(", ")})`;
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
    return `${product.name} is a ${segment} ${bestUsedFor} pack that comes in ${numVariants}`;
}


/**
 * "See the weight difference between the Osprey Women's Aura AG 50 Pack and Osprey Women's Aura AG 65 Pack."
 *
 * The lightest Osprey Women's Aura AG 50 Pack weighs 4 ounces less than the lightest Osprey Women's Aura AG 65 Pack."
 */
function madlibsWeight(p1, p2) {
    var madlib = `<p>See the weight difference between the ${p1.name} and ${p2.name}.</p>`;

    try {
        const w1_lbs = convert(p1.weight.data[0].val).from('oz').to('lb');
        const w2_lbs = convert(p2.weight.data[0].val).from('oz').to('lb');

        const w1_kg = convert(p1.weight.data[0].val).from('oz').to('kg');
        const w2_kg = convert(p2.weight.data[0].val).from('oz').to('kg');

        const diff_oz = Math.round(
            ((p1.weight.data[0].val - p2.weight.data[0].val) + Number.EPSILON) * 100 / 100
        );
        const adjective = (diff_oz > 0) ? 'more' : 'less';
        if (w1_lbs === w2_lbs) {
            madlib += `<p>The ${p1.name} and ${p2.name} both weigh ${w1_lbs} lbs (${w1_kg} kg)</p>`;
        } else {
            madlib += `<p>The lightest version of the ${p1.name} weighs <b>${Math.abs(diff_oz)} ounces ${adjective}</b> than the lighest version of the ${p2.name}.</p>`;
        }
        return madlib;
    } catch (err) {
        return madlib;
    }
}

/**
 * "See the volume difference between the Osprey Women's Aura AG 50 Pack and Osprey Women's Aura AG 65 Pack."
 *
 * The smallest Osprey Women's Aura AG 50 Pack holds 4 liters less than the smallest Osprey Women's Aura AG 65 Pack."
 */
function madlibsVolume(p1, p2) {
    var madlib = `<p>See how much gear each pack carries.</p>`;
    try {
        const v1_l = p1.volume.data[0].val;
        const v2_l = p2.volume.data[0].val;

        const diff_liters = v1_l - v2_l;
        const adjective = (diff_liters > 0) ? 'more' : 'less';

        if (v1_l === v2_l) {
            madlib += `<p>The ${p1.name} and ${p2.name} both hold ${v1_l} liters.</p>`;
        } else {
            madlib += `<p>The smallest size ${p1.name} holds <b>${Math.abs(diff_liters)} liters ${adjective}</b> than the smallest version of the ${p2.name}.</p>`;
        }
        return madlib;
    } catch (err) {
        return madlib;
    }
}

function madlibsPriceTable(p1, p2) {
    const price1 = parseFloat(p1.price);
    const price2 = parseFloat(p2.price);

    const diff = Math.round((price1 - price2) * 100 / 100);
    const adjective = (diff > 0) ? 'more' : 'less';

    if (price1 == price2) {
        return `<p>At the time of publishing, the ${p1.name} and ${p2.name} retail for ${price1}.</p><p>See the latest deals at top retailers:</p>`;
    } else {
        return `<p>At the time of publishing, the ${p1.name} retails for <b>$${Math.abs(diff)} ${adjective}</b> than the ${p2.name} on REI.com.</p><p>See the latest deals at top retailers:</p>`;
    }
}

/************************************************
 * HTML
 ***********************************************/

function generateHTML(p1, p2, madlibs) {
    return `
    <div class="affiliate-link-disclosure">
        Just so you know, this page contains affiliate links. This means if you make a purchase after clicking through one, at no extra cost to you we may earn a commission.
    </div>

    <!-- Specs Table -->
    <p>The ${madlibsIntro(p1)}, while the ${madlibsIntro(p2)}.</p>
    <p>See the key differences:</p>
    <div class="specs-table-wrapper">
        <table class="specs-table">
            <colgroup>
                <col>
                <col>
                <col>
            </colgroup>
            <thead>
                <tr>
                    <th></th>
                    <th><a href="${p1.buy_link}"><img src="${p1.image}?size=1000"></a></th>
                    <th><a href="${p2.buy_link}"><img src="${p2.image}?size=1000"></a></th>
                </tr>
                <tr>
                    <th></th>
                    <th><a href="${p1.buy_link}">${getTitle(p1.name, p2.name)}</a></th>
                    <th><a href="${p2.buy_link}">${getTitle(p2.name, p1.name)}</a></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>MSRP</td>
                    <td>$${p1.price}</td>
                    <td>$${p2.price}</td>
                </tr>
                <tr>
                    <td>Shop Online</td>
                    <td>
                        <a class="specs-table-link" href="${p1.buy_link}">$${p1.price} at REI</a>
                    </td>
                    <td>
                        <a class="specs-table-link" href="${p2.buy_link}">$${p2.price} at REI</a>
                    </td>
                </tr>
                <tr>
                    <td>Best Used For</td>
                    <td>${p1.best_used_for}</td>
                    <td>${p2.best_used_for}</td>
                </tr>

                <!-- Variant Specs -->
                <tr>
                    <td>Weight</td>
                    <td>
                        ${formatVariantFields(p1.weight.data)}
                    </td>
                    <td>
                        ${formatVariantFields(p2.weight.data)}
                    </td>
                </tr>
                <tr>
                    <td>Volume</td>
                    <td>
                        ${formatVariantFields(p1.volume.data)}
                    </td>
                    <td>
                        ${formatVariantFields(p2.volume.data)}
                    </td>
                </tr>

                <!-- Full-Text -->
                <tr>
                    <td>Gender</td>
                    <td>${p1.gender.charAt(0).toUpperCase() + p1.gender.slice(1)}</td>
                    <td>${p2.gender.charAt(0).toUpperCase() + p2.gender.slice(1)}</td>
                </tr>
                <tr>
                    <td>Fit - Waist</td>
                    <td>${p1.fit_waist_in}</td>
                    <td>${p2.fit_waist_in}</td>
                </tr>
                <tr>
                    <td>Dimensions</td>
                    <td>${p1.dimensions}</td>
                    <td>${p2.dimensions}</td>
                </tr>
                <tr>
                    <td>Sizes</td>
                    <td>${p1.sizes.raw}</td>
                    <td>${p2.sizes.raw}</td>
                </tr>
                <tr>
                    <td>Colors</td>
                    <td>${p1.colors.raw}</td>
                    <td>${p2.colors.raw}</td>
                </tr>
                <tr>
                    <td>Materials</td>
                    <td>${p1.materials}</td>
                    <td>${p2.materials}</td>
                </tr>
                <tr>
                    <td>Description</td>
                    <td>${p1.long_description}</td>
                    <td>${p2.long_description}</td>
                </tr>
            </tbody>
        </table>
    </div>

    [toc]

    <!-- Weight -->
    <h2>Weight</h2>
    ${madlibsWeight(p1, p2)}
    <div class="chart-container">
        <canvas id="weight-bar-chart"></canvas>
    </div>

    <h2>Price vs. Weight</h2>
    <p>Compare the price-to-weight ratio of the ${p1.name} and ${p2.name} to all the other backpacking backpacks in our database.</p>
    <div class="scatter-container">
        <canvas id="scatter-price-weight-chart"></canvas>
    </div>

    <!-- Volume -->
    <h2>Volume</h2>
    ${madlibsVolume(p1, p2)}
    <div class="chart-container">
        <canvas id="volume-bar-chart"></canvas>
    </div>

    <h2>Price vs. Volume</h2>
    <p>Compare the price-to-volume ratio of the ${p1.name} and ${p2.name} to all the other backpacking backpacks in our database.</p>
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
    ${madlibsPriceTable(p1, p2)}
    <div class="specs-table-wrapper">
        <table class="specs-table">
            <colgroup>
                <col>
                <col>
                <col>
            </colgroup>
            <thead>
                <tr>
                    <th></th>
                    <th></th>
                    <th></th>
                </tr>
                <tr>
                    <th></th>
                    <th><a href="${p1.buy_link}">${p1.name}</a></th>
                    <th><a href="${p2.buy_link}">${p2.name}</a></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>REI</td>
                    <td>
                        <a class="specs-table-link" href="${p1.buy_link}">$${p1.price}</a>
                    </td>
                    <td>
                        <a class="specs-table-link" href="${p2.buy_link}">$${p2.price}</a>
                    </td>
                </tr>
                ${insertBuyInfoBC(p1, p2)}
                ${insertBuyInfoOsprey(p1, p2)}

            </tbody>
        </table>
    </div>

    <!-- Price Charts -->
    <h2>Price History</h2>
    <p>Select a pack to see its price history from top retailers. Click on a retailer’s name to add or remove it from the chart.</p>
    <div>
        <div class="price-chart-selector">
            <label class="radio-inline">
                <input type="radio" name="myRadios" value="price1" onclick="handleClick(this);" checked/>${p1.name}
            </label><br>
            <label class="radio-inline">
                <input type="radio" name="myRadios" value="price2" onclick="handleClick(this);"/>${p2.name}
            </label>
        </div>

        <div id="price1" class="price-chart-container">
            <canvas id="price-history-chart-p1"></canvas>
        </div>
        <div id="price2" class="price-chart-container" style="display: none">
            <canvas id="price-history-chart-p2"></canvas>
        </div>
    </div>
`;
}

function getTitle(str1, str2) {
    return (str1.length >= str2.length) ?
        str1 :
        `${str1} ${"&nbsp; ".repeat(str2.length - str1.length)}`;
}

function insertBuyInfoBC(p1, p2) {
    if (!p1.purchase_info.backcountry && !p2.purchase_info.backcountry) {
        return '';
    }

    const td1 = (!p1.purchase_info.backcountry) ?
        `<td></td>` :
        `<td>
            <a class="specs-table-link" href="${p1.purchase_info.backcountry.buy_link}">$${p1.purchase_info.backcountry.retail_price}</a>
        </td>`;
    const td2 = (!p2.purchase_info.backcountry) ?
        `<td></td>` :
        `<td>
            <a class="specs-table-link" href="${p2.purchase_info.backcountry.buy_link}">$${p2.purchase_info.backcountry.retail_price}</a>
        </td>`;

    return `
    <tr>
        <td>Backcountry</td>
        ${td1}
        ${td2}
    </tr>`;
}

function insertBuyInfoOsprey(p1, p2) {
    if (!p1.purchase_info.osprey && !p2.purchase_info.osprey) {
        return '';
    }

    const td1 = (!p1.purchase_info.osprey) ?
        `<td></td>` :
        `<td>
            <a class="specs-table-link" href="${p1.purchase_info.osprey.buy_link}">$${p1.purchase_info.osprey.retail_price}</a>
        </td>`;
    const td2 = (!p2.purchase_info.osprey) ?
        `<td></td>` :
        `<td>
            <a class="specs-table-link" href="${p2.purchase_info.osprey.buy_link}">$${p2.purchase_info.osprey.retail_price}</a>
        </td>`;

    return `
    <tr>
        <td>Osprey</td>
        ${td1}
        ${td2}
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

function generateJS(p1, p2) {
    return `
    <script type="text/javascript">
    <!--` +
        BarChart.generateChart(
            "volume-bar-chart", "Volume", "L",
            p1.name, p1.volume.data,
            p2.name, p2.volume.data,
        ) +
        BarChart.generateChart(
            "weight-bar-chart", "Weight", "oz",
            p1.name, p1.weight.data,
            p2.name, p2.weight.data,
        ) +
        generateLoadChartJS(p1, p2) +
        PriceChart.generateChart(p1, p2) +
        ScatterPlot.generatePriceVsWeight(p1, p2) +
        ScatterPlot.generatePriceVsVolume(p1, p2) + `
    //--></script>`;
}

function generateLoadChartJS(p1, p2) {
    const label1 = `${Math.round(p1.load.low)}-${Math.round(p1.load.high)} lbs.`;
    const label2 = `${Math.round(p2.load.low)}-${Math.round(p2.load.high)} lbs.`;

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
                {
                    label: "${p2.name}",
                    data: [[ ${p2.load.low}, ${p2.load.high}]],
                    backgroundColor: '#2A70B7',
                    barPercentage: 0.9,
                }
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
            plugins: {
                datalabels: {
                    color: '#EDEDED',
                    formatter: function(value, context) {
                        var i = context.dataIndex;
                        var j = context.datasetIndex;
                        if (i == 0 && j == 0) return "${label1}";
                        if (i == 0 && j == 1) return "${label2}";
                    }
                }
            }
        },
    }
);`;
}
