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

function generateVolume(p1, products) {
    var labels = [];
    var data = [];
    var colors = [];
    for (const product of products) {
        //console.log(product);
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
    generateWeight,
    generateVolume,
};
