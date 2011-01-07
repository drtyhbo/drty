(function() {

var contentTypes = {
	'.json': 'application/json',
	'.htm': 'text/html',
	'.html': 'text/html',
	'.gif': 'image/gif',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.png': 'image/png'
};

exports.serve = function(request, response, documentRoot) {
	if (request.params.path) {
		filename = require('path').join(documentRoot, request.params.path);
	}

	if (filename.indexOf('..') != -1) { response.notFound(); }

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