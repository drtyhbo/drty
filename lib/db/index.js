(function() {

var drty = require('drty');

exports.getBackend = function() {
	var settings = drty.conf.settings.DATABASE;
	if (!settings || !settings.ENGINE) {
			throw Error('Configuration error. You must specify at least the following to use models:\n\
           		DATABASE: {\n\
					ENGINE: drty.db.backends.MySQL\n\
				}');
	}

	return settings.ENGINE;
}

exports.backends = require('./backends');
exports.models = require('./models');

})();