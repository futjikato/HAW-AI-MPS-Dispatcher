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

    offerTable.on('click', 'a.btn-offer-to-order', function(e) {
        e.preventDefault();

        socket.emit('offer to order', {
            offer: $(this).attr('data-offer')
        });
    });

    function btnHtml(offerId) {
        return "<a class=\"btn-offer-to-order\" data-offer=\"" + offerId + "\" href=\"#\">Placing order</a>";
    }

    window.offermod = {

        setSockt: function(newSocket) {
            socket = newSocket;
        },

        addOffer : function(offer) {
            var btn;
            if(offer.order == -1) {
                btn = btnHtml(offer.id);
            } else {
                btn = "Order Id " + offer.order;
            }

            var newRow = '' +
                '<tr data-offerid="' + offer.id + '">' +
                    '<td>' + offer.id + '</td>' +
                    '<td>' + offer.customer + '</td>' +
                    '<td>' + offer.element + '</td>' +
                    '<td class="order-col">' + btn + '</td>' +
                '</tr>';
            offerTable.find('tbody').append(newRow);
        },

        setOrdered : function(offerId, orderId) {
            $('tr[data-offerid="' + offerId + '"]').find('.order-col').html("Order Id " + orderId);
        },

        init : function(ary) {
            $.each(ary, function(i, offer) {
                window.offermod.addOffer(offer);
            });
        }
    };
})(window, $);