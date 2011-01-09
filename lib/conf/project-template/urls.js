var drty = require('drty'),
	urls = drty.urls;

exports.urlpatterns = urls.patterns(
	urls.url('^/$', drty.views.generic.simple.helloWorld)
);