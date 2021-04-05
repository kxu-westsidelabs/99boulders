const fs = require("fs").promises;
var convert = require('convert-units');

// weight vs price
const DATA = `[{"x":"329.95","y":4.83,"name":"Gregory Men's Baltoro 75 Pack - S"},{"x":"329.95","y":4.96,"name":"Gregory Men's Baltoro 75 Pack - M"},{"x":"329.95","y":5.22,"name":"Gregory Men's Baltoro 75 Pack - L"},{"x":"329.95","y":4.62,"name":"Gregory Women's Deva 70 Pack - XS"},{"x":"329.95","y":4.72,"name":"Gregory Women's Deva 70 Pack - S"},{"x":"329.95","y":4.95,"name":"Gregory Women's Deva 70 Pack - M"},{"x":"200.00","y":3.88,"name":"Deuter Men's Aircontact Lite 50 + 10 Pack"},{"x":"200.00","y":3.75,"name":"Deuter Women's Aircontact Lite 45 + 10 SL Pack"},{"x":"299.95","y":4.65,"name":"Gregory Men's Baltoro 65 Pack - S"},{"x":"299.95","y":4.84,"name":"Gregory Men's Baltoro 65 Pack - M"},{"x":"299.95","y":5.14,"name":"Gregory Men's Baltoro 65 Pack - L"},{"x":"349.95","y":5.19,"name":"Gregory Men's Baltoro 85 Pack - S"},{"x":"349.95","y":5.31,"name":"Gregory Men's Baltoro 85 Pack - M"},{"x":"379.95","y":6.38,"name":"Gregory Men's Baltoro 95 Pro Pack - S"},{"x":"379.95","y":6.47,"name":"Gregory Men's Baltoro 95 Pro Pack - M"},{"x":"299.95","y":4.48,"name":"Gregory Women's Deva 60 Pack - XS"},{"x":"299.95","y":4.61,"name":"Gregory Women's Deva 60 Pack - S"},{"x":"299.95","y":4.83,"name":"Gregory Women's Deva 60 Pack - M"},{"x":"349.95","y":5.05,"name":"Gregory Women's Deva 80 Pack"},{"x":"200.00","y":2.55,"name":"Osprey Men's Exos 48 Pack - S"},{"x":"200.00","y":2.57,"name":"Osprey Men's Exos 48 Pack - M"},{"x":"200.00","y":2.6,"name":"Osprey Men's Exos 48 Pack - L"},{"x":"250.00","y":1.75,"name":"Osprey Men's Levity 45 Pack"},{"x":"240.00","y":4.13,"name":"Osprey Men's Atmos AG 50 Pack - S"},{"x":"240.00","y":4.19,"name":"Osprey Men's Atmos AG 50 Pack - M"},{"x":"240.00","y":4.25,"name":"Osprey Men's Atmos AG 50 Pack - L"},{"x":"220.00","y":2.63,"name":"Osprey Men's Exos 58 Pack - S"},{"x":"220.00","y":2.69,"name":"Osprey Men's Exos 58 Pack - M"},{"x":"220.00","y":2.75,"name":"Osprey Men's Exos 58 Pack - L"},{"x":"375.00","y":3.81,"name":"Osprey Men's Aether Pro 70 Pack - S"},{"x":"250.00","y":1.75,"name":"Osprey Women's Lumina 45 Pack"},{"x":"375.00","y":3.63,"name":"Osprey Women's Ariel Pro 65 Pack - XS"},{"x":"375.00","y":3.75,"name":"Osprey Women's Ariel Pro 65 Pack - S"},{"x":"375.00","y":3.88,"name":"Osprey Women's Ariel Pro 65 Pack - M"},{"x":"240.00","y":4,"name":"Osprey Women's Aura AG 50 Pack - XS"},{"x":"240.00","y":4.13,"name":"Osprey Women's Aura AG 50 Pack - S"},{"x":"240.00","y":4.19,"name":"Osprey Women's Aura AG 50 Pack - M"},{"x":"270.00","y":4.25,"name":"Osprey Women's Aura AG 65 Pack - XS"},{"x":"270.00","y":4.31,"name":"Osprey Women's Aura AG 65 Pack - S"},{"x":"270.00","y":4.44,"name":"Osprey Women's Aura AG 65 Pack - M"},{"x":"200.00","y":2.5,"name":"Osprey Women's Eja 48 Pack - XS"},{"x":"200.00","y":2.56,"name":"Osprey Women's Eja 48 Pack - S"},{"x":"220.00","y":2.56,"name":"Osprey Women's Eja 58 Pack - XS"},{"x":"220.00","y":2.63,"name":"Osprey Women's Eja 58 Pack - S"},{"x":"220.00","y":2.63,"name":"Osprey Women's Eja 58 Pack - M"},{"x":"249.00","y":4.75,"name":"REI Co-op Men's Traverse 70 Pack - S"},{"x":"220.00","y":4.38,"name":"Deuter Men's Aircontact Lite 65 + 10 Pack"},{"x":"220.00","y":4.19,"name":"Deuter Women's Aircontact Lite 60 + 10 SL Pack"},{"x":"270.00","y":4.5,"name":"Osprey Men's Atmos AG 65 Pack - S"},{"x":"270.00","y":4.63,"name":"Osprey Men's Atmos AG 65 Pack - L"},{"x":"180.00","y":3.44,"name":"Osprey Men's Kestrel 48 Pack - S/M"},{"x":"180.00","y":3.59,"name":"Osprey Men's Kestrel 48 Pack - M/L"},{"x":"180.00","y":3.24,"name":"Osprey Women's Kyte 46 Pack - XS/S"},{"x":"180.00","y":3.38,"name":"Osprey Women's Kyte 46 Pack - S/M"},{"x":"270.00","y":1.87,"name":"Osprey Men's Levity 60 Pack - S"},{"x":"270.00","y":1.95,"name":"Osprey Men's Levity 60 Pack - M"},{"x":"270.00","y":2.03,"name":"Osprey Men's Levity 60 Pack - L"},{"x":"270.00","y":1.8,"name":"Osprey Women's Lumina 60 Pack - XS"},{"x":"270.00","y":1.88,"name":"Osprey Women's Lumina 60 Pack - S"},{"x":"270.00","y":1.95,"name":"Osprey Women's Lumina 60 Pack - M"},{"x":"179.95","y":2.9,"name":"Gregory Men's Zulu 40 Pack - S/M"},{"x":"179.95","y":2.93,"name":"Gregory Men's Zulu 40 Pack - M/L"},{"x":"229.95","y":3.68,"name":"Gregory Men's Zulu 65 Pack - S/M"},{"x":"229.95","y":3.71,"name":"Gregory Men's Zulu 65 Pack - M/L"},{"x":"179.95","y":2.75,"name":"Gregory Women's Jade 38 Pack - XS/S"},{"x":"179.95","y":2.78,"name":"Gregory Women's Jade 38 Pack - S/M"},{"x":"229.95","y":3.41,"name":"Gregory Women's Jade 63 Pack - XS/S"},{"x":"229.95","y":3.48,"name":"Gregory Women's Jade 63 Pack - S/M"},{"x":"250.00","y":5.88,"name":"Deuter Kid Comfort Active Child Carrier"},{"x":"159.00","y":2.47,"name":"REI Co-op Men's Flash 45 Pack - S"},{"x":"159.00","y":2.53,"name":"REI Co-op Men's Flash 45 Pack - M"},{"x":"199.00","y":2.56,"name":"REI Co-op Men's Flash 55 Pack - S"},{"x":"199.00","y":2.63,"name":"REI Co-op Men's Flash 55 Pack - M"},{"x":"199.00","y":2.69,"name":"REI Co-op Men's Flash 55 Pack - L"},{"x":"199.00","y":2.56,"name":"REI Co-op Women's Flash 55 Pack - XS"},{"x":"199.00","y":2.63,"name":"REI Co-op Women's Flash 55 Pack - S"},{"x":"199.00","y":2.69,"name":"REI Co-op Women's Flash 55 Pack - M"},{"x":"229.95","y":3.44,"name":"Gregory Men's Paragon 58 Pack - S/M"},{"x":"229.95","y":3.56,"name":"Gregory Men's Paragon 58 Pack - M/L"},{"x":"229.95","y":3.19,"name":"Gregory Women's Maven 55 Pack - XS/S"},{"x":"229.95","y":3.38,"name":"Gregory Women's Maven 55 Pack - S/M"},{"x":"290.00","y":7.7,"name":"Osprey Poco Child Carrier"},{"x":"330.00","y":7.9,"name":"Osprey Poco Plus Child Carrier"},{"x":"199.95","y":3.5,"name":"Gregory Men's Paragon 48 Pack"},{"x":"249.95","y":3.69,"name":"Gregory Men's Paragon 68 Pack"},{"x":"199.95","y":3.31,"name":"Gregory Women's Maven 45 Pack"},{"x":"249.95","y":3.5,"name":"Gregory Women's Maven 65 Pack"},{"x":"190.00","y":3.7,"name":"Deuter Men's Aircontact Lite 40 + 10 Pack"},{"x":"190.00","y":3.48,"name":"Deuter Women's Aircontact Lite 35 + 10 SL Pack"},{"x":"149.00","y":3.69,"name":"REI Co-op Women's Trailbreak 60 Pack"},{"x":"260.00","y":4.83,"name":"Osprey Men's Aether 55 Pack"},{"x":"280.00","y":4.92,"name":"Osprey Men's Aether 65 Pack"},{"x":"340.00","y":5.63,"name":"Osprey Men's Aether Plus 60 Pack - S/M"},{"x":"340.00","y":5.94,"name":"Osprey Men's Aether Plus 60 Pack - L/XL"},{"x":"360.00","y":5.5,"name":"Osprey Men's Aether Plus 70 Pack - S/M"},{"x":"390.00","y":6.38,"name":"Osprey Men's Aether Plus 100 Pack - S/M"},{"x":"390.00","y":6.69,"name":"Osprey Men's Aether Plus 100 Pack - L/XL"},{"x":"380.00","y":6.23,"name":"Osprey Men's Aether Plus 85 Pack"},{"x":"260.00","y":4.82,"name":"Osprey Women's Ariel 55 Pack"},{"x":"280.00","y":4.89,"name":"Osprey Women's Ariel 65 Pack"},{"x":"340.00","y":5.44,"name":"Osprey Women's Ariel Plus 60 Pack - XS/S"},{"x":"340.00","y":5.63,"name":"Osprey Women's Ariel Plus 60 Pack - M/L"},{"x":"360.00","y":5.65,"name":"Osprey Women's Ariel Plus 70 Pack"},{"x":"180.00","y":2.94,"name":"Osprey Men's Talon 44 Pack - S/M"},{"x":"180.00","y":3.31,"name":"Osprey Men's Talon 44 Pack - L/XL"},{"x":"195.00","y":3.75,"name":"Osprey Men's Kestrel 58 Pack - S/M"},{"x":"195.00","y":3.88,"name":"Osprey Men's Kestrel 58 Pack - M/L"},{"x":"195.00","y":3.56,"name":"Osprey Women's Kyte 56 Pack - XS/S"},{"x":"195.00","y":3.69,"name":"Osprey Women's Kyte 56 Pack - S/M"},{"x":"229.00","y":4.19,"name":"REI Co-op Men's Traverse 60 Pack - S"},{"x":"229.00","y":4.25,"name":"REI Co-op Men's Traverse 60 Pack - M"},{"x":"229.00","y":4.25,"name":"REI Co-op Men's Traverse 60 Pack - L Torso x S Hipbelt"},{"x":"229.00","y":4.31,"name":"REI Co-op Men's Traverse 60 Pack - L"},{"x":"229.00","y":4.13,"name":"REI Co-op Women's Traverse 60 Pack - XS"},{"x":"229.00","y":4.19,"name":"REI Co-op Women's Traverse 60 Pack - XS Torso x M Hipbelt"},{"x":"229.00","y":4.19,"name":"REI Co-op Women's Traverse 60 Pack - S"},{"x":"229.00","y":4.25,"name":"REI Co-op Women's Traverse 60 Pack - M"},{"x":"70.00","y":1.31,"name":"Osprey Daylite Plus Pack"}]`;

