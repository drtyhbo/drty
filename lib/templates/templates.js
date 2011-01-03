(function() {

var cache = {},
	_config = {},
	_defaultContext = {};
	
exports.config = function(config) {
	_config = config;
}

exports.defaultContext = function(key, value) {
	_defaultContext[key] = value;
}

function loadTemplate(filename, callback) {
	if (filename.charAt(0) != '/' && _config.DIR) {
		filename = require('path').join(_config.DIR, filename);
	}

	if (_config.CACHE && filename in cache) {
		callback(null, cache[filename]);
	} else {
		require('fs').readFile(filename, 'ascii', function(err, data) {
			if (!err && _config.CACHE) {
				cache[filename] = data;
			}
			callback(err, data);
		});
	}
}

exports.render = function(filename, dataDict, callback) {
	dataDict = Object.merge(dataDict || {}, _defaultContext);
	loadTemplate(filename, function(err, data) {
		if (err) throw err;

		var Template = require('../nachojs/json-template').Template,
			t = Template(data);
		callback(t.expand(dataDict));
	});
}

})();