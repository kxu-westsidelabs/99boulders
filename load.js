const fs = require("fs").promises;
const util = require('util')
const minify = require('html-minifier').minify;

const DATA = {

    // atmos ag 65
    134072: {
        load: { low: 30, high: 50 },
        weight: [
            {'S': 72},
            {'M': 73},
            {'L': 74},
        ],
        volume: [
            {'S': 62},
            {'M': 65},
            {'L': 68},
        ],
        features: [
            "ANTI-GRAVITY SUSPENSION: Our Anti-Gravity suspension features a continuous backpanel of lightweight mesh extending from the top of the backpanel to the hipbelt to provide unmatched comfort and ventilation. The seamless structure automatically contours to the body, providing outstanding fit and unrestricted movement.",
            "FLAPJACKET: A removable floating lid can be replaced with a fixed FlapJacket to protect your gear and minimize weight.",
        ],
    },

    // atmos 50
    126707: {
        load: { low: 25, high: 40 },
        weight: [
            {'S': 66},
            {'M': 67},
            {'L': 68},
        ],
        volume: [
            {'S': 47},
            {'M': 50},
            {'L': 53},
        ],
        features: [
            "ANTI-GRAVITY SUSPENSION: Our Anti-Gravity suspension features a continuous backpanel of lightweight mesh extending from the top of the backpanel to the hipbelt to provide unmatched comfort and ventilation. The seamless structure automatically contours to the body, providing outstanding fit and unrestricted movement.",
            "FLAPJACKET: A removable floating lid can be replaced with a fixed FlapJacket to protect your gear and minimize weight.",
        ],
    },

    // aether 65
    177493: {
        load: { low: 30, high: 60 },
        weight: [
            {'One Size': 78.7},
        ],
        volume: [
            {'One Size': 65},
        ],
        features: [
            "ANTI-GRAVITY SUSPENSION: Our Anti-Gravity suspension features a continuous backpanel of lightweight mesh extending from the top of the backpanel to the hipbelt to provide unmatched comfort and ventilation. The seamless structure automatically contours to the body, providing outstanding fit and unrestricted movement.",
            "FLAPJACKET: A removable floating lid can be replaced with a fixed FlapJacket to protect your gear and minimize weight.",
        ],
    },

    // aether 55
    177492: {
        load: { low: 30, high: 60 },
        weight: [
            {'One Size': 77.3},
        ],
        volume: [
            {'One Size': 55},
        ],
        features: [
            "CUSTOM FIT: A Custom Fit-on-the-Fly Hipbelt, Custom Fit-on-the-Fly Shoulder Strap and adjustable torso length allow for a fine-tuned fit for a variety of body shapes and sizes.",
            "AIRSCAPE SUSPENSION: An injection-molded, die-cut foam AirScapeTM backpanel creates a breathable, close-to-body fit.",
        ],
    },

    // stratos 24
    111298: {
        load: { low: 10, high: 25 },
        weight: [
            {'One Size': 44},
        ],
        volume: [
            {'One Size': 24},
        ],
        features: [
            "AIRSCAPE SUSPENSION: An injection-molded, die-cut foam AirScapeTM backpanel creates a breathable, close-to-body fit.",
            "SEAMLESS HIPBELT INTERFACE: Users can't feel seams that don't exist, and because there aren't any on the Stratos/Sirrus updated hipbelt, hikers can focus on the journey instead of the pack on your back.",
        ],
    },

    // stratos 34
    113327: {
        load: { low: 15, high: 35 },
        weight: [
            {'S/M': 47.2},
            {'M/L': 49.3},
        ],
        volume: [
            {'S/M': 32},
            {'M/L': 34},
        ],
        features: [
            "AIRSPEED SUSPENSION: Incredibly comfortable and ventilated tensioned mesh backpanel with added adjustability for variations in torso length to provide fine-tuned customization fit for every hiker and backpacker.",
            "INTEGRATED RAINCOVER: Hope for bluebird weather but know you're covered with our integrated and removable raincover that stows in its own pocket when the sun returns.",
        ],
    },

    // stratos 36
    111299: {
        load: { low: 15, high: 35 },
        weight: [
            {'S/M': 50.7},
            {'M/L': 52.8},
        ],
        volume: [
            {'S/M': 33},
            {'M/L': 36},
        ],
        features: [
            "AIRSPEED SUSPENSION: Incredibly comfortable and ventilated tensioned mesh backpanel with added adjustability for variations in torso length to provide fine-tuned customization fit for every hiker and backpacker.",
            "INTEGRATED RAINCOVER: Hope for bluebird weather but know you're covered with our integrated and removable raincover that stows in its own pocket when the sun returns.",
        ],
    },

    // talon 22
    177573: {
        load: { low: 10, high: 20 },
        weight: [
            {'S/M': 30.6},
            {'L/XL': 32.6},
        ],
        volume: [
            {'S/M': 20},
            {'L/XL': 22},
        ],
        features: [
            "AIRSCAPE SUSPENSION: An injection-molded, die-cut foam AirScapeTM backpanel creates a breathable, close-to-body fit.",
            "MULTI-SPORT: From top-loaders to lumbar packs and everything in between, the Talon/Tempest Series accommodates the needs of hikers, bikers and more",
        ]
    },

    // exos 48
    126705: {
        load: { low: 20, high: 40 },
        weight: [
            {'S': 40.8},
            {'M': 41.1},
            {'L': 41.8},
        ],
        volume: [
            {'S': 45},
            {'M': 48},
            {'L': 51},
        ],
        features: [
            "ULTRALIGHT: Ultralight design and materials plus the ability to strip weight by removing sleeping pad straps, compression straps and the top lid.",
            "AIRSPEED SUSPENSION: Tensioned backpanel keeps the weight in the pack off of your back, enabling highly ventilated carrying comfort.",
        ],
    },

    // exos 58
    126709: {
        load: { low: 20, high: 40 },
        weight: [
            {'S': 42},
            {'M': 43},
            {'L': 44},
        ],
        volume: [
            {'S': 55},
            {'M': 58},
            {'L': 61},
        ],
        features: [
            "ULTRALIGHT: Ultralight design and materials plus the ability to strip weight by removing sleeping pad straps, compression straps and the top lid.",
            "AIRSPEED SUSPENSION: Tensioned backpanel keeps the weight in the pack off of your back, enabling highly ventilated carrying comfort.",
        ],
    },
}

