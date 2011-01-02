(function() {

exports.SessionStore = Class({
	initialize: function() {
		this.sessions = {};
	},
	
	load: function(sessionId, callback) {
		callback(Object.clone(this.sessions[sessionId] || {}));
	},
	
	save: function(sessionId, session) {
		this.sessions[sessionId] = Object.clone(session);
	}
});

})();