var drty = require('drty'),
	User = drty.apps.auth.User,
	Model = drty.models.Model,
	fields = drty.models.fields;

var Blog = exports.Blog = Model.extend({
	tableName: 'blogs',

	owner: fields.foreignKey(User)
});

var Entry = exports.Entry = Model.extend({
	tableName: 'entries',

	title: fields.string({maxLength: 128}),
	body: fields.text()
});