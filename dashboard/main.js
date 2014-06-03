(function() {
    'use strict';

    var instances = [];

    function addInstance(id) {
        var found = false;
        $.each(instances, function(i, instanceId) {
            if(instanceId == id) {
                found = true;
            }
        });

        if(!found) {
            instances.push(id);
            window.pingmod.add(id);
        }
    }

    var socket = io('http://localhost:8078/monitor');
    socket.on('ping', function (data) {
        addInstance(data.id);
        console.log('add ping node', data);
        window.pingmod.addPing(data.id, data.ping);
    });
})();