/************************************************
 * Product Specs
 ***********************************************/


main();

async function main() {
    try {
        const sku1 = process.argv[2];
        const sku2 = process.argv[3];
        const compress = process.argv[4];

        const p1 = JSON.parse(
            await fs.readFile(`./3_data/${sku1}.json`, "utf-8")
        );
        const p2 = JSON.parse(
            await fs.readFile(`./3_data/${sku2}.json`, "utf-8")
        );

        var html = generateVsTableHTML(p1, p2);
        html += generateChartsHTML();
        html += generatePurchaseTableHTML(p1, p2);
        html += generatePriceChartsHTML(p1, p2);

        html += generateJS(p1, p2);

        (compress) ?
            console.log(minify(html, {
                collapseWhitespace : true
            })) :
            console.log(html);

    } catch (err) {
        console.log(`Error: ${err}`);
    }
}

/************************************************
 * HTML
 ***********************************************/

function generateVsTableHTML(p1, p2) {

    var trows = "";
    const len = p1.product_specs.length;
    for (i = 0; i < len; i++) {
        const field = p1.product_specs[i].field;
        if (field === "Shop Online") {
            trows +=
            `<tr>
                <td>Shop Online</td>
                <td><a class="specs-table-link" href="${p1.buy_link}">$${p1.price} at REI</a></td>
                <td><a class="specs-table-link" href="${p2.buy_link}">$${p2.price} at REI</a></td>
            </tr>`;
        } else if (field === "Weight" || field === "Volume") {
            trows +=
            `<tr>
                <td>${p1.product_specs[i].field}</td>
                ${parseField(p1.product_specs[i].value)}
                ${parseField(p2.product_specs[i].value)}
            </tr>`;
        } else if (p1.product_specs[i].field === "Key Features") {
            const f1 = DATA[p1.sku].features;
            const f2 = DATA[p2.sku].features;
            trows +=
            `<tr>
                <td>Key Features</td>
                <td>
                    <b>${f1[0].split(":")[0].trim()}</b>:
                        ${f1[0].split(":")[1].trim()}
                    <br><br>
                    <b>${f1[1].split(":")[0].trim()}</b>:
                        ${f1[1].split(":")[1].trim()}
                </td>
                <td>
                    <b>${f2[0].split(":")[0].trim()}</b>:
                        ${f2[0].split(":")[1].trim()}
                    <br><br>
                    <b>${f2[1].split(":")[0].trim()}</b>:
                        ${f2[1].split(":")[1].trim()}
                </td>
            </tr>`;
        } else {
            trows +=
            `<tr>
                <td>${p1.product_specs[i].field}</td>
                <td>${p1.product_specs[i].value}</td>
                <td>${p2.product_specs[i].value}</td>
            </tr>`;
        }
    }

    const vsTable =
    `<div class="specs-table-wrapper">
        <table class="specs-table">
            <colgroup>
                <col>
                <col>
                <col>
            </colgroup>
            <thead>
                <tr>
                    <th></th>
                    <th>
                        <a href="${p1.buy_link}">
                            <img src="${p1.image}" style="height: 300px">
                        </a>
                    </th>
                    <th>
                        <a href="${p2.buy_link}">
                            <img src="${p2.image}" style="height: 300px">
                        </a>
                    </th>
                </tr>
                <tr>
                    <th></th>
                    <th><a href="${p1.buy_link}">${p1.name}</a></th>
                    <th><a href="${p2.buy_link}">${p2.name}</a></th>
                </tr>
            </thead>
            <tbody>${trows}</tbody>
        </table>
    </div>`;

    return vsTable;
}

