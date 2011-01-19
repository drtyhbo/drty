(function() {

var drty = require('drty'),
	patterns = drty.urls.patterns,
	url = drty.urls.url,
	views = require('./views');

exports.urlpatterns = patterns(
	url('$', '__adminLogin', views.adminLogin),
	url('logout/$', '__adminLogout', views.adminLogout),
	url('home/$', '__adminHome', views.adminHome),
	url('model/:model/$', '__adminModel', views.adminModel),
	url('model/:model/add/$', '__adminAdd', views.adminChange),
	url('model/:model/:id/$', '__adminChange', views.adminChange),
	url('media/(?P<path>.+)$', '__adminMedia', drty.views.static.serve, 
		require('path').join(__dirname, 'media'))
);

})();