var mongoose = require('../lib/mongoose');
var config = require('../config');

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

bookSchema.statics.queryall = function (queryparam, callback) {
	var page = (parseInt(queryparam.page)) ? parseInt(queryparam.page) : 1;
	var skip = page > 0 ? ((page - 1) * config.limit) : 0;
	var options = { "_id": 0 };
	for (var key in config.display_columns) {
		options[key] = 1
	}
	delete queryparam['page'];
	return this.find(queryparam, options,
		{ skip: skip, limit: config.limit, sort: { created: -1 }},
		callback).lean();
}

bookSchema.statics.queryone = function (queryparam, callback) {
	var options = { "_id": 0, "__v": 0 };
	delete queryparam['page'];
	return this.findOne(queryparam, options, callback).lean();
}

bookSchema.statics.add = function(entity, callback) {
	var Book = mongoose.model('book', bookSchema);
	Book.create({
		name		: entity.name,
		isbn		: entity.isbn,
		year		: entity.year,
		author		: entity.author.split(','),
		pages		: entity.pages,
		paperback	: entity.paperback,
		genre		: entity.genre,
		url			: entity.url
	}, callback);
}

bookSchema.statics.update = function(entity, callback) {
	return this.findOneAndUpdate(
		{ "isbn": entity.init_isbn }, {
			name		: entity.name,
			isbn		: entity.isbn,
			year		: entity.year,
			author		: entity.author.split(','),
			pages		: entity.pages,
			paperback	: entity.paperback,
			genre		: entity.genre,
			url			: entity.url
		}, callback);
}

module.exports = mongoose.model('book', bookSchema);