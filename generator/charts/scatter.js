const fs = require("fs").promises;
var convert = require('convert-units');

const PRICE_VS_WEIGHT = `[{"y":"329.95","x":4.83,"name":"Gregory Men's Baltoro 75 Pack - S"},{"y":"329.95","x":4.96,"name":"Gregory Men's Baltoro 75 Pack - M"},{"y":"329.95","x":5.22,"name":"Gregory Men's Baltoro 75 Pack - L"},{"y":"329.95","x":4.62,"name":"Gregory Women's Deva 70 Pack - XS"},{"y":"329.95","x":4.72,"name":"Gregory Women's Deva 70 Pack - S"},{"y":"329.95","x":4.95,"name":"Gregory Women's Deva 70 Pack - M"},{"y":"200.00","x":3.88,"name":"Deuter Men's Aircontact Lite 50 + 10 Pack"},{"y":"200.00","x":3.75,"name":"Deuter Women's Aircontact Lite 45 + 10 SL Pack"},{"y":"299.95","x":4.65,"name":"Gregory Men's Baltoro 65 Pack - S"},{"y":"299.95","x":4.84,"name":"Gregory Men's Baltoro 65 Pack - M"},{"y":"299.95","x":5.14,"name":"Gregory Men's Baltoro 65 Pack - L"},{"y":"349.95","x":5.19,"name":"Gregory Men's Baltoro 85 Pack - S"},{"y":"349.95","x":5.31,"name":"Gregory Men's Baltoro 85 Pack - M"},{"y":"379.95","x":6.38,"name":"Gregory Men's Baltoro 95 Pro Pack - S"},{"y":"379.95","x":6.47,"name":"Gregory Men's Baltoro 95 Pro Pack - M"},{"y":"299.95","x":4.48,"name":"Gregory Women's Deva 60 Pack - XS"},{"y":"299.95","x":4.61,"name":"Gregory Women's Deva 60 Pack - S"},{"y":"299.95","x":4.83,"name":"Gregory Women's Deva 60 Pack - M"},{"y":"349.95","x":5.05,"name":"Gregory Women's Deva 80 Pack"},{"y":"200.00","x":2.55,"name":"Osprey Men's Exos 48 Pack - S"},{"y":"200.00","x":2.57,"name":"Osprey Men's Exos 48 Pack - M"},{"y":"200.00","x":2.6,"name":"Osprey Men's Exos 48 Pack - L"},{"y":"250.00","x":1.75,"name":"Osprey Men's Levity 45 Pack"},{"y":"240.00","x":4.13,"name":"Osprey Men's Atmos AG 50 Pack - S"},{"y":"240.00","x":4.19,"name":"Osprey Men's Atmos AG 50 Pack - M"},{"y":"240.00","x":4.25,"name":"Osprey Men's Atmos AG 50 Pack - L"},{"y":"220.00","x":2.63,"name":"Osprey Men's Exos 58 Pack - S"},{"y":"220.00","x":2.69,"name":"Osprey Men's Exos 58 Pack - M"},{"y":"220.00","x":2.75,"name":"Osprey Men's Exos 58 Pack - L"},{"y":"375.00","x":3.81,"name":"Osprey Men's Aether Pro 70 Pack - S"},{"y":"250.00","x":1.75,"name":"Osprey Women's Lumina 45 Pack"},{"y":"375.00","x":3.63,"name":"Osprey Women's Ariel Pro 65 Pack - XS"},{"y":"375.00","x":3.75,"name":"Osprey Women's Ariel Pro 65 Pack - S"},{"y":"375.00","x":3.88,"name":"Osprey Women's Ariel Pro 65 Pack - M"},{"y":"240.00","x":4,"name":"Osprey Women's Aura AG 50 Pack - XS"},{"y":"240.00","x":4.13,"name":"Osprey Women's Aura AG 50 Pack - S"},{"y":"240.00","x":4.19,"name":"Osprey Women's Aura AG 50 Pack - M"},{"y":"270.00","x":4.25,"name":"Osprey Women's Aura AG 65 Pack - XS"},{"y":"270.00","x":4.31,"name":"Osprey Women's Aura AG 65 Pack - S"},{"y":"270.00","x":4.44,"name":"Osprey Women's Aura AG 65 Pack - M"},{"y":"200.00","x":2.5,"name":"Osprey Women's Eja 48 Pack - XS"},{"y":"200.00","x":2.56,"name":"Osprey Women's Eja 48 Pack - S"},{"y":"220.00","x":2.56,"name":"Osprey Women's Eja 58 Pack - XS"},{"y":"220.00","x":2.63,"name":"Osprey Women's Eja 58 Pack - S"},{"y":"220.00","x":2.63,"name":"Osprey Women's Eja 58 Pack - M"},{"y":"249.00","x":4.75,"name":"REI Co-op Men's Traverse 70 Pack - S"},{"y":"220.00","x":4.38,"name":"Deuter Men's Aircontact Lite 65 + 10 Pack"},{"y":"220.00","x":4.19,"name":"Deuter Women's Aircontact Lite 60 + 10 SL Pack"},{"y":"270.00","x":4.5,"name":"Osprey Men's Atmos AG 65 Pack - S"},{"y":"270.00","x":4.63,"name":"Osprey Men's Atmos AG 65 Pack - L"},{"y":"180.00","x":3.44,"name":"Osprey Men's Kestrel 48 Pack - S/M"},{"y":"180.00","x":3.59,"name":"Osprey Men's Kestrel 48 Pack - M/L"},{"y":"180.00","x":3.24,"name":"Osprey Women's Kyte 46 Pack - XS/S"},{"y":"180.00","x":3.38,"name":"Osprey Women's Kyte 46 Pack - S/M"},{"y":"270.00","x":1.87,"name":"Osprey Men's Levity 60 Pack - S"},{"y":"270.00","x":1.95,"name":"Osprey Men's Levity 60 Pack - M"},{"y":"270.00","x":2.03,"name":"Osprey Men's Levity 60 Pack - L"},{"y":"270.00","x":1.8,"name":"Osprey Women's Lumina 60 Pack - XS"},{"y":"270.00","x":1.88,"name":"Osprey Women's Lumina 60 Pack - S"},{"y":"270.00","x":1.95,"name":"Osprey Women's Lumina 60 Pack - M"},{"y":"179.95","x":2.9,"name":"Gregory Men's Zulu 40 Pack - S/M"},{"y":"179.95","x":2.93,"name":"Gregory Men's Zulu 40 Pack - M/L"},{"y":"229.95","x":3.68,"name":"Gregory Men's Zulu 65 Pack - S/M"},{"y":"229.95","x":3.71,"name":"Gregory Men's Zulu 65 Pack - M/L"},{"y":"179.95","x":2.75,"name":"Gregory Women's Jade 38 Pack - XS/S"},{"y":"179.95","x":2.78,"name":"Gregory Women's Jade 38 Pack - S/M"},{"y":"229.95","x":3.41,"name":"Gregory Women's Jade 63 Pack - XS/S"},{"y":"229.95","x":3.48,"name":"Gregory Women's Jade 63 Pack - S/M"},{"y":"250.00","x":5.88,"name":"Deuter Kid Comfort Active Child Carrier"},{"y":"159.00","x":2.47,"name":"REI Co-op Men's Flash 45 Pack - S"},{"y":"159.00","x":2.53,"name":"REI Co-op Men's Flash 45 Pack - M"},{"y":"199.00","x":2.56,"name":"REI Co-op Men's Flash 55 Pack - S"},{"y":"199.00","x":2.63,"name":"REI Co-op Men's Flash 55 Pack - M"},{"y":"199.00","x":2.69,"name":"REI Co-op Men's Flash 55 Pack - L"},{"y":"199.00","x":2.56,"name":"REI Co-op Women's Flash 55 Pack - XS"},{"y":"199.00","x":2.63,"name":"REI Co-op Women's Flash 55 Pack - S"},{"y":"199.00","x":2.69,"name":"REI Co-op Women's Flash 55 Pack - M"},{"y":"229.95","x":3.44,"name":"Gregory Men's Paragon 58 Pack - S/M"},{"y":"229.95","x":3.56,"name":"Gregory Men's Paragon 58 Pack - M/L"},{"y":"229.95","x":3.19,"name":"Gregory Women's Maven 55 Pack - XS/S"},{"y":"229.95","x":3.38,"name":"Gregory Women's Maven 55 Pack - S/M"},{"y":"290.00","x":7.7,"name":"Osprey Poco Child Carrier"},{"y":"330.00","x":7.9,"name":"Osprey Poco Plus Child Carrier"},{"y":"199.95","x":3.5,"name":"Gregory Men's Paragon 48 Pack"},{"y":"249.95","x":3.69,"name":"Gregory Men's Paragon 68 Pack"},{"y":"199.95","x":3.31,"name":"Gregory Women's Maven 45 Pack"},{"y":"249.95","x":3.5,"name":"Gregory Women's Maven 65 Pack"},{"y":"190.00","x":3.7,"name":"Deuter Men's Aircontact Lite 40 + 10 Pack"},{"y":"190.00","x":3.48,"name":"Deuter Women's Aircontact Lite 35 + 10 SL Pack"},{"y":"149.00","x":3.69,"name":"REI Co-op Women's Trailbreak 60 Pack"},{"y":"260.00","x":4.83,"name":"Osprey Men's Aether 55 Pack"},{"y":"280.00","x":4.92,"name":"Osprey Men's Aether 65 Pack"},{"y":"340.00","x":5.63,"name":"Osprey Men's Aether Plus 60 Pack - S/M"},{"y":"340.00","x":5.94,"name":"Osprey Men's Aether Plus 60 Pack - L/XL"},{"y":"360.00","x":5.5,"name":"Osprey Men's Aether Plus 70 Pack - S/M"},{"y":"390.00","x":6.38,"name":"Osprey Men's Aether Plus 100 Pack - S/M"},{"y":"390.00","x":6.69,"name":"Osprey Men's Aether Plus 100 Pack - L/XL"},{"y":"380.00","x":6.23,"name":"Osprey Men's Aether Plus 85 Pack"},{"y":"260.00","x":4.82,"name":"Osprey Women's Ariel 55 Pack"},{"y":"280.00","x":4.89,"name":"Osprey Women's Ariel 65 Pack"},{"y":"340.00","x":5.44,"name":"Osprey Women's Ariel Plus 60 Pack - XS/S"},{"y":"340.00","x":5.63,"name":"Osprey Women's Ariel Plus 60 Pack - M/L"},{"y":"360.00","x":5.65,"name":"Osprey Women's Ariel Plus 70 Pack"},{"y":"180.00","x":2.94,"name":"Osprey Men's Talon 44 Pack - S/M"},{"y":"180.00","x":3.31,"name":"Osprey Men's Talon 44 Pack - L/XL"},{"y":"195.00","x":3.75,"name":"Osprey Men's Kestrel 58 Pack - S/M"},{"y":"195.00","x":3.88,"name":"Osprey Men's Kestrel 58 Pack - M/L"},{"y":"195.00","x":3.56,"name":"Osprey Women's Kyte 56 Pack - XS/S"},{"y":"195.00","x":3.69,"name":"Osprey Women's Kyte 56 Pack - S/M"},{"y":"229.00","x":4.19,"name":"REI Co-op Men's Traverse 60 Pack - S"},{"y":"229.00","x":4.25,"name":"REI Co-op Men's Traverse 60 Pack - M"},{"y":"229.00","x":4.25,"name":"REI Co-op Men's Traverse 60 Pack - L Torso x S Hipbelt"},{"y":"229.00","x":4.31,"name":"REI Co-op Men's Traverse 60 Pack - L"},{"y":"229.00","x":4.13,"name":"REI Co-op Women's Traverse 60 Pack - XS"},{"y":"229.00","x":4.19,"name":"REI Co-op Women's Traverse 60 Pack - XS Torso x M Hipbelt"},{"y":"229.00","x":4.19,"name":"REI Co-op Women's Traverse 60 Pack - S"},{"y":"229.00","x":4.25,"name":"REI Co-op Women's Traverse 60 Pack - M"},{"y":"70.00","x":1.31,"name":"Osprey Daylite Plus Pack"}]`;
const PRICE_VS_VOLUME = `[{"x":72,"y":"329.95","name":"Gregory Men's Baltoro 75 Pack - S"},{"x":75,"y":"329.95","name":"Gregory Men's Baltoro 75 Pack - M"},{"x":78,"y":"329.95","name":"Gregory Men's Baltoro 75 Pack - L"},{"x":66,"y":"329.95","name":"Gregory Women's Deva 70 Pack - XS"},{"x":70,"y":"329.95","name":"Gregory Women's Deva 70 Pack - S"},{"x":74,"y":"329.95","name":"Gregory Women's Deva 70 Pack - M"},{"x":60,"y":"200.00","name":"Deuter Men's Aircontact Lite 50 + 10 Pack"},{"x":55,"y":"200.00","name":"Deuter Women's Aircontact Lite 45 + 10 SL Pack"},{"x":63,"y":"299.95","name":"Gregory Men's Baltoro 65 Pack - S"},{"x":65,"y":"299.95","name":"Gregory Men's Baltoro 65 Pack - M"},{"x":68,"y":"299.95","name":"Gregory Men's Baltoro 65 Pack - L"},{"x":80,"y":"349.95","name":"Gregory Men's Baltoro 85 Pack - S"},{"x":85,"y":"349.95","name":"Gregory Men's Baltoro 85 Pack - M"},{"x":92,"y":"379.95","name":"Gregory Men's Baltoro 95 Pro Pack - S"},{"x":95,"y":"379.95","name":"Gregory Men's Baltoro 95 Pro Pack - M"},{"x":56,"y":"299.95","name":"Gregory Women's Deva 60 Pack - XS"},{"x":60,"y":"299.95","name":"Gregory Women's Deva 60 Pack - S"},{"x":64,"y":"299.95","name":"Gregory Women's Deva 60 Pack - M"},{"x":80,"y":"349.95","name":"Gregory Women's Deva 80 Pack"},{"x":45,"y":"200.00","name":"Osprey Men's Exos 48 Pack - S"},{"x":48,"y":"200.00","name":"Osprey Men's Exos 48 Pack - M"},{"x":51,"y":"200.00","name":"Osprey Men's Exos 48 Pack - L"},{"x":42,"y":"250.00","name":"Osprey Men's Levity 45 Pack - S"},{"x":45,"y":"250.00","name":"Osprey Men's Levity 45 Pack - M"},{"x":48,"y":"250.00","name":"Osprey Men's Levity 45 Pack - L"},{"x":47,"y":"240.00","name":"Osprey Men's Atmos AG 50 Pack - S"},{"x":50,"y":"240.00","name":"Osprey Men's Atmos AG 50 Pack - M"},{"x":53,"y":"240.00","name":"Osprey Men's Atmos AG 50 Pack - L"},{"x":55,"y":"220.00","name":"Osprey Men's Exos 58 Pack - S"},{"x":58,"y":"220.00","name":"Osprey Men's Exos 58 Pack - M"},{"x":61,"y":"220.00","name":"Osprey Men's Exos 58 Pack - L"},{"x":67,"y":"375.00","name":"Osprey Men's Aether Pro 70 Pack - S"},{"x":38,"y":"250.00","name":"Osprey Women's Lumina 45 Pack - XS"},{"x":41,"y":"250.00","name":"Osprey Women's Lumina 45 Pack - S"},{"x":45,"y":"250.00","name":"Osprey Women's Lumina 45 Pack - M"},{"x":62,"y":"375.00","name":"Osprey Women's Ariel Pro 65 Pack - XS"},{"x":65,"y":"375.00","name":"Osprey Women's Ariel Pro 65 Pack - S"},{"x":68,"y":"375.00","name":"Osprey Women's Ariel Pro 65 Pack - M"},{"x":44,"y":"240.00","name":"Osprey Women's Aura AG 50 Pack - XS"},{"x":47,"y":"240.00","name":"Osprey Women's Aura AG 50 Pack - S"},{"x":50,"y":"240.00","name":"Osprey Women's Aura AG 50 Pack - M"},{"x":60,"y":"270.00","name":"Osprey Women's Aura AG 65 Pack - XS"},{"x":62,"y":"270.00","name":"Osprey Women's Aura AG 65 Pack - S"},{"x":65,"y":"270.00","name":"Osprey Women's Aura AG 65 Pack - M"},{"x":42,"y":"200.00","name":"Osprey Women's Eja 48 Pack - XS"},{"x":45,"y":"200.00","name":"Osprey Women's Eja 48 Pack - S"},{"x":52,"y":"220.00","name":"Osprey Women's Eja 58 Pack - XS"},{"x":55,"y":"220.00","name":"Osprey Women's Eja 58 Pack - S"},{"x":58,"y":"220.00","name":"Osprey Women's Eja 58 Pack - M"},{"x":66,"y":"249.00","name":"REI Co-op Men's Traverse 70 Pack - S"},{"x":75,"y":"220.00","name":"Deuter Men's Aircontact Lite 65 + 10 Pack"},{"x":70,"y":"220.00","name":"Deuter Women's Aircontact Lite 60 + 10 SL Pack"},{"x":62,"y":"270.00","name":"Osprey Men's Atmos AG 65 Pack - S"},{"x":68,"y":"270.00","name":"Osprey Men's Atmos AG 65 Pack - L"},{"x":46,"y":"180.00","name":"Osprey Men's Kestrel 48 Pack - S/M"},{"x":48,"y":"180.00","name":"Osprey Men's Kestrel 48 Pack - M/L"},{"x":44,"y":"180.00","name":"Osprey Women's Kyte 46 Pack - XS/S"},{"x":46,"y":"180.00","name":"Osprey Women's Kyte 46 Pack - S/M"},{"x":57,"y":"270.00","name":"Osprey Men's Levity 60 Pack - S"},{"x":60,"y":"270.00","name":"Osprey Men's Levity 60 Pack - M"},{"x":63,"y":"270.00","name":"Osprey Men's Levity 60 Pack - L"},{"x":54,"y":"270.00","name":"Osprey Women's Lumina 60 Pack - XS"},{"x":57,"y":"270.00","name":"Osprey Women's Lumina 60 Pack - S"},{"x":60,"y":"270.00","name":"Osprey Women's Lumina 60 Pack - M"},{"x":38,"y":"179.95","name":"Gregory Men's Zulu 40 Pack - S/M"},{"x":40,"y":"179.95","name":"Gregory Men's Zulu 40 Pack - M/L"},{"x":63,"y":"229.95","name":"Gregory Men's Zulu 65 Pack - S/M"},{"x":65,"y":"229.95","name":"Gregory Men's Zulu 65 Pack - M/L"},{"x":35,"y":"179.95","name":"Gregory Women's Jade 38 Pack - XS/S"},{"x":38,"y":"179.95","name":"Gregory Women's Jade 38 Pack - S/M"},{"x":60,"y":"229.95","name":"Gregory Women's Jade 63 Pack - XS/S"},{"x":63,"y":"229.95","name":"Gregory Women's Jade 63 Pack - S/M"},{"x":43,"y":"159.00","name":"REI Co-op Men's Flash 45 Pack - S"},{"x":45,"y":"159.00","name":"REI Co-op Men's Flash 45 Pack - M"},{"x":53,"y":"199.00","name":"REI Co-op Men's Flash 55 Pack - S"},{"x":55,"y":"199.00","name":"REI Co-op Men's Flash 55 Pack - M"},{"x":57,"y":"199.00","name":"REI Co-op Men's Flash 55 Pack - L"},{"x":53,"y":"199.00","name":"REI Co-op Women's Flash 55 Pack - XS"},{"x":55,"y":"199.00","name":"REI Co-op Women's Flash 55 Pack - S"},{"x":57,"y":"199.00","name":"REI Co-op Women's Flash 55 Pack - M"},{"x":55,"y":"229.95","name":"Gregory Men's Paragon 58 Pack - S/M"},{"x":58,"y":"229.95","name":"Gregory Men's Paragon 58 Pack - M/L"},{"x":52,"y":"229.95","name":"Gregory Women's Maven 55 Pack - XS/S"},{"x":55,"y":"229.95","name":"Gregory Women's Maven 55 Pack - S/M"},{"x":20,"y":"290.00","name":"Osprey Poco Child Carrier"},{"x":26,"y":"330.00","name":"Osprey Poco Plus Child Carrier"},{"x":48,"y":"199.95","name":"Gregory Men's Paragon 48 Pack"},{"x":68,"y":"249.95","name":"Gregory Men's Paragon 68 Pack"},{"x":45,"y":"199.95","name":"Gregory Women's Maven 45 Pack"},{"x":65,"y":"249.95","name":"Gregory Women's Maven 65 Pack"},{"x":50,"y":"190.00","name":"Deuter Men's Aircontact Lite 40 + 10 Pack"},{"x":45,"y":"190.00","name":"Deuter Women's Aircontact Lite 35 + 10 SL Pack"},{"x":60,"y":"149.00","name":"REI Co-op Women's Trailbreak 60 Pack"},{"x":55,"y":"260.00","name":"Osprey Men's Aether 55 Pack"},{"x":65,"y":"280.00","name":"Osprey Men's Aether 65 Pack"},{"x":58,"y":"340.00","name":"Osprey Men's Aether Plus 60 Pack - S/M"},{"x":60,"y":"340.00","name":"Osprey Men's Aether Plus 60 Pack - L/XL"},{"x":68,"y":"360.00","name":"Osprey Men's Aether Plus 70 Pack - S/M"},{"x":98,"y":"390.00","name":"Osprey Men's Aether Plus 100 Pack - S/M"},{"x":100,"y":"390.00","name":"Osprey Men's Aether Plus 100 Pack - L/XL"},{"x":85,"y":"380.00","name":"Osprey Men's Aether Plus 85 Pack"},{"x":55,"y":"260.00","name":"Osprey Women's Ariel 55 Pack"},{"x":65,"y":"280.00","name":"Osprey Women's Ariel 65 Pack"},{"x":58,"y":"340.00","name":"Osprey Women's Ariel Plus 60 Pack - XS/S"},{"x":60,"y":"340.00","name":"Osprey Women's Ariel Plus 60 Pack - M/L"},{"x":70,"y":"360.00","name":"Osprey Women's Ariel Plus 70 Pack"},{"x":42,"y":"180.00","name":"Osprey Men's Talon 44 Pack - S/M"},{"x":44,"y":"180.00","name":"Osprey Men's Talon 44 Pack - L/XL"},{"x":56,"y":"195.00","name":"Osprey Men's Kestrel 58 Pack - S/M"},{"x":58,"y":"195.00","name":"Osprey Men's Kestrel 58 Pack - M/L"},{"x":54,"y":"195.00","name":"Osprey Women's Kyte 56 Pack - XS/S"},{"x":56,"y":"195.00","name":"Osprey Women's Kyte 56 Pack - S/M"},{"x":58,"y":"229.00","name":"REI Co-op Men's Traverse 60 Pack - S"},{"x":60,"y":"229.00","name":"REI Co-op Men's Traverse 60 Pack - M"},{"x":62,"y":"229.00","name":"REI Co-op Men's Traverse 60 Pack - L"},{"x":62,"y":"229.00","name":"REI Co-op Men's Traverse 60 Pack - L Torso x S Hipbelt"},{"x":58,"y":"229.00","name":"REI Co-op Women's Traverse 60 Pack - XS"},{"x":58,"y":"229.00","name":"REI Co-op Women's Traverse 60 Pack - XS Torso x M Hipbelt"},{"x":60,"y":"229.00","name":"REI Co-op Women's Traverse 60 Pack - S"},{"x":62,"y":"229.00","name":"REI Co-op Women's Traverse 60 Pack - M"},{"x":20,"y":"70.00","name":"Osprey Daylite Plus Pack"}]`;

function generatePriceVsWeight(p1, p2) {
    return `
new Chart(
    document.getElementById('scatter-price-weight-chart').getContext("2d"),
    {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Pack Weight vs. Price',
                data: ${PRICE_VS_WEIGHT},
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
                            'Weight: ' + tooltipItem.xLabel.toLocaleString() + ' lbs',
                            'Price: $' + tooltipItem.yLabel.toLocaleString(),
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

function generatePriceVsVolume(p1, p2) {

    return `
new Chart(
    document.getElementById('scatter-price-volume-chart').getContext("2d"),
    {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Pack Volume vs. Price',
                data: ${PRICE_VS_VOLUME},
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
                            'Volume: ' + tooltipItem.xLabel.toLocaleString() + ' L',
                            'Price: $' + tooltipItem.yLabel.toLocaleString(),
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

/*
(async function() {
    // await createScatterData();
    await weightVsVolume();
})();

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
*/


module.exports = {
    generatePriceVsWeight,
    generatePriceVsVolume,
    // generateWeightVsVolumeChart,
};
