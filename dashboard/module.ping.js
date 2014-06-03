(function(window) {
    'use strict';

    var container = $('#module-container-ping');

    container.highcharts({
        title: {
            text: 'Ping overview'
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 500
        },
        yAxis: {
            title: {
                text: 'Ping'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        // add series dynamicly
        series: []
    });
    var api = container.highcharts();

    window.pingmod = {
        add : function(id) {
            var series = api.addSeries({data: []});
            series.name = id;
            return series;
        },

        addPing : function(id, pingVal) {
            $.each(api.series, function(i, ser) {
                if(ser.name == id) {
                    console.log('add point');
                    ser.addPoint(pingVal);
                }
            });
        }
    };
})(window);