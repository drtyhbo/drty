var drty = require('../lib/drty');

drty.config({
	models: {
		DB: drty.models.db.MySQL,
		HOST: 'localhost',
		USER: 'demo',
		PASS: 'demo',
		NAME: 'demo'
	},
	template: {
		DIR: 'templates'
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

drty.urls
	.add('^/$', 'root')
	.add('^/login/$', 'login')
	.add('^/register/$', 'register')
	.add('^/logout/$', 'logout')
	.add('^/blog/:username/$', 'home')
	.add('^/post/$', 'post')
	.add('^/media/', 'media');

var views = require('./views');
drty.views
		.add('root', views.root)
		.add('login', views.login)
		.add('register', views.register)

// Set up static media serving
drty.views.add('media', drty.views.staticView,
	require('path').join(__dirname, 'media/'));
drty.template.defaultContext('MEDIA_URL', drty.urls.reverse('media'));


drty.go();