require('dotenv').load();

var keystone = require('keystone');

keystone.init({

	'mongo': require('./lib/db').mongoDbString,

	'name': 'BrowserStack Suite',
	'brand': 'BrowserStack Suite',

	'less': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'jade',

	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User'

});

keystone.import('models');

keystone.set('locals', {
	_: require('underscore'),
	env: keystone.get('env'),
	utils: keystone.utils
});

keystone.set('routes', require('./routes'));

// Admin UI navbar
keystone.set('nav', {
	'apps': ['apps', 'app-instances'],
	'browsers': ['specs', 'browsers'],
	'builds': 'builds',
	'users': 'users'
});

keystone.start();
