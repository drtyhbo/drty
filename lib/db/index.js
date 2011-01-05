(function() {

var conn = null;
exports.getConn = function() { return conn; }

var connectToDB = exports.connectToDB = function() {
	var drty = require('drty');

	var settings = drty.conf.settings.DATABASE;
	if (!settings || !settings.ENGINE || !settings.NAME
		|| !settings.USER || !settings.PASSWORD) {
			throw Error('Configuration error. You must specify the following parameters:\n\
           		DATABASE: {\n\
					ENGINE: drty.db.backends.MySQL\n\
					NAME: "database name",\n\
					USER: "username",\n\
					PASSWORD: "password"\n\
				}');
	}

	conn = new settings.ENGINE(settings);
	
	var models = exports.models.getAll();
	drty.utils.each(models, function(name, model) {
		conn.prepareModel(model);
	});
}

exports.backends = require('./backends');
exports.models = require('./models');
exports.utils = require('./utils');

})();