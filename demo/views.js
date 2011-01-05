var drty = require('../lib/drty'),
	forms = require('./forms');

function renderTemplate(filename, context, callback) {
	var context = drty.utils.merge(context, {
		MEDIA_URL: drty.urls.reverse('media')
	});
	
	drty.template.loadAndRender(filename, context, callback);
}
	
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
	renderTemplate('login.tpl', {form: form}, function(html) {
		response.ok(html);
	});
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
	renderTemplate('register.tpl', {form: form}, function(html) {
		response.ok(html);
	});
};