
const cfg = require('../config.json');

let isRunning = false;




setSpeed = (speed) => {

	console.log('[FLYWHEEL] setSpeed', speed);

	isRunning = true;
	
};

start = (speed) => {

	if( !isRunning )
	{
		console.log('[FLYWHEEL] start', speed);

		setSpeed( speed );
	}
};

stop = () => {

	if( isRunning )
	{
		console.log('[FLYWHEEL] stop');
		
		isRunning = false;
	}
};


exports.fwStart = start;
exports.fwStop = stop;