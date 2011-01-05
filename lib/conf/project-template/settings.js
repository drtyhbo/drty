var drty = require('drty');

exports.settings = {
	DATABASE: {
		ENGINE: drty.db.backends.MySQL,
		NAME: 'DATABASE NAME',
		USER: 'USERNAME',
		PASSWORD: 'PASSWORD',
		HOST: '',
		PORT: ''
	},
	TEMPLATE_DIRS: [
		// ENTER TEMPLATE DIRECTORIES HERE
	],
	INSTALLED_APPS: [
		drty.apps.sessions
	],
	MIDDLEWARE_CLASSES: [
		drty.contrib.sessions.middleware.SessionMiddleware
	],

	ROOT_URLCONF: require('./urls')
};