var drty = require('drty'),
	patterns = drty.urls.patterns,
	url = drty.urls.url;

exports.urlpatterns = patterns(
	//url('^/admin/', drty.contrib.admin.urls.urlpatterns),
	url('^/$', 'hello_world', drty.views.generic.simple.helloWorld)
);