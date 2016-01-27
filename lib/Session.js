// BrowserStack session object

var async = require('async'),
	fs = require('fs-extra'),
	webdriver = require('browserstack-webdriver'),
	models = require('./models');

exports = module.exports = function(build, capabilities, urls, browser) {
	var browseCount = 0;
	var currentUrl;
	var driver;

	return {
		browser: browser,

		// change current URL
		browseTo: function(url, cb) {
			driver.get(url).then(function() {
				console.log('Processing', url);
				currentUrl = url;
				browseCount++;
				cb();
			});
		},

		// take a screenshot of the current page
		takeScreenshot: function(cb) {
			driver.takeScreenshot().then(function(data) {
				var filename = browseCount + '-' + browser.filename + '.png';
				fs.writeFile(build.fullPath + '/' + filename, data.replace(/^data:image\/png;base64,/, ''), 'base64', function(err) {
					if (err) {
						cb(err);
					} else {
						new models.Screenshot({
							Build: build._id,
							Browser: browser._id,
							url: currentUrl,
							filename: build.path + '/' + filename
						}).save(cb);
					}
				});
			});
		},

		// start this session
		start: function(cb) {
			// console timer
			console.time('session-time');

			driver = new webdriver.Builder()
				.usingServer('http://hub.browserstack.com/wd/hub')
				.withCapabilities(capabilities)
				.build();

			var self = this;
			async.eachSeries(urls, function(url, cb) {
				self.browseTo(url, function() {
					self.takeScreenshot(cb);
				});
			}, function(err) {
				driver.quit().then(function() {
					console.timeEnd('session-time');
					cb(err);
				});
			});

		}
	};
};
