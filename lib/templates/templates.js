(function() {

var dirty = require('../dirty');

exports.TemplateManager = Class({
	initialize: function() {
		this.cache = {};
		this._defaultContext = {};
	},
	
	config: function(config) {
		this._config = config;
	},

	defaultContext: function(key, value) {
		this._defaultContext[key] = value;
	},

	render: function(filename, dataDict, callback) {
		dataDict = Object.merge(dataDict || {}, this._defaultContext);
		this.loadTemplate(filename, function(err, data) {
			if (err) throw err;

			var Template = require('../nachojs/json-template').Template,
				t = Template(data);
			callback(t.expand(dataDict));
		});
	},
	
	loadTemplate: function(filename, callback) {
		if (filename.charAt(0) != '/' && this._config.DIR) {
			filename = require('path').join(this._config.DIR, filename);
		}

		if (this._config.CACHE && filename in this.cache) {
			callback(null, this.cache[filename]);
		} else {
			require('fs').readFile(filename, 'ascii', function(err, data) {
				if (!err && this._config.CACHE) {
					this.cache[filename] = data;
				}
				callback(err, data);
			}.bind(this));
		}
	}
});

})();