// "15-19 inches"
//  <td>15-19 inches</td>
//
// "S: 16-19 inches, M: 18-21 inches, L: 20-23 inches
//  <td>
//      <b>S</b>: 16-19 inches
//      <br>
//      <b>M</b>: 20 inches
//      <br>
//      <b>L</b>: 23 inches
//  </td>
function parseField(str) {
    const arr = str.split(",");
    if (arr.length === 1) return `<td>${str}</td>`;

    var out = '';
    for (var i = 0; i < arr.length; i++) {
        const e = arr[i].split(":");
        out += `<b>${e[0].trim()}</b>: ${e[1].trim()}`;
        if (i != arr.length - 1) out += '<br>';
    }
    return `<td>${out}</td>`;
}

function generatePurchaseTableHTML(p1, p2) {
    return `
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
                    <td><a class="specs-table-link" href="${p1.buy_link}">$${p1.price} at REI</a></td>
                    <td><a class="specs-table-link" href="${p2.buy_link}">$${p2.price} at REI</a></td>
                </tr>
                <tr>
                    <td>Backcountry</td>
                    <td>
                        <a class="specs-table-link" href="${p1.purchase_info.backcountry.buy_link}">$${p1.purchase_info.backcountry.retail_price} at Backcountry
                        </a>
                    </td>
                    <td>
                        <a class="specs-table-link" href="${p2.purchase_info.backcountry.buy_link}">$${p2.purchase_info.backcountry.retail_price} at Backcountry
                        </a>
                    </td>
                </tr>
                <tr>
                    <td>Osprey</td>
                    <td>
                        <a class="specs-table-link" href="${p1.purchase_info.osprey.buy_link}">$${p1.purchase_info.osprey.retail_price} at Osprey
                        </a>
                    </td>
                    <td>
                        <a class="specs-table-link" href="${p2.purchase_info.osprey.buy_link}">$${p2.purchase_info.osprey.retail_price} at Osprey
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>`;
}

function generatePriceChartsHTML(p1, p2) {
    return `
    <h2>Price History</h2>
    <div class="price-chart-selector">
        <label class="radio-inline">
            <input type="radio" name="myRadios" value="price1" onclick="handleClick(this);" checked/>${p1.name}
        </label>
        <label class="radio-inline">
            <input type="radio" name="myRadios" value="price2" onclick="handleClick(this);"/>${p2.name}
        </label>
    </div>

    <div id="price1" class="price-chart-container">
        <canvas id="priceHistory1"></canvas>
    </div>
    <div id="price2" class="price-chart-container" style="display: none">
        <canvas id="priceHistory2"></canvas>
    </div>`;
}

function generateChartsHTML() {
    return `
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
        <canvas id="loadRange"></canvas>
    </div>
    `;
}

/************************************************
 * Javascript
 ***********************************************/

function generateJS(p1, p2) {
    var js = '<script>';
    js += generateWeightChartJS(p1, p2);
    js += generateVolumeChartJS(p1, p2);
    js += generateLoadChartJS(p1, p2);
    js += generatePriceChartsJS(p1, p2);
    js += '</script>';

    return js;
}

