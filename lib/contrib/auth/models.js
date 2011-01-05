(function() {

var models = require('drty').db.models;

var User = exports.User = models.Model.extend({
	tableName: 'auth_users',

	username: new models.CharField({maxLength: 64}),
	password: new models.CharField({maxLength: 32}),
	email: new models.CharField({maxLength: 128}),
	firstName: new models.CharField({maxLength: 64}),
	lastName: new models.CharField({maxLength: 64}),
	isAdmin: new models.BooleanField(),

	login: function(request) {
		request.session.userId = this.id;
	},

	logout: function(request) {
		if (request.session.userId == this.id) {
			delete request.session.userId;
		}
	}
});

})();