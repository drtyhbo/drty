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
		models[name] = appModels[name];
	}
}

exports.getAll = function() { return models }

// ----------------------------------------
// Imports
// ----------------------------------------

exports.QuerySet = require('./queryset').QuerySet;
drty.utils.mixin(exports, require('./fields'));

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
					? column.massage(this[name])
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
		NewModel.pk = columns['id'] = new exports.AutoField({primaryKey: true});
		prepColumn('id', NewModel.pk);
	}
	
	NewModel.__defineGetter__('objects', function() {
		return new exports.QuerySet(NewModel);
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

})();