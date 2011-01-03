var drty = require('../lib/drty'),
	models = drty.models;

exports.Entry = models.add('entry', {
	user: models.fields.foreignKey(drty.apps.auth.User),
	title: models.fields.string({maxLength: 256}),
	body: models.fields.text()
});