(function() {

var drty = require('drty'),
	models = require('./models'),
	testCase = require('nodeunit').testCase;

var ForeignModel = models.Model.extend({
	tableName: 'foreign'
});
var MyModel = models.Model.extend({
	tableName: 'mymodel',
	IntegerField: new models.IntegerField(),
	CharField: new models.CharField({
		maxLength: 32,
		default: 'char field'}),
	TextField: new models.TextField({
		null: true, 
		default: 'text field'}),
	BooleanField: new models.BooleanField({default: true}),
	DateTimeField: new models.DateTimeField({
		null: true,
		autoNowAdd: true}),
	ForeignKeyField: new models.ForeignKey(ForeignModel)
});

module.exports = testCase({
	'no table name': function(test) {
		test.throws(function() {
			var MyModel = models.Model.extend({
				IntegerField: new models.IntegerField()
			});
		});
		test.done();
	},

	'model static functions': function(test) {
		test.equal(MyModel.getTableName(), 'mymodel');
		test.ok(MyModel.objects instanceof models.QuerySet);

		var num = 0;
		drty.utils.each(MyModel.getColumns(), function(name, column) {
			num++;
		});
		test.equal(num, 7); // includes id

		num = 0;
		drty.utils.each(MyModel.getForeignKeys(), function(name, column) {
			num++;
		});
		test.equal(num, 1);

		test.done();
	},
	
	'fields': function(test) {
		var columns = MyModel.getColumns();

		test.equal(columns.IntegerField.getName(), 'IntegerField')
		test.equal(columns.CharField.getName(), 'CharField');
		test.equal(columns.TextField.getName(), 'TextField');
		test.equal(columns.BooleanField.getName(), 'BooleanField');
		test.equal(columns.DateTimeField.getName(), 'DateTimeField');
		test.equal(columns.ForeignKeyField.getName(), 'ForeignKeyField');

		test.equal(columns.IntegerField.getModel(), MyModel);
		test.equal(columns.CharField.getModel(), MyModel);
		test.equal(columns.TextField.getModel(), MyModel);
		test.equal(columns.BooleanField.getModel(), MyModel);
		test.equal(columns.DateTimeField.getModel(), MyModel);
		test.equal(columns.ForeignKeyField.getModel(), MyModel);

		test.strictEqual(columns.IntegerField.getInitialValue(), null);
		test.strictEqual(columns.CharField.getInitialValue(), 'char field');
		test.strictEqual(columns.TextField.getInitialValue(), 'text field');
		test.strictEqual(columns.BooleanField.getInitialValue(), true);
		test.ok(columns.DateTimeField.getInitialValue() instanceof Date);

		

		test.done();
	}
});

})();