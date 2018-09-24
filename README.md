# NERF turret
NERF automated turret

## Installation

### Requirements

```
npm i --save opencv4nodejs fast-sort nanotimer wiringpi-node pm2

sudo apt-get install raspberrypi-kernel-headers v4l2loopback-dkms v4l2loopback-utils
```

## Execute
```
pm2 start master.js
pm2 start video.js
pm2 start webserver.js
```