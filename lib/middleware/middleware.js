(function() {

exports.MiddlewareManager = Class({
	initialize: function() {
		this.middleware = [];
	},
	
	add: function(middlewareCtor, config) {
		this.middleware.push(new middlewareCtor(config));

		return this;
	},
	
	handleRequest: function(request, response, complete) {
		this.runMiddleware('handleRequest', complete,
			request, response);
			
		return this;
	},
	
	handleResponse: function(request, response, complete) {
		this.runMiddleware('handleResponse', complete,
			request, response);
			
		return this;
	},
	
	runMiddleware: function(fncName, complete) {
		var args = Array.prototype.slice.call(arguments, 2),
			list = this.middleware.slice();

		(function run() {
			if (!list.length) { complete(); return; }

			var middleware = list.shift();
			if (fncName in middleware) {
				middleware[fncName].apply(middleware, args.concat([run]));
			} else {
				run();
			}
		})();
	}
});

})();