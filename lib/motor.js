
const cfg = require('../config.json');
const hlp = require('./helpers');
const wpi = require('wiringpi-node');
const NanoTimer = require('nanotimer');

class Motor {

	constructor( stepPin, dirPin, endSwitchPin){

		this.stepPin = stepPin;
		this.dirPin = dirPin;
		this.endSwitchPin = endSwitchPin;

		this.calibrated = false;
		this.isRunning = false;

		this.stepDelay = 500;
		this.direction = 1;

		this.timer = new NanoTimer();

		console.log('[Motor] %d loaded.', stepPin);

		wpi.setup('gpio');

		// Motor setup
		wpi.pinMode( stepPin, wpi.OUTPUT );
		wpi.pinMode( dirPin, wpi.OUTPUT) ;

		// EndSwitch setup
		wpi.pinMode( endSwitchPin, wpi.INPUT );
		wpi.pullUpDnControl( endSwitchPin, wpi.PUD_UP );

		this.calibrate();
	}

	calibrate(){

		if( !this.calibrated || force )
		{
			console.log('[Motor] %d calibrate.', this.stepPin);

			// Just in case when we're doing force calibration
			this.calibrated = false;

			// Set speed to 10%
			this.setSpeed( 10 );

			wpi.wiringPiISR(this.endSwitchPin, wpi.INT_EDGE_FALLING, function(delta){

				// Stop motor
				this.stop();

				// Step back ???
				//step(-10);

				console.log('Pin 7 changed to LOW (', delta, ')');
			});

			// Set calibrated
			this.calibrated = true;

			// Set speed to 100%
			this.setSpeed( 100 );
		}
	}

	setSpeed( speed ){

		let delay = hlp.map( speed, 0, 100, 50000, 500 );

		console.log('[Motor] %d speed %d% of %d', this.stepPin, speed, delay);
	}

	step( stepsToMove ){
		
		if (stepsToMove == 0){
			return;
		}

		// Start stepping when motor is not running and is calibrated
		if( !this.isRunning && this.calibrated )
		{
			console.log('[Motor] %d step to %d', this.stepPin, stepsToMove);

			this.isRunning = true;

			if(stepsToMove > 0){
				this.direction = 1;
			}

			if(stepsToMove < 0){
				this.direction = -1;
			}

			let stepsLeft = Math.round(Math.abs(stepsToMove));

			console.log("[Motor] %d = delay=%d, steps=%d, dir=%d", this.stepPin, this.stepDelay, stepsLeft, this.direction);

			// Start stepping
			this.timer.setInterval(function()
			{
				if (stepsLeft <= 0){
					this.stop();
				}

				wpi.digitalWrite( this.stepPin, wpi.LOW );
				wpi.delayMicroseconds( this.stepDelay );

				if( this._direction == 1 )
				{
					wpi.digitalWrite( this.direction, wpi.HIGH );
				}
				else
				{
					wpi.digitalWrite( this.direction, wpi.LOW );
				}

				wpi.digitalWrite( this.stepPin, wpi.HIGH );

				stepsLeft--;

			}.bind(this), '', '50n'); // Wait 50 nanoseconds to save CPU
		}
	}

	stop(){
		
		console.log('[Motor] %d stop.', this.stepPin);

		this.timer.clearInterval();

		this.isRunning = false;

		return;
	}

	
}

var panMotor = new Motor( cfg.panMotor[0], cfg.panMotor[1], cfg.panMotor[2] );
var tiltMotor = new Motor( cfg.tiltMotor[0], cfg.tiltMotor[1], cfg.tiltMotor[2] );

module.exports = {
	pan: panMotor,
	tilt: tiltMotor
};