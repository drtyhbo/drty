(function() {

exports.render = function(view, request, response, params) {
	var list = view instanceof Array ? view.slice() : [view];

	(function run() {
		var view = list.shift(),
			args = [request, response];
		args.push(list.length ? run : params);
		view.apply(view, args);
	})();
}

exports.static = require('./static');
exports.generic = require('./generic');

})();