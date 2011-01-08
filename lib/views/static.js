(function() {

var contentTypes = {
	'.css': 'text/css',
	'.gif': 'image/gif',
	'.htm': 'text/html',
	'.html': 'text/html',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.json': 'application/json',
	'.png': 'image/png'
};

exports.serve = function(request, response, documentRoot) {
	if (request.params.path.indexOf('..') != -1) {
		response.notFound();
		return;
	}

	if (request.params.path) {
		filename = require('path').join(documentRoot, request.params.path);
	}

	require('fs').readFile(filename, function(err, data) {
		if (err) {
			response.notFound();
		} else {
			var ext = require('path').extname(filename);
			response.setHeader('Content-Type', contentTypes[ext] || 'text/plain');
			response.ok(data);
		}
	});
}

})();