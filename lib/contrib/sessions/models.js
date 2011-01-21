(function() {

var models = require('drty').db.models;

exports.Session = models.Model.extend({
	tableName: 'sessions',

	sessionId: new models.CharField({maxLength: 32, primaryKey: true}),
	data: new models.TextField(),

	toString: function() {
		return this.sessionId;
	}
});

})();