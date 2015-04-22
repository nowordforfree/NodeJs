var mongoose = require('mongoose');
var config = require('../config');

var connection_string = 'mongodb://' +
	config.mongo.ip + ':' + config.mongo.port +
	'/' + config.mongo.dbname;

mongoose.connect(connection_string, function(err) {
	if (err){
		console.log(connection_string);
		throw(err);
	}
});

module.exports = mongoose;