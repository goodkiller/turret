
const cfg = require('../config.json');
const wpi = require('wiring-pi');
const async = require('async');

wpi.setup('wpi');

// Setup
wpi.pwmSetMode( wpi.PWM_MODE_MS );
wpi.pwmSetClock( 1920 );
wpi.pwmSetRange( 10 );

wpi.pinMode(cfg.flywheelMotor[0], wpi.PWM_OUTPUT);
wpi.pinMode(cfg.flywheelMotor[1], wpi.PWM_OUTPUT);

wpi.pwmWrite(cfg.flywheelMotor[0], 0);
wpi.pwmWrite(cfg.flywheelMotor[1], 0);




setSpeed = (speed) => {

	console.log('[ESC] setSpeed', speed);

	
	
};

start = (speed) => {

	console.log('[ESC] start', speed);

	setSpeed( speed );

	//wpi.pwmSetRange(1024);
	
	wpi.pwmWrite(cfg.flywheelMotor[0], speed);
	wpi.pwmWrite(cfg.flywheelMotor[1], speed);
	
};

stop = () => {

	console.log('[ESC] stop');
		
	wpi.pwmWrite(cfg.flywheelMotor[0], 0);
	wpi.pwmWrite(cfg.flywheelMotor[1], 0);
};

// Start with 1000 cycles
start( 1000 );

// Stop after 5s
setTimeout(() => {
	stop();
}, 5000);