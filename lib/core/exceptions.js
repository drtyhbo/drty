(function() {

var drty = require('drty');

exports.ValidationError = drty.Class.extend({
	initialize: function(msg, code) {
		this.code = code;
		this.msg = msg;
	}
});

})();