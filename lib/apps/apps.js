(function() {

exports.sessions = require('./sessions/sessions');
exports.auth = require('./auth/auth');
exports.logger = require('./logger/logger');
exports.facebook = require('./facebook/facebook');
exports.admin = require('./admin/admin');

exports.add = function(app, config) {
	app.run(config);

	return this;
}

})();