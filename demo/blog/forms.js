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
	verifyEmail: new forms.EmailField(),

	password: new forms.CharField({
			widget: new forms.widgets.PasswordInput()
		}),
	verifyPassword: new forms.CharField({
			widget: new forms.widgets.PasswordInput()
		}),
});