const BarChart = require("./charts/bar.js");
const PriceChart = require("./charts/price-history.js");
const ScatterPlot = require("./charts/scatter.js");
const fs = require("fs").promises;

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
 * HTML
 ***********************************************/

function generateHTML(p1, p2) {
    return `
    <div class="affiliate-link-disclosure">
        Just so you know, this page contains affiliate links. This means if you make a purchase after clicking through one, at no extra cost to you we may earn a commission.
    </div>

    <!-- Specs Table -->
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

    <!-- Charts -->
    <h2>Weight</h2>
    <div class="chart-container">
        <canvas id="weight-bar-chart"></canvas>
    </div>

    <h2>Volume</h2>
    <div class="chart-container">
        <canvas id="volume-bar-chart"></canvas>
    </div>

    <h2>Load Range</h2>
    <div class="chart-container">
        <canvas id="load-range-chart"></canvas>
    </div>

    <!-- Purchase Table -->
    <h2>Where to Buy</h2>
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

    <!-- Scatter Plot -->
    <h2>Packs: Price vs. Weight</h2>
    <div class="scatter-weight-container">
        <canvas id="scatter-chart"></canvas>
    </div>

    <h2>Packs: Price vs. Volume</h2>
    <div class="scatter-weight-container">
        <canvas id="scatter-volume-price-chart"></canvas>
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
            "volume-bar-chart", "Volume (liters)",
            p1.name, p1.volume.data,
            p2.name, p2.volume.data,
        ) +
        BarChart.generateChart(
            "weight-bar-chart", "Weight (oz)",
            p1.name, p1.weight.data,
            p2.name, p2.weight.data,
        ) +
        generateLoadChartJS(p1, p2) +
        PriceChart.generateChart(p1, p2) +
        ScatterPlot.generateChart(p1, p2) +
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
                    backgroundColor: 'lightblue',
                    barPercentage: 0.9,
                },
                {
                    label: "${p2.name}",
                    data: [[ ${p2.load.low}, ${p2.load.high}]],
                    backgroundColor: '#6ba292',
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
