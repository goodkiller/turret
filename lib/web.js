
const cfg = require('../config.json');

const http = require('http');
const fs = require('fs');




exports.setup = () => {

	// Create webserver
	http.createServer(function (req, res){

		res.writeHead(200, {
			'Content-Type': 'text/html'
		});

		fs.readFile('./web/index.html', null, function (error, data){

			if(error)
			{
				res.writeHead(404);
				res.write('Whoops! File not found!');
			}
			else
			{
				res.write(data);
			}

			res.end();
		});

	}).listen( cfg.webServerPort );
};