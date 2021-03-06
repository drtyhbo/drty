var drty = require('drty'),
	models = drty.db.models,
	columnMeta = require('./columnmeta'),
	testCase = require('nodeunit').testCase;

var ForeignModel = models.Model.extend({
	tableName: 'foreign'
});

var MyModel = models.Model.extend({
	tableName: 'mymodel',
	AutoField: new models.AutoField(),
	IntegerField: new models.IntegerField({primaryKey: true}),
	PositiveIntegerField: new models.PositiveIntegerField(),
	SmallIntegerField: new models.SmallIntegerField({dbColumn: 'test'}),
	PositiveSmallIntegerField: new models.PositiveSmallIntegerField(),
	FloatField: new models.FloatField(),
	CharField: new models.CharField({maxLength: 32}),
	SlugField: new models.SlugField(),
	TextField: new models.TextField({null: true}),
	JSONField: new  models.JSONField({null: true}),
	EmailField: new models.EmailField(),
	URLField: new models.URLField(),
	IPAddressField: new models.IPAddressField(),
	BooleanField: new models.BooleanField({dbColumn: 'myboolean'}),
	NullBooleanField: new models.NullBooleanField({unique: true}),
	DateTimeField: new models.DateTimeField({dbIndex: true}),
	DateField: new models.DateField(),
	TimeField: new models.TimeField(),
	ForeignKeyField: new models.ForeignKey(ForeignModel),
	DecimalField: new models.DecimalField({maxDigits: 8, decimalPlaces: 5}),
	FileField: new models.FileField()
});

