var express = require('express');
var router = express.Router();
var book_model = require('../models/book_model');
var config = require('../config');

function GetBooks(req, callback) {
	var page = (parseInt(req.query.page)) ? parseInt(req.query.page) : 1;
	var skip = page > 0 ? ((page - 1) * config.limit) : 0;
	var options = { "_id": 0 };
	var query = {};
	for (var key in config.display_columns) {
		options[key] = 1
	}
	for (var key in req.query) {
		if (key != "page")
			query[key] = req.query[key];
	}
	book_model.find(
		query,
		options,
		{ skip: skip, limit: config.limit, sort: { created: -1 }},
		function(err, book_model) {
			if (err) {
				callback(err);
			}
			else {
				callback(JSON.parse(JSON.stringify(book_model)));
			}
		});
}

function GetOne(req, callback) {
	var page = (parseInt(req.query.page)) ? parseInt(req.query.page) : 1;
	var skip = page > 0 ? ((page - 1) * config.limit) : 0;
	var options = { "_id": 0, "__v": 0 };
	var query = {};
	for (var key in req.query) {
		if (key != "page")
			query[key] = req.query[key];
	}
	book_model.find(
		query,
		options,
		function(err, book_model) {
			if (err) {
				callback(err);
			}
			else {
				callback(JSON.parse(JSON.stringify(book_model)));
			}
		});
}

router.get('/', function(req, res) {
	res.redirect('/home');
});

router.get('/home', function(req, res) {
	var pagecount;
	book_model.find().count({}, function(err, result) {
		if (err)
			console.log(err);
		else
			pagecount = Math.ceil(result / config.limit);
	});
	GetBooks(req, function(data) {
		var columns = [];
		for (var key in config.display_columns) {
			columns[columns.length] = config.display_columns[key];
		}
		var currentpage = (parseInt(req.query.page)) ? parseInt(req.query.page) : 1;
		res.render('home',
			{ title: 'Home',
			columns: columns,
			data: data,
			pages: pagecount,
			current: currentpage,
			genres: config.book_genres });
	});
});

router.get('/getbook', function(req, res) {	
	GetOne(req, function(data) {
		res.send(data);
	});
})

router.get('/view', function(req, res) {
	GetOne(req, function(data) {
		res.render('view', { title: 'View', data: data });
	});
})

router.get('/create', function(req, res) {
	res.render('create', { title: 'Create', paperbacks: config.paperback_types, genres: config.book_genres });
});

router.post('/create', function(req, res) {
	if (req.body) {
		var book_model = new book_model();
		book_model.name			= req.body.name;
		book_model.isbn			= req.body.isbn;
		book_model.year			= req.body.year;
		book_model.author		= req.body.author.split(',');
		book_model.pages		= req.body.pages;
		book_model.paperback	= req.body.paperback;
		book_model.genre		= req.body.genre;
		book_model.url			= req.body.url;
		
		book_model.save(function(err) {
			if (err)
				console.log(err);
		});
		
		res.redirect('/home');
	}
});

router.get('/update', function(req, res) {
	GetOne(req, function(data) {
		res.render('update', {
			title: 'Update',
			paperbacks: config.paperback_types,
			genres: config.book_genres,
			book: data[0]
		});
	});
});

router.post('/update', function(req, res) {
	book_model.findOneAndUpdate(
		{ "isbn": req.body.init_isbn },
		{
			name		: req.body.name,
			isbn		: req.body.isbn,
			year		: req.body.year,
			author		: req.body.author.split(','),
			pages		: req.body.pages,
			paperback	: req.body.paperback,
			genre		: req.body.genre,
			url			: req.body.url
		}, function(err, success) {
			if (err)
				console.log(err);
			res.redirect('/home');
		});
});

router.delete('/delete', function(req, res) {
	book_model.findOneAndRemove({ "isbn": req.query.isbn }, function(err, success) {
		res.send('done');
		console.log(success);
	});
})

module.exports = router;