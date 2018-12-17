
const cfg = require('../config/config.json');
const hlp = require('./helpers');
const wpi = require('wiringpi-node');

class Motor {

	constructor( $motorObj ){

		this.stepPin = $motorObj.pins[0];
		this.dirPin = $motorObj.pins[1];
		this.enPin = $motorObj.pins[2];
		this.timeout = $motorObj.timeout;

		this.calibrated = false;
		this.isRunning = false;

		this.stepDelay = 1000;
		this.direction = 1;

		console.log('[Motor] %d loaded.', this.stepPin);

		wpi.setup('gpio');

		// Motor setup
		wpi.pinMode( this.stepPin, wpi.OUTPUT );
		wpi.pinMode( this.dirPin, wpi.OUTPUT) ;

		// Set enable pin
		wpi.pinMode( this.enPin, wpi.OUTPUT );

		// EndSwitch setup
		//wpi.pinMode( endSwitch, wpi.INPUT );
		//wpi.pullUpDnControl( endSwitchPin, wpi.PUD_UP );

		this.calibrate();
	}

	calibrate( force ){

		if( !this.calibrated || force )
		{
			console.log('[Motor] %d calibrate.', this.stepPin);

			// Just in case when we're doing force calibration
			this.calibrated = false;

			// Set speed to 10%
			this.setSpeed( 10 );
			this.step( 1000 );

			/*
			wpi.wiringPiISR(this.endSwitchPin, wpi.INT_EDGE_FALLING, function(delta){

				// Stop motor
				this.stop();

				// Step back ???
				//step(-10);

				console.log('Pin 7 changed to LOW (', delta, ')');
			});
			*/

			// Set calibrated
			this.calibrated = true;

			// Set speed to 100%
			this.setSpeed( 100 );
		}
	}

	setSpeed( speed ){

		this.stepDelay = hlp.map( speed, 0, 100, 1000, 100 );

		console.log('[Motor] %d speed %d% of %d', this.stepPin, speed, this.stepDelay);
	}

	step( stepsToMove, target ){

		let parent = this;

		// Activate motor
		this.activate();
		
		stepsToMove = Math.round(stepsToMove);

		if (stepsToMove == 0){
			return;
		}

		// Start stepping when motor is not running and is calibrated
		if( !this.isRunning )
		{
			console.log('[Motor] %d = Move to %d, target found', this.stepPin, stepsToMove, target);

			this.isRunning = true;

			if(stepsToMove > 0){
				this.direction = 1;
			}

			if(stepsToMove < 0){
				this.direction = -1;
			}

			let stepsLeft = Math.round(Math.abs(stepsToMove));

			console.log("[Motor] %d = delay=%d, steps=%d, dir=%d", this.stepPin, this.stepDelay, stepsLeft, this.direction);

			if( this.direction == 1 ){
				wpi.digitalWrite( this.dirPin, wpi.HIGH );
			}else{
				wpi.digitalWrite( this.dirPin, wpi.LOW );
			}

			// Start stepping
			while(stepsLeft > 0)
			{
				wpi.digitalWrite( this.stepPin, wpi.HIGH );
				wpi.digitalWrite( this.stepPin, wpi.LOW );
				wpi.delayMicroseconds( this.stepDelay );

				stepsLeft--;

				if (stepsLeft <= 0){
					this.stop();
				}
			};

			// Motor timeout
			if( this.timeout !== null && this.timeout > 0 )
			{
				setTimeout(() => {
					parent.deactivate();
				}, this.timeout);
			}
		}
		else
		{
			console.log('[Motor] %d still running... wait!', this.stepPin);
		}
	}

	activate() {

		console.log('[Motor] Activate %d', this.stepPin);

		wpi.digitalWrite( this.enPin, wpi.LOW );
	}

	deactivate() {

		console.log('[Motor] Deactivate %d', this.stepPin);

		wpi.digitalWrite( this.enPin, wpi.HIGH );
	}

	stop(){
		
		console.log('[Motor] %d stopped.', this.stepPin);

		this.isRunning = false;

		return;
	}
}

module.exports = {
	pan: new Motor( cfg.panMotor ),
	tilt: new Motor( cfg.tiltMotor )
};