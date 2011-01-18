(function() {

var drty = require('drty'),
	models = require('./models'),
	testCase = require('nodeunit').testCase;

drty.conf.settings.DATABASE = {
	ENGINE: drty.db.backends.MySQL,
	USER: 'demo',
	PASSWORD: 'demo',
	NAME: 'demo'
};

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
	ForeignKeyField: new models.ForeignKey(ForeignModel, {null: true})
});

ForeignModel.prepare('ForeignModel', ForeignModel);
MyModel.prepare('MyModel', MyModel);

ForeignModel.sync();
MyModel.sync();

module.exports = testCase({
	'no table name': function(test) {
		var MyModel = models.Model.extend({
			IntegerField: new models.IntegerField()
		});
		MyModel.prepare('MyModel', MyModel);
		test.equal(MyModel.getTableName(), 'my_model');
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
	},
	
	'simple saving': function(test) {
		var mymodel = new MyModel({IntegerField: 16});
		mymodel.save(function(error, model) {
			MyModel.objects.filter({id: model.id}).fetchOne(function(error, model) {
				test.equal(model.IntegerField, 16);
				test.equal(model.CharField, 'char field');
				test.equal(model.TextField, 'text field');
				test.equal(model.BooleanField, true);
				test.ok(model.DateTimeField instanceof Date);
				test.strictEqual(model.ForeignKeyField, null);
				
				test.done();
			});
		});
	},
	
	'foreign key saving': function(test) {
		var foreign = new ForeignModel();
		foreign.save(function(error, foreign) {
			var mymodel = new MyModel({
				ForeignKeyField: foreign,
				IntegerField: 32,
				CharField: 'ya baby!',
				BooleanField: false,
				DateTimeField: new Date()
			}).save(function(error, mymodel) {
				MyModel.objects.filter({id: mymodel.id}).fetchOne(function(error, model) {
					test.strictEqual(model.IntegerField, mymodel.IntegerField);
					test.strictEqual(model.CharField, mymodel.CharField);
					test.strictEqual(model.TextField, mymodel.TextField);
					test.strictEqual(model.BooleanField, mymodel.BooleanField);
					test.strictEqual(model.DateTimeField.getTime(), mymodel.DateTimeField.getTime());
					test.strictEqual(model.ForeignKeyField.id, mymodel.ForeignKeyField.id);

					test.done();
				});
			});
		});
	},

	'errors': function(test) {
		var mymodel = new MyModel();
		mymodel.save(function(error, model) {
			test.notStrictEqual(error, null);
			test.done();
		});
	}
});

})();