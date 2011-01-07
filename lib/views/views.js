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

exports.render = function(view, request, response, params) {
	var list = view instanceof Array ? view.slice() : [view];

	(function run() {
		var view = list.shift(),
			args = [request, response];
		args.push(list.length ? run : params);
		view.apply(view, args);
	})();
}

// ----------------------------------------
// Default Views
// ----------------------------------------

exports.static = function(request, response, documentRoot) {
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

exports.directToTemplate = function(request, response, filename, context) {
	var drty = require('drty');

	context = context || {};

	var processors = drty.conf.settings.TEMPLATE_CONTEXT_PROCESSORS || [];
	for (var i = 0, processor; (processor = processors[i]); i++) {
		context = drty.utils.merge(context, processor(request));
	}
	
	drty.template.loadAndRender(filename, context, function(s) {
		response.ok(s);
	});
}

})();