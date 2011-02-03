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
		//require('path').join(__dirname, 'templates')
	],
	INSTALLED_APPS: [
		//drty.contrib.sessions,
		//drty.contrib.auth,
		//drty.contrib.admin
	],
	MIDDLEWARE_CLASSES: [
		//drty.contrib.sessions.middleware.SessionMiddleware,
		//drty.contrib.auth.middleware.AuthMiddleware
	],

	ROOT_URLCONF: require('./urls').urlpatterns
};