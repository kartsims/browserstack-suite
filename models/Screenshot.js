var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Screenshot Model
 * =============
 */

var Screenshot = new keystone.List('Screenshot', {
	nocreate: true,
	nodelete: true,
	noedit: true
});

Screenshot.add({
	Build: {
		type: Types.Relationship,
		ref: 'Build',
		required: true
	},
	Browser: {
		type: Types.Relationship,
		ref: 'Browser',
		required: true
	},
	url: {
		type: Types.Url
	},
	filename: {
		type: String
	}
});

Screenshot.register();
