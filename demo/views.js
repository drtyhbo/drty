var drty = require('../lib/drty'),
	forms = require('./forms');
	
exports.root = function(request, response) {
	response.redirect(drty.urls.reverse('login'));
};

exports.login = function(request, response) {
	var form;
	if (request.method == "POST") {
		form = new forms.LoginForm(request.POST);
		if (form.clean()) {

		}
	} else {
		form = new forms.LoginForm();
	}
	drty.template.loadAndRender('login.tpl', {form: form}, function(html) {
		response.ok(html);
	})
};

exports.register = function(request, response) {
	var form;
	if (request.method == "POST") {
		form = new forms.RegisterForm(request.POST);
		if (form.clean()) {

		}
	} else {
		form = new forms.RegisterForm();
	}
	drty.template.loadAndRender('register.tpl', {form: form}, function(html) {
		response.ok(html);
	})
};