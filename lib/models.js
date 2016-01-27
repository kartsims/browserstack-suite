var keystone = require('keystone'),
	db = require('./db');

// init empty keystone instance
keystone.init();
keystone.import('../models');

module.exports = {
	App: db.connection.model('apps', keystone.list('App').schema),
	AppInstance: db.connection.model('appinstances', keystone.list('AppInstance').schema),
	Browser: db.connection.model('browsers', keystone.list('Browser').schema),
	Build: db.connection.model('builds', keystone.list('Build').schema),
	Screenshot: db.connection.model('screenshots', keystone.list('Screenshot').schema),
	Spec: db.connection.model('specs', keystone.list('Spec').schema),
};
