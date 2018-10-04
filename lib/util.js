
const events = require('events');
//const eventEmitter = new events.EventEmitter();

const util = require('util');

//eventEmitter.on('eventlogger', function(message) {
//	io.emit('weblog', message);
//});

// Override console.log
var originConsoleLog = console.log;

// Re-overwrite console.log
console.log = (...args) => {

	const l = '[' + new Date().toISOString() + ']' + util.format.apply(util, args );

	let dt = new Date().toISOString();
	 
	//eventEmitter.emit('eventlogger', l);

	originConsoleLog( l );
}