var mongoose = require('mongoose');
var config = require('../config');
var logger = require('../logger/logger');

var connection_string = 'mongodb://' +
	config.mongo.ip + ':' + config.mongo.port +
	'/' + config.mongo.dbname;

mongoose.connect(connection_string, function(err) {
	if (err){
		logger.log('Error at mongodb. Details: ' + err);
		//throw(err);
	}
	else {
		logger.log('Connected to db successfully');
	}
});

module.exports = mongoose;