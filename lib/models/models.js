(function() {

var drty = require('../drty'),
	Model = require('./Model').Model,
	QuerySet = require('./QuerySet').QuerySet;

exports.ModelManager = Class({
	initialize: function() {
		this.models = {};
		this.conn = null;
		
		this.db = {
			MySQL: require('./db/mysql').MySQL
		};
		this.fields = require('./fields');
	},

	config: function(config) {
		if (config.DB) {
			this.conn = new config.DB(config);
		}
	},
	
	// properties can contain a list of member functions as well
	// as a list of data type fields.
	add: function(tableName, properties) {
		// Extract the columns from the list of fields
		var columns = {}, members = {
			Extends: Model
		}, hasPrimaryKey = false;
		for (var name in properties) {
			var property = properties[name];
			if (property.fieldType) {
				hasPrimaryKey = hasPrimaryKey || property.isPrimaryKey();
				columns[name] = property;
			} else {
				members[name] = property;
			}
		}
		
		if (!hasPrimaryKey) {
			columns['id'] = this.fields.integer({primaryKey: true});
		}

		if (!this.conn) {
			drty.error("You must select a DB before creating a model.");
		}

		var NewModel = new Class(members);
		NewModel.__meta = {
			tableName: tableName,
			columns: columns
		};
		NewModel.__defineGetter__('objects', function() {
			return new QuerySet(NewModel);
		});

		this.prepareModel(NewModel);
		this.conn.prepareModel(NewModel);

		return (this.models[tableName] = NewModel);
	},
	
	getAll: function() {
		return this.models
	},
	
	syncAll: function() {
		for (var tableName in this.models) {
			this.conn.create(this.models[tableName]);
		}
	},
	
	prepareModel: function(NewModel) {
		var columns = NewModel.__meta.columns;
		for (var name in columns) {
			var column = columns[name];
			column.defineAccessors(NewModel, name);
		};
	}
});

})();