var fs = require('fs');
var path = require('path');

module.exports.index = function(req, res){
	fs.readFile(path.join(__dirname, "../index.html"), "utf8", function(err, data){
		if (err) throw err;
		res.write(data);
		res.end();
	});
};