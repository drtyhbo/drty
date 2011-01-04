(function() {

require('./nachojs/class');

exports.error = function(msg) {
	console.log('**** ERROR ****');
	console.log(msg);
	console.log('***************');
	process.exit();
}

var config = {};
exports.config = function(newConfig) {
	if (!newConfig) { return config; }
	config = newConfig;
}

exports.go = function() {
	var cmdLine = process.argv[0] + ' ' + process.argv[1];
	
	if (process.argv.length < 3) {
		exports.error('Usage: ' + cmdLine + ' <runserver|syncdb>');
	}
	
	switch(process.argv[2]) {
		case 'runserver':
			if (process.argv.length < 4) {
				exports.error('Usage: ' + cmdLine + ' runserver port');
			}
			require('./server/server').listen(process.argv[3]);
			break;

		case 'syncdb':
			exports.models.syncAll();
			break;
		
		default:
			exports.error('Unknown command ' + process.argv[1]);
			break;
	}
}

exports.Class = require('./nachojs/class').Class;

exports.template = require('./template/template');
exports.urls = require('./urls/urls');
exports.views = require('./views/views');
exports.middleware = require('./middleware/middleware');
exports.forms = require('./forms/forms');
exports.models = require('./models/models');
exports.apps = require('./apps/apps');

exports.utils = require('./utils');

})();