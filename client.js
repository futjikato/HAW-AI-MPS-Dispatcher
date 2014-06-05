(function(module) {
    'use strict';

    var net = require('net'),
        util = require("util"),
        events = require("events");

    function Client(connection, options) {
        var $this = this;
        events.EventEmitter.call($this);
        $this.ready = false;
        $this.id = connection.id;
        $this.client = net.connect(connection.port, connection.host, function() {
            $this.ready = true;
			// // ping
			// $this.lastPing = -1;
			// setInterval(function() {
            // $this.ping();
			// }, options.pinginterval);

			// // load avg
			// $this.lastLoadAvg = 0;
			// setInterval(function() {
            // $this.avgLoad();
			// }, options.loadinterval);
        });
		
		$this.client.on('error', function(){
			// setTimeout(function(){
				// $this.client = net.connect(connection.port, connection.host, function() {
					// $this.ready = true;
					// // ping
					// $this.lastPing = -1;
					// setInterval(function() {
					// $this.ping();
					// }, options.pinginterval);

					// // load avg
					// $this.lastLoadAvg = 0;
					// setInterval(function() {
					// $this.avgLoad();
					// }, options.loadinterval);
				// });
			// }, 10000);
			// require('./starter').start(connection.port, options.mainpath)
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

            // read user ID
            var userId = buf.readInt32BE(offset);
            response.userid = userId;
            offset += 4;

            // read parameter count
            var paramCount = buf.readInt32BE(offset);
            offset += 4;

            var params = [];
            for(var i = 0 ; i < paramCount ; i++) {
                // get length, start and end of string
                var strLength = buf.readInt32BE(offset);
                offset += 4;

                // read string
                params.push(buf.toString('utf8', offset, offset + strLength));

                offset += strLength;
            }
            response.params = params;

            if(response.statusCode != 200) {
                console.log('[' + this.client.remotePort + ']', 'received error', response);
                emitMsg = 'err.' + userId;
                $this.emit(emitMsg, response);
            } else {
                var emitMsg = 'req.' + (userId ? userId : '0') + '.' + (response.name ? response.name : 'anonymous');
                console.log('[' + $this.client.remotePort + ']', 'received response', emitMsg);
                $this.emit(emitMsg, response);
                emitMsg = 'user.' + (userId ? userId : '0');
                $this.emit(emitMsg, response);
                emitMsg = 'act.' + (response.name ? response.name : 'anonymous');
                $this.emit(emitMsg, response);
            }
        });

        // ping
        $this.lastPing = -1;
        setInterval(function() {
            //$this.ping();
        }, options.pinginterval);

        // load avg
        $this.lastLoadAvg = 0;
        setInterval(function() {
            //$this.avgLoad();
        }, options.loadinterval);

        // request counter
        $this.lastReqCount = 0;
        setInterval(function() {
            //$this.reqCount();
        }, options.reqcountinterval);
    }
    util.inherits(Client, events.EventEmitter);

    Client.prototype.ping = function(){
        var start = Date.now(),
            $this = this;

        $this.send(0, 'PING', []);

        $this.once('req.0.pong', function() {
            $this.lastPing = Date.now() - start;
            $this.emit('msg.ping', {ping: $this.lastPing});
        });
    };

    Client.prototype.avgLoad = function() {
        var $this = this;

        $this.send(0, 'LOAD', []);

        $this.once('req.0.load', function(response) {
            $this.emit('msg.load', {load: response.params[0]});
        });
    };

    Client.prototype.reqCount = function() {
        var $this = this;

        $this.send(0, 'REQCOUNT', []);

        $this.once('req.0.reqcount', function(response) {
            $this.emit('msg.reqcount', {count: response.params[0]});
        });
    };

    Client.prototype.send = function(user, action, params) {
        var buf = new Buffer(2048),
            offset = 0;

        function writeStr(val, offset) {
            var strVal = String(val);
            console.log('Parameter', strVal);
            buf.writeInt32BE(strVal.length, offset);
            buf.write(strVal, offset + 4, strVal.length);

            return offset + 4 + val.length;
        }

        // write action name
        offset = writeStr(action, 0);

        // write user identification
        buf.writeInt32BE(user, offset);
        offset += 4;

        // write parameter count
        buf.writeInt32BE(params.length, offset);
        offset += 4;

        // write parameters
        params.forEach(function(paramStr) {
            offset = writeStr(paramStr, offset);
        });

        var sendBuffer = buf.slice(0, offset);

        console.log('[' + this.client.remotePort + ']', 'send request', action);
        this.client.write(sendBuffer);
    };

    Client.prototype.getId = function() {
        return this.id;
    };

    module.exports = {
        Client: Client
    };
})(module);