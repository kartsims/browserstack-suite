var keystone = require('keystone');

exports = module.exports = function(req, res) {

	keystone.list('Build').model.find({
		app: res.locals.authorizedApp._id
	}).populate('app appInstance').exec(function(err, docs) {
		if (err) {
			return res.send(JSON.stringify(err));
		}
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify(docs, null, 2));
	});

};
