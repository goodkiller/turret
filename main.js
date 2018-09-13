
const cfg = require('./config.json');

// Disable logging 
if( !cfg.debug ){
	console.log = function() {}
}

const cv = require('opencv4nodejs');

const {
	grabFrames, 
	drawCrosshair, 
	drawTarget
} = require('./lib/video');

console.log('Turret setup ...');

grabFrames((frame) => {

	// const frameHLS = frame.cvtColor(cv.COLOR_BGR2HLS);
	const frameHLS = frame.cvtColor(cv.COLOR_BGR2HSV);

	const crosshair = drawCrosshair( frame );

	//console.log(cross);

	const brownLower = new cv.Vec(0, 192, 98);
	const brownUpper = new cv.Vec(179, 255, 255);

	const rangeMask = frameHLS.inRange(brownLower, brownUpper);


	const blurred = rangeMask.blur(new cv.Size(10, 10));
	const thresholded = blurred.threshold(100, 255, cv.THRESH_BINARY);

	
	drawTarget(thresholded, frame, cfg.minPxSize, crosshair);

	//cv.imshow('rangeMask', rangeMask);
	//cv.imshow('thresholded', thresholded);
	cv.imshow('frame', frame);

});
