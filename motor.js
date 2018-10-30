
const cfg = require('./config/config.json');

const ipc = require('node-ipc');
const mot = require('./lib/motor');

ipc.config.id = 'motor';
ipc.config.retry = 1500;
ipc.config.silent = true;

// Cnnect to master
ipc.connectTo( 'master', () => {

	// Calibrate motors
	ipc.of.master.on( ipc.config.id + ':calibrateMotors', (data) => {
	    console.log('[Motor] Calibrate: ', data);

	    mot.pan.calibrate( true );
	    mot.tilt.calibrate( true );
	});

	// Target found
	ipc.of.master.on( ipc.config.id + ':onTarget', (target) => {
	    console.log('[Motor] On target: ', target);

	    mot.pan.step( target.xPos, target );
	    mot.tilt.step( target.yPos, target );
	});
});