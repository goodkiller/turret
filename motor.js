
const cfg = require('./config/config.json');

const ipc = require('node-ipc');

ipc.config.id = 'motor';
ipc.config.retry = 1500;
ipc.config.silent = true;

// Cnnect to master
ipc.connectTo( 'master', () => {

	ipc.of.master.on('calibrateMotors', function(data) {
	    console.log('a', data);
	});
});