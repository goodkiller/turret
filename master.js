
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
	ipc.server.on('onCommand', (command, socket) => {

		console.log('[Ipc] onCommand: ', command);

		if( command.call !== undefined )
		{
			let data = null;

			if( command.data !== undefined ){
				data = command.data;
			}

			ipc.server.broadcast( command.call, data );
		}
	});
});

ipc.server.start();
