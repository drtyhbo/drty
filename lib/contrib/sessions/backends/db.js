(function() {

var drty = require('drty'),
	JSON = require('../../../nachojs/json2').JSON,
	Session = drty.contrib.sessions.models.Session;

export.load = function(sessionId, callback) {
	Session.objects.filter({sessionId: sessionId}).fetchOne(function(model) {
		var session = {};
		if (model) {
			session = JSON.parse(model.data);
		}
		callback(session);
	});
}
	
export.save = function(sessionId, session) {
	Session.objects.filter({sessionId: sessionId}).fetchOne(function(model) {
		if (!model) {
			model = new this.Session({
				sessionId: sessionId
			});
		}
		model.data = JSON.stringify(session);
		model.save();
	}.bind(this));
}

})();