(function() {

var drty = require('drty'),
	md5 = require('../../deps/md5/md5').md5;

exports.SessionMiddleware = drty.Class.extend({
	initialize: function() {
		this.backend = drty.conf.settings.SESSION_ENGINE;
		if (!this.backend) {
			throw new Error('Configuration error. You must specify the following settings to use sessions:\n\
		    	SESSION_ENGINE: [drty.conf.sessions.backends.cache | drty.conf.sessions.backends.db]');
		}

		if (!drty.conf.isAppInstalled(drty.contrib.sessions)) {
			console.log('WARNING: SessionMiddleware used without drty.contrib.sessions in the INSTALLED_APPS list.\n');
		}
	},

	handleRequest: function(request, response, next) {
		var backend = drty.conf.settings.SESSION_ENGINE;

		function onSessionLoaded(session) {
			request.sessionId = sessionId;
			request.session = session || {};
			next();
		}

		var sessionId = request.cookies.sessionid;
		if (!sessionId) {
			sessionId = md5(String(request.httpRequest.socket.remoteAddress)
				+ String(new Date().getTime()));
			response.setCookie('sessionid', sessionId);
			onSessionLoaded();
		} else {
			backend.load(sessionId, onSessionLoaded);
		}
	},

	handleResponse: function(request, response, next) {
		if (request.sessionId && request.session) {
			var backend = drty.conf.settings.SESSION_ENGINE;
			backend.save(request.sessionId, request.session);
		}
		next();
	}	
});

})()