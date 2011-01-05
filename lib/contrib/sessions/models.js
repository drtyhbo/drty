(function() {

var models = require('drty').db.models;

exports.Session = models.Model.extend({
	sessionId: models.CharField({maxLength: 32}),
	data: models.TextField(),

	toString: function() {
		return this.sessionId;
	}
});

});