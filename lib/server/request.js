(function() {

var drty = require('drty'),
	formidable = require('formidable');

exports.Request = require('drty').Class.extend({
	initialize: function(httpRequest) {
		this.httpRequest = httpRequest;
		
		this.url = httpRequest.url;
		this.method = httpRequest.method;
	},

	parse: function(callback) {
		var httpHeaders = this.httpRequest.headers;
		this.headers = {};
		for (var header in httpHeaders) {
			this.headers[header.toUpperCase()] = httpHeaders[header];
		}

		this.parseCookies();
		this.parseGET();
		if (this.method == 'POST') {
			if (this.headers['CONTENT-TYPE'].match(/urlencode/i)
					|| this.headers['CONTENT-TYPE'].match(/multipart/i)) {
				var form = new formidable.IncomingForm();
				form.parse(this.httpRequest, function(err, fields, files) {
					for (var name in files) {
						files[name] = new drty.core.files.UploadedFile(files[name].path, files[name].name);
					}
					this.POST = drty.utils.merge(fields, files);
					callback();
				}.bind(this));
			} else {
				this.parsePOST(callback);
			}
		} else {
			callback();
		}
	},

	parseCookies: function() {
		// Parse out cookies from the header
		var cookies = {};
		(this.headers.COOKIE || '').split(';').forEach(function(cookie) {
			if (!cookie) { return; }

			var splitIdx = cookie.indexOf('='),
				key = cookie.substr(0, splitIdx),
				value = cookie.substr(splitIdx + 1);
			cookies[key.trim()] = value;
		});

		this.cookies = cookies;
	},
	
	parsePOST: function(complete) {
		var numBytesWritten = 0,
			rawPostData = this.rawPostData = new Buffer(parseInt(this.headers['CONTENT-LENGTH'], 10));
		this.httpRequest
			.addListener('data', function(data) {
				data.copy(rawPostData, numBytesWritten);
				numBytesWritten += data.length;
			})
			.addListener('end', function() {
				complete();
			});
	},
	
	parseGET: function() {
		this.GET = require('querystring').parse(
			require('url').parse(this.httpRequest.url).query || '');
	}
});

})();