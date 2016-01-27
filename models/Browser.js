var keystone = require('keystone');

/**
 * Browser Model
 * =============
 */

var Browser = new keystone.List('Browser', {
	nocreate: true,
	nodelete: true,
	noedit: true
});

Browser.add({
	name: {
		type: String
	},
	os: {
		type: String,
		required: true
	},
	osVersion: {
		type: String,
		required: true
	},
	browser: {
		type: String,
		required: true
	},
	browserVersion: {
		type: String
	},
	device: {
		type: String
	}
});

// prepare automatically a human-readable name
Browser.schema.pre('save', function(next) {
	if (this.device) {
		this.name = this.device;
	}
	else {
		this.name = '';
		if (this.browser) {
			this.name += this.browser;
		}
		if (this.browserVersion) {
			this.name += ' ' + this.browserVersion;
		}
		if (this.os && this.osVersion) {
			this.name += ' - ' + this.os + ' ' + this.osVersion;
		}
	}
	next();
});

// used to generate filenames based on browser's name
Browser.schema.virtual('filename').get(function() {
	return this.name
		.replace(/[^a-z0-9_\-]/gi, '_')
		.replace(/_+/, '_')
		.replace(/^_/, '')
		.toLowerCase();
});

// capabilities passed to BrowserStack Automate API
Browser.schema.virtual('capabilities').get(function() {
	if (this.device === null) {
		return {
			/* jshint ignore:start */
			browser: this.browser || null,
			browser_version: this.browserVersion || null,
			os: this.os || null,
			os_version: this.osVersion || null,
			resolution: '1280x1024',
			/* jshint ignore:end */
		};
	}
	var capabilities = {
		device: this.device
	};
	if (this.os === 'ios') {
		capabilities.platform = 'MAC';
		capabilities.browserName = this.device.match(/iphone/i) ? 'iPhone' : 'iPad';
	} else if (this.os === 'android') {
		capabilities.platform = 'ANDROID';
		capabilities.browserName = 'android';
	} else {
		// os winphone not available yet but still available in the API..?
		return null;
	}
	return capabilities;
});

Browser.relationship({
	ref: 'Spec',
	path: 'browsers'
});

Browser.defaultColumns = 'name';
Browser.searchFields = 'device, os, osVersion, browser, browserVersion';
Browser.register();
