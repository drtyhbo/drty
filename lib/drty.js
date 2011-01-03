(function() {

require('./nachojs/class');

exports.error = function(msg) {
	console.log('**** ERROR ****');
	console.log(msg);
	console.log('***************');
	process.exit();
}

exports.Class = require('./nachojs/class').Class;
exports.templates = require('./templates/templates');
//exports.server = new (require('./server/server').Server)();
//exports.views = new (require('./views/views').ViewManager)();
exports.urls = require('./urls/urls');
exports.forms = require('./forms/forms');
//exports.models = new (require('./models/models').ModelManager)();
//exports.middleware = new (require('./middleware/middleware').MiddlewareManager)();
//exports.apps = new (require('./apps/apps').AppManager)();

exports.utils = require('./utils');

})();