(function() {

var drty = require('drty');

exports.AuthenticationMiddleware = drty.Class.extend({
	handleRequest: function(request, response, next) {
		if ('userId' in request.session) {
			drty.contrib.auth.models.User.objects.filter({id: request.session.userId}).fetchOne(function(user) {
				if (user) {
					request.user = user;
				}
				next();
			})
		} else {
			next();
		}
	}
});

})();