(function() {

var drty = require('drty');

exports.settings = {
	SESSION_ENGINE: drty.contrib.sessions.backends.db
};

})();