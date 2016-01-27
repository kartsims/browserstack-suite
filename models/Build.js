var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Build Model
 * =============
 */

var Build = new keystone.List('Build', {
	nocreate: true,
	nodelete: true,
	noedit: true
});

Build.add({
	app: {
		type: Types.Relationship,
		ref: 'App',
		required: true,
		initial: true
	},
	appInstance: {
		type: Types.Relationship,
		ref: 'AppInstance',
		required: true,
		initial: true
	},
	name: {
		type: String
	},
	status: {
		type: String
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	finishedAt: {
		type: Date
	},
	hashedId: {
		type: String
	}
});

Build.register();
