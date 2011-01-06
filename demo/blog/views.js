var drty = require('drty'),
	forms = require('./forms');

exports.loginView = function(request, response) {
	var form;
	if (request.method == 'POST') {
		
	} else {
		form = new forms.LoginForm();
	}

	drty.template.loadAndRender('login.tpl', {form: form}, function(html) {
		response.ok(html);
	});
}