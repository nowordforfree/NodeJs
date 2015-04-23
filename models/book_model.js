var mongoose = require('../lib/mongoose');

var bookSchema = new mongoose.Schema({
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

module.exports = mongoose.model('book', bookSchema);