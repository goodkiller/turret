
const wpi = require('wiringpi-node');
const NanoTimer = require('nanotimer');
 
wpi.setup('gpio');

var timer = new NanoTimer();
var isRunning = false;

exports.setup = function(stepPin, directionPin)
{
	var context = {
		step: step,
		setSpeed: setSpeed,

		_stepPin: stepPin,
		_directionPin: directionPin,

		_stepDelay: 500, // milliseconds
		_direction: 1
	};

	wpi.pinMode(stepPin, wpi.OUTPUT);
	wpi.pinMode(directionPin, wpi.OUTPUT);

	return context;
}

function setSpeed( speed )
{

}

function stop( callback )
{
	timer.clearInterval();

	isRunning = false;

	if(callback != null){
		callback();
	}

	return;
}

function step(stepsToMove, callback)
{
	if (stepsToMove == 0){
		stop( callback );
	}

	if( !isRunning )
	{
		isRunning = true;

		if(stepsToMove > 0){
			this._direction = 1;
		}

		if(stepsToMove < 0){
			this._direction = -1;
		}

		let stepsLeft = Math.round(Math.abs(stepsToMove));

		console.log("[MOTOR] Step: delay=%d, steps=%d, direction=%d", this._stepDelay, stepsLeft, this._direction);

		// Start stepping
		timer.setInterval(function()
		{
			if (stepsLeft <= 0){
				stop( callback );
			}

			stepMotor.call( this );

			stepsLeft--;

		}.bind(this), '', '50n'); // Wait 50 nanoseconds to save CPU
	}
}

function stepMotor()
{
	wpi.digitalWrite( this._stepPin, wpi.LOW );
	wpi.delayMicroseconds( this._stepDelay );

	if( this._direction == 1 )
	{
		wpi.digitalWrite( this._directionPin, wpi.HIGH );
	}
	else
	{
		wpi.digitalWrite( this._directionPin, wpi.LOW );
	}

	wpi.digitalWrite( this._stepPin, wpi.HIGH );

	return;
}