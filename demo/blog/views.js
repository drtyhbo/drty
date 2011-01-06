var drty = require('drty'),
	forms = require('./forms');

exports.login = function(request, response) {
	var form;
	if (request.method == 'POST') {
		form = new forms.LoginForm(request.POST);
		form.clean();
	} else {
		form = new forms.LoginForm();
	}

	drty.template.loadAndRender('login.tpl', {form: form}, function(html) {
		response.ok(html);
	});
}

exports.logout = function(request, response) {
	if (request.user) {
		request.user.logout(request);
	}
	response.redirect(drty.urls.reverse('login'));
}

exports.register = function(request, response) {
	var form;
	if (request.method == 'POST') {
		form = new forms.RegisterForm(request.POST);
		form.clean();
	} else {
		form = new forms.RegisterForm();
	}

	drty.template.loadAndRender('register.tpl', {form: form}, function(html) {
		response.ok(html);
	});
	
}