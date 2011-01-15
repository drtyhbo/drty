(function() {

var drty = require('drty'),
	sessions = {};

exports.load = function(sessionId, callback) {
	callback(sessions[sessionId] || {});
}
	
exports.save = function(sessionId, session) {
	sessions[sessionId] = session;
}

})();