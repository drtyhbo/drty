var drty = require('../lib/drty');

drty.config({
	models: {
		DB: drty.models.db.MySQL,
		HOST: 'localhost',
		USER: 'demo',
		PASS: 'demo',
		NAME: 'demo'
	},
	templates: {
		DIR: 'templates/'
	}
});

var apps = drty.apps;
apps
	.add(apps.sessions)
	.add(apps.auth)
	.add(apps.admin, {
			BASE_URL: '/admin/',
			MEDIA_URL: '/admin-media/'
		});

require('./models'),
require('./urls'),
require('./views');

drty.server.listen(8080);