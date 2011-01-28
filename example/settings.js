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
		drty.contrib.admin,
		require('./blog')
	],
	MIDDLEWARE_CLASSES: [
		drty.contrib.sessions.middleware.SessionMiddleware,
		drty.contrib.auth.middleware.AuthenticationMiddleware
	],
	TEMPLATE_CONTEXT_PROCESSORS: [
		require('./index').contextProcessor
	],
	
	LOGIN_URL: '/login/',

	ROOT_URLCONF: require('./urls').urlpatterns
};