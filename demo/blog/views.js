var drty = require('drty'),
	forms = require('./forms');

exports.login = function(request, response) {
	var form;
	if (request.method == 'POST') {
		form = new forms.LoginForm(request.POST);
		if (form.clean()) {
		}
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
	function render(context) {
		drty.template.loadAndRender('register.tpl', context, function(html) {
			response.ok(html);
		});
	}

	var form;
	if (request.method == 'POST') {
		form = new forms.RegisterForm(request.POST);
		if (form.clean()) {
			var username = form.cleanValues.username,
				password = form.cleanValues.password,
				email = form.cleanValues.email;

			drty.contrib.auth.createUser(username, password, email, '', '', function(user) {
				if (!user) {
					render({
						form: form,
						error: "'" + username + "' has already been taken!"
					});
				} else {
					response.redirect
				}

			});
		}
	} else {
		form = new forms.RegisterForm();
	}
	
	render({form: form});
}