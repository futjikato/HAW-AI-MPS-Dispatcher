(function(window, $) {
    'use strict';

    var orderTable = $('#order-table'),
        socket = null;

    orderTable.on('click', 'a.????????', function(e) {
        e.preventDefault();

        // todo
    });

    window.ordermod = {

        setSockt: function(newSocket) {
            socket = newSocket;
        },

        addOrder : function(order) {
            var newRow = '<tr>' +
                '<td>' + order.id + '</td>' +
                '<td>' + order. + '</td>' +
            '</tr>';

            orderTable.find('tbody').append(newRow);
        },

        init : function(ary) {
            $.each(ary, function(i, order) {
                window.ordermod.addOffer(order);
            });
        }
    };
})(window, $);