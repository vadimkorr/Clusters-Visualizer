var http = require("http");
var fs = require("fs");
var url = require("url");
var path = require("path");
var port = process.argv[2] || 8080;

http.createServer(function(req, res) {
	var uri = url.parse(req.url).pathname;
	var fileName = path.join(process.cwd(), uri);
	
	var setCommonHeaders = function(res) {
		res.setHeader("Access-Control-Allow-Origin", "*");
		//res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	};
		
	fs.exists(fileName, function(exists) {
		if (!exists) {
			setCommonHeaders(res);
			res.writeHead(404, {"Content-Type": "text/plain"});
			res.write("404 Not Found\n");
			res.end();
			return;
		}
		
		var isDir = false;
		if (fs.statSync(fileName).isDirectory()) {
			isDir = true;
			fileName += '/src/index.html';
		}
		
		fs.readFile(fileName, "binary", function(err, file) {
			if (err) {
				setCommonHeaders(res);
				res.writeHead(500, {"Content-type": "text/plain"});
				res.write(err + "\n");	
				res.end();
				return;
			}
		
			setCommonHeaders(res);
			if (isDir) {
				res.writeHead(200, {"Content-type": "text/html;charset=utf-8"});
				res.write(file);	
			} else {
				res.writeHead(200, {"Content-type": "text/plain;charset=utf-8"});
				res.write(file, "binary");	
			}
			res.end();
		});
	});
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");