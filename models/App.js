var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * App Model
 * ==========
 */

var App = new keystone.List('App');

App.add({
	name: {
		type: String,
		required: true
	},
	uniqueid: {
		type: String,
		label: 'Unique ID'
	},
	password: {
		type: String,
		label: 'Access password'
	},
	uris: {
		type: Types.TextArray,
		label: 'Test URIs'
	},
	spec: {
		type: Types.Relationship,
		ref: 'Spec',
		label: 'Browser Specs'
	}
});

App.relationship({
	ref: 'AppInstance',
	path: 'app'
});

App.defaultColumns = 'key|10%, name, spec';
App.register();
