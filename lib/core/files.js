(function() {

var drty = require('drty');

exports.UploadedFile = drty.Class.extend({
	initialize: function(file) {
		for (var key in file) {
			this[key] = file[key];
		}
	}
})
	
})();