var drty = require('drty');

exports.settings = {
	DATABASE: {
		ENGINE: drty.db.backends.MySQL,
		NAME: 'demo',
		USER: 'demo',
		PASSWORD: 'demo',
		HOST: '',
		PORT: ''
	},
	TEMPLATE_DIRS: [
		// ENTER TEMPLATE DIRECTORIES HERE
	],
	INSTALLED_APPS: [
		drty.contrib.sessions,
		drty.contrib.auth,
		require('./blog')
	],
	MIDDLEWARE_CLASSES: [
		drty.contrib.sessions.middleware.SessionMiddleware
	],

	ROOT_URLCONF: require('./urls')
};