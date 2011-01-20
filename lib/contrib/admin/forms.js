(function() {

var drty = require('drty'),
	forms = drty.forms;

exports.LoginForm = forms.Form.extend({
	username: new forms.CharField(),
	password: new forms.CharField({
		widget: new forms.widgets.PasswordInput()
	})
});

})();