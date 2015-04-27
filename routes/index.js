var express = require('express');
var router = express.Router();
var book_model = require('../models/book_model');
var config = require('../config');
var logger = require('../logger/logger');

logger.log('App started. Listening...'); 

router.get('/', function(req, res) {
	res.redirect('/home');
});

router.get('/home', function(req, res) {
	var currentpage = (parseInt(req.query.page)) ? parseInt(req.query.page) : 1;
	delete req.query.page;
	book_model.count(req.query, function(err, result) {
		if (err) {
			logger.log('15. Error details: ' + err);
			res.render('error', {
				message: 'Oops... some error with db occured. For more details please look at log file'
			});
		}
		else {
			var pagecount = Math.ceil(result / config.limit);
			book_model.queryall(req.query, function(err, data) {
				if (err) {
					logger.log('Routes/index. Line 21. Error ocurred: ' + err);
				}
				else {
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
			logger.log('Routes/index. Line 46. Error occured: ' + err);
		}
		else {
			res.send(data);
		}
	});
})

router.get('/view', function(req, res) {
	book_model.queryone(req.query, function(err, data) {
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

router.post('/create', function(req, res) {
	if (req.body) {
		book_model.add(req.body, function(err, item) {
			if (err) {
				logger.log('Routes/index. Line 87. Error: ' + err);
				res.render('error', {
					message: 'Oops... some error with db occured. For more details please look at log file'
				});
			}
			else {
				// redirect on view form of created item
				res.redirect('/home');
			}
		});
	}
});

router.get('/update', function(req, res) {
	book_model.queryone(req.query, function(err, data) {
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
	book_model.update(req.body, function(err, success) {
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
	book_model.findOneAndRemove({ "isbn": req.query.isbn }, function(err, success) {
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