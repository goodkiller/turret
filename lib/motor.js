

const cfg = require('../config.json');

const hlp = require('./helpers');
const wpi = require('wiringpi-node');
const NanoTimer = require('nanotimer');
 
wpi.setup('gpio');

let timer = new NanoTimer();

// Is motor running
let isRunning = false;

// Is motor calibrated
let calibrated = false;

/**
 * Setup motor
 * @method  setup
 * @author  Marko Praakli
 * @date    2018-09-17
 */
function setup( stepPin, directionPin, endSwitchPin )
{
	var context = {
		step: step,
		setSpeed: setSpeed,

		_stepPin: stepPin,
		_directionPin: directionPin,
		_endSwitchPin: endSwitchPin,

		_stepDelay: 500, // milliseconds
		_direction: 1
	};

	// Motor setup
	wpi.pinMode(stepPin, wpi.OUTPUT);
	wpi.pinMode(directionPin, wpi.OUTPUT);

	// EndSwitch setup
	wpi.pinMode(endSwitchPin, wpi.INPUT);
	wpi.pullUpDnControl(endSwitchPin, wpi.PUD_UP);

	// Autocalibrate when setup
	calibrate.call( context, false );

	return context;
}

/**
 * Auto calibrate motor positions
 * @method  autoCalibrate
 * @author  Marko Praakli
 * @date    2018-09-17
 */
function calibrate( force )
{
	if( !calibrated || force )
	{
		console.log('[MOTOR] Calibrating ...');

		// Set speed to 10%
		setSpeed( 10 );

		wpi.wiringPiISR(this._endSwitchPin, wpi.INT_EDGE_FALLING, function(delta){

			// Stop motor
			stop();

			// Step back ???
			//step(-10);

			console.log('Pin 7 changed to LOW (', delta, ')');
		});

		// Set calibrated
		calibrated = true;

		// Set speed to 100%
		setSpeed( 100 );
	}
}

/**
 * Set motor speed 0% - 100%
 * @method  setSpeed
 * @author  Marko Praakli
 */
function setSpeed( speed )
{
	let delay = hlp.map( speed, 0, 100, 50000, 500 );

	console.log('[MOTOR] Set speed %d% of %d', speed, delay);
}

/**
 * Stop timer and stop moving
 * @method  stop
 * @author  Marko Praakli
 */
function stop( callback )
{
	timer.clearInterval();

	isRunning = false;

	if(callback != null){
		callback();
	}

	return;
}

/**
 * Move motor
 * @method  step
 * @author  Marko Praakli
 */
function step( stepsToMove, callback )
{
	if (stepsToMove == 0){
		stop( callback );
	}

	// Start stepping when motor is not running and is calibrated
	if( !isRunning && calibrated )
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

/**
 * Do steps ...
 * @method  stepMotor
 * @author  Marko Praakli
 */
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


exports.calibrate = calibrate;

// Setup and export pan motor
exports.panMotor = setup(cfg.panMotor[0], cfg.panMotor[1], cfg.panMotor[2]);

// Setup and export tilt motor
exports.tiltMotor = setup(cfg.tiltMotor[0], cfg.tiltMotor[1], cfg.panMotor[2]);