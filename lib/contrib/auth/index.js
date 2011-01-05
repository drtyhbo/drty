(function() {

var drty = require('drty');

exports.createUser = function(username, password, email, firstName, lastName, callback) {
	if (!user) {
		throw "You must call drty.apps.add(drty.apps.auth) before calling createUser";
	}

	exports.models.User.objects.filter({username: username}).fetch(function(rows) {
		if (rows.length) {
			callback(null);
		} else {
			var user = new exports.User({
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
	if (!user) {
		throw "You must call drty.apps.add(drty.apps.auth) before calling authenticate";
	}
	exports.models.User.objects.filter({username: username}).fetchOne(function(user) {
		callback(user && user.password == require('hashlib').md5(password) ? user : null);
	});
};

exports.loginRequired = function(request, response, next, loginUrl) {
	if (!request.user) {
		response.redirect((loginUrl || config.LOGIN_URL)
			+ '?' + require('querystring').stringify({next: request.url}))
	} else {
		next();
	}
};

exports.adminRequired = function(request, response, next, loginUrl) {
	if (!request.user || !request.user.isAdmin) {
		response.redirect((loginUrl || config.LOGIN_URL)
			+ '?' + require('querystring').stringify({next: request.url}))
	} else {
		next();
	}
};

exports.middleware = require('./middleware');
exports.models = require('./models');

})();