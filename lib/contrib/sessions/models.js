(function() {

var models = require('drty').db.models;

exports.Session = models.Model.extend({
	tableName: 'sessions',

	sessionId: new models.CharField({
			verboseName: 'Session Key',
			maxLength: 32,
			editable: false
		}),
	data: new models.TextField({
			verboseName: 'JSON',
			helpText: 'Must be a JSON object!'
		}),

	toString: function() {
		return this.sessionId;
	}
});

})();