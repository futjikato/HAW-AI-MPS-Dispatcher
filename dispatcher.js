var fs = require('fs'),
    io = require('socket.io')(8078),
    Client = require('./client').Client;

// config
var config = JSON.parse(fs.readFileSync('config.json')),
    instances = [];

// establish connection to server instances
config.instances.forEach(function(clientObj) {
    instances.push(new Client(clientObj, config.options));
});

// get ready for user
var monitor = io.of('/monitor'),
    mps = io.of('/mps');

monitor.on('connection', function (socket) {
    instances.forEach(function(client) {
        // emit ping for instance
        client.on('msg.ping', function(data) {
            socket.emit('ping', {
                id: client.getId(),
                ping: data.ping
            });
        });

        // emit svg load
        client.on('msg.load', function(data) {
            socket.emit('load', {
                id: client.getId(),
                load : data.load
            });
        });
    });
});

var currUserId = 0;

function roundRobinSend(userid, action, params) {
    // todo round robin implementation
    instances[0].send(userid, action, params);
}

mps.on('connection', function (socket) {
    var userId = ++currUserId;

    socket.on('customers init', function() {
        roundRobinSend(userId, 'GET_CUSTOMERS', []);
    });
    socket.on('offers init', function() {
        roundRobinSend(userId, 'GET_OFFERS', []);
    });

    socket.on('customer new', function(data) {
        roundRobinSend(userId, 'NEW_CUSTOMER', [data.name]);
    });
    socket.on('offer new', function(data) {
        roundRobinSend(userId, 'NEW_OFFER', [data.customer, data.element]);
    });

    instances.forEach(function(client) {

        client.on('err.' + userId, function(response) {
            console.error(response.params[0]);
        });

        client.on('req.' + userId + '.customers', function(response) {

            var customers = [];
            for(var i = 0 ; i < response.params.length ; i+=2) {
                customers.push({
                    id: response.params[i],
                    name: response.params[i+1]
                });
            }

            console.log('send customer list', customers);
            socket.emit('customers', {
                customers: customers
            });
        });

        client.on('req.' + userId + '.offers', function(response) {

            var offers = [];
            for(var i = 0 ; i < response.params.length ; i+=4) {
                offers.push({
                    id: response.params[i],
                    customer: response.params[i+1],
                    element: response.params[i+2],
                    order: response.params[i+3]
                });
            }

            console.log('send offer list', offers);
            socket.emit('offers', {
                offers: offers
            });
        });

        client.on('act.new_customer', function(response) {
            socket.emit('customer', {
                customer: {
                    id: response.params[0],
                    name: response.params[1]
                }
            });
        });

        client.on('act.new_offer', function(response) {
            socket.emit('offer', {
                offer: {
                    id: response.params[0],
                    customer: response.params[1],
                    element: response.params[2],
                    order: -1
                }
            });
        });
    });

    socket.emit('ready');
});