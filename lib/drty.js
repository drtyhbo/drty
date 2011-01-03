(function() {

require('./nachojs/class');

exports.error = function(msg) {
	console.log('**** ERROR ****');
	console.log(msg);
	console.log('***************');
	process.exit();
}

exports.templates = require('./templates/templates');
exports.server = new (require('./server/server').Server)();
exports.views = new (require('./views/views').ViewManager)();
exports.urls = require('./urls/urls');
exports.forms = new (require('./forms/forms').FormManager)();
exports.models = new (require('./models/models').ModelManager)();
exports.middleware = new (require('./middleware/middleware').MiddlewareManager)();
exports.apps = new (require('./apps/apps').AppManager)();

})();