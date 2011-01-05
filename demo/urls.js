var urls = require('drty').urls;

exports.urlpatterns = urls.patterns('',
	urls.url('^/blog/', require('./blog/urls'))
);