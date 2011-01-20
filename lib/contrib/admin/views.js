var drty = require('drty'),
	forms = require('./forms'),
	directToTemplate = drty.views.generic.simple.directToTemplate;

var path = require('path'),
	templatesDir = path.join(__dirname, 'templates/');

// -- VIEWS --
function renderTemplate(request, response, filename, context) {
	context = drty.utils.merge(context, {
		BASE: path.join(templatesDir, 'base.tpl'),
		request: request
	});

	directToTemplate(request, response, path.join(templatesDir, filename),
		context);
}

exports.adminLogout = function(request, response) {
	request.user.logout(request);
	response.redirect(drty.urls.reverse('__adminLogin'));
}

exports.adminLogin = function(request, response) {
	function render(form) {
		renderTemplate(request, response, 'login.tpl', {
			form: form
		});
	}

	var form;
	if (request.method == 'POST') {
		form = new forms.LoginForm(request.POST);
		
		if (form.clean()) {
			var User = drty.contrib.auth.models.User;
			User.authenticate(form.username, form.password, function(error, user) {
				if (error) {
					render(form);
				} else {
					user.login(request);
					response.redirect(drty.urls.reverse('__adminHome'));
				}
			});
		} else {
			render(form);
		}
	} else { 
		render(new forms.LoginForm());
	}
}

function adminRequired(request, response, next) {
	if (!request.user || !request.user.isAdmin) {
		response.redirect(drty.urls.reverse('__adminLogin') + '?'
			+ require('querystring').stringify({next: request.url}));
	} else {
		next();
	}
}

exports.adminHome = [
	adminRequired,
	function(request, response) {
		var models = drty.utils.keys(drty.db.models.getAll());
		models.sort();
	
		renderTemplate(request, response, 'home.tpl', {
			models: models
		});
	}
];

exports.adminModel = [
	adminRequired,
	function(request, response) {
		var Model = drty.db.models.getAll()[request.params.model];

		if (!Model) {
			response.redirect(drty.urls.reverse('__adminHome'));
		} else {
			Model.objects.fetch(function(error, items) {
				renderTemplate(request, response, 'model.tpl', {
					modelName: request.params.model,
					items: items
				});
			});
		}
	}
];

exports.adminChange = [
	adminRequired,
	function(request, response) {
		var Model = drty.db.models.getAll()[request.params.model],
			isNew = !Boolean(request.params.id);

		function render(Model, model) {
			drty.forms.formFromModel(Model, function(Form) {
				if (request.method == "POST") {
					var form = new Form(request.POST);
					if (form.clean()) {
						if (!model) { model = new Model(); }

						var columns = Model.getColumns();
						for(var name in form) {
							var column = columns[name];
							if (!column) { continue; }

							model[name] = form[name];
						}

						if (isNew) {
							model.save(function(error, model) {
								response.redirect(drty.urls.reverse('__adminChange',
									request.params.model, model.id));
							});
							return;
						} else {
							model.save();
						}
					}
				} else {
					var form = new Form(model);
				}

				renderTemplate(request, response, 'change.tpl', {
					modelName: request.params.model,
					model: model,
					form: form
				});
			});
		}

		if (!Model) {
			response.redirect(drty.urls.reverse('__adminHome'));
		} else {
			if (!isNew) {
				Model.objects.filter({id: request.params.id}).fetchOne(function(error, model) {
					if (error) {
						response.redirect(drty.urls.reverse('__adminHome'));
					} else {
						render(Model, model);
					}
				});
			} else {
				render(Model);
			}
		}
	}
];