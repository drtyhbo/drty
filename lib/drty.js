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

exports.Class = require('./nachojs/class').Class;

exports.templates = require('./templates/templates');
exports.urls = require('./urls/urls');
exports.views = require('./views/views');
exports.middleware = require('./middleware/middleware');
exports.server = require('./server/server');
exports.forms = require('./forms/forms');
exports.models = require('./models/models');
exports.apps = require('./apps/apps');

exports.utils = require('./utils');

})();