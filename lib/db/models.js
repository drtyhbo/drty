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
		drty.db.getBackend().select(this, function(error, models) {
			callback(error, models[0] || null);
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

		// set the values of the columns
		var columns = this.constructor.getColumns();
		for (var name in columns) {
			var column = columns[name];

			if (column.isPrimaryKey()) { continue; }

			if (name in this) {
				this[name] = this[name]
					? column.massageData(this[name])
					: this[name];
			} else {
				this[name] = columns[name].getInitialValue();
			}
		}

		if (!('id' in this)) {
			var self = this;
			conn.insert(this, function(error, id) {
				if (!error) {
					self.id = id;
				}

				if (callback) { callback(error, self); }
			});
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
	}

	// Extract the columns from the list of fields
	var columns = {}, foreignKeys = {},
		hasPrimaryKey = false;
	drty.utils.each(properties, function(name, column) {
		if (!column.getFieldType) { return; }

		prepColumn(name, column);

		// add the column to our list of columns and remove it from
		// the prototype
		columns[name] = column;		
		if (column.isRelationship()) {
			foreignKeys[name] = column;
		}
		delete NewModel.prototype[name];

		if (column.isPrimaryKey()) {
			NewModel.pk = column;
		}
	});
	
	if (!NewModel.pk) {
		NewModel.pk = columns['id'] = new IntegerField({primaryKey: true});
		prepColumn('id', NewModel.pk);
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
		this._params = params || {};

		if (this._params.primaryKey) {
			this._params.null = false;
		}
	},
	
	getFieldType: function() { return this._fieldType; },
	
	setName: function(name) { this._name = name; },
	getName: function() { return this._name; },
	setModel: function(Model) { this._Model = Model; },
	getModel: function() { return this._Model; },
	
	isNull: function() { return Boolean(this._params.null); },
	isPrimaryKey: function() { return this._params.primaryKey || false; },
	isRelationship: function() { return this._fieldType == 'foreignkey'; },

	getInitialValue: function() { return this._params.default || null; },
	massageData: function(value) { return value; }
});

var IntegerField = exports.IntegerField = Field.extend({
	_fieldType: 'IntegerField'
});

var CharField = exports.CharField = Field.extend({
	_fieldType: 'CharField',
	
	getMaxLength: function() { return this._params.maxLength; }
});

var TextField = exports.TextField = Field.extend({
	_fieldType: 'TextField'
});

var BooleanField = exports.BooleanField = Field.extend({
	_fieldType: 'BooleanField'
});

var DateTimeField = exports.DateTimeField = Field.extend({
	_fieldType: 'DateTimeField',

	getInitialValue: function() {
		return this._params.autoNowAdd ? new Date() : this.default;
	},

	massageData: function(value) {
		value = new Date(value);
		value.setMilliseconds(0);

		return value;
	}
});

var ForeignKey = exports.ForeignKey = Field.extend({
	_fieldType: 'ForeignKey',

	initialize: function(model, params) {
		this.parent(params);
		this.otherModel = model;
	},

	isRelationship: function() { return true; }
});

})();