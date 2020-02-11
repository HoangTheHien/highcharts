// Table row definitions. The table is built from this data.
var tableRows = [{
    trackTitle: 'Education',
    chartData: [178, 184, 167, 183, 160, 138]
}, {
    trackTitle: 'Employment & Workplace',
    chartData: [87, 68, 99, 105, 91, 137]
}, {
    trackTitle: 'Entertainment & Leisure',
    chartData: [24, 32, 30, 25, 25, 28]
}, {
    trackTitle: 'Independent Living',
    chartData: [51, 57, 67, 76, 57, 107]
}, {
    trackTitle: 'Law & Policy',
    chartData: [37, 42, 53, 45, 44, 54]
}, {
    trackTitle: 'Transportation',
    chartData: [5, 6, 10, 8, 4, 4]
}];


// Default options for the sparkline charts
var defaultChartOptions = {
    chart: {
        type: 'line',
        backgroundColor: 'transparent'
    },

    title: {
        text: null
    },

    legend: {
        enabled: false
    },

    exporting: {
        enabled: false
    },

    credits: {
        enabled: false
    },

    plotOptions: {
        series: {
            pointStart: 2015,
            marker: {
                enabled: false
            }
        }
    },

    tooltip: {
        outside: true,
        headerFormat: '<span style="font-size: 10px">{series.name}</span><br/>',
        pointFormat: '<span style="color:{point.color}">●</span> {point.x}: <b>{point.y}</b><br/>'
    },

    xAxis: {
        type: 'category',
        visible: false
    },

    yAxis: {
        visible: false
    }
};


// Add a cell with the track title to a table row element
function addTrackCell(tableRowElement, rowDefinition) {
    var cell = document.createElement('th');
    cell.setAttribute('scope', 'row');
    cell.textContent = rowDefinition.trackTitle;
    tableRowElement.appendChild(cell);
}


// Add a cell with the average data to a table row element
function addAverageCell(tableRowElement, rowDefinition) {
    var cell = document.createElement('td');
    var getArrayAverage = arr => arr.reduce((acc, cur) => acc + cur, 0) / arr.length;

    cell.textContent = Math.round(getArrayAverage(rowDefinition.chartData)) + ' sessions';
    tableRowElement.appendChild(cell);
}


// Add a sparkline cell to a table row element
function addSparklineCell(tableRowElement, rowDefinition) {
    var cell = document.createElement('td');
    var sparklineContainer = document.createElement('div');

    sparklineContainer.className = 'sparkline-container';
    cell.appendChild(sparklineContainer);
    tableRowElement.appendChild(cell);

    Highcharts.chart(sparklineContainer, Object.assign(defaultChartOptions, {
        series: [{
            name: 'Sessions',
            data: rowDefinition.chartData
        }]
    }));
}


// Populate the table
var table = document.getElementById('table');
tableRows.forEach(function (rowDefinition) {
    var tableRowElement = document.createElement('tr');

    table.appendChild(tableRowElement);

    addTrackCell(tableRowElement, rowDefinition);
    addAverageCell(tableRowElement, rowDefinition);
    addSparklineCell(tableRowElement, rowDefinition);
});