function generateWeightChartJS(p1, p2) {
    const weight1 = DATA[p1.sku].weight;
    const weight2 = DATA[p2.sku].weight;

    const js = `
    const weightCtx = document.getElementById('weight-bar-chart').getContext("2d");
    new Chart(weightCtx, {
        type: 'bar',
        data: {
            labels: ["${p1.name}", "${p2.name}"],
            datasets: [
                // TODO(kevin):
                // ${JSON.stringify(weight1)}
                // ${JSON.stringify(weight2)}
                {
                    data: [42, 30],
                    backgroundColor: 'lightblue',
                    datalabels: {
                        align: 'end',
                        anchor: 'end',
                    },
                },
                {
                    data: [24, 20],
                    backgroundColor: '#6ba292',
                    datalabels: {
                        align: 'end',
                        anchor: 'end',
                    },
                },
                {
                    data: [65, null],
                    backgroundColor: '#bcd8b7',
                    datalabels: {
                        align: 'end',
                        anchor: 'end',
                    },
                },
            ]
        },
        options: {
            title: false,
            responsive: true,
            maintainAspectRatio: false,
            legend: false,
            layout: {
                padding: {
                    top: 20
                }
            },
            scales: {
                xAxes: [{
                    ticks: {
                        fontSize: 16,
                    },
                }],
                yAxes: [{
                    gridLines: {
                        display: false,
                    },
                    ticks: {
                        beginAtZero: true,
                        stepSize: 10,
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Weight (oz)",
                        fontSize: 16,
                    }
                }],
            },
            plugins: {
                datalabels: {
                    formatter: function(value, context) {
                        var i = context.dataIndex;
                        var j = context.datasetIndex;

                        // TODO(kevin):
                        // ${JSON.stringify(weight1)}
                        // ${JSON.stringify(weight2)}

                        if (i == 0 && j == 0) return "S";
                        if (i == 0 && j == 1) return "M";
                        if (i == 0 && j == 2) return "L";

                        if (i == 1 && j == 0) return "S/M";
                        if (i == 1 && j == 1) return "L/XL";
                    },
                }
            }
        }
    });`;
    return js;
}

function generateVolumeChartJS(p1, p2) {
    const volume1 = DATA[p1.sku].volume;
    const volume2 = DATA[p2.sku].volume;

    const js = `
    const volumeCtx = document.getElementById('volume-bar-chart').getContext("2d");
    new Chart(volumeCtx, {
        type: 'bar',
        data: {
            labels: ["${p1.name}", "${p2.name}"],
            datasets: [
                // TODO(kevin):
                // ${JSON.stringify(volume1)}
                // ${JSON.stringify(volume2)}
                {
                    data: [60, 65],
                    backgroundColor: '#6ba292',
                    datalabels: {
                        align: 'end',
                        anchor: 'end',
                    },
                },
                {
                    data: [65, null],
                    backgroundColor: '#bcd8b7',
                    datalabels: {
                        align: 'end',
                        anchor: 'end',
                    },
                },
            ]
        },
        options: {
            title: {
                display: false,
            },
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            layout: {
                padding: {
                    top: 20
                }
            },
            scales: {
                xAxes: [{
                    ticks: {
                        fontSize: 16,
                    },
                }],
                yAxes: [{
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        beginAtZero: true,
                        stepSize: 10,
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Volume (L)",
                        fontSize: 16,
                    }
                }],
            },
            plugins: {
                datalabels: {
                    formatter: function(value, context) {
                        var i = context.dataIndex;
                        var j = context.datasetIndex;

                        // TODO(kevin): ${JSON.stringify(volume1)}
                        if (i == 0 && j == 0) return "S/M";
                        if (i == 0 && j == 1) return "L/XL";

                        // TODO(kevin): ${JSON.stringify(volume2)}
                        if (i == 1 && j == 0) return "One Size";
                    },
                }
            },
        },
    });`;
    return js;
}

