(function(window, $) {
    'use strict';

    var offerTable = $('#offer-table'),
        offerForm = $('#new-offer'),
        socket = null;

    offerForm.on('submit', function(e) {
        e.preventDefault();

        var data = {
            customer: $(this).find('input[name="customer"]').val(),
            element: $(this).find('input[name="element"]').val()
        };

        socket.emit('offer new', data);
    });

    window.offermod = {

        setSockt: function(newSocket) {
            socket = newSocket;
        },

        addOffer : function(offer) {
            var newRow = '' +
                '<tr>' +
                    '<td>' + offer.id + '</td>' +
                    '<td>' + offer.customer + '</td>' +
                    '<td>' + offer.element + '</td>' +
                    '<td>' + offer.order + '</td>' +
                '</tr>';
            offerTable.find('tbody').append(newRow);
        },

        init : function(ary) {
            $.each(ary, function(i, offer) {
                window.offermod.addOffer(offer);
            });
        }
    };
})(window, $);