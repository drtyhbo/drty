(function() {

var drty = require('drty');

var Patterns = drty.Class.extend({
	initialize: function(view, urls) {
		this.urls = [];

		for (var i = 0, url; (url = urls[i]); i++) {
			if (view && !(url instanceof Patterns)) {
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

				var args = [url.view, request, response].concat(url.args || []);
				drty.views.render.apply(drty.views, args);

				return true;
			}
		}
		
		return false;
	},
	
	reverse: function(id) {
		args = Array.prototype.slice.call(arguments, 1);

		for (var i = 0, url; (url = this.urls[i]); i++) {
			if (url.id != id) { continue; }
			
			args = args.slice();
			var url = url.url.replace(/\([^)]*\)/g, function() {
				if (!args.length) {
					throw Error('Error: reverse(): not enough url arguments');
				}
				return args.shift();
			});
			return drty.utils.stripRe(url);
		}

		throw Error("Error: Route '" + id + "' not found!");
	},
	
	concat: function(patterns) {
		if (!(patterns instanceof Patterns)) {
			throw Error('Error: pattern() expected.');
		}
		this.urls = this.urls.concat(patterns.urls);
	}
});

var Url = drty.Class.extend({
	initialize: function(url, view, id, args) {
		var re = /\?P\<([^>]*)\>/g,
			params = [];
		url = url.replace(re, function(match, groupName) {
			params.push(groupName);
			return '';
		});

		this.url = url;
		this.view = view;
		this.id = id;
		this.args = args || {};
		this.params = params;
	},

	addPrefix: function(prefix) { this.url = prefix + this.url; },
	setView: function(view) {
		if (typeof(this.view) != 'string') { return; }
		if (!(this.view in view)) {
			throw new Error("Error: View '" + this.view + "' not found in view object.");
		}
		this.view = view[this.view];
	}
});


exports.patterns = function() {
	var urls = Array.prototype.slice.call(arguments);
	
	if (!urls.length) {
		return new Patterns(null, []);
	} else {
		var view = !(urls[0] instanceof Url) ? urls[0] : null;
		return new Patterns(view, view ? urls.slice(1) : urls);
	}
}

exports.url = function(url, view, id, args) {
	if (view instanceof Patterns) {
		return view.addPrefix(url);
	}
	return new Url(url, view, id, args);
}

exports.route = function() {
	var patterns = exports.getPatterns();
	return patterns.route.apply(patterns, arguments);
}

exports.reverse = function() {
	var patterns = exports.getPatterns();
	return patterns.reverse.apply(patterns, arguments);
}

var getPatterns = exports.getPatterns = function() {
	var settings = require('drty').conf.settings;
	return settings.ROOT_URLCONF || [];	
}

})();