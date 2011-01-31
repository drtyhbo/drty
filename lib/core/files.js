(function() {

var drty = require('drty');

exports.File = drty.Class.extend({
	initialize: function(path, name) {
		this.path = path;
		this.name = name || require('path').basename(path);
	},
	
	save: function(dest, callback) {
		var fs = require('fs');

		drty.utils.mkdir(require('path').dirname(dest), function(err) {		
			var readStream = fs.createReadStream(this.path),
				writeStream = fs.createWriteStream(dest);

			require('sys').pump(readStream, writeStream, function(err) {
				callback(err, err ? null : new this.constructor(dest));
			}.bind(this));
		}.bind(this));
	}
});

exports.UploadedFile = exports.File.extend();
exports.ImageFile = exports.File.extend();

})();