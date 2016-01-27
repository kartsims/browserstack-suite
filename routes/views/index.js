var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	
	view.on('init', function(next) {
		keystone.list('Build').model.find({
			app: res.locals.authorizedApp._id
		}).populate('app appInstance').exec(function(err, docs) {
			if (err) {
				next(err);
			} else {
				res.locals.builds = docs;
				next();
			}
		});
	});
	
	// Render the view
	view.render('index');
	
};