// weight vs volume
const WEIGHT_VS_VOLUME = `[{"x":77.2,"y":4.83,"name":"Gregory Men's Baltoro 75 Pack - S"},{"x":73.9,"y":4.62,"name":"Gregory Women's Deva 70 Pack - XS"},{"x":62,"y":3.88,"name":"Deuter Men's Aircontact Lite 50 + 10 Pack"},{"x":60,"y":3.75,"name":"Deuter Women's Aircontact Lite 45 + 10 SL Pack"},{"x":74.4,"y":4.65,"name":"Gregory Men's Baltoro 65 Pack - S"},{"x":83,"y":5.19,"name":"Gregory Men's Baltoro 85 Pack - S"},{"x":102,"y":6.38,"name":"Gregory Men's Baltoro 95 Pro Pack - S"},{"x":71.7,"y":4.48,"name":"Gregory Women's Deva 60 Pack - XS"},{"x":80.75,"y":5.05,"name":"Gregory Women's Deva 80 Pack"},{"x":40.8,"y":2.55,"name":"Osprey Men's Exos 48 Pack - S"},{"x":28,"y":1.75,"name":"Osprey Men's Levity 45 Pack"},{"x":66,"y":4.13,"name":"Osprey Men's Atmos AG 50 Pack - S"},{"x":42,"y":2.63,"name":"Osprey Men's Exos 58 Pack - S"},{"x":61,"y":3.81,"name":"Osprey Men's Aether Pro 70 Pack - S"},{"x":28,"y":1.75,"name":"Osprey Women's Lumina 45 Pack"},{"x":58,"y":3.63,"name":"Osprey Women's Ariel Pro 65 Pack - XS"},{"x":64,"y":4,"name":"Osprey Women's Aura AG 50 Pack - XS"},{"x":68,"y":4.25,"name":"Osprey Women's Aura AG 65 Pack - XS"},{"x":40,"y":2.5,"name":"Osprey Women's Eja 48 Pack - XS"},{"x":41,"y":2.56,"name":"Osprey Women's Eja 58 Pack - XS"},{"x":76,"y":4.75,"name":"REI Co-op Men's Traverse 70 Pack - S"},{"x":70,"y":4.38,"name":"Deuter Men's Aircontact Lite 65 + 10 Pack"},{"x":67,"y":4.19,"name":"Deuter Women's Aircontact Lite 60 + 10 SL Pack"},{"x":72,"y":4.5,"name":"Osprey Men's Atmos AG 65 Pack - S"},{"x":55,"y":3.44,"name":"Osprey Men's Kestrel 48 Pack - S/M"},{"x":51.8,"y":3.24,"name":"Osprey Women's Kyte 46 Pack - XS/S"},{"x":29.9,"y":1.87,"name":"Osprey Men's Levity 60 Pack - S"},{"x":28.8,"y":1.8,"name":"Osprey Women's Lumina 60 Pack - XS"},{"x":46.4,"y":2.9,"name":"Gregory Men's Zulu 40 Pack - S/M"},{"x":58.9,"y":3.68,"name":"Gregory Men's Zulu 65 Pack - S/M"},{"x":44,"y":2.75,"name":"Gregory Women's Jade 38 Pack - XS/S"},{"x":54.6,"y":3.41,"name":"Gregory Women's Jade 63 Pack - XS/S"},{"x":39.5,"y":2.47,"name":"REI Co-op Men's Flash 45 Pack - S"},{"x":41,"y":2.56,"name":"REI Co-op Men's Flash 55 Pack - S"},{"x":41,"y":2.56,"name":"REI Co-op Women's Flash 55 Pack - XS"},{"x":55,"y":3.44,"name":"Gregory Men's Paragon 58 Pack - S/M"},{"x":51,"y":3.19,"name":"Gregory Women's Maven 55 Pack - XS/S"},{"x":123.2,"y":7.7,"name":"Osprey Poco Child Carrier"},{"x":126.4,"y":7.9,"name":"Osprey Poco Plus Child Carrier"},{"x":56,"y":3.5,"name":"Gregory Men's Paragon 48 Pack"},{"x":59,"y":3.69,"name":"Gregory Men's Paragon 68 Pack"},{"x":53,"y":3.31,"name":"Gregory Women's Maven 45 Pack"},{"x":56,"y":3.5,"name":"Gregory Women's Maven 65 Pack"},{"x":59.2,"y":3.7,"name":"Deuter Men's Aircontact Lite 40 + 10 Pack"},{"x":55.7,"y":3.48,"name":"Deuter Women's Aircontact Lite 35 + 10 SL Pack"},{"x":59,"y":3.69,"name":"REI Co-op Women's Trailbreak 60 Pack"},{"x":77.3,"y":4.83,"name":"Osprey Men's Aether 55 Pack"},{"x":78.7,"y":4.92,"name":"Osprey Men's Aether 65 Pack"},{"x":90,"y":5.63,"name":"Osprey Men's Aether Plus 60 Pack - S/M"},{"x":88,"y":5.5,"name":"Osprey Men's Aether Plus 70 Pack - S/M"},{"x":102,"y":6.38,"name":"Osprey Men's Aether Plus 100 Pack - S/M"},{"x":99.7,"y":6.23,"name":"Osprey Men's Aether Plus 85 Pack"},{"x":77.1,"y":4.82,"name":"Osprey Women's Ariel 55 Pack"},{"x":78.2,"y":4.89,"name":"Osprey Women's Ariel 65 Pack"},{"x":87,"y":5.44,"name":"Osprey Women's Ariel Plus 60 Pack - XS/S"},{"x":90.4,"y":5.65,"name":"Osprey Women's Ariel Plus 70 Pack"},{"x":47,"y":2.94,"name":"Osprey Men's Talon 44 Pack - S/M"},{"x":60,"y":3.75,"name":"Osprey Men's Kestrel 58 Pack - S/M"},{"x":57,"y":3.56,"name":"Osprey Women's Kyte 56 Pack - XS/S"},{"x":67,"y":4.19,"name":"REI Co-op Men's Traverse 60 Pack - S"},{"x":66,"y":4.13,"name":"REI Co-op Women's Traverse 60 Pack - XS"},{"x":21,"y":1.31,"name":"Osprey Daylite Plus Pack"}]`;

