(function() {

var contentTypes = {
	'.json': 'application/json',
	'.htm': 'text/html',
	'.html': 'text/html',
	'.gif': 'image/gif',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.png': 'image/png'
};

exports.ViewManager = Class.extend({
	initialize: function() {
		this.views = {};
	},

	add: function(id, fnc) {
		if (!(id in this.views)) {
			this.views[id] = [];
		}
		
		var args = Array.prototype.slice.call(arguments, 2);
		this.views[id].push({
			fnc: fnc,
			args: args
		});

		return this;
	},

	render: function(id) {
		var args = Array.prototype.slice.call(arguments, 1),
			list = this.views[id].slice();

		(function run() {
			if (!list.length) {
				console.log('No view handled this request!');
				break;
			}

			var view = list.shift();
			if (list.length) { args.push(run); }
			view.fnc.apply(view.fnc, args.concat(view.args));
		})();
	},

	staticView: function(request, response, filename) {
		if (request.unmatched) {
			filename = require('path').join(filename, request.unmatched);
		}

		if (filename.indexOf('..') != -1) { response.notFound(); }

		require('fs').readFile(filename, function(err, data) {
			if (err) {
				response.notFound();
			} else {
				var ext = require('path').extname(filename);
				response.setHeader('Content-Type', contentTypes[ext] || 'text/plain');
				response.ok(data);
			}
		});
	}
});

})();