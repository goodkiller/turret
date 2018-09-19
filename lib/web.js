
const cfg = require('../config.json');

const motor = require('./motor');

const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer( app );
const io = require('socket.io').listen( server );

const events = require('events');
const eventEmitter = new events.EventEmitter();

const util = require('util');

// Static page
app.use('/', express.static('web'));

eventEmitter.on('eventlogger', function(message) {
	io.emit('weblog', message);
});

// SocketIO events
io.on('connection', function(socket){

	// Motor autocalibrate
	socket.on('motAutoCalibrate', () => {
		console.log('[CMD] Start motor autocalibration ...');

		// Force to calibrate
		motor.calibrate( true );

		// Calibrate motors... how???
	});

	// Emergency STOP
	socket.on('emergencyStop', () => {
		console.log('[CMD] Emergency STOP!');

		// Stepper motors stop
		// Flywheel motors stop
	});
});

// Start server
server.listen(cfg.webServerPort, function(){

	console.log('[WEB] Port: %d', cfg.webServerPort);
	console.log('[WEB] Start logging to WEB ...');

	// Override console.log
	var originConsoleLog = console.log;

	// Re-overwrite console.log
	console.log = (...args) => {

		const l = util.format.apply(util, args );

		eventEmitter.emit('eventlogger', l);

		originConsoleLog( l );
	}
});