(function() {

var drty = require('../drty');

var paramRe = /:[a-zA-Z_][a-zA-Z0-9_]*/g;

exports.UrlManager = Class({
	initialize: function() {
		this.routes = [];

		drty.templates.defaultContext('urlreverse', this.reverse.bind(this));
	},

	add: function(url, id) {
		var params = [];
		var regExpUrl = url.replace(paramRe, function(param) {
			params.push(param.substr(1));
			return '([^/]*)';
		});

		if (regExpUrl.charAt(url.length - 1) != '$') {
			regExpUrl += '(.*)$';
		}

		var route = {
			regExp: new RegExp(regExpUrl),
			url: url.replace('^', '').replace('$', ''),
			id: id,
			params: params
		}
		this.routes.push(route);
		this.routes[id] = route;
	
		return this;
	},

	route: function(request, response) {
		var parts = require('url').parse(request.url);

		for (var i = 0, route; (route = this.routes[i]); i++) {
			var match;
			if ((match = parts.pathname.match(route.regExp))) {
				request.params = {};
				for (var j = 0, param; (param = route.params[j]); j++) {
					request.params[param] = match[j + 1];
				}
				if (j < match.length - 1) {
					request.unmatched = match[j + 1];
				}

				drty.views.render(route.id, request, response);
				break;
			}
		}	

		if (i == this.routes.length) {
			response.notFound();
		}
	
		return this;
	},
	
	reverse: function(id) {
		if (!(id in this.routes)) {
			drty.error("Route '" + id + "' not found!");
		}
		var args = Array.prototype.slice.call(arguments, 1);

		return this.routes[id].url.replace(paramRe, function(param) {
			return args.shift();
		});
	}
});

})();