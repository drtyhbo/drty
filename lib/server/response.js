(function() {

exports.Response = require('drty').Class.extend({
	initialize: function(httpResponse) {
		this.httpResponse = httpResponse;
		this.headers = {}
	},

	setResponseCallback: function(responseCallback) {
		this.responseCallback = responseCallback;
	},
	
	fireResponseCallback: function(statusCode, body) {
		this.statusCode = statusCode;
		this.body = body || '';
		
		this.responseCallback();
	},

	// Header manipulation
	setHeader: function(name, value) {
		this.headers[name] = value;
		return this;
	},
	
	setCookie: function(name, value) {
		this.setHeader('Set-Cookie', name + '=' + value + ' ; path=/');
		return this;
	},

	// Responses. These call the responseCallback.
	ok: function(body, contentType) {
		this.setHeader('Content-type', contentType || 'text/html');
		this.fireResponseCallback(200, body);
	},
		
	redirect: function(url) {
		this.setHeader('Location', url);
		this.fireResponseCallback(302);
	},
	
	notFound: function() {
		this.fireResponseCallback(404);
	},

	error: function() {
		this.fireResponseCallback(500);
	}
});

})();