require('dotenv').load();

var Browser = require('../lib/Browser')();
var client = require('../lib/browserstackClient');

// load supported browsers list and update the database
client.getBrowsers(function(err, browsers) {
	if (err) {
		throw new Error(err);
	} else {
		console.log('Processing ' + browsers.length + ' browsers from Automate REST API');
		Browser.updateArray(browsers, function(err) {
			if (err) {
				throw new Error(err);
			}
			process.exit();
		});
	}
});
