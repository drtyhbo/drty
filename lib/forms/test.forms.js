var drty = require('drty'),
	forms = require('./index'),
	testCase = require('nodeunit').testCase;

var MyForm = forms.Form.extend({
	username: new forms.CharField(),
	password: new forms.CharField({widget: new forms.widgets.PasswordInput()}),
	email: new forms.EmailField(),
	isSuperuser: new forms.BooleanField(),
	age: new forms.IntegerField({required: false}),
	permissions: new forms.ChoiceField({
		choices: {
			'all': 'All',
			'readonly': 'Read Only',
			'readwrite': 'Read/Write'
		}
	})
});

module.exports = testCase({
	'basic': function(test) {
		var values = {
			username: 'user1',
			password: 'mypass',
			email: 'user1@domain.com',
			isSuperuser: false,
			age: 26,
			permissions: 'all'
		};
		var form = new MyForm(values);
		test.ok(form.clean());
		
		test.done();
	},

	'missing username': function(test) {
		var values = {
			username: '',
			password: 'mypass',
			email: 'user1@domain.com',
			isSuperuser: false,
			age: 26,
			permissions: 'all'
		};
		var form = new MyForm(values);
		test.equal(form.clean(), false);
		
		test.done();
	},

	'invalid email': function(test) {
		var values = {
			username: 'user1',
			password: 'mypass',
			email: 'user1@domain',
			isSuperuser: false,
			age: 26,
			permissions: 'all'
		};
		var form = new MyForm(values);
		test.equal(form.clean(), false);
		
		test.done();
	},

	'invalid age': function(test) {
		var values = {
			username: 'user1',
			password: 'mypass',
			email: 'user1@domain',
			isSuperuser: false,
			age: 'abcd',
			permissions: 'all'
		};
		var form = new MyForm(values);
		test.equal(form.clean(), false);
		
		test.done();
	},

	'missing age': function(test) {
		var values = {
			username: 'user1',
			password: 'mypass',
			email: 'user1@domain.com',
			isSuperuser: false,
			permissions: 'all'
		};
		var form = new MyForm(values);
		test.equal(form.clean(), true);
		
		test.done();
	},

	'incorrect choice': function(test) {
		var values = {
			username: 'user1',
			password: 'mypass',
			email: 'user1@domain.com',
			isSuperuser: false,
			age: 26,
			permissions: 'incorrect'
		};
		var form = new MyForm(values);
		test.equal(form.clean(), false);
		
		test.done();
	},
	
	'values': function(test) {
		var values = {
			username: 'user1',
			password: 'mypass',
			email: 'user1@domain.com',
			isSuperuser: false,
			age: 26,
			permissions: 'all'
		};
		var form = new MyForm(values);
		test.equal(form.clean(), true);
		test.deepEqual(form.cleanValues, values);
		
		test.done();
	},
	
	'html': function(test) {
		var values = {
			username: 'user1',
			password: 'mypass',
			email: 'user1@domain.com',
			isSuperuser: false,
			age: 26,
			permissions: 'all'
		};
		var form = new MyForm(values);
		test.equal(form.toString(), '<tr><td><label for="username">Username</td><td><input type="text" name="username" id="username" value="user1"></td></tr>\n\
<tr><td><label for="password">Password</td><td><input type="password" name="password" id="password" value="mypass"></td></tr>\n\
<tr><td><label for="email">Email</td><td><input type="text" name="email" id="email" value="user1@domain.com"></td></tr>\n\
<tr><td><label for="isSuperuser">Is Superuser</td><td><input type="checkbox" name="isSuperuser" id="isSuperuser"></td></tr>\n\
<tr><td><label for="age">Age</td><td><input type="text" name="age" id="age" value="26"></td></tr>\n\
<tr><td><label for="permissions">Permissions</td><td><select name="permissions" id="permissions">\n\
<option value="all" selected>All</option>\n\
<option value="readonly">Read Only</option>\n\
<option value="readwrite">Read/Write</option>\n\
</select></td></tr>');
		test.done();
	},
	
	'nameToLabel': function(test) {
		var form = new MyForm();

		test.equal(form.nameToLabel('variable'), 'Variable');
		test.equal(form.nameToLabel('isAdmin'), 'Is Admin');
		test.equal(form.nameToLabel('isYouAdmin'), 'Is You Admin');

		test.done();
	},
	
	'formFromModel basic': function(test) {
		var models = drty.db.models,
			MyModel = models.Model.extend({
				tableName: 'mymodel',
				IntegerField: new models.IntegerField(),
				CharField: new models.CharField({
					maxLength: 32,
					default: 'char field'}),
				TextField: new models.TextField({
					null: true, 
					default: 'text field'}),
				BooleanField: new models.BooleanField({default: true})
			});
		forms.formFromModel(MyModel, function(Form) {
			test.ok(Form.__meta.fields.IntegerField);
			test.ok(Form.__meta.fields.IntegerField instanceof forms.IntegerField);

			test.ok(Form.__meta.fields.CharField);
			test.ok(Form.__meta.fields.CharField instanceof forms.CharField);

			test.ok(Form.__meta.fields.TextField);
			test.ok(Form.__meta.fields.TextField instanceof forms.TextField);

			test.ok(Form.__meta.fields.BooleanField);
			test.ok(Form.__meta.fields.BooleanField instanceof forms.BooleanField);

			test.done();
		});
	}
});