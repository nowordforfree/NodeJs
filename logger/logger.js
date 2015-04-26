var fs = require('fs');

var dir = './logs/';
var file = 'app.log';

fs.log = function(message) {
	try {
		if (!fs.existsSync(dir)){
			fs.mkdirSync(dir);
		}
		if (!fs.existsSync(dir + file)) {
			fs.writeFile(dir + file, "", function (err) {
				if (err) {
					throw err;
				}
			});
		}
		fs.appendFile(dir + file, new Date().toLocaleString() + ' ' + message + '\n', function (err) {
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