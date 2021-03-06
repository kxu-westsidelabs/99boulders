const fs = require("fs").promises;

/*
(async function() {
    const sku1 = process.argv[2];
    const sku2 = process.argv[3];
    const p1 = JSON.parse(
        await fs.readFile(`../data/products/${sku1}.json`, "utf-8")
    );
    const p2 = JSON.parse(
        await fs.readFile(`../data/products/${sku2}.json`, "utf-8")
    );
    console.log(
        generateChart(p1, p2)
    );
})();
*/

function generateChart(p1, p2) {
    return `
var currentValue = 'price1';
function handleClick(myRadio) {
    var hide = document.getElementById(currentValue);
    hide.style.display = 'none';

    var show = document.getElementById(myRadio.value);
    show.style.display = 'block';

    currentValue = myRadio.value;
}

const p1 = JSON.parse('${JSON.stringify(p1.price_history)}');
const p2 = JSON.parse('${JSON.stringify(p2.price_history)}');

${generatePriceChart(p1, 'p1')}
${generatePriceChart(p2, 'p2')}
`;
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

module.exports = {
    generateChart
};
