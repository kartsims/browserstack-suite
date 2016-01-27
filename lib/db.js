// mongoDB connection
var mongoDbString = 'mongodb://';
if (process.env.DB_USER.length > 0) {
	mongoDbString += process.env.DB_USER + ':' + process.env.DB_PASSWORD + '@';
}
mongoDbString += process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_NAME;

// Mongoose connection
var mongoose = require('mongoose');
var connection = mongoose.createConnection(mongoDbString);
connection.on('error', function(err) {
	console.log('Error with Mongo DB connection');
	throw err;
});

module.exports = {
	connection: connection,
	mongoDbString: mongoDbString
};
