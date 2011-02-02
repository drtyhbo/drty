(function() {

var middleware = [];

exports.add = function(middlewareObj) {
	middleware.push(middlewareObj);
	return this;
};

function runMiddleware(fncName, complete, lastToFirst) {
	var args = Array.prototype.slice.call(arguments, 3),
		list = middleware.slice();

	var dirName = lastToFirst ? 'pop' : 'shift';

	(function run() {
		if (!list.length) { complete(); return; }

		var middlewareObj = list[dirName]();
		if (fncName in middlewareObj) {
			middlewareObj[fncName].apply(middlewareObj, args.concat([run]));
		} else {
			run();
		}
	})();
}
	
exports.handleRequest = function(request, response, complete) {
	runMiddleware('handleRequest', complete, false,
		request, response);
	return this;
}
	
exports.handleResponse = function(request, response, complete) {
	runMiddleware('handleResponse', complete, true,
		request, response);
	return this;
};

})();