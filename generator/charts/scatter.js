const fs = require("fs").promises;
var convert = require('convert-units');

const DATA = `[{"x":"329.95","y":4.83,"name":"Gregory Men's Baltoro 75 Pack - S"},{"x":"329.95","y":4.96,"name":"Gregory Men's Baltoro 75 Pack - M"},{"x":"329.95","y":5.22,"name":"Gregory Men's Baltoro 75 Pack - L"},{"x":"299.95","y":4.65,"name":"Gregory Men's Baltoro 65 Pack - S"},{"x":"299.95","y":4.84,"name":"Gregory Men's Baltoro 65 Pack - M"},{"x":"299.95","y":5.14,"name":"Gregory Men's Baltoro 65 Pack - L"},{"x":"200.00","y":2.55,"name":"Osprey Men's Exos 48 Pack - S"},{"x":"200.00","y":2.57,"name":"Osprey Men's Exos 48 Pack - M"},{"x":"200.00","y":2.6,"name":"Osprey Men's Exos 48 Pack - L"},{"x":"240.00","y":4.13,"name":"Osprey Men's Atmos AG 50 Pack - S"},{"x":"240.00","y":4.19,"name":"Osprey Men's Atmos AG 50 Pack - M"},{"x":"240.00","y":4.25,"name":"Osprey Men's Atmos AG 50 Pack - L"},{"x":"220.00","y":2.63,"name":"Osprey Men's Exos 58 Pack - S"},{"x":"220.00","y":2.69,"name":"Osprey Men's Exos 58 Pack - M"},{"x":"220.00","y":2.75,"name":"Osprey Men's Exos 58 Pack - L"},{"x":"240.00","y":0.25,"name":"Osprey Women's Aura AG 50 Pack - XS"},{"x":"240.00","y":4.13,"name":"Osprey Women's Aura AG 50 Pack - S"},{"x":"240.00","y":4.19,"name":"Osprey Women's Aura AG 50 Pack - M"},{"x":"270.00","y":4.25,"name":"Osprey Women's Aura AG 65 Pack - XS"},{"x":"270.00","y":4.31,"name":"Osprey Women's Aura AG 65 Pack - S"},{"x":"270.00","y":4.44,"name":"Osprey Women's Aura AG 65 Pack - M"},{"x":"270.00","y":4.5,"name":"Osprey Men's Atmos AG 65 Pack - S"},{"x":"270.00","y":4.63,"name":"Osprey Men's Atmos AG 65 Pack - L"},{"x":"250.00","y":5.88,"name":"Deuter Kid Comfort Active Child Carrier"},{"x":"290.00","y":7.7,"name":"Osprey Poco Child Carrier"},{"x":"330.00","y":7.9,"name":"Osprey Poco Plus Child Carrier"},{"x":"260.00","y":4.83,"name":"Osprey Men's Aether 55 Pack"},{"x":"280.00","y":4.92,"name":"Osprey Men's Aether 65 Pack"},{"x":"260.00","y":4.82,"name":"Osprey Women's Ariel 55 Pack"},{"x":"280.00","y":4.89,"name":"Osprey Women's Ariel 65 Pack"},{"x":"180.00","y":2.94,"name":"Osprey Men's Talon 44 Pack - S/M"},{"x":"180.00","y":3.31,"name":"Osprey Men's Talon 44 Pack - L/XL"},{"x":"70.00","y":1.31,"name":"Osprey Daylite Plus Pack"}]`;

/*
(async function() {
    await createScatterData();
})();
*/

// iterate over all files in ./data/products
// fetch the weight field
// aggregate them into a separate json object
async function createScatterData() {
    try {
        const baseUrl = '../data/products';
        const files = await fs.readdir(baseUrl);

        var data = [];
        for (const file of files) {
            if ([ '.DS_Store' ].includes(file)) {
                continue;
            }
            const product = JSON.parse(
                await fs.readFile(`${baseUrl}/${file}`, "utf-8")
            );

            for (const variant of product.weight.data) {
                const name = (variant.key === 'One Size') ?
                    product.name :
                    `${product.name} - ${variant.key}`;

                const lbs = convert(variant.val).from('oz').to('lb');
                data.push({
                    x: product.price,
                    y: Math.round(lbs * 100) / 100,
                    name: name,
                });
            }
        }
        console.log(JSON.stringify(data));
    } catch (err) {
        console.log(err);
    }
}

function generateChart(p1, p2) {

    return `
new Chart(
    document.getElementById('scatter-chart').getContext("2d"),
    {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Pack Weight vs. Price',
                data: ${DATA},
                backgroundColor: function(context) {
                    var index = context.dataIndex;
                    var value = context.dataset.data[index];
                    if (value && value.name) {
                        if (value.name.includes("${p1.name}")) {
                            return 'red';
                        }
                        if (value.name.includes("${p2.name}")) {
                            return 'blue';
                        }
                    }
                    return '#A9A9A9';
                },
                pointRadius: 3,
                pointHoverRadius: 4,
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
                        display: false,
                    },
                    gridLines: {
                        display: true,
                    },
                    ticks: {
                        callback: function(value, index, values) {
                            return '$' + value.toLocaleString();
                        }
                    },
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Weight (lbs)',
                        fontSize: 16,
                    },
                    gridLines: {
                        display: true,
                    },
                    ticks: {
                        stepSize: 2,
                        callback: function(value, index, values) {
                            return value.toLocaleString();
                        }
                    }
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
                            'Price: $' + tooltipItem.xLabel.toLocaleString(),
                            'Weight: ' + tooltipItem.yLabel.toLocaleString() + ' lbs',
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

module.exports = {
    generateChart
};
