var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * AppInstance Model
 * ==========
 */

var AppInstance = new keystone.List('AppInstance', {
	autokey: {
		from: 'name',
		path: 'key',
		unique: true
	}
});

AppInstance.add({
	app: {
		type: Types.Relationship,
		ref: 'App',
		required: true,
		initial: true
	},
	name: {
		type: String,
		required: true,
		initial: true
	},
	baseurl: {
		type: Types.Url,
		label: 'Base URL',
		required: true,
		initial: true
	},
});

AppInstance.relationship({
	ref: 'Build',
	path: 'appInstance'
});

AppInstance.defaultColumns = 'app, name, baseurl';
AppInstance.register();
