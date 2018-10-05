
const cfg = require('./config/config.json');
const colors = require('./config/colors.json');

const ipc = require('node-ipc');
const cv = require('opencv4nodejs');

const vid = require('./lib/video');

ipc.config.id = 'video';
ipc.config.retry = 1500;
ipc.config.silent = true;

// Cnnect to master
ipc.connectTo( 'master', () => {

	// Grab frames
	vid.grabFrames((frame) => {

		const frameHSV = frame.cvtColor(cv.COLOR_BGR2HSV);

		// Calibrate colors
		ipc.of.master.on( ipc.config.id + ':calibrateColors', (data) => {
			console.log('[Video] Calibrate: ', data);

			ipc.of.master.emit('onCommand', {
				call: 'webserver:screenshot',
				data: cv.imencode('.png', frame).toString('base64')
			});

			//web.io.emit('picture', cv.imencode('.png', frame).toString('base64') );
		});

		const crosshair = vid.drawCrosshair( frame );

		const rangeMask = frameHSV.inRange(
			new cv.Vec(colors[0][0], colors[0][1], colors[0][2]),
			new cv.Vec(colors[1][0], colors[1][1], colors[1][2])
		);

		const blurred = rangeMask.blur(new cv.Size(10, 10));
		const thresholded = blurred.threshold(100, 255, cv.THRESH_BINARY);

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
});