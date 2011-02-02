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
	function render(form, error) {
		renderTemplate(request, response, 'login.tpl', {
			error: error || null,
			form: form
		});
	}

	var form;
	if (request.method == 'POST') {
		form = new forms.LoginForm(request.POST);
		
		form.clean(function(err) {
			if (err) { return render(form); }

			var User = drty.contrib.auth.models.User;
			User.authenticate(form.username, form.password, function(error, user) {
				if (error || !user.isAdmin) {
					render(form, error ? error.message : 'Admin privileges required');
				} else {
					user.login(request);
					response.redirect(drty.urls.reverse('__adminHome'));
				}
			});
		});
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
		var models = Object.keys(drty.db.models.getAll());
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
		var Model = drty.db.models.getAll()[request.params.model];
		if (!Model) {
			response.redirect(drty.urls.reverse('__adminHome'));
			return;
		}

		drty.utils.nav({
			'createForm': function(nav) {
				Model.toForm(function(NewForm) {
					nav.loadModel(NewForm);
				});
			},

			'loadModel': function(nav, NewForm) {
				// if there's a model id, load the model
				if (request.params.id) {
					Model.objects.filter({id: request.params.id}).fetchOne(function(err, model) {
						if (err) {
							response.redirect(drty.urls.reverse('__adminHome'));
						} else {
							nav.processPOST(NewForm, model);
						}
					});
				} else {
					nav.processPOST(NewForm);
				}
			},

			'processPOST': function(nav, NewForm, model) {
				// if it's a post, save the form with the new data
				if (request.method == "POST") {
					var form = new NewForm(request.POST, model);
					form.save(function(err, form) {
						if (err) {
							nav.render(form);
							return;
						}
						if (form && !request.params.id) {
							response.redirect(drty.urls.reverse('__adminChange',
								request.params.model,
								form.model.id));
						} else {
							nav.render(form, model);
						}
					});
				} else {
					// otherwise generate a new form
					nav.render(new NewForm(model, model), model);
				}					
			},

			'render': function(nav, form, model) {
				renderTemplate(request, response, 'change.tpl', {
					modelName: request.params.model,
					model: model || null,
					form: form
				});
			}
		});
	}
];