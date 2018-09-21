
const cfg = require('../config.json');

const motor = require('./motor');
const flywheel = require('./flywheel');

const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer( app );
const io = require('socket.io').listen( server );

const events = require('events');
const eventEmitter = new events.EventEmitter();

const util = require('util');
const fs = require('fs');

// Static page
app.use('/', express.static('web'));

eventEmitter.on('eventlogger', function(message) {
	io.emit('weblog', message);
});

// SocketIO events
io.on('connection', function(socket){

	// Motor autocalibrate
	socket.on('calibrateMotors', () => {

		console.log('[CMD] Start motor calibration ...');

		// Force to calibrate
		motor.pan.calibrate( true );
		motor.tilt.calibrate( true );
	});

	// Emergency STOP
	socket.on('emergencyStop', () => {

		console.log('[CMD] Emergency STOP!');

		cfg.emergencyStop = true;

		// Stop flywheel
		flywheel.stop();

		// Stop axis motors
		motor.pan.stop();
		motor.tilt.stop();
	});

	// Calibrate colors
	socket.on('calibrateColors', () => {

		console.log('[CMD] Calibrate colors!');

		cfg.stream_picture = true;

		/*
		fs.writeFile("/tmp/test", "Hey there!", function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 

		 */
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


exports.io = io;