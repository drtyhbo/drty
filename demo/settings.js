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
		'templates'
	],
	INSTALLED_APPS: [
		drty.contrib.sessions,
		drty.contrib.auth,
		require('./blog')
	],
	MIDDLEWARE_CLASSES: [
		drty.contrib.sessions.middleware.SessionMiddleware
	],
	TEMPLATE_CONTEXT_PROCESSORS: [
		require('./index').contextProcessor
	],

	ROOT_URLCONF: require('./urls')
};