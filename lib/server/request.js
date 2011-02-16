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
		var headers = this.httpRequest.headers;

		this.headers = {};
		for (var header in headers) {
			this.headers[header.toUpperCase()] = headers[header];
		}

		this.parseCookies();
		this.parseGET();
		if (this.method == 'POST' && (this.headers['CONTENT-TYPE'].match(/urlencoded/i)
				|| this.headers['CONTENT-TYPE'].match(/multipart/i))) {
			var form = new formidable.IncomingForm();
			form.parse(this.httpRequest, function(err, fields, files) {
				for (var name in files) {
					files[name] = new drty.core.files.UploadedFile(files[name].path, files[name].name);
				}
				this.POST = drty.utils.merge(fields, files);
				callback();
			}.bind(this));
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
		var postData = '';
		this.httpRequest
			.addListener('data', function(data) {
				postData += data;
			})
			.addListener('end', function() {
				this.rawPostData = postData;
				this.POST = require('querystring').parse(postData);
				complete();
			}.bind(this));
	},
	
	parseGET: function() {
		this.GET = require('querystring').parse(
			require('url').parse(this.httpRequest.url).query || '');
	}
});

})();