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
	var filename = documentRoot,
		path = request.params.path;
	
	if (path) {
		if (path.indexOf('..') != -1) {
			response.notFound();
			return;
		}

		filename = require('path').join(filename, path);
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