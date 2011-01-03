(function() {

var path = require('path'),
	drty = require('../../drty');

exports.run = function(config) {
	exports.config = config;

	var baseUrl = config.BASE_URL || '/admin/',
		mediaUrl = config.MEDIA_URL || '/admin-media/';
			
	drty.urls
		.add('^' + baseUrl + '$', '__adminLogin')
		.add('^' + baseUrl + 'logout/$', '__adminLogout')
		.add('^' + baseUrl + 'home/$', '__adminHome')
		.add('^' + baseUrl + 'model/:model/$', '__adminModel')
		.add('^' + baseUrl + 'model/:model/add/$', '__adminAdd')
		.add('^' + baseUrl + 'model/:model/:id/$', '__adminChange')
		.add('^' + mediaUrl, '__adminStatic');

	var loginUrl = drty.urls.reverse('__adminLogin'),
		views = require('./views');
	drty.views
		.add('__adminLogin', views.adminLogin)

		.add('__adminLogout', drty.apps.auth.adminRequired, loginUrl)
		.add('__adminLogout', views.adminLogout)

		.add('__adminHome', drty.apps.auth.adminRequired, loginUrl)
		.add('__adminHome', views.adminHome)

		.add('__adminModel', drty.apps.auth.adminRequired, loginUrl)
		.add('__adminModel', views.adminModel)

		.add('__adminAdd', drty.apps.auth.adminRequired, loginUrl)
		.add('__adminAdd', views.adminChange)

		.add('__adminChange', drty.apps.auth.adminRequired, loginUrl)
		.add('__adminChange', views.adminChange)

		.add('__adminStatic', drty.views.staticView, path.join(__dirname, 'media/'));
}

})();