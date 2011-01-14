var drty = require('drty'),
	urls = drty.urls,
	views = require('./blog/views');

exports.urlpatterns = urls.patterns(
	/* Matches /login/. Renders the login page. */
	urls.url('^/login/$', views.login, 'login'),
	/* Matches /logout/. Renders the logout page. */
	urls.url('^/logout/$', views.logout, 'logout'),
	/* Matches /register/. Renders the register page. */
	urls.url('^/register/$', views.register, 'register'),
	/* Matches /home/. Renders the home page. */
	urls.url('^/home/$', views.home, 'home'),
	/* Matches /blog/* /. Renders the blog page.
	   Adds the ... part to the request.params object as blogId. */
	urls.url('^/blog/(?P<blogId>[^/]*)/$', views.blog, 'blog'),
	/* Matches /media/*. Serves a static file.
	   Adds the * part to the request.params object as path.
	   Passes the path to the media directory as an extra parameter to the view. */
	urls.url('^/media/(?P<path>.*)$', drty.views.static.serve, 'media', [
		require('path').join(__dirname, 'media')
	])
);