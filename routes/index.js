var express = require('express');
var router = express.Router();
// MissingSchemaError: Schema hasn't been registered for model "book"
// var book = mongoose.model('book');
// to get this (string above) work need to pass schema as second parameter
var book = require('../models/book');
var config = require('../config');


router.get('/', function(req, res) {
	res.redirect('/home');
});

router.get('/home', function(req, res, next) {
	var currentpage = (parseInt(req.query.page)) ? parseInt(req.query.page) : 1;
	delete req.query.page;
	if (!book.readyState) {
		var error = new Error('Not connected to DB');
		error.status = 500;
		return next(error, req, res);
	}		
	book.count(req.query, function(err, result) {
		if (err) {
			var error = new Error(err);
			error.status = 500;
			return next(error, req, res);
		}
		var pagecount = Math.ceil(result / config.limit);
		book.queryall(req.query, function(err, data) {
			if (err) {
				var error = new Error(err);
				error.status = 500;
				return next(error, req, res);
			}

			res.render('home', {
				title: 'Home',
				columns: config.display_columns,
				data: data,
				pages: pagecount,
				current: currentpage,
				genres: config.book_genres
			});
		})
	});
});

router.get('/getbook', function(req, res) {
	book.queryone(req.query, function(err, data) {
		if (err) {
			var error = new Error(err);
			error.status = 500;
			return next(error, req, res);
		}

		res.send(data);
	});
})

router.get('/view', function(req, res) {
	book.queryone(req.query, function(err, data) {
		if (err) {
			var error = new Error(err);
			error.status = 500;
			return next(error, req, res);
		}

		res.render('view', { title: 'View', data: data });
	});
})

router.get('/create', function(req, res) {
	res.render('create', {
		title: 'Create',
		paperbacks: config.paperback_types,
		genres: config.book_genres
	});
});

router.post('/create', function(req, res, next) {
	if (!req.body) {
		var error = new Error('No data has been sent in request body');
		error.status = 500;
		return next(error, req, res);
	}
	book.add(req.body, function(err, item) {
		if (err) {
			var error = new Error(err);
			error.status = 500;
			return next(error, req, res);
		}
		// redirect on view form of created item
		res.render('/home');
	});
});

router.get('/update', function(req, res) {
	book.queryone(req.query, function(err, data) {
		if (err) {
			var error = new Error(err);
			error.status = 500;
			return next(error, req, res);
		}

		res.render('update', {
			title: 'Update',
			paperbacks: config.paperback_types,
			genres: config.book_genres,
			book: data
		});
	});
});

router.post('/update', function(req, res) {
	book.update(req.body, function(err, success) {
		if (err) {
			var error = new Error(err);
			error.status = 500;
			return next(error, req, res);
		}

		res.redirect('/home');
	});
});

router.delete('/delete', function(req, res) {
	book.findOneAndRemove({ "isbn": req.query.isbn }, function(err, success) {
		if (err) {
			var error = new Error(err);
			error.status = 500;
			return next(error, req, res);
		}

		res.send('complete');
	});
});

module.exports = router;