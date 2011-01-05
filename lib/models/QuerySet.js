(function() {

var drty = require('drty');

var QuerySet = exports.QuerySet = drty.Class.extend({
	initialize: function(model) {
		if (model instanceof QuerySet) {
			this.model = model.model;
			this.filters = model.filters;
			this.opt = drty.utils.clone(model.opt);
			this.selectRelated = model.selectRelated;
		} else {
			this.model = model;
			this.filters = {};
			this.opt = {};
			this.selectRelated = true;
		}
	},

	filter: function(filters) {
		var qs = new QuerySet(this);
		for (var column in filters) {
			qs.filters[column] = filters[column];
		}

		return qs;
	},

	limit: function(limit) {
		var qs = new QuerySet(this);
		qs.opt.limit = limit;

		return qs;
	},

	orderBy: function(orderBy) {
		var qs = new QuerySet(this),
			isDecending = orderBy.charAt(0) == '-';
		qs.opt.orderBy = {
			isDecending: isDecending,
			column: isDecending ? orderBy.substr(1) : orderBy
		};

		return qs;
	},

	dontSelectRelated: function() {
		var qs = new QuerySet(this);
		qs.selectRelated = false;

		return qs;
	},

	fetch: function(callback) {
		drty.models.getConn().select(this, callback);

		return this;
	},

	fetchOne: function(callback) {
		this.limit(1);
		drty.models.getConn().select(this, function(models) {
			callback(models[0]);
		});

		return this;
	}
});
	
})();