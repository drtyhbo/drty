(function() {

var drty = require('drty');

var lookupMapping = {
	'eq': '=',
	'lt': '<',
	'lte': '<=',
	'gt': '>',
	'gte': '>='
};

var QuerySet = exports.QuerySet = drty.Class.extend({
	initialize: function(model) {
		if (model instanceof QuerySet) {
			this.model = model.model;
			this.filters = model.filters.slice();
			this.opt = drty.utils.clone(model.opt);
			this.selectRelated = model.selectRelated;
		} else {
			this.model = model;
			this.filters = [];
			this.opt = {};
			this.selectRelated = true;
		}
	},

	filter: function(filters) {
		var columns = this.model.getColumns();

		var qs = new QuerySet(this);
		for (var filter in filters) {
			var value = filters[filter],
				pieces = filter.split('__'),
				name = pieces[0];

			if (name == 'pk') {
				name = this.model.pk.getName();
			}

			if (!(name in columns)) {
				throw new Error("Unknown column '" + name + "' in '"
					+ this.model.getTableName() + "'");
			}

			qs.filters.push({
				name: name,
				value: value,
				lookup: lookupMapping[pieces[1] || 'eq']
			});
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
			name: isDecending ? orderBy.substr(1) : orderBy
		};

		return qs;
	},

	dontSelectRelated: function() {
		var qs = new QuerySet(this);
		qs.selectRelated = false;

		return qs;
	},

	fetch: function(callback) {
		drty.db.getBackend().select(this, callback);

		return this;
	},

	fetchOne: function(callback) {
		this.limit(1);
		drty.db.getBackend().select(this, function(error, models) {
			callback(error, models[0] || null);
		});

		return this;
	}
});

})();