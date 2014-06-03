(function(window) {
    var socket = io('http://localhost:8078/mps');

    window.customermod.setSockt(socket);
    window.offermod.setSockt(socket);

    socket.once('customers', function (data) {
        console.log(data);
        window.customermod.init(data.customers);
    });
    socket.once('offers', function (data) {
        console.log(data);
        window.offermod.init(data.offers);
    });

    socket.on('customer', function (data) {
        console.log(data);
        window.customermod.addCustomer({
            name : data.customer.name,
            id : data.customer.id
        });
    });

    socket.once('ready', function() {
        socket.emit('customers init', {});
        socket.emit('offers init', {});
        console.log('should have send inits');
    });
})(window);