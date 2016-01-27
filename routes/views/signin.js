var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);

	if ('p' in req.query) {
		view.on('init', function(next) {
			keystone.list('App').model.findOne({
				password: req.query.p
			}).exec(function(err, app) {
				if (err) {
					next(err);
				} else if (!app) {
					req.flash('error', 'This password is not correct.');
					next();
				} else {
					res.cookie('authorizedApp', app);
					res.redirect('/');
				}
			});
		});
	}

	// Render the view
	view.render('signin');

};
