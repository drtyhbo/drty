(function() {

var drty = require('../../drty');

var SessionMiddleware = Class({
	initialize: function(sessionStore) {
		this.sessionStore = new (require('./store/db').SessionStore)();
	},

	handleRequest: function(request, response, next) {
		function onSessionLoaded(session) {
			request.sessionId = sessionId;
			request.session = session || {};
			next();
		}

		var sessionId = request.cookies.sessionid;
		if (!sessionId) {
			sessionId = require('hashlib').md5(String(request.httpRequest.socket.remoteAddress)
				+ String(new Date().getTime()));
			response.setCookie('sessionid', sessionId);
			onSessionLoaded();
		} else {
			this.sessionStore.load(sessionId, onSessionLoaded);
		}
	},

	handleResponse: function(request, response, next) {
		if (request.sessionId && request.session) {
			this.sessionStore.save(request.sessionId, request.session);
		}
		next();
	}	
});

exports.App = Class({
	initialize: function(config) {
		drty.middleware.add(SessionMiddleware, {
			SESSION_STORE: config.SESSION_STORE || 'db'
		});
	}
});

})();