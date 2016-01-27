module.exports = {
	options: {
		reporter: require('jshint-stylish'),
		jshintrc: true,
		force: true
	},
	all: [ 'routes/**/*.js',
				 'bin/**/*.js',
				 'lib/**/*.js',
				 'models/**/*.js',
				 'updates/*.js'
	],
	server: [
		'./keystone.js'
	]
};
