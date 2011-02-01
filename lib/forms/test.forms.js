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
		form.clean(function(err) {
			test.equal(err, null);
		});
		
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
		form.clean(function(err) {
			test.ok(err);
		});
		
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
		form.clean(function(err) {
			test.ok(err);
		});
		
		test.done();
	},

	'invalid age': function(test) {
		var values = {
			username: 'user1',
			password: 'mypass',
			email: 'user1@domain.com',
			isSuperuser: false,
			age: 'abcd',
			permissions: 'all'
		};
		var form = new MyForm(values);
		form.clean(function(err) {
			test.ok(err);
		});

		var values = {
			username: 'user1',
			password: 'mypass',
			email: 'user1@domain.com',
			isSuperuser: false,
			age: '100.52',
			permissions: 'all'
		};
		var form = new MyForm(values);
		form.clean(function(err) {
			test.ok(err);
		});
		
		test.done();
	},

	'valid age': function(test) {
		var values = {
			username: 'user1',
			password: 'mypass',
			email: 'user1@domain.com',
			isSuperuser: false,
			age: '0',
			permissions: 'all'
		};
		var form = new MyForm(values);
		form.clean(function(err) {
			test.equal(err, null);
		});

		var values = {
			username: 'user1',
			password: 'mypass',
			email: 'user1@domain.com',
			isSuperuser: false,
			age: '100',
			permissions: 'all'
		};
		var form = new MyForm(values);
		form.clean(function(err) {
			test.equal(err, null);
		});
		
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
		form.clean(function(err) {
			test.equal(err, null);
		});
		
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
		form.clean(function(err) {
			test.ok(err);
		});
		
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
		form.clean(function(err) {
			test.equal(err, null);
			test.deepEqual(form.cleanValues, values);
		});
		
		test.done();
	},
	
	'asTable': function(test) {
		var values = {
			username: 'user1',
			password: 'mypass',
			email: 'user1@domain.com',
			isSuperuser: false,
			age: 26,
			permissions: 'all'
		};
		var form = new MyForm(values);
		test.equal(form.toString(), '<tr><td><label for="username">Username</label></td><td><input type="text" name="username" id="username" value="user1"></td></tr>\n\
<tr><td><label for="password">Password</label></td><td><input type="password" name="password" id="password" value="mypass"></td></tr>\n\
<tr><td><label for="email">Email</label></td><td><input type="text" name="email" id="email" value="user1@domain.com"></td></tr>\n\
<tr><td><label for="isSuperuser">Is Superuser</label></td><td><input type="checkbox" name="isSuperuser" id="isSuperuser"></td></tr>\n\
<tr><td><label for="age">Age</label></td><td><input type="text" name="age" id="age" value="26"></td></tr>\n\
<tr><td><label for="permissions">Permissions</label></td><td><select name="permissions" id="permissions">\n\
<option value="all" selected>All</option>\n\
<option value="readonly">Read Only</option>\n\
<option value="readwrite">Read/Write</option>\n\
</select></td></tr>');
		test.done();
	},

		'asP': function(test) {
			var values = {
				username: 'user1',
				password: 'mypass',
				email: 'user1@domain.com',
				isSuperuser: false,
				age: 26,
				permissions: 'all'
			};
			var form = new MyForm(values);
			test.equal(form.asP(), '<p><label for="username">Username</label> <input type="text" name="username" id="username" value="user1"></p>\n\
<p><label for="password">Password</label> <input type="password" name="password" id="password" value="mypass"></p>\n\
<p><label for="email">Email</label> <input type="text" name="email" id="email" value="user1@domain.com"></p>\n\
<p><label for="isSuperuser">Is Superuser</label> <input type="checkbox" name="isSuperuser" id="isSuperuser"></p>\n\
<p><label for="age">Age</label> <input type="text" name="age" id="age" value="26"></p>\n\
<p><label for="permissions">Permissions</label> <select name="permissions" id="permissions">\n\
<option value="all" selected>All</option>\n\
<option value="readonly">Read Only</option>\n\
<option value="readwrite">Read/Write</option>\n\
</select></p>');
			test.done();
		},

	
	'nameToLabel': function(test) {
		var form = new MyForm();

		test.equal(form.nameToLabel('variable'), 'Variable');
		test.equal(form.nameToLabel('isAdmin'), 'Is Admin');
		test.equal(form.nameToLabel('isYouAdmin'), 'Is You Admin');

		test.done();
	}
});