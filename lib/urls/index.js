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

			var match;
			if ((match = pathname.match(url.re))) {
//				request.params = {};
//				for (var j = 0, param; (param = pattern.params[j]); j++) {
//					request.params[param] = match[j + 1];
//				}
//				if (j < match.length - 1) {
//					request.unmatched = match[j + 1];
//				}

				url.view(request, response);

				return true;
			}
		}
		
		return false;	
	}
});


var Url = drty.Class.extend({
	initialize: function(url, id) {
		this.url = url;
		this.id = id;
	},

	addPrefix: function(prefix) { this.url = prefix + this.url; },
	setView: function(view) { this.view = view[this.id]; }
});


exports.patterns = function(view) {
	var urls = Array.prototype.slice.call(arguments, 1);
	return new Patterns(view, urls);
}

exports.url = function(url, id) {
	var patterns = id.urlpatterns;
	if (patterns instanceof Patterns) {
		return patterns.addPrefix(url);
	}
	return new Url(url, id);
}

exports.reverse = function(id) {
	patterns = require('drty').conf.settings.ROOT_URLCONF.urlpatterns || {};

	if (!(id in patterns)) {
		throw "Route '" + id + "' not found!";
	}
	var args = Array.prototype.slice.call(arguments, 1);

	return patterns[id].url.replace(paramRe, function(param) {
		return args.shift();
	});
}

var getPatterns = exports.getPatterns = function() {
	var settings = require('drty').conf.settings;
	return settings.ROOT_URLCONF.urlpatterns || [];	
}

})();