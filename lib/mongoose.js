var mongoose = require('mongoose');
var config = require('../config');
var logger = require('./logger');

var connection_string = 'mongodb://' +
	config.mongo.ip + ':' + config.mongo.port +
	'/' + config.mongo.dbname;

mongoose.connect(connection_string, function(err, next) {
	if (err){
		return logger.log('Error at mongodb. Details: ' + err);
		// return next(err);
	}
	logger.log('Connected to db successfully');
});

module.exports = mongoose;