var express = require('express');
var router = express.Router();
var Book = require('../BookBase/database');
var config = require('../config');

function GetBooks(req, callback) {
	var page = (parseInt(req.query.page)) ? parseInt(req.query.page) : 1;
	var skip = page > 0 ? ((page - 1) * 25) : 0;
	var options = { "_id": 0 };
	var query = {};
	for (var key in config.display_columns) {
		options[key] = 1
	}
	for (var key in req.query) {
		if (key != "page")
			query[key] = req.query[key];
	}
	Book.find(
		query,
		options,
		{ skip: skip, limit: 25, sort: { created: -1 }},
		function(err, books) {
			if (err) {
				callback(err);
			}
			else {
				callback(JSON.parse(JSON.stringify(books)));
			}
		});
}

function GetOne(req, callback) {
	var page = (parseInt(req.query.page)) ? parseInt(req.query.page) : 1;
	var skip = page > 0 ? ((page - 1) * 25) : 0;
	var options = { "_id": 0, "__v": 0 };
	var query = {};
	for (var key in req.query) {
		if (key != "page")
			query[key] = req.query[key];
	}
	Book.find(
		query,
		options,
		function(err, books) {
			if (err) {
				callback(err);
			}
			else {
				callback(JSON.parse(JSON.stringify(books)));
			}
		});
}

router.get('/', function(req, res) {
	res.redirect('/home');
});

router.get('/home', function(req, res) {
	var pagecount;
	Book.find().count({}, function(err, result) {
		if (err)
			console.log(err);
		else
			pagecount = Math.ceil(result / 25);
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
		var book = new Book();
		book.name		= req.body.name;
		book.isbn		= req.body.isbn;
		book.year		= req.body.year;
		book.author		= req.body.author.split(',');
		book.pages		= req.body.pages;
		book.paperback	= req.body.paperback;
		book.genre		= req.body.genre;
		book.url		= req.body.url;
		
		book.save(function(err) {
			if (err)
				console.log(err);
		});
		
		res.redirect('/home');
	}
});

router.get('/update', function(req, res) {
	GetOne(req, function(data) {
		res.render('update', { title: 'Update', paperbacks: config.paperback_types, genres: config.book_genres, book: data[0] });
	});
});

router.post('/update', function(req, res) {
	Book.findOneAndUpdate(
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
	Book.findOneAndRemove({ "isbn": req.query.isbn }, function(err, success) {
		res.send('done');
		console.log(success);
	});
})

module.exports = router;