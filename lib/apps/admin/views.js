var dirty = require('../../dirty');

// -- VIEWS --
function renderTemplate(filename, context, request, response) {
	var path = require('path'),
		templateDir = path.join(__dirname, 'templates/');

	context = Object.merge(context || {}, {
		user: request.user,
		MEDIA_URL: dirty.apps.admin.config.MEDIA_URL
	});
	
	dirty.templates.render(path.join(templateDir, filename),
		context, response.ok.bind(response));
}

var ForeignKeyField = new Class({
	Extends: dirty.forms.fields.IntegerField,
	defaultWidget: dirty.forms.widgets.ChoiceBox,

	fromJS: function(value) {
		return typeof(value) == 'number'
			? value
			: (value && 'id' in value && value.id) || '';
	}
});

function modelToForm(model, callback) {
	var columns = [];
	Object.each(model.__meta.columns, function(column, name) {
		columns.push({
			name: name,
			column: column
		});
	});

	var properties = {};
	var next = (function() {
		if (!columns.length) {
			callback(dirty.forms.add(properties));
			return;
		}

		var name = columns[0].name,
			column = columns[0].column;
		columns.shift();

		switch(column.fieldType) {
			case 'string':
			case 'integer':
			case 'boolean':
			case 'text':
				properties[name] = dirty.forms.fields[column.fieldType]({
					widget: column.isPrimaryKey() 
						? (new dirty.forms.widgets.HiddenInputBox())
						: null,
					attr: {
						class: column.fieldType
					}
				});
				next();
				break;
			case 'foreignkey':
				column.model.objects.fetch(function(models) {
					var choices = {};
					for (var i = 0, model; (model = models[i]); i++) {
						choices[model.id] = String(model);
					}

					properties[name] = new ForeignKeyField({
						attr: {
							choices: choices
						}
					});
					next();
				}.bind(this));
				break;
			default:
				next();
				break;
		}
	}).bind(this);
	next();
}

exports.adminLogout = function(request, response) {
	request.user.logout(request);
	response.redirect(dirty.urls.reverse('__adminLogin'));
}

exports.adminLogin = function(request, response) {
	function render(error, username) {
		renderTemplate('login.tpl', {
			error: error || '',
			username: username || ''
		}, request, response);
	}

	if (request.method == 'POST') {
		var username = request.POST['username'],
			password = request.POST['password'];
		if (!username || !password) {
			render('Username and Password required', username);
		} else {
			dirty.apps.auth.authenticate(username, password, function(user) {
				if (!user) {
					render('Username or password invalid', username);
				} else if (!user.isAdmin) {
					render('User must be an admin', username);
				} else {
					user.login(request);
					response.redirect(dirty.urls.reverse('__adminHome'));
				}
			});
		}
	} else { 
		render();
	}
}

exports.adminHome = function(request, response) {
	var models = dirty.models.getAll(),
		modelList = [];
	for (var tableName in models) {
		modelList.push({
			id: tableName,
			name: tableName
		});
	}
	modelList.sort(function(a, b) {
		return a.name < b.name ? -1 : 1;
	});
	
	renderTemplate('home.tpl', {
		models: modelList
	}, request, response);
}

exports.adminModel = function(request, response) {
	var Model = dirty.models.getAll()[request.params.model];

	if (!Model) {
		response.redirect(dirty.urls.reverse('__adminHome'));
	} else {
		Model.objects.fetch(function(items) {
			renderTemplate('model.tpl', {
				model: request.params.model,
				items: items
			}, request, response);
		});
	}
}

exports.adminChange = function(request, response) {
	var ModelCtor = dirty.models.getAll()[request.params.model],
		isNew = !Boolean(request.params.id);

	function render(ModelCtor, model) {
		modelToForm(ModelCtor, function(Form) {
			if (request.method == "POST") {
				var form = new Form(request.POST);
				if (form.clean()) {
					if (!model) { model = new ModelCtor(); }

					for(var name in form) {
						var column = model.__meta.columns[name];
						if (!column) { continue; }

						model[name] = form[name];
					}

					if (isNew) {
						model.save(function(model) {
							response.redirect(dirty.urls.reverse('__adminChange',
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

			renderTemplate('change.tpl', {
				tableName: request.params.model,
				model: model,
				html: form.toTable()
			}, request, response);
		});
	}

	if (!ModelCtor) {
		response.redirect(dirty.urls.reverse('__adminHome'));
	} else {
		if (!isNew) {
			ModelCtor.objects.filter({id: request.params.id}).fetchOne(function(model) {
				if (!model) {
					response.redirect(dirty.urls.reverse('__adminHome'));
				} else {
					render(ModelCtor, model);
				}
			});
		} else {
			render(ModelCtor);
		}
	}
}