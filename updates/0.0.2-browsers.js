/**
 * Fill the browsers collection in the DB
 */

var keystone = require('keystone'),
	db = require('../lib/db'),
	client = require('../lib/browserstackClient');

// initiate this helper lib with the browser model
var BrowserModel = db.connection.model('browsers', keystone.list('Browser').schema);
var Browser = require('../lib/Browser')(BrowserModel);

// update browsers collection from the API
exports = module.exports = function(cb) {
	client.getBrowsers(function(err, browsers) {
		if (err) {
			throw err;
		} else {
			console.log('Processing ' + browsers.length + ' browsers from Automate REST API');
			Browser.updateArray(browsers, cb);
		}
	});
};
