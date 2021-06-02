const fs = require("fs").promises;
const convert = require('convert-units');

function generateWeight(p1, products) {
    var labels = [];
    var data = [];
    var colors = [];
    for (const product of products) {
        //console.log(product);
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

/*
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
*/

module.exports = {
    generateWeight,
};
