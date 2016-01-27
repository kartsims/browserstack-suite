var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var responseData;
	keystone.list('Build').model.findOne({
		app: res.locals.authorizedApp._id,
		_id: req.params.id
	}).populate('app appInstance').lean().exec(function(err, build) {
		if (err) {
			return res.send(JSON.stringify(err));
		}
		if (!build) {
			return res.send('This build ID does not exist.');
		}
		
		responseData = build;

		// get screenshots
		keystone.list('Screenshot').model.find({
			Build: responseData._id
		}).populate('Browser').lean().exec(function(err, docs) {
			if (err) {
				throw err;
			}
			responseData.screenshots = docs;

			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(responseData, null, 2));
		});
	});

};
