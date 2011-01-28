(function() {

var drty = require('drty');

exports.Request = require('./request').Request;
exports.Response = require('./response').Response;

function outputToConsole(request, response) {
	console.log(drty.utils.strftime(new Date(), '[%d/%b/%Y %H:%M:%S] "') + request.method + ' '
		+ require('url').parse(request.url).pathname + ' HTTP/' + request.httpRequest.httpVersion
		+ '" ' + response.statusCode + ' ' + response.body.length);
}

function route(request, response) {
	function runResponseMiddleware() {
		function writeResponse() {
			outputToConsole(request, response);

			response.httpResponse.writeHead(response.statusCode, response.headers);
			response.httpResponse.write(response.body);
			response.httpResponse.end();
		}

		response.setResponseCallback(writeResponse);
		drty.middleware.handleResponse(request, response, writeResponse);
	}

	response.setResponseCallback(runResponseMiddleware);
	drty.middleware.handleRequest(request, response, function() {
		if (!drty.urls.route(request, response)) {
			response.notFound();
		}
	});
}

exports.listen = function(port) {
	console.log('Development server is running at http://127.0.0.1:' + port + '/');
	console.log('Quit the server with CONTROL-C.');

	require('http').createServer(function(httpRequest, httpResponse) {
		var request = new exports.Request(httpRequest),
			response = new exports.Response(httpResponse);

		request.parse(function() {
			route(request, response)
		});
	}).listen(port);
}
	
})();