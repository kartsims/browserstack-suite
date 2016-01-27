module.exports = {
	js: {
		files: [
			'model/**/*.js',
			'routes/**/*.js'
		],
		tasks: ['jshint:all']
	},
	express: {
		files: [
			'keystone.js',
		],
		tasks: ['jshint:server', 'concurrent:dev']
	},
	sass: {
		files: ['public/styles/**/*.scss'],
		tasks: ['sass']
	},
	livereload: {
		files: [
			'public/styles/**/*.css',
		],
		options: {
			livereload: true
		}
	}
};
