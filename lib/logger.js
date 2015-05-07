var fs = require('fs');
var path = require('path');
var format = require('util').format;

var dir = path.join(__dirname, '../logs');
var file = 'app.log';

var logger = module.exports = {};

logger.log = function(message, done) {
	var _message = '%s: %s\n';
	fs.appendFile(path.join(dir, file), format(_message, Date.now(), message), function(err) {
		if (err) {
			if (done && typeof done === 'function') {
				return done(err);
			}
			console.log('Unexpected error ocurred in logger: ' + err);
		};
	})
}