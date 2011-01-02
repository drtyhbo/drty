(function() {

var dirty = require('../dirty'),
	Request = require('./Request').Request,
	Response = require('./Response').Response;

exports.Server = Class({
	initialize: function() {
		this.Request = Request;
		this.Response = Response;
	},

	listen: function(port) {
		console.log('Running server on http://127.0.0.0:' + port);
		require('http').createServer(function(httpRequest, httpResponse) {
			var request = new Request(httpRequest),
				response = new Response(httpResponse);

			request.parse(this.route.bind(this, request, response));
		}.bind(this)).listen(port);
	},
	
	route: function(request, response) {
		function runResponseMiddleware() {
			function writeResponse() {
				response.httpResponse.writeHead(response.statusCode, response.headers);
				response.httpResponse.write(response.body);
				response.httpResponse.end();
			}

			response.setResponseCallback(writeResponse);
			dirty.middleware.handleResponse(request, response, writeResponse);
		}

		response.setResponseCallback(runResponseMiddleware);
		dirty.middleware.handleRequest(request, response, function() {
			dirty.urls.route(request, response);
		});
	}
});

})();