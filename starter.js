var spawn = require('child_process').spawn;
	
function start(port, path) {
    var java = spawn('java', ['Main.class', port], {cwd: path});
	
	java.stdout.on('data', function (data) {
		console.log('stdout' + port + ': ' + data);
	});

	java.stderr.on('data', function (data) {
		console.log('stderr' + port + ': ' + data);
	});

	java.on('close', function (code) {
		console.log('MPS System '+ port + ' exited with code: ' + code);
	});

}

module.exports = {
    start: start
};