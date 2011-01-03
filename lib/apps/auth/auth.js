(function() {

var drty = require('../../drty');

exports.App = Class({
	initialize: function(config) {
		var models = drty.models,
			fields = models.fields;

		var User = models.add('users', Object.merge({
			username: fields.string({maxLength: 64}),
			password: fields.string({maxLength: 32}),
			email: fields.string({maxLength: 128}),
			firstName: fields.string({maxLength: 64}),
			lastName: fields.string({maxLength: 64}),
			isAdmin: fields.boolean(),

			login: function(request) {
				request.session.userId = this.id;
			},

			logout: function(request) {
				if (request.session.userId == this.id) {
					delete request.session.userId;
				}
			}
		}, config.EXTEND_USER || {}));

		drty.middleware.add(new Class({
			handleRequest: function(request, response, next) {
				if ('userId' in request.session) {
					User.objects.filter({id: request.session.userId}).fetchOne(function(user) {
						if (user) {
							request.user = user;
						}
						next();
					})
				} else {
					next();
				}
			}
		}));

		exports.User = User;

		exports.createUser = function(username, password, email, firstName, lastName, callback) {
			User.objects.filter({username: username}).fetch(function(rows) {
				if (rows.length) {
					callback(null);
				} else {
					var user = new User({
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
			User.objects.filter({username: username}).fetchOne(function(user) {
				callback(user && user.password == require('hashlib').md5(password) ? user : null);
			});
		};

		exports.loginRequired = function(request, response, next, loginUrl) {
			if (!request.user) {
				response.redirect((loginUrl || config.LOGIN_URL) + '?' + require('querystring').stringify({next: request.url}))
			} else {
				next();
			}
		};

		exports.adminRequired = function(request, response, next, loginUrl) {
			if (!request.user || !request.user.isAdmin) {
				response.redirect((loginUrl || config.LOGIN_URL) + '?' + require('querystring').stringify({next: request.url}))
			} else {
				next();
			}
		};
	}
});

})();