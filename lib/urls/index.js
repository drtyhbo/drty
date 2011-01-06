(function() {

var drty = require('drty');

var Patterns = drty.Class.extend({
	initialize: function(view, urls) {
		this.urls = [];

		for (var i = 0, url; (url = urls[i]); i++) {
			if (!(url instanceof Patterns)) {
				url.setView(view);
			}
			this.urls = this.urls.concat(url instanceof Patterns ? url.urls : [url]);
		}		
	},
	
	addPrefix: function(prefix) {
		for (var i = 0, url; (url = this.urls[i]); i++) {
			url.addPrefix(prefix);
		}

		return this;
	},
	
	route: function(request, response) {
		var pathname = require('url').parse(request.url).pathname;

		for (var i = 0, url; (url = this.urls[i]); i++) {
			if (!url.re) {
				url.re = new RegExp(url.url);
			}

			var match = pathname.match(url.re);
			if (match) {
				request.params = {};
				for (var j = 0, param; (param = url.params[j]); j++) {
					request.params[param] = match[j + 1];
				}
				if (j < match.length - 1) {
					request.unmatched = match[j + 1];
				}

				url.view(request, response, url.args);

				return true;
			}
		}
		
		return false;	
	},
	
	reverse: function(id, args) {
		for (var i = 0, url; (url = this.urls[i]); i++) {
			if (url.id != id) { continue; }
			return drty.utils.stripRe(url.url);
		}

		throw Error("Error: Route '" + id + "' not found!");
	},
	
	concat: function(patterns) {
		this.urls = this.urls.concat(patterns.urls);
	}
});

var Url = drty.Class.extend({
	initialize: function(url, id, args) {
		var re = /\?P\<([^>]*)\>/g,
			params = [];
		url = url.replace(re, function(match, groupName) {
			params.push(groupName);
			return '';
		});

		this.url = url;
		this.id = id;
		this.args = args || {};
		this.params = params;
	},

	addPrefix: function(prefix) { this.url = prefix + this.url; },
	setView: function(view) { this.view = view[this.id]; }
});


exports.patterns = function(view) {
	var urls = Array.prototype.slice.call(arguments, 1);
	return new Patterns(view, urls);
}

exports.url = function(url, id, args) {
	var patterns = id.urlpatterns;
	if (patterns instanceof Patterns) {
		return patterns.addPrefix(url);
	}
	return new Url(url, id, args);
}

exports.reverse = function(id) {
	patterns = require('drty').conf.settings.ROOT_URLCONF.urlpatterns || {};
}

var getPatterns = exports.getPatterns = function() {
	var settings = require('drty').conf.settings;
	return settings.ROOT_URLCONF.urlpatterns || [];	
}

})();