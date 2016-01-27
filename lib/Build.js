var async = require('async'),
	chalk = require('chalk'),
	Session = require('./Session'),
	fs = require('fs-extra'),
	models = require('./models');

module.exports = function(app, appInstance) {
	var sessions = [];

	var build = new models.Build({
		name: null,
		path: null,
		fullPath: null,
		app: app.config._id,
		appInstance: appInstance._id
	});

	// set build name according to BrowserStack restrictions (we need this to retrieve the BS build ID later)
	build.name = app.config.name;
	build.name += (new Date()).toUTCString();
	build.name = build.name.replace(/[^a-z0-9]/gi, '');

	// create build path
	build.path = app.config.uniqueid + '/' + appInstance.key + '/' + build.name;
	build.fullPath = __dirname + '/../public/data/screenshots/' + build.path;
	fs.mkdirsSync(build.fullPath);
	build.fullPath = fs.realpathSync(build.fullPath);

	return {
		build: build,
		name: build.name,

		init: function(cb) {
			build.save(cb);
		},

		// add a new session
		addSession: function(browser, urls) {
			var capabilities = {
				'browserstack.user': process.env.BS_EMAIL,
				'browserstack.key': process.env.BS_PASSWORD
			};

			// browser capabilities
			for (var i in browser.capabilities) {
				if (browser.capabilities.hasOwnProperty(i)) {
					capabilities[i] = browser.capabilities[i];
				}
			}

			// build configuration
			capabilities.project = app.uniqueid;
			capabilities.build = build.name;

			// adds the session to the test
			sessions.push(new Session(build, capabilities, urls, browser));
		},

		// start every session one by one
		start: function(cb) {
			async.eachSeries(sessions, function(session, cb) {
				console.log(chalk.bold('\nStarting session', session.browser.name));
				session.start(cb);
			}, cb);
		},

		// save the build in our DB
		save: function(cb) {

			// init browserstack API client
			var client = require('./browserstackClient');
			client.getBuilds(function(err, builds) {
				if (err) {
					cb(err);
				} else {
					builds.forEach(function(b) {
						if (b.name === build.name) {
							/* jshint ignore:start */
							build.hashedId = b.hashed_id;
							/* jshint ignore:end */
							build.status = b.status;
						}
					});
					build.finishedAt = Date.now();
					build.save(cb);
				}
			});
		}

	};
};
