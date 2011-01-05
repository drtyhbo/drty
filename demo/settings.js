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

	ROOT_URLCONF: require('./urls')
};