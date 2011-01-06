var urls = require('drty').urls;

exports.urlpatterns = urls.patterns(require('./blog/views'),
	urls.url('^/login/$', 'login'),
	urls.url('^/logout/$', 'logout'),
	urls.url('^/register/$', 'register'),
	urls.url('^/media/', '')
);