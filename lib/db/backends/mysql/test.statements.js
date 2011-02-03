var drty = require('drty'),
	models = drty.db.models,
	statements = require('./statements'),
	testCase = require('nodeunit').testCase;

drty.conf.settings.DATABASE = {
	ENGINE: drty.db.backends.MySQL,
	USER: 'demo',
	PASSWORD: 'demo',
	NAME: 'demo'
};

var ForeignModel = models.Model.extend({
		tableName: 'foreign'
	}),
	MyModel = models.Model.extend({
		tableName: 'mymodel',
		IntegerField: new models.IntegerField(),
		CharField: new models.CharField({maxLength: 32}),
		TextField: new models.TextField({null: true}),
		BooleanField: new models.BooleanField(),
		DateTimeField: new models.DateTimeField({null: true}),
		ForeignKeyField: new models.ForeignKey(ForeignModel, {null: true})
	});

var values1 = {
		IntegerField: 100,
		CharField: 'what\'s up G?',
		TextField: null,
		BooleanField: true,
		DateTimeField: new Date(1294778991323),
		ForeignKeyField: null
	},
	values2 = {
		IntegerField: 100,
		CharField: 'another "test"',
		TextField: null,
		BooleanField: false,
		DateTimeField: null,
		ForeignKeyField: 20
	};

module.exports = testCase({
	'insert': function(test) {
		var model;
		model = new MyModel(values1);
		test.equal(new statements.Insert(model).getSQL(),
			"INSERT INTO `mymodel` (`integer_field`, `char_field`, `text_field`, `boolean_field`, `date_time_field`, `foreign_key_field_id`) VALUES(100, \"what\'s up G?\", NULL, 1, \"2011-01-11 12:49:51\", NULL)");

		model = new MyModel(values2);
		test.equal(new statements.Insert(model).getSQL(),
			"INSERT INTO `mymodel` (`integer_field`, `char_field`, `text_field`, `boolean_field`, `date_time_field`, `foreign_key_field_id`) VALUES(100, \"another \\\"test\\\"\", NULL, 0, NULL, 20)");
		test.done();

	},
	
	'update': function(test) {
		var model;
		model = new MyModel(drty.utils.merge(values1, {id: 20}));
		test.equal(new statements.Update(model).getSQL(),
			"UPDATE `mymodel` SET `integer_field`=100, `char_field`=\"what's up G?\", `text_field`=NULL, `boolean_field`=1, `date_time_field`=\"2011-01-11 12:49:51\", `foreign_key_field_id`=NULL WHERE id=20");

		model = new MyModel(drty.utils.merge(values2, {id: 20}));
		test.equal(new statements.Update(model).getSQL(),
			"UPDATE `mymodel` SET `integer_field`=100, `char_field`=\"another \\\"test\\\"\", `text_field`=NULL, `boolean_field`=0, `date_time_field`=NULL, `foreign_key_field_id`=20 WHERE id=20");

		test.done();
	},
	
	'select': function(test) {
		var fm, qs;

		fm = new ForeignModel({id: 128});
		qs = MyModel.objects.filter({IntegerField: 20, CharField: 'abc', ForeignKeyField: fm});
		test.equal(new statements.Select(qs).getSQL(),
			'SELECT mymodel.integer_field AS mymodel__integer_field, mymodel.char_field AS mymodel__char_field, mymodel.text_field AS mymodel__text_field, mymodel.boolean_field AS mymodel__boolean_field, mymodel.date_time_field AS mymodel__date_time_field, mymodel.foreign_key_field_id AS mymodel__foreign_key_field_id, mymodel.id AS mymodel__id, foreign.id AS foreign__id FROM mymodel LEFT JOIN (`foreign`) ON (mymodel.foreign_key_field_id=foreign.id) WHERE mymodel.integer_field=20 AND mymodel.char_field="abc" AND mymodel.foreign_key_field_id=128');

		qs = MyModel.objects.filter({IntegerField: 20, CharField: 'abc', BooleanField: true, DateTimeField: new Date(1294778991323)});
		test.strictEqual(new statements.Select(qs).getSQL(),
			'SELECT mymodel.integer_field AS mymodel__integer_field, mymodel.char_field AS mymodel__char_field, mymodel.text_field AS mymodel__text_field, mymodel.boolean_field AS mymodel__boolean_field, mymodel.date_time_field AS mymodel__date_time_field, mymodel.foreign_key_field_id AS mymodel__foreign_key_field_id, mymodel.id AS mymodel__id, foreign.id AS foreign__id FROM mymodel LEFT JOIN (`foreign`) ON (mymodel.foreign_key_field_id=foreign.id) WHERE mymodel.integer_field=20 AND mymodel.char_field="abc" AND mymodel.boolean_field=1 AND mymodel.date_time_field="2011-01-11 12:49:51"');
		test.done();
	},
	
	'create': function(test) {
		test.equal(new statements.Create(MyModel).getSQL(),
			'CREATE TABLE `mymodel` (`integer_field` integer NOT NULL, `char_field` varchar(32) NOT NULL, `text_field` text, `boolean_field` tinyint UNSIGNED NOT NULL, `date_time_field` datetime, `foreign_key_field_id` integer UNSIGNED, `id` integer UNSIGNED NOT NULL AUTO_INCREMENT, PRIMARY KEY(id))');
		test.done();
	}
});