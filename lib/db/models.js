(function() {

var drty = require('drty');

var models = {};
exports.loadFromApp = function(app) {
	var appModels = app.models || {};
	for (var name in appModels) {
		var Model = appModels[name];
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

	static: {
		sync: function(callback) { drty.db.getBackend().create(this, callback); },
		validate: function(callback) { drty.db.getBackend().validate(this, callback); },

		getTableName: function() { return this._meta.tableName; },
		getColumns: function() { return this._meta.columns; },
		getForeignKeys: function() { return this._meta.foreignKeys; },
		extend: function(prop) {
			if (!prop.tableName) {
				throw new Error('Error: "tableName" missing in Model');
			}

			var NewModel = this.parent(prop);

			// Extract the columns from the list of fields
			var columns = {}, foreignKeys = {}, 
				pk = null;
			drty.utils.each(NewModel.prototype, function(name, column) {
				if (!column.getFieldType) { return; }

				column.setName(name);
				columns[name] = column;
				if (column.isRelationship()) {
					foreignKeys[name] = column;
				}

				if (column.isPrimaryKey()) { pk = column; }
			});

			if (!pk) {
				pk = columns['id'] = NewModel.prototype.id = new exports.AutoField({primaryKey: true});
				pk.setName('id');
			}
			
			NewModel.pk = pk;
			NewModel.__defineGetter__('objects', function() {
				return new exports.QuerySet(NewModel);
			});
			NewModel._meta = {
				tableName: prop.tableName,
				columns: columns,
				foreignKeys: foreignKeys
			}
			
			return NewModel;
		}
	}
});

})();