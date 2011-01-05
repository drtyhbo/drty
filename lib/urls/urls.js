(function() {

var drty = require('../drty');

var paramRe = /:[a-zA-Z_][a-zA-Z0-9_]*/g,
	routes = [];

exports.add = function(url, id) {
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
	routes.push(route);
	routes[id] = route;

	return this;
}

exports.route = function(request, response) {
	var parts = require('url').parse(request.url);

	for (var i = 0, route; (route = routes[i]); i++) {
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
			return true;
		}
	}	

	return false;
}
	
exports.reverse = function(id) {
	if (!(id in routes)) {
		throw "Route '" + id + "' not found!";
	}
	var args = Array.prototype.slice.call(arguments, 1);

	return routes[id].url.replace(paramRe, function(param) {
		return args.shift();
	});
}

})();