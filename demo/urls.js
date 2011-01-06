var drty = require('drty'),
	urls = drty.urls;

exports.urlpatterns = urls.patterns(require('./blog/views'),
	urls.url('^/login/$', 'login'),
	urls.url('^/logout/$', 'logout'),
	urls.url('^/register/$', 'register')
);

exports.urlpatterns.concat(urls.patterns(drty.views,
	urls.url('^/media/(?P<path>.*)$', 'static', {
		documentRoot: require('path').join(__dirname, 'media')
	})
));