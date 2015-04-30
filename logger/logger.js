var fs = require('fs');
var path = require('path');

var dir = path.join(__dirname, '../logs');
var file = 'app.log';

fs.log = function(message) {
	try {
		if (!fs.existsSync(dir)){
			fs.mkdirSync(dir);
		}
		if (!fs.existsSync(path.join(dir, file))) {
			fs.writeFile(path.join(dir, file), "", function (err) {
				if (err) {
					throw err;
				}
			});
		}
		fs.appendFile(path.join(dir, file), new Date().toLocaleString() + ' ' + message + '\n', function (err) {
			if (err) {
				throw err;
			}
		})
	}
	catch (e) {
		console.log('Exception occured in logger. Exception details: ' + e);
	}
}

module.exports = fs;