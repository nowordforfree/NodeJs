var express = require('express');
var router = express.Router();
var book_model = require('../models/book_model');
var config = require('../config');


router.get('/', function(req, res) {
	res.redirect('/home');
});

router.get('/home', function(req, res) {
	book_model.count(function(err, result) {
		if (err) {
			console.log('15. Error details: ' + err);
		}
		else {
			var pagecount = Math.ceil(result / config.limit);
			book_model.queryall(req.query, function(err, data) {
				if (err) {
					console.log('21. Error ocurred: ' + err);
				}
				else {
					var currentpage = (parseInt(req.query.page)) ? parseInt(req.query.page) : 1;
					res.render('home', {
						title: 'Home',
						columns: config.display_columns,
						data: data,
						pages: pagecount,
						current: currentpage,
						genres: config.book_genres
					});
				}
			})
		}
	});
});

router.get('/getbook', function(req, res) {
	book_model.queryone(req.query, function(err, data) {
		if (err) {
			console.log('46. Some error occured: ' + err);
		}
		else {
			res.send(data);
		}
	});
})

router.get('/view', function(req, res) {
	book_model.queryone(req.query, function(err, data) {
		if (err) {
			console.log('57. Some error occured: ' + err);
		}
		else {
			res.render('view', { title: 'View', data: data });
		}
	});
})

router.get('/create', function(req, res) {
	res.render('create', {
		title: 'Create',
		paperbacks: config.paperback_types,
		genres: config.book_genres
	});
});

router.post('/create', function(req, res) {
	console.log(req.body);
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
			if (err) {
				console.log('87. Error: ' + err);
			}
			else {
				res.redirect('/home');
			}
		});
	}
});

router.get('/update', function(req, res) {
	book_model.queryone(req.query, function(err, data) {
		if (err) {
			console.log('99. Some error occured: ' + err);
		}
		else {
			res.render('update', {
				title: 'Update',
				paperbacks: config.paperback_types,
				genres: config.book_genres,
				book: data
			});
		}
	});
});

router.post('/update', function(req, res) {
	console.log(req.body);
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
			if (err) {
				console.log('126. Error: ' + err);
			}
			res.redirect('/home');
		});
});

router.delete('/delete', function(req, res) {
	book_model.findOneAndRemove({ "isbn": req.query.isbn }, function(err, success) {
		if (err) {
			console.log('136. Error: ' + err);
		}
		res.send('complete');
	});
});

module.exports = router;