/*
(async function() {
    // await createScatterData();
    await weightVsVolume();
})();
*/

async function weightVsVolume() {
    try {
        const baseUrl = '../../data/products';
        const files = await fs.readdir(baseUrl);

        var data = [];
        for (const file of files) {
            if ([ '.DS_Store' ].includes(file)) {
                continue;
            }
            const product = JSON.parse(
                await fs.readFile(`${baseUrl}/${file}`, "utf-8")
            );

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

                break;
            }
        }
        console.log(JSON.stringify(data));
    } catch (err) {
        console.log(err);
    }
}


// iterate over all files in ./data/products
// fetch the weight field
// aggregate them into a separate json object
async function createScatterData() {
    try {
        const baseUrl = '../../data/products';
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

function generateWeightVsVolumeChart(p1, p2) {
    return `
new Chart(
    document.getElementById('scatter-weight-volume-chart').getContext("2d"),
    {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Pack Weight vs. Volume',
                data: ${WEIGHT_VS_VOLUME},
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
                        display: true,
                        labelString: 'Volume (liters)',
                        fontSize: 16,
                    },
                    gridLines: {
                        display: true,
                    },
                    ticks: {
                        callback: function(value, index, values) {
                            return value.toLocaleString();
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
                            'Volume: ' + tooltipItem.xLabel.toLocaleString() + ' liters',
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
    generateChart,
    generateWeightVsVolumeChart,
};
