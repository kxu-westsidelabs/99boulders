/************************************************
 * Bar
 ***********************************************/

const BREAKPOINT = 900;
const MOBILE_FONTSIZE = 10;
const DESKTOP_FONTSIZE = 16;
const BACKGROUND_COLORS = [
    'lightblue',
    '#6ba292',
    '#bcd8b7',
];

function calculateStepSize(arr1 ) {
    const max1 = Math.max.apply(Math, arr1.map(function(o) { return o.val; }));
    return (max1 > 10) ? 10 : 1;
}

function generateBarChartWeight(p1) {
    return generateBarChart("volume-bar-chart", "Volume", "L", p1.name, p1.volume.data);
}

function generateBarChartVolume(p1) {
    return generateBarChart("weight-bar-chart", "Weight", "oz", p1.name, p1.weight.data);
}

// TODO: how to handle empty data?
function generateBarChart(chartId, label, unit, p1, arr1) {
    const stepSize = calculateStepSize(arr1);

    var dataset = '';
    var datalabel = '';

    const numLoops = Math.max(arr1.length);
    for (var i = 0; i < numLoops; i++) {

        // TODO: sometimes one of the values is empty
        var val1 = "null";
        if (arr1[i]) {
            val1 = arr1[i].val;
            datalabel += `
                if (i == ${i} && j == 0) return "${arr1[i].key}";`;
        }
        dataset += `{
            data: [ ${val1} ],
            backgroundColor: '${BACKGROUND_COLORS[i]}',
            datalabels: { align: 'end', anchor: 'end' },
        },`;
    }


    // TODO: Product names with " will break chart.data.labels
    return `
new Chart(
    document.getElementById('${chartId}').getContext("2d"), {
    type: 'bar',
    data: {
        labels: [ "${p1}" ],
        datasets: [
            ${dataset}
        ],
    },
    plugins: [{
        beforeLayout: function(context) {
            var fontSize = (context.chart.width < ${BREAKPOINT})
                ? ${MOBILE_FONTSIZE} : ${DESKTOP_FONTSIZE};
            context.chart.options.scales.xAxes[0].ticks.fontSize = fontSize;
        }
    }],
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
            yAxes: [{
                gridLines: {
                    display: false,
                },
                ticks: {
                    beginAtZero: true,
                    stepSize: ${stepSize},
                },
                scaleLabel: {
                    display: true,
                    labelString: "${label} (${unit})",
                    fontSize: 16,
                }
            }],
        },
        tooltips: {
            displayColors: false,
            callbacks: {
                label: function(tooltipItem, all) {
                    return '${label}: ' + tooltipItem.yLabel.toLocaleString() + ' ${unit}';
                }
            }
        },
        plugins: {
            datalabels: {
                formatter: function(value, context) {
                    var i = context.datasetIndex;
                    var j = context.dataIndex;
                    ${datalabel}
                },
            }
        }
    }
});`;
}

/************************************************
 * Load - Floating Bar
 ***********************************************/

