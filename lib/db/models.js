(function() {

var drty = require('drty');

var models = {};
exports.loadFromApp = function(app) {
	var appModels = app.models || {};
	for (var name in appModels) {
		if (!appModels[name].__meta) { continue; }

		appModels[name].__meta.tableName = appModels[name].__meta.tableName
			|| drty.db.utils.varNameToTableName(name);
		models[name] = appModels[name];
	}
}

exports.getAll = function() { return models }

// ----------------------------------------
// QuerySet
// ----------------------------------------

var QuerySet = drty.Class.extend({
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
		drty.db.getConn().select(this, callback);

		return this;
	},

	fetchOne: function(callback) {
		this.limit(1);
		drty.db.getConn().select(this, function(models) {
			callback(models[0]);
		});

		return this;
	}
});

// ----------------------------------------
// Model
// ----------------------------------------

var Model = exports.Model = drty.Class.extend({
	initialize: function(meta, values) {
		for (var name in values) {
			this[name] = values[name];
		}
		this.__meta = meta;
	},
	save: function(callback) {
		var conn = drty.db.getConn();

		if (!('id' in this)) {
			conn.insert(this, function(id) {
				this.id = id;
				if (callback) { callback(this); }
			}.bind(this));
		} else {
			conn.update(this, callback);
		}

		return this;
	}
});
Model.__onExtend__ = function(NewModel, properties) {
	// Extract the columns from the list of fields
	var columns = {},
		hasPrimaryKey = false;
	drty.utils.each(properties, function(key, value) {
		if (!value.fieldType) { return; }

		hasPrimaryKey = hasPrimaryKey || value.isPrimaryKey();
		columns[key] = value;
	});
	
	if (!hasPrimaryKey) {
		columns['id'] = new IntegerField({primaryKey: true});
	}

	var meta = NewModel.__meta = {
		tableName: properties.tableName,
		columns: columns
	};
	NewModel.__defineGetter__('objects', function() {
		return new (require('./QuerySet').QuerySet)(NewModel);
	});
	NewModel.sync = function(callback) {
		drty.db.getConn().create(this, callback);
	}

	for (var name in meta.columns) {
		var column = meta.columns[name];
		column.defineAccessors(NewModel, name);
	}
};

// ----------------------------------------
// Fields
// ----------------------------------------

var Field = exports.Field = drty.Class.extend({
	initialize: function(params) {
		params = params || {};
		for (var param in params) {
			this[param] = params[param];
		}
		if (this.primaryKey) {
			this.notNull = true;
			this.autoIncrement = true;
		}
	},
	isPrimaryKey: function() {
		return this['primaryKey'] || false;
	},
	isRelationship: function() {
		return this.fieldType == 'foreignkey';
	},

	defineAccessors: function(Model, name) {
	}
});

var IntegerField = exports.IntegerField = Field.extend({
	fieldType: 'integer'
});

var CharField = exports.CharField = Field.extend({
	fieldType: 'string'
});

var TextField = exports.TextField = Field.extend({
	fieldType: 'text'
});

var BooleanField = exports.BooleanField = Field.extend({
	fieldType: 'boolean'
});

var DateTimeField = exports.DateTimeField = Field.extend({
	fieldType: 'datetime'
})

var ForeignKey = exports.ForeignKey = Field.extend({
	fieldType: 'foreignkey',
	initialize: function(model, params) {
		this.parent(params);
		this.model = model;
	},
	defineAccessors: function(Model, name) {
		var varName = '_' + name;
		Model.prototype.__defineGetter__(name, function() {
			return this[varName] || this[varName + '_id'];
		});
		Model.prototype.__defineSetter__(name, function(value) {
			if (typeof(value) == 'number') {
				this[varName] = null;
				this[varName + '_id'] = value;
			} else {
				this[varName] = value;
				this[varName + '_id'] = 'id' in value ? value.id : null;
			}
		});
	}
});

})();