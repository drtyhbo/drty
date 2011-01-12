(function() {

var drty = require('drty');

function varNameToTableName(name) {
	name = name.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()
	return name.charAt(name.length - 1) != 's'
		? (name + 's')
		: name;
}

var models = {};
exports.loadFromApp = function(app) {
	var appModels = app.models || {};
	for (var name in appModels) {
		if (!appModels[name].__meta) { continue; }

		appModels[name].__meta.tableName = appModels[name].__meta.tableName
			|| varNameToTableName(name);
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
		var columns = this.model.getColumns();

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
		drty.db.getBackend().select(this, callback);

		return this;
	},

	fetchOne: function(callback) {
		this.limit(1);
		drty.db.getBackend().select(this, function(models) {
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
		for (var name in values) {
			this[name] = values[name];
		}
	},
	save: function(callback) {
		var conn = drty.db.getBackend();

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
	},
	
	getTableName: function() { return this.constructor.getTableName(); },
	getColumns: function() { return this.constructor.getColumns(); },
	getForeignKeys: function() { return this.constructor.getForeignKeys(); }
});
Model.__onExtend__ = function(NewModel, properties) {
	if (!properties.tableName) {
		throw new Error('Error: tableName required on Model.')
	}

	function prepColumn(name, column) {
		column.setName(name);
		column.setModel(NewModel);
		column.defineAccessors(NewModel, name);		
	}

	// Extract the columns from the list of fields
	var columns = {}, foreignKeys = {},
		hasPrimaryKey = false;
	drty.utils.each(properties, function(name, column) {
		if (!column.fieldType) { return; }

		prepColumn(name, column);

		// add the column to our list of columns and remove it from
		// the prototype
		columns[name] = column;		
		if (column.isRelationship()) {
			foreignKeys[name] = column;
		}
		delete NewModel.prototype[name];

		hasPrimaryKey = hasPrimaryKey || column.isPrimaryKey();
	});
	
	if (!hasPrimaryKey) {
		var column = columns['id'] = new IntegerField({primaryKey: true});
		prepColumn('id', column);
	}
	
	NewModel.__defineGetter__('objects', function() {
		return new QuerySet(NewModel);
	});
	NewModel.sync = function(callback) {
		drty.db.getBackend().create(this, callback);
	}
	NewModel.validate = function(callback) {
		drty.db.getBackend().validate(this, callback);
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
			this.params.null = false;
		}
	},
	
	setName: function(name) { this.name = name; },
	getName: function() { return this.name; },
	setModel: function(Model) { this.Model = Model; },
	getModel: function() { return this.Model; },

	isUnsigned: function() { return this.params.unsigned; },
	isNull: function() { return Boolean(this.params.null); },
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
	fieldType: 'CharField'
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
	
	isRelationship: function() { return true; },

	initialize: function(model, params) {
		this.parent(params);
		this.otherModel = model;
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