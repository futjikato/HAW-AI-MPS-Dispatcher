var fs = require('fs'),
    io = require('socket.io')(8078),
    Client = require('./client').Client;

// config
var config = JSON.parse(fs.readFileSync('config.json')),
    instances = [],
    clientId = 1;

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

mps.on('connection', function (socket) {

});