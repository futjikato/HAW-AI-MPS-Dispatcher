(function(window) {
    'use strict';

    var container = $('#module-container-reqcount');

    container.highcharts({
        title: {
            text: 'Request counter'
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 500
        },
        yAxis: {
            title: {
                text: 'a',
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

    window.reqmod = {
        add : function(id) {
            return api.addSeries({data: [], name: id});
        },

        addCount : function(id, countVal) {
            $.each(api.series, function(i, ser) {
                if(ser.name == id) {
                    var shift = false;
                    if(ser.data.length > 10) {
                        shift = true;
                    }
                    ser.addPoint([Date.now(), parseInt(countVal)], true, shift);
                }
            });
        }
    };
})(window);