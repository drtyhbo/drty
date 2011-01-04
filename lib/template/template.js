(function() {

var cache = {},
	config = {},
	defaultContext = {};
	
exports.defaultContext = function(key, value) {
	defaultContext[key] = value;
}

function renderTemplate(t, context, callback) {
	context = require('../drty').utils.merge(context || {}, defaultContext);
	t.render(context, callback);
}

exports.loadAndRender = function(filename, context, callback) {
	var config = require('../drty').config().template;
	if (!config || !config.DIR) {
		throw 'Configuration error. To use templates, you must specify the following parameters:\n\
			template: {\n\
				DIR: "base directory for templates"\n\
			}';
	}

	if (filename.charAt(0) != '/' && config.DIR) {
		filename = require('path').join(config.DIR, filename);
	}

	if (filename in cache) {
		renderTemplate(cache[filename], context, callback);
	} else {
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