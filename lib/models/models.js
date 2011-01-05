(function() {

var drty = require('drty');

exports.db = {
	MySQL: require('./db/mysql').MySQL
};


exports.Model = require('./Model').Model;
exports.fields = require('./fields');

var conn = null;
exports.getConn = function() {
	if (!conn) {
		connectToDB();
	}
	return conn;
}

var models = {};
exports.add = function(NewModel) {
	models[NewModel.__meta.tableName] = NewModel;

	if (conn) { conn.add(NewModel); }
}

var connectToDB = exports.connectToDB = function() {
	if (conn) { return; }

	var settings = drty.conf.settings.DATABASE;
	if (!settings || !settings.ENGINE || !settings.NAME
		|| !settings.USER || !settings.PASSWORD) {
			throw Error('Configuration error. To use models, you must specify the following parameters:\n\
-           	DATABASE: {\n\
					ENGINE: drty.models.db.MySQL\n\
					NAME: "database name",\n\
					USER: "username",\n\
					PASSWORD: "password",\n\
				}');
	}
	
	conn = new settings.ENGINE(settings);

	drty.utils.each(models, function(tableName, Model) {
		if (conn) { conn.add(Model); }
	});
}

exports.getAll = function() { return models }
exports.syncAll = function(callback) {
	drty.utils.eachChained(models, function(tableName, Model, next) {
		Model.sync(next);
	}, callback);
}
	
})();