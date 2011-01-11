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
		var columns = this.model.__meta.columns;

		var qs = new QuerySet(this);
		for (var name in filters) {
			if (!(name in columns)) {
				throw new Error("Unknown column '" + name + "' in '"
					+ this.model.__meta.tableName + "'");
			}
			qs.filters[name] = filters[name];
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
	initialize: function(values) {
		this.__meta = this.constructor.__meta;
		for (var name in values) {
			this[name] = values[name];
		}
	},
	save: function(callback) {
		var conn = drty.db.getConn();

		if (!('id' in this)) {
			// set the initial values of the 
			var columns = this.constructor.__meta.columns;
			for (var name in columns) {
				var column = columns[name];
				if (name in this && this[name]
					|| column.isPrimaryKey()) { continue; }
				this[name] = columns[name].getInitialValue();
			}
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
	if (!properties.tableName) {
		throw new Error('Error: tableName required on Model.')
	}

	// Extract the columns from the list of fields
	var columns = {}, foreignKeys = {},
		hasPrimaryKey = false;
	drty.utils.each(properties, function(key, value) {
		if (!column.fieldType) { return; }

		hasPrimaryKey = hasPrimaryKey || column.isPrimaryKey();
		columns[key] = value;
		
		if (column.isForeignKey()) {
			foreignKeys[name] = column;
		}

		column.defineAccessors(NewModel, name);

		delete NewModel.prototype[key];
	});
	
	if (!hasPrimaryKey) {
		columns['id'] = new IntegerField({primaryKey: true});
	}

	NewModel.__defineGetter__('objects', function() {
		return new QuerySet(NewModel);
	});
	NewModel.sync = function(callback) {
		drty.db.getConn().create(this, callback);
	}
	NewModel.validate = function(callback) {
		drty.db.getConn().validate(this, callback);
	}

	NewModel.getTableName = function() { return properties.tableName; }
	NewModel.getColumns = function() { return columns; }
	NewModel.getForeignKeys = function() { return foreignKeys; }
};

// ----------------------------------------
// Fields
// ----------------------------------------

var Field = exports.Field = drty.Class.extend({
	initialize: function(params) {
		this.params = params || {};

		if (this.params.primaryKey) {
			this.params.notNull = true;
			this.params.autoIncrement = true;
		}
	},

	isNotNull: function() { return this.params.notNull || false; },
	isPrimaryKey: function() { return this.params.primaryKey || false; },
	isAutoIncrement: function() { return this.params.autoIncrement || false; },
	isRelationship: function() { return this.fieldType == 'foreignkey'; },
	getInitialValue: function() { return this.default; },

	defineAccessors: function(Model, name) {}
	
});

var IntegerField = exports.IntegerField = Field.extend({
	fieldType: 'IntegerField'
});

var CharField = exports.CharField = Field.extend({
	fieldType: 'StringField'
});

var TextField = exports.TextField = Field.extend({
	fieldType: 'TextField'
});

var BooleanField = exports.BooleanField = Field.extend({
	fieldType: 'BooleanField'
});

var DateTimeField = exports.DateTimeField = Field.extend({
	fieldType: 'DateTimeField',
	getInitialValue: function() {
		return this.autoNowAdd ? new Date().getTime() : this.default;
	}
})

var ForeignKey = exports.ForeignKey = Field.extend({
	fieldType: 'ForeignKey',
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