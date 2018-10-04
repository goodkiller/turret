
const cfg = require('./config/config.json');
const util = require('lib/util');

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

	// SocketIO events
	io.on('connection', function(socket){

		// Motor autocalibrate
		socket.on('calibrateMotors', () => {
        	ipc.of.master.emit('onWebCmd', {
        		call: 'calibrateMotors'
        	});

		});

		// Emergency STOP
		socket.on('emergencyStop', () => {
			ipc.of.master.emit('onWebCmd', {
				call: 'emergencyStop'
			});
		});

		// Calibrate colors
		socket.on('calibrateColors', () => {
			ipc.of.master.emit('onWebCmd', {
				call: 'calibrateColors'
			});
		});
	});

	ipc.of.master.on('webLog', function(message) {
	    io.emit('weblog', message);
	});

	// Start server
	server.listen(cfg.webServerPort, function(){
		ipc.of.master.emit('log', ['[WEB] Port: %d', cfg.webServerPort]);
	});
});