function generateLoadChartJS(p1, p2) {
    const load1 = DATA[p1.sku].load;
    const load2 = DATA[p2.sku].load;

    const range1 = `[ ${load1.low}, ${load1.high} ]`;
    const range2 = `[ ${load2.low}, ${load2.high} ]`;

    const label1 = `${load1.low} - ${load1.high} lbs.`;
    const label2 = `${load2.low} - ${load2.high} lbs.`;

    const min = Math.floor(load1.low, load2.low) - 5;
    const max = Math.ceil(load1.high, load2.high) + 5;

    const js = `
    const loadCtx = document.getElementById('loadRange').getContext("2d");
    new Chart(loadCtx, {
        type: 'horizontalBar',
        data: {
            labels: ["${p1.name}", "${p2.name}"],
            datalabels: ["${label1}", "${label2}"],
            datasets: [
                {
                    data: [${range1}, ${range2}],
                    backgroundColor: 'lightblue',
                    barPercentage: 1.0,
                }
            ]
        },
        options: {
            title: false,
            responsive: true,
            maintainAspectRatio: false,
            legend: false,
            tooltips: false,
            layout: {
                padding: {
                    top: 20,
                    bottom: 20
                }
            },
            scales: {
                xAxes: [{
                    ticks: {
                        suggestedMin: ${min},
                        suggestedMax: ${max},
                    },
                }],
                yAxes: [{
                    ticks: {
                        fontSize: 16,
                    }
                }],
            },
            plugins: {
                datalabels: {
                    formatter: function(value, context) {
                        return context.chart.data.datalabels[context.dataIndex];
                    },
                    font: {
                        size: 16,
                    }
                }
            }
        },
    });`;
    return js;
}

function generatePriceChartsJS(p1, p2) {
    const str1 = JSON.stringify(p1.price_history);
    const str2 = JSON.stringify(p2.price_history);

    const js = `
    var currentValue = 'price1';
    function handleClick(myRadio) {
        var hide = document.getElementById(currentValue);
        hide.style.display = 'none';

        var show = document.getElementById(myRadio.value);
        show.style.display = 'block';

        currentValue = myRadio.value;
    }

    const p1 = JSON.parse('${str1}');
    const p2 = JSON.parse('${str2}');

    const ctx1 = document.getElementById('priceHistory1').getContext("2d");
    new Chart(ctx1, {
        type: 'line',
        label: "${p1.name}",
        data: {
            datasets: [
                {
                    label: 'REI',
                    data: p1.rei.data,
                    borderColor: 'green',
                    borderWidth: 2,
                    fill: false,
                    steppedLine: true,
                    datalabels: {
                        display: false
                    },
                },
                {
                    label: 'Backcountry',
                    data: p1.backcountry.data,
                    borderColor: 'blue',
                    borderWidth: 2,
                    fill: false,
                    steppedLine: true,
                    datalabels: {
                        display: false
                    },
                },
                {
                    label: 'Osprey',
                    data: p1.osprey.data,
                    borderColor: 'red',
                    borderWidth: 2,
                    fill: false,
                    steppedLine: true,
                    datalabels: {
                        display: false
                    },
                },
            ]
        },
        options: {
            title: {
                display: true,
                text: "${p1.name}",
                position: 'bottom',
                fontSize: 20,
                fontStyle: 'bold',
            },
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                position: 'top'
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'month',
                        unitStepSize: 3,
                        displayFormats: {
                            'month': 'MMM YY'
                        }
                    }
                }]
            }
        }
    });

    const ctx2 = document.getElementById('priceHistory2').getContext("2d");
    new Chart(ctx2, {
        type: 'line',
        label: "${p2.name}",
        data: {
            datasets: [
                {
                    label: 'REI',
                    data: p2.rei.data,
                    borderColor: 'green',
                    borderWidth: 2,
                    fill: false,
                    steppedLine: true,
                    datalabels: {
                        display: false
                    },
                },
                {
                    label: 'Backcountry',
                    data: p2.backcountry.data,
                    borderColor: 'blue',
                    borderWidth: 2,
                    fill: false,
                    steppedLine: true,
                    datalabels: {
                        display: false
                    },
                },
                {
                    label: 'Osprey',
                    data: p2.osprey.data,
                    borderColor: 'red',
                    borderWidth: 2,
                    fill: false,
                    steppedLine: true,
                    datalabels: {
                        display: false
                    },
                },
            ]
        },
        options: {
            title: {
                display: true,
                text: "${p2.name}",
                position: 'bottom',
                fontSize: 20,
                fontStyle: 'bold',
            },
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                position: 'top'
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'month',
                        unitStepSize: 3,
                        displayFormats: {
                            'month': 'MMM YY'
                        }
                    }
                }]
            }
        }
    });`;
    return js;
}
