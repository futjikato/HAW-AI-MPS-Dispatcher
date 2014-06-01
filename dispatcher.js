var fs = require('fs'),
    io = require('socket.io')(8078),
    Client = require('./client').Client;

// config
var config = JSON.parse(fs.readFileSync('config.json')),
    instances = [];

// establish connection to server instances
config.instances.forEach(function(clientObj) {
    instances.push(new Client(clientObj));
});

// get ready for user
var monitor = io.of('/monitor'),
    mps = io.of('/mps');

monitor.on('connection', function (socket) {

});

mps.on('connection', function (socket) {

});