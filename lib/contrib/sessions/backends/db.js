(function() {

var drty = require('drty'),
	JSON = require('../../../../deps/json2').JSON;

exports.load = function(sessionId, callback) {
	var Session = drty.contrib.sessions.models.Session;
	Session.objects.filter({sessionId: sessionId}).fetchOne(function(error, model) {
		if (error) { throw error; }

		var session = {};
		if (model) {
			session = JSON.parse(model.data);
		}
		callback(session);
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
		model.data = JSON.stringify(session);
		model.save();
	}.bind(this));
}

})();