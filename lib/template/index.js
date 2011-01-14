(function() {

var cache = {},
	djangode = require('../deps/djangode/template/template');

exports.load = function(filename, callback) {
	var drty = require('drty');

	if (filename in cache) {
		callback(cache[filename]);
	} else {
		drty.utils.eachChained(drty.conf.settings.TEMPLATE_DIRS, function(idx, templateDir, next) {
			var fullPath = filename.charAt(0) != '/'
				? require('path').join(templateDir, filename)
				: filename;

			require('fs').readFile(fullPath, 'ascii', function(err, s) {
				if (err) { next(); return; }

				var t = djangode.parse(s);
				cache[filename] = t;

				callback(t);
			});
		}, function() {
			callback(null);
		});
	}
}

exports.loadAndRender = function(filename, context, callback) {
	var drty = require('drty');
	
	exports.load(filename, function(t) {
		if (!t) { throw Error("Error: loadAndRender(): Unable to load template file '" + filename + "'"); }

		t.render(context, callback);
	});
}

exports.render = function(s, context, callback) {
	var t = djangode.parse(s);
	t.render(context, callback);
}

})();