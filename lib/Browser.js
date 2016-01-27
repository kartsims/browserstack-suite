var async = require('async');

module.exports = function(BrowserModel) {
	// you may specify the model if keystone is already loaded (ie. in updates)
	BrowserModel = BrowserModel || require('./models').Browser;

	var nbAdded = 0;

	// create browser if it does not exist in the DB
	function update(browserFromApi, cb) {
		// convert the object we got from the API into an object we can save in the database (camel-case issues)
		var browser = {
			/* jshint ignore:start */
			os: browserFromApi.os || null,
			osVersion: browserFromApi.os_version || null,
			browser: browserFromApi.browser || null,
			browserVersion: browserFromApi.browser_version || null,
			device: browserFromApi.device || null
			/* jshint ignore:end */
		};
		BrowserModel.find(browser, function(err, doc) {
			if (err) {
				console.error('Error while fetching browser');
				console.error(err);
				cb();
			} else if (doc.length === 0) {

				var b = new BrowserModel(browser);
				b.save(function(err) {
					if (err) {
						console.error('Error adding browser ' + b.name + ' to the database:');
						console.error(err);
					} else {
						console.log('Added ' + b.name);
						nbAdded++;
					}
					cb();
				});

			} else {
				cb();
			}
		});
	}

	function updateArray(browsers, cb) {
		nbAdded = 0;
		async.each(browsers, update, function() {

			// TODO clear browsers that are not available anymore (something like array_intersect)
			// TODO check that these browsers are not used by any spec, otherwise throw an error
			// TODO show number of browsers deleted

			if (nbAdded > 0) {
				console.log('Added ' + nbAdded + ' browser' + (nbAdded > 1 ? 's' : '') + ' to the database');
			}

			cb();
		});
	}

	return {
		update: update,
		updateArray: updateArray
	};
};
