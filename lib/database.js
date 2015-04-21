var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/bookstore', function(err) {
	if (err)
		console.log('Error connection to db: ', err);
	else
		console.log('Connected to db successfully');
});

var Schema	= mongoose.Schema;

var bookSchema = new Schema({
	name		: { type: String, required: true },
	isbn		: { type: String, required: true, unique: true },
	year		: { type: Number, required: true },
	author		: { type: Array, required: true },
	pages		: { type: Number, required: true },
	paperback	: String,
	genre		: String,
	url			: String,
	created		: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Book', bookSchema);