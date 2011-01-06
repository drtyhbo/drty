(function() {

var drty = require('drty');

exports.Request = require('./Request').Request;
exports.Response = require('./Response').Response;

function route(request, response) {
	function runResponseMiddleware() {
		function writeResponse() {
			response.httpResponse.writeHead(response.statusCode, response.headers);
			response.httpResponse.write(response.body);
			response.httpResponse.end();
		}

		response.setResponseCallback(writeResponse);
		drty.middleware.handleResponse(request, response, writeResponse);
	}

	response.setResponseCallback(runResponseMiddleware);
	drty.middleware.handleRequest(request, response, function() {
		if (!drty.urls.getPatterns().route(request, response)) {
			response.notFound();
		}
	});
}

exports.listen = function(port) {
	console.log('Running server on http://127.0.0.0:' + port);
	require('http').createServer(function(httpRequest, httpResponse) {
		var request = new exports.Request(httpRequest),
			response = new exports.Response(httpResponse);

		request.parse(function() {
			route(request, response)
		});
	}).listen(port);
}
	
})();