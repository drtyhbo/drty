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

	Model.toForm(function(NewForm) {  
		function processPOST(model) {
			function render(form) {
				renderTemplate(request, response, 'change.tpl', {
					modelName: request.params.model,
					model: form.model || null,
					form: form
				});
			}

			// if it's a post, save the form with the new data
			if (request.method == "POST") {
				if (request.POST.submit == 'Delete' && model) {
					model.delete();
					response.redirect(drty.urls.reverse('__adminModel',
						request.params.model));
				} else {
					var form = new NewForm(request.POST, model);
					form.save(function(err, form) {
						if (err) {
							nav.render(form);
						} else {
							response.redirect(drty.urls.reverse('__adminModel',
								request.params.model));
						}
					});
				}
			} else {
				// otherwise generate a new form
				render(new NewForm(null, model));
			}
		}

		if (request.params.id) {
			Model.objects.filter({id: request.params.id}).fetchOne(function(err, model) {
				if (err) {
					response.redirect(drty.urls.reverse('__adminHome'));
				} else if (!model) {
					response.error();
				} else {
					processPOST(model);
				}
			});
		} else {
			processPOST();
		}
	});
}

];