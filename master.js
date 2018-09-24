
const ipc = require('node-ipc');
const util = require('util');

ipc.config.id = 'master';
ipc.config.retry = 1500;
ipc.config.silent = true;

ipc.serve(() => {

	console.log('[Ipc] Master started.');

	// Log
	ipc.server.on('log', (data, socket) => {

		let log = util.format.apply(util, data );

		console.log('[Ipc] log: ', log);
	});

	// Target information
	ipc.server.on('onTarget', (data, socket) => {

		// { x1: 148, y1: 24, x2: 217, y2: 69, d: 1993, xPos: 138, yPos: 182 }
		console.log('[Ipc] onTarget: ', data);

		if( data.d > 0 )
		{
			//ipc.of.motor.emit('panTo', data);

			// Stop flywheel
			//flywheel.stop();

			// Move to target
			//motor.pan.step( turretXPos, t );
			//motor.tilt.step( turretYPos, t );
		}
		else
		{
			// Start flywheel
			//flywheel.start( 300 );
		}
	});

	// Target information
	ipc.server.on('onWebCmd', (data, socket) => {

		console.log('[Ipc] onWebCmd: ', data);

		ipc.server.broadcast('calibrateMotors', data );
			
		
	});

});

ipc.server.start();