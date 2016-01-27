var models = require('./models');

module.exports = function(uniqueid) {
	var config = {};

	return {

		// exposed variables
		config: config,

		// basic app information
		initConfig: function(cb) {
			models.App.findOne()
				.where('uniqueid', uniqueid)
				.populate('spec')
				.exec(function(err, doc) {
					if (err) {
						cb(err);
					} else if (doc === null) {
						cb('Could not find app with uniqueid ' + uniqueid);
					} else if (doc.spec == null) {
						cb('No spec configured for app ' + doc.name);
					} else if (doc.uris.length === 0) {
						cb('No URIs configured for app ' + doc.name);
					} else {
						config._id = doc._id;
						config.uniqueid = doc.uniqueid;
						config.name = doc.name;
						config.uris = doc.uris;
						config.spec = doc.spec;
						cb();
					}
				});
		},

		// load browsers information from spec
		loadBrowsers: function(cb) {
			if (typeof config.spec.browsers === 'undefined') {
				return cb('Could not find spec browsers information for ' + config.name);
			}
			models.Browser.find()
				.where('_id', {
					$in: config.spec.browsers
				})
				.exec(function(err, docs) {
					if (err) {
						cb(err);
					} else if (docs.length === 0) {
						cb('Could not find any browser for spec ' + config.spec.name);
					} else {
						config.browsers = docs;
						cb();
					}
				});
		},

		// load instances
		loadInstances: function(cb) {
			models.AppInstance.find()
				.where('app', config._id)
				.exec(function(err, docs) {
					if (err) {
						cb(err);
					} else if (docs.length === 0) {
						cb('Could not find any instance of app ' + config.name);
					} else {
						config.instances = docs;
						cb();
					}
				});
		},

	};
};
