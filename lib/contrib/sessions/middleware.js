(function() {

var drty = require('drty');

exports.SessionMiddleware = drty.Class.extend({
	handleRequest: function(request, response, next) {
		var backend = drty.contrib.sessions.backends.db;
		
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
			backend.load(sessionId, onSessionLoaded);
		}
	},

	handleResponse: function(request, response, next) {
		if (request.sessionId && request.session) {
			var backend = drty.contrib.sessions.backends.db;
			backend.save(request.sessionId, request.session);
		}
		next();
	}	
});

})()