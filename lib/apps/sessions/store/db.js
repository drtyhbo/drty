(function() {

var drty = require('drty'),
	JSON = require('../../../nachojs/json2').JSON;

exports.SessionStore = drty.Class.extend({
	initialize: function() {
		var models = drty.models,
			fields = models.fields;
		this.Session = models.add('sessions', {
			sessionId: fields.string({maxLength: 32}),
			data: fields.text(),
			toString: function() {
				return this.sessionId;
			}
		});
	},
	
	load: function(sessionId, callback) {
		this.Session.objects.filter({sessionId: sessionId}).fetchOne(function(model) {
			var session = {};
			if (model) {
				session = JSON.parse(model.data);
			}
			callback(session);
		});
	},
	
	save: function(sessionId, session) {
		this.Session.objects.filter({sessionId: sessionId}).fetchOne(function(model) {
			if (!model) {
				model = new this.Session({
					sessionId: sessionId
				});
			}
			model.data = JSON.stringify(session);
			model.save();
		}.bind(this));
	}
});

})();