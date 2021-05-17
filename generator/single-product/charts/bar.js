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

// TODO: how to handle empty data?
function generateChart(chartId, label, unit, p1, arr1) {
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

module.exports = {
    generateChart
};
