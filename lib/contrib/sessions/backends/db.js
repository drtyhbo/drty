(function() {

var drty = require('drty');

exports.load = function(sessionId, callback) {
	var Session = drty.contrib.sessions.models.Session;
	Session.objects.filter({sessionId: sessionId}).fetchOne(function(error, model) {
		if (error) { throw error; }
		callback(model && model.data || {});
	});
}
	
exports.save = function(sessionId, session) {
	var Session = drty.contrib.sessions.models.Session;
	Session.objects.filter({sessionId: sessionId}).fetchOne(function(error, model) {
		if (error) { throw error; }

		if (!model) {
			model = new Session({
				sessionId: sessionId
			});
		}
		model.data = session;
		model.save();
	}.bind(this));
}

})();