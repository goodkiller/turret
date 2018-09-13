
const cfg = require('../config.json');
const cv = require('opencv4nodejs');

// Check arguments
process.argv.forEach(function (val, index, array) {
	if( val == '--gui' ){
		cfg.guiEnabled = true;
	}

	if( val == '--debug' ){
		cfg.debug = true;
	}
});

// Disable logging 
if( !cfg.debug ){
	console.log = function() {}
}

console.log('Turret setup ...');

exports.cfg = cfg;
exports.cv = cv;