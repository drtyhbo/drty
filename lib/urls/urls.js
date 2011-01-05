(function() {

var paramRe = /:[a-zA-Z_][a-zA-Z0-9_]*/g;

exports.patterns = function(view) {
	var urls = Array.prototype.slice.call(arguments, 1);
	for (var i = 0, url; (url = urls[i]); i++) {
		url.viewFnc = view[url.id];
		urls[url.id] = url;
	}
	return urls;
}

exports.url = function(url, id) {
	var params = [];
	var regExpUrl = url.replace(paramRe, function(param) {
		params.push(param.substr(1));
		return '([^/]*)';
	});

	if (regExpUrl.charAt(url.length - 1) != '$') {
		regExpUrl += '(.*)$';
	}

	return {
		regExp: new RegExp(regExpUrl),
		url: url.replace('^', '').replace('$', ''),
		id: id,
		params: params
	}
}

exports.route = function(patterns, request, response) {
	var parts = require('url').parse(request.url);

	for (var i = 0, pattern; (pattern = patterns[i]); i++) {
		var match;
		if ((match = parts.pathname.match(pattern.regExp))) {
			request.params = {};
			for (var j = 0, param; (param = pattern.params[j]); j++) {
				request.params[param] = match[j + 1];
			}
			if (j < match.length - 1) {
				request.unmatched = match[j + 1];
			}

			pattern.viewFnc(request, response);

			return true;
		}
	}	

	return false;
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

})();