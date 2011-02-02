(function() {

var models = require('drty').db.models;

var User = exports.User = models.Model.extend({
	tableName: 'auth_users',

	username: new models.CharField({maxLength: 64}),
	password: new models.CharField({maxLength: 32}),
	email: new models.CharField({maxLength: 128, null: true}),
	firstName: new models.CharField({maxLength: 64, null: true}),
	lastName: new models.CharField({maxLength: 64, null: true}),
	isAdmin: new models.BooleanField(),

	toString: function() {
		return 'User ' + this.username;
	},

	login: function(request) {
		var drty = require('drty');
		
		if (!drty.conf.isMiddlewareInstalled(drty.contrib.auth.middleware.AuthMiddleware)) {
			console.log('WARNING: User.login() called but AuthMiddleware is not installed.');
		}

		request.session.userId = this.id;
	},

	logout: function(request) {
		if (request.session.userId == this.id) {
			delete request.session.userId;
		}
	},
	
	static: {
		create: function(username, password, email, firstName, lastName, callback) {
			var User = this;
			User.objects.filter({username: username}).fetch(function(error, rows) {
				if (rows.length) {
					callback(new Error("Username '" + username + "' has already been taken"), null);
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
		},
		authenticate: function(username, password, callback) {
			this.objects.filter({username: username}).fetchOne(function(error, user) {
				if (error || !user || user.password != require('hashlib').md5(password)) {
					callback(error || new Error('Invalid username or password'));
				} else {
					callback(null, user);
				}
			});
		}
	}
});

})();