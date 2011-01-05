var drty = require('drty');

exports.settings = {
	DATABASE: {
		ENGINE: drty.models.db.MySQL,
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

	ROOT_URLCONF: require('./urls')
};