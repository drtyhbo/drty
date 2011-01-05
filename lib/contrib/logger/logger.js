(function() {

var drty = require('drty');

var LoggerMiddleware = drty.Class.extend({
	handleResponse: function(request, response, next) {
		console.log(request.httpRequest.socket.remoteAddress + ' ' + request.method + ' '
			+ request.url + ' ' + response.statusCode + ' ' + response.body.length);
		next();
	}	
});

exports.run = function(config) {
	drty.middleware.add(new LoggerMiddleware());
}

})();