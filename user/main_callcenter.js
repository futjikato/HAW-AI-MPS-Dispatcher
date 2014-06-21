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
        window.customermod.addCustomer(data.customer);
    });

    socket.on('offer', function (data) {
        console.log(data);
        window.offermod.addOffer(data.offer);
    });

    socket.on('order', function(data) {
        window.offermod.setOrdered(data.offer, data.order);
        window.ordermod.addOrder(data);
    });

    socket.on('orders', function(data) {
        window.ordermod.init(data.orders);
    });

    socket.once('ready', function() {
        socket.emit('customers init', {});
        socket.emit('offers init', {});
        socket.emit('orders init', {});
        console.log('should have send inits');
    });
})(window);