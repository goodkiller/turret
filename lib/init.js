
const cfg = require('../config.json');

exports.cv = require('opencv4nodejs');
exports.web = require('./web');
exports.colors = require('../colors.json');

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