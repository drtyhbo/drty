(function() {

var drty = require('../drty'),
	Model = require('./Model').Model,
	QuerySet = require('./QuerySet').QuerySet;

var models = {};
exports.conn = null;

exports.db = {};
exports.db.MySQL = require('./db/mysql').MySQL
exports.fields = require('./fields');
	
exports.add = function(tableName, properties) {
	// Extract the columns from the list of fields
	var columns = {},
		members = {},
		hasPrimaryKey = false;
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

	if (!exports.conn) {
		var config = drty.config().models;
		if (!config || !config.DB || !config.HOST || !config.USER 
				|| !config.PASS || !config.NAME) {
			throw 'Configuration error. To use models, you must specify the following parameters:\n\
				models: {\n\
					DB: drty.models.db.MySQL\n\
					HOST: "hostname",\n\
					USER: "username",\n\
					PASS: "password",\n\
					NAME: "database name"\n\
				}';
		}

		exports.conn = new config.DB(config);
	}

	var meta = {
		tableName: tableName,
		columns: columns
	};
	members.initialize = function(values) {
		this.parent(meta, values);
	}	

	var NewModel = Model.extend(members);
	NewModel.__meta = meta;
	NewModel.__defineGetter__('objects', function() {
		return new QuerySet(NewModel);
	});

	for (var name in meta.columns) {
		var column = meta.columns[name];
		column.defineAccessors(NewModel, name);
	}

	exports.conn.add(NewModel);

	return (models[tableName] = NewModel);
};
	
exports.getAll = function() { return models }
exports.syncAll = function(callback) {
	drty.utils.eachChained(models, function(tableName, model, next) {
		exports.conn.create(model, next);
	}, callback);
}
	
})();