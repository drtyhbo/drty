(function() {

var drty = require('drty');

exports.loginRequired = function(request, response, next) {
	var settings = drty.conf.settings;
	if (!settings.LOGIN_URL) {
		throw new drty.conf.ConfigurationError('Configuration Error: LOGIN_URL required to use loginRequired().')
	}

	if (!request.user) {
		response.redirect(settings.LOGIN_URL
			+ '?' + require('querystring').stringify({next: request.url}))
	} else {
		next();
	}
};

exports.adminRequired = function(request, response, next) {
	if (!request.user || !request.user.isAdmin) {
		response.redirect(drty.conf.settings.LOGIN_URL
			+ '?' + require('querystring').stringify({next: request.url}))
	} else {
		next();
	}
};

exports.middleware = require('./middleware');
exports.models = require('./models');

})();