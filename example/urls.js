var drty = require('drty'),
	patterns = drty.urls.patterns,
	url = drty.urls.url,
	views = require('./blog/views');

exports.urlpatterns = patterns(
	url('^/admin/', drty.contrib.admin.urls.urlpatterns),
	url('^/login/$', 'login', views.login),
	url('^/logout/$', 'logout', views.logout),
	url('^/register/$', 'register', views.register),
	url('^/home/$', 'home', views.home),
	url('^/blog/:blogId/$', 'blog', views.blog),
	url('^/media/(?P<path>.+)$', drty.views.static.serve, 
		require('path').join(__dirname, 'media'))
);