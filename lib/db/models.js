(function() {

var drty = require('drty');

var models = {};
exports.loadFromApp = function(app) {
	var appModels = app.models || {};
	for (var name in appModels) {
		var Model = appModels[name];
		Model.prepare(name);
		models[name] = Model;
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
		this._values = drty.utils.clone(values);

		var columns = this.getColumns();
		for (var name in columns) {
			(function(obj, name) {
				obj.__defineGetter__(name, function() {
					return obj._values[name];
				});
				obj.__defineSetter__(name, function(value) {
					obj._values[name] = value;
				});
				
			})(this, name);
		}
	},
	save: function(callback) {
		var conn = drty.db.getBackend();

		// set the values of the columns
		var columns = this.constructor.getColumns(),
			values = this._values;
		for (var name in columns) {
			var column = columns[name];

			if (column.isPrimaryKey()) { continue; }

			if (name in values) {
				values[name] = values[name]
					? column.massage(values[name])
					: values[name];
			} else {
				values[name] = columns[name].getInitialValue();
			}
		}

		if (!('id' in this._values)) {
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
	getForeignKeys: function() { return this.constructor.getForeignKeys(); },

	__static__: {
		prepare: function(name) {
			this.tableName = this.prototype.tableName
				|| name.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();

			var Model = this;
			function prepColumn(name, column) {
				column.setName(name);
				column.setModel(Model);
			}

			// Extract the columns from the list of fields
			var columns = {}, foreignKeys = {}, 
				pk = null;
			drty.utils.each(this.prototype, function(name, column) {
				if (!column.getFieldType) { return; }

				prepColumn(name, column);

				// add the column to our list of columns and remove it from
				// the prototype
				columns[name] = column;
				if (column.isRelationship()) {
					foreignKeys[name] = column;
				}

				if (column.isPrimaryKey()) { pk = column; }
			});

			if (!pk) {
				pk = columns['id'] = this.prototype.id = new exports.AutoField({primaryKey: true});
				prepColumn('id', pk);
			}
			this.pk = pk;

			this.__defineGetter__('objects', function() {
				return new exports.QuerySet(Model);
			});
			this._meta = {
				columns: columns,
				foreignKeys: foreignKeys
			}
		},
	
		sync: function(callback) { drty.db.getBackend().create(this, callback); },
		validate: function(callback) { drty.db.getBackend().validate(this, callback); },

		getTableName: function() { return this.tableName; },
		getColumns: function() { return this._meta.columns; },
		getForeignKeys: function() { return this._meta.foreignKeys; }
	}
});

})();