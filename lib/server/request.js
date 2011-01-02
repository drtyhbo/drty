(function() {

exports.Request = Class({
	initialize: function(httpRequest) {
		this.httpRequest = httpRequest;
		
		this.url = httpRequest.url;
		this.method = httpRequest.method;
	},

	parse: function(callback) {
		this.parseCookies();

		this.parseGET();
		if (this.method == 'POST') {
			this.parsePOST(callback);
		} else {
			callback();
		}
	},

	parseCookies: function() {
		// Parse out cookies from the header
		var cookies = {};
		(this.httpRequest.headers.cookie || '').split(';').forEach(function(cookie) {
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