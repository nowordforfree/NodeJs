var express = require('express');
var router = express.Router();
// MissingSchemaError: Schema hasn't been registered for model "book"
// var book = require('../lib/mongoose').model('book');
var book = require('../models/book');
var config = require('../config');


router.get('/', function(req, res) {
	res.redirect('/home');
});

router.get('/home', function(req, res, next) {
	var currentpage = (parseInt(req.query.page)) ? parseInt(req.query.page) : 1;
	delete req.query.page;
	book.count(req.query, function(err, result) {
		if (err) {
			//return next({err.message: 'Oops... some error with db occured. For more details please look at log file'});
			return next(err);
		}
		var pagecount = Math.ceil(result / config.limit);
		book.queryall(req.query, function(err, data) {
			if (err) {
				return next(err);
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
			logger.log('Routes/index. Line 46. Error occured: ' + err);
		}
		else {
			res.send(data);
		}
	});
})

router.get('/view', function(req, res) {
	book.queryone(req.query, function(err, data) {
		if (err) {
			logger.log('Routes/index. Line 57. Error occured: ' + err);
			res.render('error', {
				message: 'Oops... some error with db occured. For more details please look at log file'
			});
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

router.post('/create', function(req, res, next) {
	if (!req.body) {
		return next({err: 'No body in request'});
	}
	book.add(req.body, function(err, item) {
		if (err) {
			return next(err);
		}
		// redirect on view form of created item
		res.redirect('/home');
	});
});

router.get('/update', function(req, res) {
	book.queryone(req.query, function(err, data) {
		if (err) {
			logger.log('Routes/index. Line 99. Error occured: ' + err);
			res.render('error', {
				message: 'Oops... some error with db occured. For more details please look at log file'
			});
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
	book.update(req.body, function(err, success) {
		if (err) {
			logger.log('Routes/index. Line 126. Error: ' + err);
			res.render('error', {
				message: 'Oops... some error with db occured. For more details please look at log file'
			});
		}
		else {
			res.redirect('/home');
		}
	});
});

router.delete('/delete', function(req, res) {
	book.findOneAndRemove({ "isbn": req.query.isbn }, function(err, success) {
		if (err) {
			logger.log('Routes/index. Line 136. Error: ' + err);
			res.render('error', {
				message: 'Oops... some error with db occured. For more details please look at log file'
			});
		}
		else {
			res.send('complete');
		}
	});
});

module.exports = router;