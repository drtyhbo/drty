var drty = require('drty'),
	models = require('drty').db.models;

var Blog = exports.Blog = models.Model.extend({
	tableName: 'blogs',

	owner: new models.ForeignKey(drty.contrib.auth.models.User)
});

var Entry = exports.Entry = models.Model.extend({
	tableName: 'entries',

	blog: new models.ForeignKey(Blog),
	title: new models.CharField({maxLength: 128}),
	body: new models.TextField()
});