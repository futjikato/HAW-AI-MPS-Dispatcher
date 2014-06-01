(function(module) {
    'use strict';

    var net = require('net'),
        util = require("util"),
        events = require("events");

    function Client(opts) {
        var $this = this;
        events.EventEmitter.call($this);
        $this.opts = opts;
        $this.ready = false;
        $this.client = net.connect(opts.port, opts.host, function() {
            $this.ready = true;
        });

        $this.client.on('data', function(buf) {
            var response = {},
                offset = 0;

            // read status code
            response.statusCode = buf.readInt32BE(offset);
            offset += 4;

            // read length of response action name
            var nameLength = buf.readInt32BE(offset);
            offset += 4;

            // if name is present read
            if(nameLength > 0) {
                var name = buf.toString('utf8', offset, offset + nameLength);
                offset += nameLength;
                response.name = name;
            }

            // read parameter count
            var paramCount = buf.readInt32BE(offset);
            offset += 4;

            var params = [];
            for(var i = 0 ; i < paramCount ; i++) {
                // get length, start and end of string
                var strLength = buf.readInt32BE(offset + (i * 4));
                var strStart = offset + (i * 4) + 4;
                var strEnd = strStart + strLength;

                // read string
                params.push(buf.toString('utf8', strStart, strEnd));
            }
            response.params = params;


            if(response.name) {
                console.log('emit', response.name);
                $this.emit('req.' + response.name.toLowerCase());
            } else {
                console.log('emit anonym action');
                $this.emit('req.anonym', response);
            }
        });

        // ping
        $this.lastPing = -1;
        setInterval(function() {
            $this.ping();
        }, 5000);
    }
    util.inherits(Client, events.EventEmitter);

    Client.prototype.ping = function(){
        var start = Date.now(),
            $this = this;

        this.send('ping', []);

        this.once('req.pong', function() {
            $this.lastPing = Date.now() - start;
            console.log('ping', $this.lastPing);
        });
    };

    Client.prototype.send = function(action, params) {
        var buf = new Buffer(2048),
            offset = 0;

        function writeStr(val, offset) {
            buf.writeInt32BE(val.length, offset);
            buf.write(val, offset + 4, val.length);

            return offset + 4 + val.length;
        }

        offset = writeStr(action, 0);

        buf.writeInt32BE(params.length, offset);
        offset += 4;

        params.forEach(function(paramStr) {
            offset = writeStr(paramStr, offset);
        });

        var sendBuffer = buf.slice(0, offset);
        this.client.write(sendBuffer);
    };

    module.exports = {
        Client: Client
    };
})(module);