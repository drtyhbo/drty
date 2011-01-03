var drty = require('../lib/drty'),
	forms = drty.forms;

exports.LoginForm = forms.add({
	username: forms.fields.string(),
	password: forms.fields.string()
});