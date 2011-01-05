(function() {

var drty = require('drty'),
	QuerySet = require('./QuerySet').QuerySet;

var Model = exports.Model = drty.Class.extend({
	initialize: function(meta, values) {
		for (var name in values) {
			this[name] = values[name];
		}
		this.__meta = meta;
	},
	save: function(callback) {
		var conn = drty.models.getConn();

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
Model.__onExtend = function(NewModel, properties) {
	// Extract the columns from the list of fields
	var columns = {},
		hasPrimaryKey = false;
	drty.utils.each(properties, function(key, value) {
		if (!value.fieldType) { return; }

		hasPrimaryKey = hasPrimaryKey || value.isPrimaryKey();
		columns[key] = value;
	});
	
	if (!hasPrimaryKey) {
		columns['id'] = drty.models.fields.integer({primaryKey: true});
	}

	var tableName = properties.tableName;
	if (!tableName) {
		throw Error("Error: Models must contain the tableName property.")
	}

	var meta = NewModel.__meta = {
		tableName: tableName,
		columns: columns
	};
	NewModel.__defineGetter__('objects', function() {
		return new QuerySet(NewModel);
	});
	NewModel.sync = function(callback) {
		drty.models.getConn().create(this, callback);
	}

	for (var name in meta.columns) {
		var column = meta.columns[name];
		column.defineAccessors(NewModel, name);
	}

	drty.models.add(NewModel);
};

})();