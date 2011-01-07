var drty = require('drty'),
	urls = drty.urls,
	views = require('./blog/views');

exports.urlpatterns = urls.patterns(
	urls.url('^/login/$', views.login, 'login'),
	urls.url('^/logout/$', views.logout, 'logout'),
	urls.url('^/register/$', views.register, 'register'),
	urls.url('^/home/$', views.home, 'home'),
	urls.url('^/blog/(?P<blogId>[^/]*)/$', views.blog, 'blog'),
	urls.url('^/media/(?P<path>.*)$', drty.views.static.serve, 'media', [
		require('path').join(__dirname, 'media')
	])
);