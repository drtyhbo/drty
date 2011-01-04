(function() {

var cache = {},
	config = {},
	defaultContext = {};
	
exports.defaultContext = function(key, value) {
	defaultContext[key] = value;
}

function loadTemplate(filename, callback) {
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

	if (config.CACHE && filename in cache) {
		callback(null, cache[filename]);
	} else {
		require('fs').readFile(filename, 'ascii', function(err, data) {
			if (!err && config.CACHE) {
				cache[filename] = data;
			}
			callback(err, data);
		});
	}
}

exports.render = function(filename, dataDict, callback) {
	dataDict = require('../drty').utils.merge(dataDict || {}, defaultContext);

	loadTemplate(filename, function(err, data) {
		if (err) throw err;

		var Template = require('../nachojs/json-template').Template,
			t = Template(data);
		callback(t.expand(dataDict));
	});
}

})();