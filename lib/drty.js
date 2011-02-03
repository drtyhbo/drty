(function() {

require.paths.unshift(__dirname);

exports.Class = require('./deps/class').Class;

exports.utils = require('./utils');
exports.template = require('./template');
exports.conf = require('./conf');
exports.urls = require('./urls');
exports.views = require('./views');
exports.middleware = require('./middleware');
exports.core = require('./core');
exports.forms = require('./forms');
exports.db = require('./db');
exports.contrib = require('./contrib');

})();