module.exports = testCase({
	'meta': function(test) {
		var meta;

		meta = columnMeta.getMetaForColumn(MyModel, MyModel.getColumns().AutoField);
		test.ok(meta instanceof columnMeta.AutoFieldMeta);
		test.equal(meta.getSqlName(), 'auto_field');
		test.equal(meta.getSqlType(), 'integer');
		test.equal(meta.getQualifiedName(), 'mymodel.auto_field');
		test.equal(meta.getSelectName(), 'mymodel__auto_field');
		test.equal(meta.getColumnDef(), '`auto_field` integer UNSIGNED NOT NULL AUTO_INCREMENT');
		test.equal(meta.toSQL(100), 100);
		test.equal(meta.toJS(100), 100);

		meta = columnMeta.getMetaForColumn(MyModel, MyModel.getColumns().IntegerField);
		test.ok(meta instanceof columnMeta.IntegerFieldMeta);
		test.equal(meta.getSqlName(), 'integer_field');
		test.equal(meta.getSqlType(), 'integer');
		test.equal(meta.getQualifiedName(), 'mymodel.integer_field');
		test.equal(meta.getSelectName(), 'mymodel__integer_field');
		test.equal(meta.getColumnDef(), '`integer_field` integer NOT NULL, PRIMARY KEY(integer_field)');
		test.equal(meta.toSQL(100), 100);
		test.equal(meta.toJS(100), 100);

		meta = columnMeta.getMetaForColumn(MyModel, MyModel.getColumns().PositiveIntegerField);
		test.ok(meta instanceof columnMeta.PositiveIntegerFieldMeta);
		test.equal(meta.getSqlName(), 'positive_integer_field');
		test.equal(meta.getSqlType(), 'integer');
		test.equal(meta.getQualifiedName(), 'mymodel.positive_integer_field');
		test.equal(meta.getSelectName(), 'mymodel__positive_integer_field');
		test.equal(meta.getColumnDef(), '`positive_integer_field` integer UNSIGNED NOT NULL');
		test.equal(meta.toSQL(100), 100);
		test.equal(meta.toJS(100), 100);

		meta = columnMeta.getMetaForColumn(MyModel, MyModel.getColumns().SmallIntegerField);
		test.ok(meta instanceof columnMeta.SmallIntegerFieldMeta);
		test.equal(meta.getSqlName(), 'test');
		test.equal(meta.getSqlType(), 'smallint');
		test.equal(meta.getQualifiedName(), 'mymodel.test');
		test.equal(meta.getSelectName(), 'mymodel__test');
		test.equal(meta.getColumnDef(), '`test` smallint NOT NULL');
		test.equal(meta.toSQL(100), 100);
		test.equal(meta.toJS(100), 100);

		meta = columnMeta.getMetaForColumn(MyModel, MyModel.getColumns().PositiveSmallIntegerField);
		test.ok(meta instanceof columnMeta.PositiveSmallIntegerFieldMeta);
		test.equal(meta.getSqlName(), 'positive_small_integer_field');
		test.equal(meta.getSqlType(), 'smallint');
		test.equal(meta.getQualifiedName(), 'mymodel.positive_small_integer_field');
		test.equal(meta.getSelectName(), 'mymodel__positive_small_integer_field');
		test.equal(meta.getColumnDef(), '`positive_small_integer_field` smallint UNSIGNED NOT NULL');
		test.equal(meta.toSQL(100), 100);
		test.equal(meta.toJS(100), 100);

		meta = columnMeta.getMetaForColumn(MyModel, MyModel.getColumns().FloatField);
		test.ok(meta instanceof columnMeta.FloatFieldMeta);
		test.equal(meta.getSqlName(), 'float_field');
		test.equal(meta.getSqlType(), 'double');
		test.equal(meta.getQualifiedName(), 'mymodel.float_field');
		test.equal(meta.getSelectName(), 'mymodel__float_field');
		test.equal(meta.getColumnDef(), '`float_field` double NOT NULL');
		test.equal(meta.toSQL(100.55), 100.55);
		test.equal(meta.toJS(100.55), 100.55);

		meta = columnMeta.getMetaForColumn(MyModel, MyModel.getColumns().CharField);
		test.ok(meta instanceof columnMeta.CharFieldMeta);
		test.equal(meta.getSqlName(), 'char_field');
		test.equal(meta.getSqlType(), 'varchar');
		test.equal(meta.getQualifiedName(), 'mymodel.char_field');
		test.equal(meta.getSelectName(), 'mymodel__char_field');
		test.equal(meta.getColumnDef(), '`char_field` varchar(32) NOT NULL');
		test.equal(meta.toSQL('hey there!'), 'hey there!');
		test.equal(meta.toJS('hey there!'), 'hey there!');

		meta = columnMeta.getMetaForColumn(MyModel, MyModel.getColumns().FileField);
		test.ok(meta instanceof columnMeta.CharFieldMeta);
		test.equal(meta.getSqlName(), 'file_field');
		test.equal(meta.getSqlType(), 'varchar');
		test.equal(meta.getQualifiedName(), 'mymodel.file_field');
		test.equal(meta.getSelectName(), 'mymodel__file_field');
		test.equal(meta.getColumnDef(), '`file_field` varchar(100) NOT NULL');
		test.equal(meta.toSQL('hey there!'), 'hey there!');
		test.equal(meta.toJS('hey there!'), 'hey there!');

		meta = columnMeta.getMetaForColumn(MyModel, MyModel.getColumns().SlugField);
		test.ok(meta instanceof columnMeta.CharFieldMeta);
		test.equal(meta.getSqlName(), 'slug_field');
		test.equal(meta.getSqlType(), 'varchar');
		test.equal(meta.getQualifiedName(), 'mymodel.slug_field');
		test.equal(meta.getSelectName(), 'mymodel__slug_field');
		test.equal(meta.getColumnDef(), '`slug_field` varchar(50) NOT NULL, INDEX(slug_field)');
		test.equal(meta.toSQL('hey there!'), 'hey there!');
		test.equal(meta.toJS('hey there!'), 'hey there!');

		meta = columnMeta.getMetaForColumn(MyModel, MyModel.getColumns().TextField);
		test.ok(meta instanceof columnMeta.TextFieldMeta);
		test.equal(meta.getSqlName(), 'text_field');
		test.equal(meta.getSqlType(), 'text');
		test.equal(meta.getQualifiedName(), 'mymodel.text_field');
		test.equal(meta.getSelectName(), 'mymodel__text_field');
		test.equal(meta.getColumnDef(), '`text_field` text');
		test.equal(meta.toSQL('hey there!'), 'hey there!');
		test.equal(meta.toJS('hey there!'), 'hey there!');

		meta = columnMeta.getMetaForColumn(MyModel, MyModel.getColumns().JSONField);
		test.ok(meta instanceof columnMeta.JSONFieldMeta);
		test.equal(meta.getSqlName(), 'json_field');
		test.equal(meta.getSqlType(), 'text');
		test.equal(meta.getQualifiedName(), 'mymodel.json_field');
		test.equal(meta.getSelectName(), 'mymodel__json_field');
		test.equal(meta.getColumnDef(), '`json_field` text');
		test.equal(meta.toSQL({hey: 'there'}), '{"hey":"there"}');
		test.deepEqual(meta.toJS('{"hey":"there"}'), {hey: 'there'});

		meta = columnMeta.getMetaForColumn(MyModel, MyModel.getColumns().EmailField);
		test.ok(meta instanceof columnMeta.CharFieldMeta);
		test.equal(meta.getSqlName(), 'email_field');
		test.equal(meta.getSqlType(), 'varchar');
		test.equal(meta.getQualifiedName(), 'mymodel.email_field');
		test.equal(meta.getSelectName(), 'mymodel__email_field');
		test.equal(meta.getColumnDef(), '`email_field` varchar(75) NOT NULL');
		test.equal(meta.toSQL('hey there!'), 'hey there!');
		test.equal(meta.toJS('hey there!'), 'hey there!');

		meta = columnMeta.getMetaForColumn(MyModel, MyModel.getColumns().URLField);
		test.ok(meta instanceof columnMeta.CharFieldMeta);
		test.equal(meta.getSqlName(), 'url_field');
		test.equal(meta.getSqlType(), 'varchar');
		test.equal(meta.getQualifiedName(), 'mymodel.url_field');
		test.equal(meta.getSelectName(), 'mymodel__url_field');
		test.equal(meta.getColumnDef(), '`url_field` varchar(200) NOT NULL');
		test.equal(meta.toSQL('hey there!'), 'hey there!');
		test.equal(meta.toJS('hey there!'), 'hey there!');

		meta = columnMeta.getMetaForColumn(MyModel, MyModel.getColumns().IPAddressField);
		test.ok(meta instanceof columnMeta.CharFieldMeta);
		test.equal(meta.getSqlName(), 'ip_address_field');
		test.equal(meta.getSqlType(), 'varchar');
		test.equal(meta.getQualifiedName(), 'mymodel.ip_address_field');
		test.equal(meta.getSelectName(), 'mymodel__ip_address_field');
		test.equal(meta.getColumnDef(), '`ip_address_field` varchar(15) NOT NULL');
		test.equal(meta.toSQL('hey there!'), 'hey there!');
		test.equal(meta.toJS('hey there!'), 'hey there!');

		meta = columnMeta.getMetaForColumn(MyModel, MyModel.getColumns().BooleanField);
		test.ok(meta instanceof columnMeta.BooleanFieldMeta);
		test.equal(meta.getSqlName(), 'myboolean');
		test.equal(meta.getSqlType(), 'tinyint');
		test.equal(meta.getQualifiedName(), 'mymodel.myboolean');
		test.equal(meta.getSelectName(), 'mymodel__myboolean');
		test.equal(meta.getColumnDef(), '`myboolean` tinyint UNSIGNED NOT NULL');
		test.strictEqual(meta.toSQL(true), 1);
		test.strictEqual(meta.toSQL(false), 0);
		test.strictEqual(meta.toJS(1), true);
		test.strictEqual(meta.toJS(0), false);

		meta = columnMeta.getMetaForColumn(MyModel, MyModel.getColumns().NullBooleanField);
		test.ok(meta instanceof columnMeta.BooleanFieldMeta);
		test.equal(meta.getSqlName(), 'null_boolean_field');
		test.equal(meta.getSqlType(), 'tinyint');
		test.equal(meta.getQualifiedName(), 'mymodel.null_boolean_field');
		test.equal(meta.getSelectName(), 'mymodel__null_boolean_field');
		test.equal(meta.getColumnDef(), '`null_boolean_field` tinyint UNSIGNED, UNIQUE(null_boolean_field)');
		test.strictEqual(meta.toSQL(true), 1);
		test.strictEqual(meta.toSQL(false), 0);
		test.strictEqual(meta.toJS(1), true);
		test.strictEqual(meta.toJS(0), false);

		meta = columnMeta.getMetaForColumn(MyModel, MyModel.getColumns().DateTimeField);
		test.ok(meta instanceof columnMeta.DateTimeFieldMeta);
		test.equal(meta.getSqlName(), 'date_time_field');
		test.equal(meta.getSqlType(), 'datetime');
		test.equal(meta.getQualifiedName(), 'mymodel.date_time_field');
		test.equal(meta.getSelectName(), 'mymodel__date_time_field');
		test.equal(meta.getColumnDef(), '`date_time_field` datetime NOT NULL, INDEX(date_time_field)');
		test.equal(meta.toSQL(new Date(1294778991323)), '2011-01-11 12:49:51');
		test.strictEqual(meta.toSQL(null), null);

		meta = columnMeta.getMetaForColumn(MyModel, MyModel.getColumns().DateField);
		test.ok(meta instanceof columnMeta.DateFieldMeta);
		test.equal(meta.getSqlName(), 'date_field');
		test.equal(meta.getSqlType(), 'date');
		test.equal(meta.getQualifiedName(), 'mymodel.date_field');
		test.equal(meta.getSelectName(), 'mymodel__date_field');
		test.equal(meta.getColumnDef(), '`date_field` date NOT NULL');
		test.equal(meta.toSQL(new Date(1294778991323)), '2011-01-11');
		test.strictEqual(meta.toSQL(null), null);

		meta = columnMeta.getMetaForColumn(MyModel, MyModel.getColumns().TimeField);
		test.ok(meta instanceof columnMeta.TimeFieldMeta);
		test.equal(meta.getSqlName(), 'time_field');
		test.equal(meta.getSqlType(), 'time');
		test.equal(meta.getQualifiedName(), 'mymodel.time_field');
		test.equal(meta.getSelectName(), 'mymodel__time_field');
		test.equal(meta.getColumnDef(), '`time_field` time NOT NULL');
		test.equal(meta.toSQL(new Date(1294778991323)), '12:49:51');
		test.strictEqual(meta.toSQL(null), null);

		meta = columnMeta.getMetaForColumn(MyModel, MyModel.getColumns().ForeignKeyField);
		test.ok(meta instanceof columnMeta.ForeignKeyMeta);
		test.equal(meta.getSqlName(), 'foreign_key_field_id');
		test.equal(meta.getSqlType(), 'integer');
		test.equal(meta.getQualifiedName(), 'mymodel.foreign_key_field_id');
		test.equal(meta.getSelectName(), 'mymodel__foreign_key_field_id');
		test.equal(meta.getColumnDef(), '`foreign_key_field_id` integer UNSIGNED NOT NULL');
		test.equal(meta.toSQL(100), 100);

		meta = columnMeta.getMetaForColumn(MyModel, MyModel.getColumns().DecimalField);
		test.ok(meta instanceof columnMeta.DecimalFieldMeta);
		test.equal(meta.getSqlName(), 'decimal_field');
		test.equal(meta.getSqlType(), 'decimal');
		test.equal(meta.getQualifiedName(), 'mymodel.decimal_field');
		test.equal(meta.getSelectName(), 'mymodel__decimal_field');
		test.equal(meta.getColumnDef(), '`decimal_field` decimal(8, 5) NOT NULL');

		test.done();
	}
});