const cv = require('opencv4nodejs');
const sort = require('fast-sort');

const delay = 10;
const minPxSize = 50;



const grabFrames = (videoFile, delay, onFrame) => {
  const cap = new cv.VideoCapture(videoFile);
  let done = false;
  const intvl = setInterval(() => {
    let frame = cap.read();
    // loop back to start on end of stream reached
    if (frame.empty) {
      cap.reset();
      frame = cap.read();
    }
    onFrame(frame);

    const key = cv.waitKey(delay);
    done = key !== -1 && key !== 255;
    if (done) {
      clearInterval(intvl);
      console.log('Key pressed, exiting.');
    }
  }, 0);
};



const drawCrosshair = (frame, size) => {

	const 	frameX = frame.sizes[1] / 2,
			frameY = frame.sizes[0] / 2,
			sizeCenter = size / 2;

	const frameCenterPoint = cv.Point( frameX, frameY );

	// Circle
	frame.drawCircle(
		frameCenterPoint, 
		size, // Size
		new cv.Vec(0, 0, 255), // Red
		2, // Stroke width
		cv.LINE_8
	);

	// Dot
	frame.drawCircle(
		frameCenterPoint, 
		2, // Size
		new cv.Vec(0, 0, 255), // Red
		2, // Stroke width
		cv.LINE_8
	);

	return [ frameX, frameY ];
};

const drawTarget = (binaryImg, dstImg, minPxSize, crosshair) => {

	const {
		centroids,
		stats,
		labels
	} = binaryImg.connectedComponentsWithStats();

	let targetList = [];

	// pretend label 0 is background
	for (let label = 1; label < centroids.rows; label += 1)
	{
		const [x1, y1] = [
			stats.at(label, cv.CC_STAT_LEFT), 
			stats.at(label, cv.CC_STAT_TOP)
		];

		const [x2, y2] = [
			x1 + stats.at(label, cv.CC_STAT_WIDTH),
			y1 + stats.at(label, cv.CC_STAT_HEIGHT)
		];

		const size = stats.at(label, cv.CC_STAT_AREA);

		if (minPxSize < size)
		{
			const dist = calcDistance(
				crosshair[0], crosshair[1], 
				x1, y1, 
				x2, y2
			);

			targetList.push({
				x1: x1,
				y1: y1,
				x2: x2, 
				y2: y2,
				d: dist
			});
		}
	}

	sort(targetList).asc('d');

	if( targetList.length > 0 )
	{

		const t = targetList[0];

		const 	frameHeight = labels.sizes[0],
				frameWidth = labels.sizes[1];

		const 	targetWidth = t.x2 - t.x1,
				targetCenter = targetWidth / 2,
				targetXPos = t.x1 + targetCenter,
				targetYPos = t.y1 + targetCenter;

		const 	turretXPos = (frameWidth / 2) - targetXPos,
				turretYPos = (frameHeight / 2) - targetYPos;

	

		console.log('TARGET: ', t);

		if( t.d > 0 )
		{
			if( turretXPos > 0 ){
				console.log('Move: left ', turretXPos);
			}else{
				console.log('Move: right ', turretXPos);
			}

			if( turretYPos > 0 ){
				console.log('Move: up ', turretYPos);
			}else{
				console.log('Move: down ', turretYPos);
			}
		}

		// Draw target
		dstImg.drawRectangle(
			new cv.Point(t.x1, t.y1),
			new cv.Point(t.x2, t.y2),
			{
				color: new cv.Vec(0, 255, 0), // green
				thickness: 2
			}
		);
	}

	console.log("\n\n");
};

const calcDistance = (x, y, x1, y1, x2, y2) => {


    var dx, dy;
    if (x < x1) {
        dx = x1 - x;
        if (y < y1) {
            dy = y1 - y;
            return Math.sqrt(dx * dx + dy * dy);
        }
        else if (y > y2) {
            dy = y - y2;
            return Math.sqrt(dx * dx + dy * dy);
        }
        else {
            return dx;
        }
    }
    else if (x > x2) {
        dx = x - x2;
        if (y < y1) {
            dy = y1 - y;
            return Math.sqrt(dx * dx + dy * dy);
        }
        else if (y > y2) {
            dy = y - y2;
            return Math.sqrt(dx * dx + dy * dy);
        }
        else {
            return dx;
        }
    }
    else {
        if (y < y1) {
            return y1 - y;
        }
        else if (y > y2) {
            return y - y2;
        }
        else {
            return 0.0; // inside the rectangle or on the edge
        }
    }



};





grabFrames(1, delay, (frame) => {

	// const frameHLS = frame.cvtColor(cv.COLOR_BGR2HLS);
	const frameHLS = frame.cvtColor(cv.COLOR_BGR2HSV);

	const crosshair = drawCrosshair( frame, 20 );

	//console.log(cross);

	const brownLower = new cv.Vec(0, 192, 98);
	const brownUpper = new cv.Vec(179, 255, 255);

	const rangeMask = frameHLS.inRange(brownLower, brownUpper);


	const blurred = rangeMask.blur(new cv.Size(10, 10));
	const thresholded = blurred.threshold(100, 255, cv.THRESH_BINARY);

	
	drawTarget(thresholded, frame, minPxSize, crosshair);

	cv.imshow('rangeMask', rangeMask);
	cv.imshow('thresholded', thresholded);
	cv.imshow('frame', frame);
});
