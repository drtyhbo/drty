(function() {

var cache = {};

function renderTemplate(t, context, callback) {
	t.render(context, callback, function(filename, context, callback) {
		exports.loadAndRender(filename, context, callback);
	});
}

exports.loadAndRender = function(filename, context, callback) {
	if (filename in cache) {
		renderTemplate(cache[filename], context, callback);
	} else {
		var config = require('../drty').config().template;
		if (!config || !config.DIR) {
			throw 'Configuration error. To use templates, you must specify the following parameters:\n\
				template: {\n\
					DIR: "base directory for templates"\n\
					[CACHE: true|false] default false\n\
				}';
		}

		if (filename.charAt(0) != '/' && config.DIR) {
			filename = require('path').join(config.DIR, filename);
		}

		require('fs').readFile(filename, 'ascii', function(err, s) {
			if (err) { throw err; }

			var t = require('../nachojs/djangode/template/template').parse(s);
			if (config.CACHE) {
				cache[filename] = t;
			}
			renderTemplate(t, context, callback);
		});
	}
}

exports.render = function(s, context, callback) {
	var t = require('../nachojs/djangode/template/template').parse(s);
	renderTemplate(t, context, callback);
}

})();