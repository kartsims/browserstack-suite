var chalk = require('chalk'),
	async = require('async'),
	program = require('commander'),
	mongoose = require('mongoose'),
	Build = require('../lib/Build');


// Get information about an app from the CLI
function infoAction(uniqueid) {
	var app = require('../lib/App')(uniqueid);

	async.series([
		app.initConfig,
		app.loadBrowsers,
		app.loadInstances,
	], function(err) {
		if (err) {
			console.log(chalk.red(err));
		} else {
			console.log('\n');
			console.log(chalk.bgYellow('  ' + app.config.name + ' '));
			console.log('\n');

			console.log(chalk.yellow('\n' + app.config.instances.length + ' instances\n'));
			app.config.instances.forEach(function(instance) {
				console.log('  ' + instance.name + ' : ' + chalk.blue(instance.baseurl));
			});

			console.log(chalk.yellow('\n' + app.config.uris.length + ' URIs'));
			console.log('\n  ' + app.config.uris.join('\n  '));

			console.log(chalk.yellow('\n' + app.config.browsers.length + ' browsers (' + app.config.spec.name + ')\n'));
			app.config.browsers.forEach(function(browser) {
				console.log('  ' + browser.name);
			});
			console.log('\n');
		}
		mongoose.disconnect();
	});

}

function programAction(uniqueid, instanceUniqueid) {
	var app = require('../lib/App')(uniqueid);

	async.series([
		app.initConfig,
		app.loadBrowsers,
		app.loadInstances,
		function(cb) {

			// check if specified app instance exists
			var appInstance = app.config.instances.find(function(instance) {
				return instance.key.toLowerCase() === instanceUniqueid.toLowerCase();
			});
			if (appInstance === undefined) {
				return cb('App instance ' + instanceUniqueid + ' not found !');
			}

			// prepare the build object
			var build = new Build(app, appInstance);
			console.log(chalk.yellow('\nPreparing build \'' + build.name + '\''));
			console.log('Go to https://www.browserstack.com/automate to see it live');

			// prepare the list of URLs
			var urls = app.config.uris.map(function(uri) {
				return appInstance.baseurl + uri;
			});

			// prepare sessions for this build
			app.config.browsers.forEach(function(browser) {
				build.addSession(browser, urls);
			});
			console.log(chalk.yellow(app.config.browsers.length + ' sessions created'));

			// we are ready now let's go !
			async.series([
				build.init,
				build.start,
				build.save,
			], cb);
		}
	], function(err) {
		if (err) {
			console.log(chalk.red(err));
		}
		mongoose.disconnect();
	});

}


// Commander commands
program
	.command('capture <uniqueid> <instance>')
	.action(programAction);
program
	.command('info <uniqueid>')
	.action(infoAction);
program
	.parse(process.argv);
