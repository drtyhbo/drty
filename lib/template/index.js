(function() {

var cache = {},
	djangode = require('../deps/djangode/template/template');

exports.load = function(filename, cb) {
	var drty = require('drty');

	if (filename in cache) {
		cb(cache[filename]);
	} else {
		function loadTemplate(filename, cb) {
			require('fs').readFile(filename, 'ascii', function(err, s) {
				if (err) { cb(null); return; }

				var t = djangode.parse(s);
				cache[filename] = t;

				cb(t);
			});			
		}

		if (filename.charAt(0) == '/') {
			loadTemplate(filename, cb);
		} else {
			drty.utils.eachChained(drty.conf.settings.TEMPLATE_DIRS, function(idx, templateDir, next) {
				loadTemplate(require('path').join(templateDir, filename), function(t) {
					if (!t) {
						next();
					} else {
						cb(t);
					}
				});
			}, function() {
				cb(null);
			});
		}
	}
}

exports.loadAndRender = function(filename, context, callback) {
	var drty = require('drty');
	
	exports.load(filename, function(t) {
		if (!t) { throw Error("Error: Unable to load template file '" + filename + "'"); }

		t.render(context, callback);
	});
}

exports.render = function(s, context, callback) {
	var t = djangode.parse(s);
	t.render(context, callback);
}

})();