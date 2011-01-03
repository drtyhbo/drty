(function() {

var drty = require('../../drty');

var LoggerMiddleware = Class({
	handleResponse: function(request, response, next) {
		console.log(request.httpRequest.socket.remoteAddress + ' ' + request.method + ' '
			+ request.url + ' ' + response.statusCode + ' ' + response.body.length);
		next();
	}	
});

exports.App = Class({
	initialize: function(config) {
		drty.middleware.add(new LoggerMiddleware());
	}
});

})();