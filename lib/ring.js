
const ws281x = require('rpi-ws281x-native');
const hlp = require('./helpers');

let num_leds = 12,
	pixelData = new Uint32Array( num_leds );

ws281x.init( num_leds );

/**
 * Set led ring brightness
 * @method
 * @author  Marko Praakli
 * @date    2018-10-30
 */
setBrightness = ( percent ) => {

	let brightness = stepDelay = hlp.map( percent, 0, 100, 0, 255 );

	ws281x.setBrightness( brightness );
};

/**
 * Set led ring color
 * @method
 * @author  Marko Praakli
 * @date    2018-10-30
 */
exports.setColor = ( color ) => {

	for(var i = 0; i < num_leds; i++) {
	    pixelData[i] = color;
	}

	ws281x.render( pixelData );
	
	// setBrightness( 100 );
};

/**
 * Breathe led ring
 * @method
 * @author  Marko Praakli
 * @date    2018-10-30
 */
exports.breathe = () => {

	// Lightblue
	setColor( 0x56d4ff );

	setBrightness( 50 );
};

/**
 * Reset led ring
 * @method
 * @author  Marko Praakli
 * @date    2018-10-30
 */
exports.reset = () => {
	
	ws281x.reset();
};
