(function() {

var drty = require('drty');

exports.createUser = function(username, password, email, firstName, lastName, callback) {
	exports.models.User.objects.filter({username: username}).fetch(function(error, rows) {
		if (rows.length) {
			callback(new Error("Username '" + username + "' has already been taken"), null);
		} else {
			var user = new exports.models.User({
				username: username,
				password: password ? require('hashlib').md5(password) : '',
				email: email || '',
				firstName: firstName || '',
				lastName: lastName || ''
			}).save(callback);
		}
	});
};

exports.authenticate = function(username, password, callback) {
	exports.models.User.objects.filter({username: username}).fetchOne(function(error, user) {
		if (error || !user || user.password != require('hashlib').md5(password)) {
			callback(error || new Error('Invalid username or password'));
		} else {
			callback(null, user);
		}
	});
};

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