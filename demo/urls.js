var drty = require('drty'),
	urls = drty.urls;

exports.urlpatterns = urls.patterns(require('./blog/views'),
	urls.url('^/login/$', 'login', 'login'),
	urls.url('^/logout/$', 'logout', 'logout'),
	urls.url('^/register/$', 'register', 'register'),
	urls.url('^/home/$', 'home', 'home'),
	urls.url('^/blog/(?P<blogId>[^/]*)/$', 'blog', 'blog')
);

exports.urlpatterns.concat(urls.patterns(
	urls.url('^/about/$', drty.views.directToTemplate, 'about', ['about.tpl']),
	urls.url('^/media/(?P<path>.*)$', drty.views.static, 'media', [
		require('path').join(__dirname, 'media')
	])
));