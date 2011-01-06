var drty = require('drty'),
	urls = drty.urls;

exports.urlpatterns = urls.patterns(require('./blog/views'),
	urls.url('^/login/$', 'login', 'login'),
	urls.url('^/logout/$', 'logout', 'logout'),
	urls.url('^/register/$', 'register', 'register')
);

exports.urlpatterns.concat(urls.patterns(drty.views,
	urls.url('^/about/$', 'directToTemplate', 'about', ['about.tpl']),
	urls.url('^/media/(?P<path>.*)$', 'static', 'media', [
		require('path').join(__dirname, 'media')
	])
));