var drty = require('drty'),
	forms = drty.forms;

exports.LoginForm = forms.Form.extend({
	username: new forms.CharField(),
	password: new forms.CharField({
			widget: new forms.widgets.PasswordInput()
		})
});

exports.RegisterForm = forms.Form.extend({
	username: new forms.CharField(),
	email: new forms.EmailField(),
	password: new forms.CharField({
			widget: new forms.widgets.PasswordInput()
		})
});

exports.CreateBlogForm = forms.Form.extend({
	title: new forms.CharField(),
	isPublic: new forms.BooleanField({label: 'Public?'})
});

exports.CreateEntryForm = forms.Form.extend({
	title: new forms.CharField(),
	body: new forms.TextField()
});