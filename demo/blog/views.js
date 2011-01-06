var drty = require('drty'),
	forms = require('./forms');

exports.login = function(request, response) {
	function render(context) {
		drty.template.loadAndRender('login.tpl', context, function(html) {
			response.ok(html);
		});
	}

	if (request.method == 'POST') {
		var form = new forms.LoginForm(request.POST);
		if (form.clean()) {
			var username = form.cleanValues.username,
				password = form.cleanValues.password;

			drty.contrib.auth.authenticate(username, password, function(user) {
				if (!user) {
					render({
						form: form,
						error: 'Invalid username or password'
					});
				} else {
					response.redirect()
				}
			});
		} else {
			render({form: form});
		}
	} else {
		render({form: new forms.LoginForm()});
	}
}

exports.register = function(request, response) {
	function render(context) {
		drty.template.loadAndRender('register.tpl', context, function(html) {
			response.ok(html);
		});
	}

	if (request.method == 'POST') {
		var form = new forms.RegisterForm(request.POST);
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
		} else {
			render({form: form});
		}
	} else {
		render({form: new forms.RegisterForm()});
	}
}

exports.logout = [
	drty.contrib.auth.loginRequired,
	function(request, response) {
		if (request.user) {
			request.user.logout(request);
		}
		response.redirect(drty.urls.reverse('login'));
	}
];

exports.home = [
	drty.contrib.auth.loginRequired,
	function(request, response) {
		response.ok('home');
	}
];