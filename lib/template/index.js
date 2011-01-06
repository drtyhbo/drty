(function() {

var cache = {},
	djangode = require('../nachojs/djangode/template/template');

function renderTemplate(t, context, callback) {
	t.render(context, callback, function(filename, context, callback) {
		exports.loadAndRender(filename, context, callback);
	});
}

exports.loadAndRender = function(filename, context, callback) {
	var drty = require('drty');

	drty.utils.eachChained(drty.conf.settings.TEMPLATE_DIRS, function(idx, templateDir, next) {
		if (filename.charAt(0) != '/') {
			filename = require('path').join(templateDir, filename);
		}

		if (filename in cache) {
			renderTemplate(cache[filename], context, callback);
		} else {
			require('fs').readFile(filename, 'ascii', function(err, s) {
				if (err) { next(); return; }

				var t = djangode.parse(s);
				cache[filename] = t;

				renderTemplate(t, context, callback);
			});
		}
	});
}

exports.render = function(s, context, callback) {
	var t = djangode.parse(s);
	renderTemplate(t, context, callback);
}

})();