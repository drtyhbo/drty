(function() {

var sys = require('sys'),
	hashlib = require('hashlib'),
	dirty = require('../../dirty');

var FB = Class({
	initialize: function (userId, accessToken) {
		this.userId = userId;
		this.accessToken = accessToken;

		this.client = require('http').createClient(443, 'graph.facebook.com', true);
	},

	me: function(callback) {
		this.makeRequest(this.userId, callback);
	},
	
	user: function(userId, callback) {
		this.makeRequest('/' + userId, callback);
	},
	
	friends: function(callback) {
		this.makeRequest('/me/friends', callback);
	},

	makeRequest: function(url, callback) {
		url = url + '?access_token=' + this.accessToken;

		var request = this.client.request('GET', url, {host: 'graph.facebook.com'}),
			data = '';
		request.end();
		request.on('response', function(response) {
			response.setEncoding('utf8');
			response.on('data', function(chunk) {
				data += chunk;
			});
			response.on('end', function() {
				data = JSON.decode(data);
				callback(data.error || null, data);
			});
		});
	}
});

exports.App = Class({
	initialize: function(config) {
		var apiKey = config['API_KEY'],
			apiSecret = config['API_SECRET'],
			xdReciever = config['XD_RECIEVER'];

		dirty.urls.add('^/xd_reciever.htm$', 'static', xdReciever);

		dirty.server.Request.implement({
			fb: function() {
				if (!this.fb) {
					if (this.session.fb) {
						this.fb = new FB(this.session.fb.uid, this.session.fb.access_token);
					} else {
						var cookie = this.cookies['fbs_' + apiKey];
						if (!cookie) { return null; }
						cookie = cookie.substr(1, cookie.length - 2);

						var pieces = {},
							components = cookie.split('&');
						for (var i = 0, component; (component = components[i]); i++) {
							var parts = component.split('=');
							pieces[parts[0]] = parts[1];
						}

						this.session.fb = {
							uid: pieces.uid,
							access_token: pieces.access_token
						};
						this.fb = new FB(pieces.uid, pieces.access_token);
					}
				}
				
				return this.fb;
			}
		});
	}
});

})();