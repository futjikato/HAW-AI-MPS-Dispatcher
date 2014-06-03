(function(window) {
    'use strict';

    var container = $('#module-container-load');

    container.highcharts({
        title: {
            text: 'Load overview'
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 500
        },
        yAxis: {
            title: {
                text: 'load',
                align: 'high'
            },
            min: 0,
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

    window.loadmod = {
        add : function(id) {
            return api.addSeries({data: [], name: id});
        },

        addLoad : function(id, loadVal) {
            $.each(api.series, function(i, ser) {
                if(ser.name == id) {
                    var shift = false;
                    if(ser.data.length > 10) {
                        shift = true;
                    }
                    ser.addPoint([Date.now(), parseFloat(loadVal)], true, shift);
                }
            });
        }
    };
})(window);