
const cfg = require('../config.json');


let isPanRunning = false;
let isTiltRunning = false;


// Move pan position
exports.panMotor = (xPos) => {


	if( xPos > 0 ){
		console.log('panMotor Move: left ', xPos);
	}else{
		console.log('panMotor Move: right ', xPos);
	}
};

// Move tilt position
exports.tiltMotor = (yPos) => {


	if( yPos > 0 ){
		console.log('tiltMotor Move: up ', yPos);
	}else{
		console.log('tiltMotor Move: down ', yPos);
	}
};

// Scan target
exports.scanTarget = () => {


};
