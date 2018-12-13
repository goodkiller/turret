
const cfg = require('./config/config.json');
const util = require('./lib/util');

const ipc = require('node-ipc');

const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer( app );
const io = require('socket.io').listen( server );

ipc.config.id = 'webserver';
ipc.config.retry = 1500;
ipc.config.silent = true;

// Static page
app.use('/', express.static('web'));

// Cnnect to master
ipc.connectTo( 'master', () => {

	// Calibrate colors
	ipc.of.master.on( ipc.config.id + ':screenshot', (base64_data) => {
		web.io.emit('picture', base64_data );
	});

	// SocketIO events
	io.on('connection', (socket) => {

		// Motor autocalibrate
		socket.on('calibrateMotors', () => {
        	ipc.of.master.emit('onCommand', {
        		call: 'motor:calibrateMotors'
        	});
		});

		// Emergency STOP
		socket.on('emergencyStop', () => {
			ipc.of.master.emit('onCommand', {
				call: 'motor:emergencyStop'
			});
		});

		// Calibrate colors
		socket.on('calibrateColors', () => {
			ipc.of.master.emit('onCommand', {
				call: 'video:calibrateColors'
			});
		});
	});

	ipc.of.master.on('webLog', function(message) {
	    io.emit('weblog', message);
	});

	// Start server
	server.listen(cfg.webServerPort, () => {
		ipc.of.master.emit('log', ['[WEB] Port: %d', cfg.webServerPort]);
	});
});
