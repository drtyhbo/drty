var drty = require('../lib/drty'),
	forms = drty.forms;

exports.LoginForm = forms.add({
	username: forms.fields.string(),
	password: forms.fields.string()
});

exports.RegisterForm = forms.add({
	username: forms.fields.string(),
	email: forms.fields.string(),
	verifyEmail: forms.fields.string(),
	password: forms.fields.string(),
	verifyPassword: forms.fields.string()
});