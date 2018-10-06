
const cfg = require('../config/config.json');

const hlp = require('./helpers');
const Gpio = require('pigpio').Gpio;

const fw1 = new Gpio(cfg.flywheelMotor[0], {mode: Gpio.OUTPUT});
const fw2 = new Gpio(cfg.flywheelMotor[1], {mode: Gpio.OUTPUT});

stop = () => {

	console.log('[ESC] stop');
		
	fw1.servoWrite(1000);
	fw2.servoWrite(1000);
};

start = (speed_percent) => {

	speed_percent = Math.min(speed_percent, 100);

	let speed = Math.round( hlp.map( speed_percent, 0, 100, cfg.flywheelSpeedRange[0], cfg.flywheelSpeedRange[1] ) );

	console.log('[ESC] start %d% of %d', speed_percent, speed);

	fw1.servoWrite(speed);
	fw2.servoWrite(speed);
};

stop();



setTimeout(() => {
	start(1);
}, 3000);

setTimeout(() => {
	stop();
}, 4000);

setTimeout(() => {
	start(10);
}, 5000);

setTimeout(() => {
	stop();
}, 7000);
