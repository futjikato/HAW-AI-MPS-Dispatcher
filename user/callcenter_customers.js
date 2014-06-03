(function(window, $) {
    'use strict';

    var customerTable = $('#customer-table'),
        customerForm = $('#new-customer'),
        socket = null;

    customerForm.on('submit', function(e) {
        e.preventDefault();

        var name = $(this).find('input[name="name"]').val();

        if(socket) {
            socket.emit('customer new', {name: name});
        }
    });

    window.customermod = {

        setSockt: function(newSocket) {
            socket = newSocket;
        },

        addCustomer : function(customer) {
            customerTable.find('tbody').append('<tr><td class="customer-id">' + customer.id + '</td><td class="customer-name">' + customer.name + '</td></tr>');
        },

        init : function(ary) {
            $.each(ary, function(i, customer) {
                window.customermod.addCustomer(customer);
            });
        }
    };
})(window, $);