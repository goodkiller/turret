
const cfg = require('./config/config.json');
const colors = require('./config/colors.json');

const ipc = require('node-ipc');
const cv = require('opencv4nodejs');

const vid = require('./lib/video');

ipc.config.id = 'video';
ipc.config.retry = 1500;
ipc.config.silent = true;

let fr;

// Cnnect to master
ipc.connectTo( 'master', () => {

	// Calibrate colors
	ipc.of.master.on( ipc.config.id + ':calibrateColors', (data) => {
		console.log('[Video] Calibrate: ', data);

		ipc.of.master.emit('onCommand', {
			call: 'webserver:screenshot',
			data: cv.imencode('.png', fr).toString('base64')
		});
	});
});

// Grab frames
vid.grabFrames((frame) => {

	const frameHSV = frame.cvtColor(cv.COLOR_BGR2HSV),
		crosshair = vid.drawCrosshair( frame ),
		rangeMask = frameHSV.inRange(
			new cv.Vec(colors[0][0], colors[0][1], colors[0][2]),
			new cv.Vec(colors[1][0], colors[1][1], colors[1][2])
		),
		blurred = rangeMask.blur(new cv.Size(10, 10)),
		thresholded = blurred.threshold(100, 255, cv.THRESH_BINARY);

	fr = frame;

	let target = vid.drawTarget(thresholded, frame, cfg.minPxSize, crosshair);

	// Send target to master
	if( target )
	{
		ipc.of.master.emit('onCommand', {
			call: 'motor:onTarget',
			data: target
		});
	}
	
	if( cfg.guiEnabled )
	{
		//cv.imshow('rangeMask', rangeMask);
		//cv.imshow('thresholded', thresholded);
		cv.imshow('frame', frame);
	}
});