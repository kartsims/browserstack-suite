module.exports = require('browserstack').createAutomateClient({
	username: process.env.BS_EMAIL,
	password: process.env.BS_PASSWORD
});
