var urls = require('drty').urls;

exports.urlpatterns = urls.patterns(require('./blog/views'),
	urls.url('^/login/$', 'loginView'),
	urls.url('^/logout/$', 'logoutView')
);