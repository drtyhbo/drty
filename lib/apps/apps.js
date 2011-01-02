(function() {

exports.AppManager = Class({
	sessions: require('./sessions/sessions'),
	auth: require('./auth/auth'),
	logger: require('./logger/logger'),
	facebook: require('./facebook/facebook'),
	admin: require('./admin/admin'),

	add: function(app, config) {
		new app.App(config || {});
		return this;
	}
});

})();