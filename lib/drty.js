(function() {

require.paths.push(__dirname);

require('./nachojs/class');

exports.Class = require('./nachojs/class').Class;

exports.template = require('./template/template');
exports.conf = require('./conf/conf');
exports.urls = require('./urls/urls');
exports.views = require('./views/views');
exports.middleware = require('./middleware/middleware');
exports.forms = require('./forms/forms');
exports.models = require('./models/models');
exports.apps = require('./apps/apps');
exports.core = require('./core/core');

exports.utils = require('./utils');

})();