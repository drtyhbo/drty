var drty = require('drty'),
	models = drty.db.models,
	QuerySet = require('./queryset').QuerySet,
	testCase = require('nodeunit').testCase;

var Blog = models.Model.extend({
	tableName: 'blog',
	title: new models.CharField({maxLength: 256}),
	createDate: new models.DateTimeField({autoNowAdd: true})
});
Blog.prepare('Blog', Blog);

var Entry = models.Model.extend({
	tableName: 'entries',
	title: new models.CharField({maxLength: 256}),
	body: new models.TextField(),
	postDate: new models.DateTimeField({autoNowAdd: true}),
	blog: new models.ForeignKey(Blog)
});
Entry.prepare('Entry', Entry);

module.exports = testCase({
	'objects': function(test) {
		test.ok(Entry.objects instanceof QuerySet);
		test.done();
	},
	
	'filter': function(test) {
		var date = new Date();

		var qs = Entry.objects.filter({postDate__lt: date});
		test.equal(qs.filters[0].value, date);
		test.equal(qs.filters[0].lookup, '<');

		qs = Entry.objects.filter({postDate__lte: date});
		test.equal(qs.filters[0].value, date);
		test.equal(qs.filters[0].lookup, '<=');

		qs = Entry.objects.filter({postDate__gt: date});
		test.equal(qs.filters[0].value, date);
		test.equal(qs.filters[0].lookup, '>');

		qs = Entry.objects.filter({postDate__gte: date});
		test.equal(qs.filters[0].value, date);
		test.equal(qs.filters[0].lookup, '>=');

		qs1 = Entry.objects.filter({postDate__gte: date});
		var qs2 = qs1.filter({postDate__lte: date});
		test.equal(qs1.filters.length, 1);
		test.equal(qs1.filters[0].value, date);
		test.equal(qs1.filters[0].lookup, '>=');

		test.equal(qs2.filters.length, 2);
		test.equal(qs2.filters[0].name, 'postDate');
		test.equal(qs2.filters[0].value, date);
		test.equal(qs2.filters[0].lookup, '>=');
		test.equal(qs2.filters[1].name, 'postDate');
		test.equal(qs2.filters[1].value, date);
		test.equal(qs2.filters[1].lookup, '<=');

		qs = Entry.objects.filter({postDate__gte: date, postDate__lte: date});
		test.equal(qs.filters[0].name, 'postDate');
		test.equal(qs.filters[0].value, date);
		test.equal(qs.filters[0].lookup, '>=');
		test.equal(qs.filters[1].name, 'postDate');
		test.equal(qs.filters[1].value, date);
		test.equal(qs.filters[1].lookup, '<=');

		test.done();
	},
	
	'orderBy': function(test) {
		var qs = Entry.objects.orderBy('postDate');
		test.equal(qs.opt.orderBy.name, 'postDate');
		test.equal(qs.opt.orderBy.isDecending, false);

		qs = Entry.objects.orderBy('-postDate');
		test.equal(qs.opt.orderBy.name, 'postDate');
		test.equal(qs.opt.orderBy.isDecending, true);

		test.done();
	},
	
	'limit': function(test) {
		var qs = Entry.objects.limit(1);
		test.equal(qs.opt.limit, 1);

		test.done();
	},
	
	'dontSelectRelated': function(test) {
		test.equal(Entry.objects.selectRelated, true);
		test.equal(Entry.objects.dontSelectRelated().selectRelated, false);

		test.done();
	}
})