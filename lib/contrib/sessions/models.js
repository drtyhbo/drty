(function() {

var models = require('drty').db.models;

exports.Session = models.Model.extend({
	sessionId: new models.CharField({maxLength: 32}),
	data: new models.TextField(),

	toString: function() {
		return this.sessionId;
	}
});

})();