(function() {

var drty = require('drty');

exports.File = drty.Class.extend({
	initialize: function(path, name) {
		this.path = path;
		this.name = name || require('path').basename(path);
	},
	
	save: function(dest, callback) {
		var fs = require('fs');
		
		var readStream = fs.createReadStream(this.path),
			writeStream = fs.createWriteStream(dest);

		require('sys').pump(readStream, writeStream, function(err) {
			if (err) {
				callback(err, null);
			} else {
				callback(err, new this.constructor(dest));
			}
		}.bind(this));
	}
});

exports.UploadedFile = exports.File.extend();

})();