(function() {

var drty = require('drty');

exports.settings = require('./default-settings').settings;
exports.parseSettings = function(settings) {
	exports.settings = drty.utils.merge(settings, exports.settings);
}

})();