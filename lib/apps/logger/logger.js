(function() {

var dirty = require('../../dirty');

var LoggerMiddleware = Class({
	handleResponse: function(request, response, next) {
		console.log(request.httpRequest.socket.remoteAddress + ' ' + request.method + ' '
			+ request.url + ' ' + response.statusCode + ' ' + response.body.length);
		next();
	}	
});

exports.App = Class({
	initialize: function(config) {
		dirty.middleware.add(LoggerMiddleware);
	}
});

})();