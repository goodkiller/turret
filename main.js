
const { 
	cfg, 
	cv, 
	web
} = require('./lib/init');

const {
	grabFrames, 
	drawCrosshair, 
	drawTarget
} = require('./lib/video');

grabFrames((frame) => {

	const frameHLS = frame.cvtColor(cv.COLOR_BGR2HSV);

	const crosshair = drawCrosshair( frame );

	const brownLower = new cv.Vec(0, 192, 98);
	const brownUpper = new cv.Vec(179, 255, 255);

	const rangeMask = frameHLS.inRange(brownLower, brownUpper);

	const blurred = rangeMask.blur(new cv.Size(10, 10));
	const thresholded = blurred.threshold(100, 255, cv.THRESH_BINARY);

	drawTarget(thresholded, frame, cfg.minPxSize, crosshair);

	// Send frames to web
	//web.io.emit('frame', cv.imencode('.jpg', frame).toString('base64') );

	if( cfg.guiEnabled )
	{
		//cv.imshow('rangeMask', rangeMask);
		//cv.imshow('thresholded', thresholded);
		cv.imshow('frame', frame);
	}
});
