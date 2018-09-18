
const cfg = require('../config.json');

const express = require('express');
const app = express();

app.use('/', express.static('web'))

app.listen(cfg.webServerPort,function(){
	console.log('[WEB] Port: %d', cfg.webServerPort);
});