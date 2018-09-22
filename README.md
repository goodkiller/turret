# NERF turret
NERF automated turret

## Installation

### Requirements

```
npm i --save opencv4nodejs
npm i fast-sort
npm i nanotimer
npm i wiringpi-node

sudo apt-get install raspberrypi-kernel-headers
sudo apt-get install v4l2loopback-dkms
sudo apt-get install v4l2loopback-utils
```

## Execute
```
node main.js
node main.js --gui --debug
```

### Flags

| Argument  | Description |
| ------------- | ------------- |
| --gui | Enables GUI for debugging  |
| --debug | Displays console.log outputs |
