
const cfg = require('../config.json');

let isRunning = false;




setSpeed = (speed) => {

	console.log('Flywheel setSpeed', speed);

	isRunning = true;
	
};

start = (speed) => {

	if( !isRunning )
	{
		console.log('Flywheel start', speed);

		setSpeed( speed );
	}
};

stop = () => {

	if( isRunning )
	{
		console.log('Flywheel stop');
		
		isRunning = false;
	}
};


exports.fwStart = start;
exports.fwStop = stop;