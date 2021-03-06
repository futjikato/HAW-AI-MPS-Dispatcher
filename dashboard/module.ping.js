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
                text: 'ms',
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

    window.pingmod = {
        add : function(id) {
            return api.addSeries({data: [], name: id});
        },

        addPing : function(id, pingVal) {
            $.each(api.series, function(i, ser) {
                if(ser.name == id) {
                    var shift = false;
                    if(ser.data.length > 10) {
                        shift = true;
                    }
                    ser.addPoint([Date.now(), pingVal], true, shift);
                }
            });
        }
    };
})(window);