
const cfg = require('../config.json');

let isRunning = false;




setSpeed = (speed) => {

	console.log('[FLYWHEEL] setSpeed', speed);

	isRunning = true;
	
};

exports.start = (speed) => {

	if( !isRunning && !cfg.emergencyStop )
	{
		console.log('[FLYWHEEL] start', speed);

		setSpeed( speed );
	}
};

exports.stop = () => {

	if( isRunning )
	{
		console.log('[FLYWHEEL] stop');
		
		isRunning = false;
	}
};