function generateLoadChart(p1) {
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


/************************************************
 * Price History
 ***********************************************/

function generatePriceHistory(p1) {
    return `
const p1 = JSON.parse('${JSON.stringify(p1.price_history)}');

${generatePriceChart(p1, 'p1')}`;
}

function calculateDiffDays(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const delta = Math.abs(d2 - d1);
    return Math.ceil(delta / (1000 * 60 * 60 * 24));
}

function generatePriceChart(p1, str) {
    var datasets = '[';
    if (p1.price_history.rei &&
        p1.price_history.rei.data.length !== 0) {
        datasets += `{
            label: 'REI',
            data: ${str}.rei.data,
            borderColor: 'green',
            borderWidth: 2,
            fill: false,
            steppedLine: true,
            datalabels: {
                display: false
            },
        },`;
    }
    if (p1.price_history.backcountry &&
        p1.price_history.backcountry.data.length !== 0) {
        datasets += `{
            label: 'Backcountry',
            data: ${str}.backcountry.data,
            borderColor: 'blue',
            borderWidth: 2,
            fill: false,
            steppedLine: true,
            datalabels: {
                display: false
            },
        },`;
    }
    if (p1.price_history.osprey &&
        p1.price_history.osprey.data.length !== 0) {
        datasets += `{
            label: 'Osprey',
            data: ${str}.osprey.data,
            borderColor: 'red',
            borderWidth: 2,
            fill: false,
            steppedLine: true,
            datalabels: {
                display: false
            },
        },`;
    }
    datasets += `]`;

    // Calculate x-axis scales (date)
    const labels = p1.price_history.rei.labels;
    const days = calculateDiffDays(
        labels[0],
        labels[labels.length - 1]
    );
    var unit = 'month';
    var stepSize = 3;
    if (days < 30) {
        unit = 'week';
        stepSize = 1;
    } else if (days < 180) {
        unit = 'month';
        stepSize = 1;
    }

    return `
new Chart(
    document.getElementById('price-history-chart-${str}').getContext("2d"),
    {
        type: 'line',
        label: "${p1.name}",
        data: {
            datasets: ${datasets}
        },
        options: {
            title: {
                display: true,
                text: "${p1.name}",
                position: 'bottom',
                fontSize: 16,
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
                        unit: '${unit}',
                        unitStepSize: ${stepSize},
                        displayFormats: {
                            'month': 'MMM YY'
                        }
                    }
                }],
                yAxes: [{
                    ticks: {
                        callback: function(value, index, values) {
                            return '$' + Math.round(value.toLocaleString());
                        }
                    },
                }]
            }
        }
    }
);`;
}

/************************************************
 * Scatter Charts
 ***********************************************/

// generated using curate.js
const PRICE_VS_WEIGHT = `[{"y":"329.95","x":4.83,"name":"Gregory Men's Baltoro 75 Pack - S"},{"y":"329.95","x":4.96,"name":"Gregory Men's Baltoro 75 Pack - M"},{"y":"329.95","x":5.22,"name":"Gregory Men's Baltoro 75 Pack - L"},{"y":"329.95","x":4.62,"name":"Gregory Women's Deva 70 Pack - XS"},{"y":"329.95","x":4.72,"name":"Gregory Women's Deva 70 Pack - S"},{"y":"329.95","x":4.95,"name":"Gregory Women's Deva 70 Pack - M"},{"y":"200.00","x":3.88,"name":"Deuter Men's Aircontact Lite 50 + 10 Pack"},{"y":"200.00","x":3.75,"name":"Deuter Women's Aircontact Lite 45 + 10 SL Pack"},{"y":"299.95","x":4.65,"name":"Gregory Men's Baltoro 65 Pack - S"},{"y":"299.95","x":4.84,"name":"Gregory Men's Baltoro 65 Pack - M"},{"y":"299.95","x":5.14,"name":"Gregory Men's Baltoro 65 Pack - L"},{"y":"349.95","x":5.19,"name":"Gregory Men's Baltoro 85 Pack - S"},{"y":"349.95","x":5.31,"name":"Gregory Men's Baltoro 85 Pack - M"},{"y":"379.95","x":6.38,"name":"Gregory Men's Baltoro 95 Pro Pack - S"},{"y":"379.95","x":6.47,"name":"Gregory Men's Baltoro 95 Pro Pack - M"},{"y":"299.95","x":4.48,"name":"Gregory Women's Deva 60 Pack - XS"},{"y":"299.95","x":4.61,"name":"Gregory Women's Deva 60 Pack - S"},{"y":"299.95","x":4.83,"name":"Gregory Women's Deva 60 Pack - M"},{"y":"349.95","x":5.05,"name":"Gregory Women's Deva 80 Pack"},{"y":"200.00","x":2.55,"name":"Osprey Men's Exos 48 Pack - S"},{"y":"200.00","x":2.57,"name":"Osprey Men's Exos 48 Pack - M"},{"y":"200.00","x":2.6,"name":"Osprey Men's Exos 48 Pack - L"},{"y":"250.00","x":1.75,"name":"Osprey Men's Levity 45 Pack"},{"y":"240.00","x":4.13,"name":"Osprey Men's Atmos AG 50 Pack - S"},{"y":"240.00","x":4.19,"name":"Osprey Men's Atmos AG 50 Pack - M"},{"y":"240.00","x":4.25,"name":"Osprey Men's Atmos AG 50 Pack - L"},{"y":"220.00","x":2.63,"name":"Osprey Men's Exos 58 Pack - S"},{"y":"220.00","x":2.69,"name":"Osprey Men's Exos 58 Pack - M"},{"y":"220.00","x":2.75,"name":"Osprey Men's Exos 58 Pack - L"},{"y":"375.00","x":3.81,"name":"Osprey Men's Aether Pro 70 Pack - S"},{"y":"250.00","x":1.75,"name":"Osprey Women's Lumina 45 Pack"},{"y":"375.00","x":3.63,"name":"Osprey Women's Ariel Pro 65 Pack - XS"},{"y":"375.00","x":3.75,"name":"Osprey Women's Ariel Pro 65 Pack - S"},{"y":"375.00","x":3.88,"name":"Osprey Women's Ariel Pro 65 Pack - M"},{"y":"240.00","x":4,"name":"Osprey Women's Aura AG 50 Pack - XS"},{"y":"240.00","x":4.13,"name":"Osprey Women's Aura AG 50 Pack - S"},{"y":"240.00","x":4.19,"name":"Osprey Women's Aura AG 50 Pack - M"},{"y":"270.00","x":4.25,"name":"Osprey Women's Aura AG 65 Pack - XS"},{"y":"270.00","x":4.31,"name":"Osprey Women's Aura AG 65 Pack - S"},{"y":"270.00","x":4.44,"name":"Osprey Women's Aura AG 65 Pack - M"},{"y":"200.00","x":2.5,"name":"Osprey Women's Eja 48 Pack - XS"},{"y":"200.00","x":2.56,"name":"Osprey Women's Eja 48 Pack - S"},{"y":"220.00","x":2.56,"name":"Osprey Women's Eja 58 Pack - XS"},{"y":"220.00","x":2.63,"name":"Osprey Women's Eja 58 Pack - S"},{"y":"220.00","x":2.63,"name":"Osprey Women's Eja 58 Pack - M"},{"y":"249.00","x":4.75,"name":"REI Co-op Men's Traverse 70 Pack - S"},{"y":"220.00","x":4.38,"name":"Deuter Men's Aircontact Lite 65 + 10 Pack"},{"y":"220.00","x":4.19,"name":"Deuter Women's Aircontact Lite 60 + 10 SL Pack"},{"y":"270.00","x":4.5,"name":"Osprey Men's Atmos AG 65 Pack - S"},{"y":"270.00","x":4.63,"name":"Osprey Men's Atmos AG 65 Pack - L"},{"y":"180.00","x":3.44,"name":"Osprey Men's Kestrel 48 Pack - S/M"},{"y":"180.00","x":3.59,"name":"Osprey Men's Kestrel 48 Pack - M/L"},{"y":"180.00","x":3.24,"name":"Osprey Women's Kyte 46 Pack - XS/S"},{"y":"180.00","x":3.38,"name":"Osprey Women's Kyte 46 Pack - S/M"},{"y":"270.00","x":1.87,"name":"Osprey Men's Levity 60 Pack - S"},{"y":"270.00","x":1.95,"name":"Osprey Men's Levity 60 Pack - M"},{"y":"270.00","x":2.03,"name":"Osprey Men's Levity 60 Pack - L"},{"y":"270.00","x":1.8,"name":"Osprey Women's Lumina 60 Pack - XS"},{"y":"270.00","x":1.88,"name":"Osprey Women's Lumina 60 Pack - S"},{"y":"270.00","x":1.95,"name":"Osprey Women's Lumina 60 Pack - M"},{"y":"179.95","x":2.9,"name":"Gregory Men's Zulu 40 Pack - S/M"},{"y":"179.95","x":2.93,"name":"Gregory Men's Zulu 40 Pack - M/L"},{"y":"229.95","x":3.68,"name":"Gregory Men's Zulu 65 Pack - S/M"},{"y":"229.95","x":3.71,"name":"Gregory Men's Zulu 65 Pack - M/L"},{"y":"179.95","x":2.75,"name":"Gregory Women's Jade 38 Pack - XS/S"},{"y":"179.95","x":2.78,"name":"Gregory Women's Jade 38 Pack - S/M"},{"y":"229.95","x":3.41,"name":"Gregory Women's Jade 63 Pack - XS/S"},{"y":"229.95","x":3.48,"name":"Gregory Women's Jade 63 Pack - S/M"},{"y":"250.00","x":5.88,"name":"Deuter Kid Comfort Active Child Carrier"},{"y":"159.00","x":2.47,"name":"REI Co-op Men's Flash 45 Pack - S"},{"y":"159.00","x":2.53,"name":"REI Co-op Men's Flash 45 Pack - M"},{"y":"199.00","x":2.56,"name":"REI Co-op Men's Flash 55 Pack - S"},{"y":"199.00","x":2.63,"name":"REI Co-op Men's Flash 55 Pack - M"},{"y":"199.00","x":2.69,"name":"REI Co-op Men's Flash 55 Pack - L"},{"y":"199.00","x":2.56,"name":"REI Co-op Women's Flash 55 Pack - XS"},{"y":"199.00","x":2.63,"name":"REI Co-op Women's Flash 55 Pack - S"},{"y":"199.00","x":2.69,"name":"REI Co-op Women's Flash 55 Pack - M"},{"y":"229.95","x":3.44,"name":"Gregory Men's Paragon 58 Pack - S/M"},{"y":"229.95","x":3.56,"name":"Gregory Men's Paragon 58 Pack - M/L"},{"y":"229.95","x":3.19,"name":"Gregory Women's Maven 55 Pack - XS/S"},{"y":"229.95","x":3.38,"name":"Gregory Women's Maven 55 Pack - S/M"},{"y":"290.00","x":7.7,"name":"Osprey Poco Child Carrier"},{"y":"330.00","x":7.9,"name":"Osprey Poco Plus Child Carrier"},{"y":"199.95","x":3.5,"name":"Gregory Men's Paragon 48 Pack"},{"y":"249.95","x":3.69,"name":"Gregory Men's Paragon 68 Pack"},{"y":"199.95","x":3.31,"name":"Gregory Women's Maven 45 Pack"},{"y":"249.95","x":3.5,"name":"Gregory Women's Maven 65 Pack"},{"y":"190.00","x":3.7,"name":"Deuter Men's Aircontact Lite 40 + 10 Pack"},{"y":"190.00","x":3.48,"name":"Deuter Women's Aircontact Lite 35 + 10 SL Pack"},{"y":"149.00","x":3.69,"name":"REI Co-op Women's Trailbreak 60 Pack"},{"y":"260.00","x":4.83,"name":"Osprey Men's Aether 55 Pack"},{"y":"280.00","x":4.92,"name":"Osprey Men's Aether 65 Pack"},{"y":"340.00","x":5.63,"name":"Osprey Men's Aether Plus 60 Pack - S/M"},{"y":"340.00","x":5.94,"name":"Osprey Men's Aether Plus 60 Pack - L/XL"},{"y":"360.00","x":5.5,"name":"Osprey Men's Aether Plus 70 Pack - S/M"},{"y":"390.00","x":6.38,"name":"Osprey Men's Aether Plus 100 Pack - S/M"},{"y":"390.00","x":6.69,"name":"Osprey Men's Aether Plus 100 Pack - L/XL"},{"y":"380.00","x":6.23,"name":"Osprey Men's Aether Plus 85 Pack"},{"y":"260.00","x":4.82,"name":"Osprey Women's Ariel 55 Pack"},{"y":"280.00","x":4.89,"name":"Osprey Women's Ariel 65 Pack"},{"y":"340.00","x":5.44,"name":"Osprey Women's Ariel Plus 60 Pack - XS/S"},{"y":"340.00","x":5.63,"name":"Osprey Women's Ariel Plus 60 Pack - M/L"},{"y":"360.00","x":5.65,"name":"Osprey Women's Ariel Plus 70 Pack"},{"y":"180.00","x":2.94,"name":"Osprey Men's Talon 44 Pack - S/M"},{"y":"180.00","x":3.31,"name":"Osprey Men's Talon 44 Pack - L/XL"},{"y":"195.00","x":3.75,"name":"Osprey Men's Kestrel 58 Pack - S/M"},{"y":"195.00","x":3.88,"name":"Osprey Men's Kestrel 58 Pack - M/L"},{"y":"195.00","x":3.56,"name":"Osprey Women's Kyte 56 Pack - XS/S"},{"y":"195.00","x":3.69,"name":"Osprey Women's Kyte 56 Pack - S/M"},{"y":"229.00","x":4.19,"name":"REI Co-op Men's Traverse 60 Pack - S"},{"y":"229.00","x":4.25,"name":"REI Co-op Men's Traverse 60 Pack - M"},{"y":"229.00","x":4.25,"name":"REI Co-op Men's Traverse 60 Pack - L Torso x S Hipbelt"},{"y":"229.00","x":4.31,"name":"REI Co-op Men's Traverse 60 Pack - L"},{"y":"229.00","x":4.13,"name":"REI Co-op Women's Traverse 60 Pack - XS"},{"y":"229.00","x":4.19,"name":"REI Co-op Women's Traverse 60 Pack - XS Torso x M Hipbelt"},{"y":"229.00","x":4.19,"name":"REI Co-op Women's Traverse 60 Pack - S"},{"y":"229.00","x":4.25,"name":"REI Co-op Women's Traverse 60 Pack - M"},{"y":"70.00","x":1.31,"name":"Osprey Daylite Plus Pack"}]`;
const PRICE_VS_VOLUME = `[{"x":72,"y":"329.95","name":"Gregory Men's Baltoro 75 Pack - S"},{"x":75,"y":"329.95","name":"Gregory Men's Baltoro 75 Pack - M"},{"x":78,"y":"329.95","name":"Gregory Men's Baltoro 75 Pack - L"},{"x":66,"y":"329.95","name":"Gregory Women's Deva 70 Pack - XS"},{"x":70,"y":"329.95","name":"Gregory Women's Deva 70 Pack - S"},{"x":74,"y":"329.95","name":"Gregory Women's Deva 70 Pack - M"},{"x":60,"y":"200.00","name":"Deuter Men's Aircontact Lite 50 + 10 Pack"},{"x":55,"y":"200.00","name":"Deuter Women's Aircontact Lite 45 + 10 SL Pack"},{"x":63,"y":"299.95","name":"Gregory Men's Baltoro 65 Pack - S"},{"x":65,"y":"299.95","name":"Gregory Men's Baltoro 65 Pack - M"},{"x":68,"y":"299.95","name":"Gregory Men's Baltoro 65 Pack - L"},{"x":80,"y":"349.95","name":"Gregory Men's Baltoro 85 Pack - S"},{"x":85,"y":"349.95","name":"Gregory Men's Baltoro 85 Pack - M"},{"x":92,"y":"379.95","name":"Gregory Men's Baltoro 95 Pro Pack - S"},{"x":95,"y":"379.95","name":"Gregory Men's Baltoro 95 Pro Pack - M"},{"x":56,"y":"299.95","name":"Gregory Women's Deva 60 Pack - XS"},{"x":60,"y":"299.95","name":"Gregory Women's Deva 60 Pack - S"},{"x":64,"y":"299.95","name":"Gregory Women's Deva 60 Pack - M"},{"x":80,"y":"349.95","name":"Gregory Women's Deva 80 Pack"},{"x":45,"y":"200.00","name":"Osprey Men's Exos 48 Pack - S"},{"x":48,"y":"200.00","name":"Osprey Men's Exos 48 Pack - M"},{"x":51,"y":"200.00","name":"Osprey Men's Exos 48 Pack - L"},{"x":42,"y":"250.00","name":"Osprey Men's Levity 45 Pack - S"},{"x":45,"y":"250.00","name":"Osprey Men's Levity 45 Pack - M"},{"x":48,"y":"250.00","name":"Osprey Men's Levity 45 Pack - L"},{"x":47,"y":"240.00","name":"Osprey Men's Atmos AG 50 Pack - S"},{"x":50,"y":"240.00","name":"Osprey Men's Atmos AG 50 Pack - M"},{"x":53,"y":"240.00","name":"Osprey Men's Atmos AG 50 Pack - L"},{"x":55,"y":"220.00","name":"Osprey Men's Exos 58 Pack - S"},{"x":58,"y":"220.00","name":"Osprey Men's Exos 58 Pack - M"},{"x":61,"y":"220.00","name":"Osprey Men's Exos 58 Pack - L"},{"x":67,"y":"375.00","name":"Osprey Men's Aether Pro 70 Pack - S"},{"x":38,"y":"250.00","name":"Osprey Women's Lumina 45 Pack - XS"},{"x":41,"y":"250.00","name":"Osprey Women's Lumina 45 Pack - S"},{"x":45,"y":"250.00","name":"Osprey Women's Lumina 45 Pack - M"},{"x":62,"y":"375.00","name":"Osprey Women's Ariel Pro 65 Pack - XS"},{"x":65,"y":"375.00","name":"Osprey Women's Ariel Pro 65 Pack - S"},{"x":68,"y":"375.00","name":"Osprey Women's Ariel Pro 65 Pack - M"},{"x":44,"y":"240.00","name":"Osprey Women's Aura AG 50 Pack - XS"},{"x":47,"y":"240.00","name":"Osprey Women's Aura AG 50 Pack - S"},{"x":50,"y":"240.00","name":"Osprey Women's Aura AG 50 Pack - M"},{"x":60,"y":"270.00","name":"Osprey Women's Aura AG 65 Pack - XS"},{"x":62,"y":"270.00","name":"Osprey Women's Aura AG 65 Pack - S"},{"x":65,"y":"270.00","name":"Osprey Women's Aura AG 65 Pack - M"},{"x":42,"y":"200.00","name":"Osprey Women's Eja 48 Pack - XS"},{"x":45,"y":"200.00","name":"Osprey Women's Eja 48 Pack - S"},{"x":52,"y":"220.00","name":"Osprey Women's Eja 58 Pack - XS"},{"x":55,"y":"220.00","name":"Osprey Women's Eja 58 Pack - S"},{"x":58,"y":"220.00","name":"Osprey Women's Eja 58 Pack - M"},{"x":66,"y":"249.00","name":"REI Co-op Men's Traverse 70 Pack - S"},{"x":75,"y":"220.00","name":"Deuter Men's Aircontact Lite 65 + 10 Pack"},{"x":70,"y":"220.00","name":"Deuter Women's Aircontact Lite 60 + 10 SL Pack"},{"x":62,"y":"270.00","name":"Osprey Men's Atmos AG 65 Pack - S"},{"x":68,"y":"270.00","name":"Osprey Men's Atmos AG 65 Pack - L"},{"x":46,"y":"180.00","name":"Osprey Men's Kestrel 48 Pack - S/M"},{"x":48,"y":"180.00","name":"Osprey Men's Kestrel 48 Pack - M/L"},{"x":44,"y":"180.00","name":"Osprey Women's Kyte 46 Pack - XS/S"},{"x":46,"y":"180.00","name":"Osprey Women's Kyte 46 Pack - S/M"},{"x":57,"y":"270.00","name":"Osprey Men's Levity 60 Pack - S"},{"x":60,"y":"270.00","name":"Osprey Men's Levity 60 Pack - M"},{"x":63,"y":"270.00","name":"Osprey Men's Levity 60 Pack - L"},{"x":54,"y":"270.00","name":"Osprey Women's Lumina 60 Pack - XS"},{"x":57,"y":"270.00","name":"Osprey Women's Lumina 60 Pack - S"},{"x":60,"y":"270.00","name":"Osprey Women's Lumina 60 Pack - M"},{"x":38,"y":"179.95","name":"Gregory Men's Zulu 40 Pack - S/M"},{"x":40,"y":"179.95","name":"Gregory Men's Zulu 40 Pack - M/L"},{"x":63,"y":"229.95","name":"Gregory Men's Zulu 65 Pack - S/M"},{"x":65,"y":"229.95","name":"Gregory Men's Zulu 65 Pack - M/L"},{"x":35,"y":"179.95","name":"Gregory Women's Jade 38 Pack - XS/S"},{"x":38,"y":"179.95","name":"Gregory Women's Jade 38 Pack - S/M"},{"x":60,"y":"229.95","name":"Gregory Women's Jade 63 Pack - XS/S"},{"x":63,"y":"229.95","name":"Gregory Women's Jade 63 Pack - S/M"},{"x":43,"y":"159.00","name":"REI Co-op Men's Flash 45 Pack - S"},{"x":45,"y":"159.00","name":"REI Co-op Men's Flash 45 Pack - M"},{"x":53,"y":"199.00","name":"REI Co-op Men's Flash 55 Pack - S"},{"x":55,"y":"199.00","name":"REI Co-op Men's Flash 55 Pack - M"},{"x":57,"y":"199.00","name":"REI Co-op Men's Flash 55 Pack - L"},{"x":53,"y":"199.00","name":"REI Co-op Women's Flash 55 Pack - XS"},{"x":55,"y":"199.00","name":"REI Co-op Women's Flash 55 Pack - S"},{"x":57,"y":"199.00","name":"REI Co-op Women's Flash 55 Pack - M"},{"x":55,"y":"229.95","name":"Gregory Men's Paragon 58 Pack - S/M"},{"x":58,"y":"229.95","name":"Gregory Men's Paragon 58 Pack - M/L"},{"x":52,"y":"229.95","name":"Gregory Women's Maven 55 Pack - XS/S"},{"x":55,"y":"229.95","name":"Gregory Women's Maven 55 Pack - S/M"},{"x":20,"y":"290.00","name":"Osprey Poco Child Carrier"},{"x":26,"y":"330.00","name":"Osprey Poco Plus Child Carrier"},{"x":48,"y":"199.95","name":"Gregory Men's Paragon 48 Pack"},{"x":68,"y":"249.95","name":"Gregory Men's Paragon 68 Pack"},{"x":45,"y":"199.95","name":"Gregory Women's Maven 45 Pack"},{"x":65,"y":"249.95","name":"Gregory Women's Maven 65 Pack"},{"x":50,"y":"190.00","name":"Deuter Men's Aircontact Lite 40 + 10 Pack"},{"x":45,"y":"190.00","name":"Deuter Women's Aircontact Lite 35 + 10 SL Pack"},{"x":60,"y":"149.00","name":"REI Co-op Women's Trailbreak 60 Pack"},{"x":55,"y":"260.00","name":"Osprey Men's Aether 55 Pack"},{"x":65,"y":"280.00","name":"Osprey Men's Aether 65 Pack"},{"x":58,"y":"340.00","name":"Osprey Men's Aether Plus 60 Pack - S/M"},{"x":60,"y":"340.00","name":"Osprey Men's Aether Plus 60 Pack - L/XL"},{"x":68,"y":"360.00","name":"Osprey Men's Aether Plus 70 Pack - S/M"},{"x":98,"y":"390.00","name":"Osprey Men's Aether Plus 100 Pack - S/M"},{"x":100,"y":"390.00","name":"Osprey Men's Aether Plus 100 Pack - L/XL"},{"x":85,"y":"380.00","name":"Osprey Men's Aether Plus 85 Pack"},{"x":55,"y":"260.00","name":"Osprey Women's Ariel 55 Pack"},{"x":65,"y":"280.00","name":"Osprey Women's Ariel 65 Pack"},{"x":58,"y":"340.00","name":"Osprey Women's Ariel Plus 60 Pack - XS/S"},{"x":60,"y":"340.00","name":"Osprey Women's Ariel Plus 60 Pack - M/L"},{"x":70,"y":"360.00","name":"Osprey Women's Ariel Plus 70 Pack"},{"x":42,"y":"180.00","name":"Osprey Men's Talon 44 Pack - S/M"},{"x":44,"y":"180.00","name":"Osprey Men's Talon 44 Pack - L/XL"},{"x":56,"y":"195.00","name":"Osprey Men's Kestrel 58 Pack - S/M"},{"x":58,"y":"195.00","name":"Osprey Men's Kestrel 58 Pack - M/L"},{"x":54,"y":"195.00","name":"Osprey Women's Kyte 56 Pack - XS/S"},{"x":56,"y":"195.00","name":"Osprey Women's Kyte 56 Pack - S/M"},{"x":58,"y":"229.00","name":"REI Co-op Men's Traverse 60 Pack - S"},{"x":60,"y":"229.00","name":"REI Co-op Men's Traverse 60 Pack - M"},{"x":62,"y":"229.00","name":"REI Co-op Men's Traverse 60 Pack - L"},{"x":62,"y":"229.00","name":"REI Co-op Men's Traverse 60 Pack - L Torso x S Hipbelt"},{"x":58,"y":"229.00","name":"REI Co-op Women's Traverse 60 Pack - XS"},{"x":58,"y":"229.00","name":"REI Co-op Women's Traverse 60 Pack - XS Torso x M Hipbelt"},{"x":60,"y":"229.00","name":"REI Co-op Women's Traverse 60 Pack - S"},{"x":62,"y":"229.00","name":"REI Co-op Women's Traverse 60 Pack - M"},{"x":20,"y":"70.00","name":"Osprey Daylite Plus Pack"}]`;

function generateScatterPriceVsWeight(p1) {

    // re-order the data so that the compared products are rendered LAST
    // to prevent overlaps
    const data = JSON.parse(PRICE_VS_WEIGHT);
    var background = [];
    var products = [];
    for (var i = 0; i < data.length; i++) {
        (data[i].name.includes(p1.name)) ?
            products.push(data[i]) :
            background.push(data[i]);
    }
    const merged = background.concat(products);

    return `
new Chart(
    document.getElementById('scatter-price-weight-chart').getContext("2d"),
    {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Pack Weight vs. Price',
                data: ${JSON.stringify(merged)},
                backgroundColor: function(context) {
                    var index = context.dataIndex;
                    var value = context.dataset.data[index];
                    if (value && value.name) {
						if (value.name.includes("Osprey")) {
							return value.name.includes("${p1.name}") ? 'red' : 'blue';
                        }
                    }
                    return '#A9A9A9';
                },
                pointRadius: 3,
                pointHoverRadius: 4,
                pointHitDetectionRadius: 1,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: false,
            },
            legend: {
                display: false,
            },
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Weight (lbs)',
                        fontSize: 16,
                    },
                    gridLines: {
                        display: true,
                    },
                    ticks: {
                        beginAtZero: true,
                        stepSize: 1,
                        callback: function(value, index, values) {
                            return value.toLocaleString();
                        }
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: false,
                    },
                    gridLines: {
                        display: true,
                    },
                    ticks: {
                        beginAtZero: true,
                        stepSize: 50,
                        callback: function(value, index, values) {
                            return '$' + value.toLocaleString();
                        }
                    },
                }],
            },
            tooltips: {
                displayColors: false,
                callbacks: {
                    title: function(tooltipItem, all) {
                        return [
                            all.datasets[tooltipItem[0].datasetIndex].data[tooltipItem[0].index].name,
                        ]
                    },
                    label: function(tooltipItem, all) {
                        return [
                            'Price: $' + tooltipItem.yLabel.toLocaleString(),
                            'Weight: ' + tooltipItem.xLabel.toLocaleString() + ' lbs',
                        ]
                    }
                }
            },
            plugins: {
                datalabels: {
                    display: false
                },
            },
        }
    }
);`;
}

function generateScatterPriceVsVolume(p1) {

    // re-order the data so that the compared products are rendered LAST
    // to prevent overlaps
    const data = JSON.parse(PRICE_VS_VOLUME);
    var background = [];
    var products = [];
    for (var i = 0; i < data.length; i++) {
        (data[i].name.includes(p1.name)) ?
            products.push(data[i]) :
            background.push(data[i]);
    }
    const merged = background.concat(products);

    return `
new Chart(
    document.getElementById('scatter-price-volume-chart').getContext("2d"),
    {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Pack Volume vs. Price',
                data: ${JSON.stringify(merged)},
                backgroundColor: function(context) {
                    var index = context.dataIndex;
                    var value = context.dataset.data[index];
                    if (value && value.name) {
						if (value.name.includes("Osprey")) {
							return value.name.includes("${p1.name}") ? 'red' : 'blue';
                        }
                    }
                    return '#A9A9A9';
                },
                pointRadius: 3,
                pointHoverRadius: 4,
                pointHitDetectionRadius: 1,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: false,
            },
            legend: {
                display: false,
            },
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Volume (L)',
                        fontSize: 16,
                    },
                    gridLines: {
                        display: true,
                    },
                    ticks: {
                        beginAtZero: true,
                        stepSize: 10,
                        callback: function(value, index, values) {
                            return value.toLocaleString();
                        }
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: false,
                    },
                    gridLines: {
                        display: true,
                    },
                    ticks: {
                        beginAtZero: true,
                        stepSize: 50,
                        callback: function(value, index, values) {
                            return '$' + value.toLocaleString();
                        }
                    },
                }],
            },
            tooltips: {
                displayColors: false,
                callbacks: {
                    title: function(tooltipItem, all) {
                        return [
                            all.datasets[tooltipItem[0].datasetIndex].data[tooltipItem[0].index].name,
                        ]
                    },
                    label: function(tooltipItem, all) {
                        return [
                            'Price: $' + tooltipItem.yLabel.toLocaleString(),
                            'Volume: ' + tooltipItem.xLabel.toLocaleString() + ' L',
                        ]
                    }
                }
            },
            plugins: {
                datalabels: {
                    display: false
                },
            },
        }
    }
);`;
}

/************************************************
 * Horizontal Bar - Rankings
 ***********************************************/

function generateRankingsWeight(p1, products) {
    var labels = [];
    var data = [];
    var colors = [];
    for (const product of products) {
        labels.push(product.name);
        data.push([0, product.weight.val]);
        colors.push(
            (product.sku == p1.sku) ? 'green' : 'lightblue'
        );
    }

    return `
new Chart(
    document.getElementById('weight-rankings-chart').getContext("2d"),
    {
        type: 'horizontalBar',
        data: {
            labels: ${JSON.stringify(labels)},
            datasets: [{
                label: 'data',
                data: ${JSON.stringify(data)},
                backgroundColor: ${JSON.stringify(colors)},
            }]
        },
        options: {
            title: false,
            responsive: true,
            maintainAspectRatio: false,
            tooltips: false,
            legend: false,
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontSize: 16,
                    },
                }],
            },
            plugins: {
                datalabels: {
                    color: '#EDEDED',
                    formatter: function(value, context) {
                        return value[1] + ' oz';
                    }
                }
            },
        },
    }
);`;
}

function generateRankingsVolume(p1, products) {
    var labels = [];
    var data = [];
    var colors = [];
    for (const product of products) {
        labels.push(product.name);
        data.push([0, product.volume.val]);
        colors.push(
            (product.sku == p1.sku) ? 'green' : 'lightblue'
        );
    }

    return `
new Chart(
    document.getElementById('volume-rankings-chart').getContext("2d"),
    {
        type: 'horizontalBar',
        data: {
            labels: ${JSON.stringify(labels)},
            datasets: [{
                label: 'data',
                data: ${JSON.stringify(data)},
                backgroundColor: ${JSON.stringify(colors)},
            }]
        },
        options: {
            title: false,
            responsive: true,
            maintainAspectRatio: false,
            tooltips: false,
            legend: false,
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontSize: 16,
                    },
                }],
            },
            plugins: {
                datalabels: {
                    color: '#EDEDED',
                    formatter: function(value, context) {
                        return value[1] + ' liters';
                    }
                }
            },
        },
    }
);`;
}

module.exports = {
    generateBarChartWeight,
    generateBarChartVolume,
    generateLoadChart,
    generatePriceHistory,
    generateScatterPriceVsWeight,
    generateScatterPriceVsVolume,
    generateRankingsVolume,
    generateRankingsWeight,
};
