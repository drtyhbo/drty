(function() {

var drty = require('drty'),
	ValidationError = drty.core.exceptions.ValidationError;

// ----------------------------------------
// Form
// ----------------------------------------

var Form = exports.Form = drty.Class.extend({
	initialize: function(values) {
		values = values || {};

		this.dirtyValues = {};
		this.cleanValues = {};
		this.errors = {};

		var fields = this.getFields();
		for (var name in fields) {
			this.dirtyValues[name] = values[name];

			(function(form, name, field) {
				form.__defineGetter__(name, function() {
					var value = '';

					if (name in form.cleanValues) { value = form.cleanValues[name]; }
					else if (name in form.dirtyValues) { value = form.dirtyValues[name]; }
					else if (field.getInitial() !== undefined) { value = field.getInitial(); }

					return value;
				});
				form.__defineSetter__(name, function(value) {
					delete form.cleanValues[name];
					form.dirtyValues[name] = value;
				});
			})(this, name, fields[name]);
		}
	},
	
	getFields: function() { return this.constructor._meta.fields; },

	toString: function() { return this.asTable(); },
	nameToLabel: function(name) {
		return name.charAt(0).toUpperCase() + name.substr(1).replace(/([a-z])([A-Z])/g, '$1 $2');
	},

	clean: function() {
		var isValid = true;

		var fields = this.getFields();
		for (var name in fields) {
			var field = fields[name];

			try {
				var rawValue = field.widget.toJS(this.dirtyValues);
				field.validate(rawValue);

				this.cleanValues[name] = rawValue ? field.toJS(rawValue) : rawValue;
				delete this.dirtyValues[name];
			} catch(e) {
				if (!(e instanceof ValidationError)) { throw e; }
				this.errors[name] = field.getError(e.code) || e.msg;
				isValid = false;
			}
		}

		return isValid;
	},
	
	fieldsToHTML: function(format) {
		var rows = [];

		var fields = this.getFields();
		for (var name in fields) {
			var field = fields[name],
				value = (this[name] !== undefined && field.fromJS(this[name])) || '';

			if (field.widget.isHidden()) {
				rows.push(field.widget.render(value));
			} else {
				var label = field.getLabel() || this.nameToLabel(name),
					help = field.getHelpText() ? ('<span class="help_text">' + field.getHelpText() + '</span>') : '',
					error = this.errors[name] ? ('<div class="error">' + this.errors[name] + '</div>') : '';

				rows.push(format
					.replace('{{ label }}', '<label for="' + name + '">' + label + '</label>')
					.replace('{{ field }}', field.widget.render(value))
					.replace('{{ error }}', error)
					.replace('{{ help }}', help));
			}
		}

		return rows.join('\n');		
	},
	
	asTable: function() {
		return this.fieldsToHTML('<tr><td>{{ label }}</td><td>{{ field }}{{ help }}{{ error }}</td></tr>');
	},
	
	asP: function() {
		return this.fieldsToHTML('<p>{{ label }} {{ field }}{{ help }}{{ error }}</p>');
	},

	static: {
		extend: function(prop) {
			var NewClass = this.parent(prop);

			// Extract the fields
			var fields = {};
			drty.utils.each(NewClass.prototype, function(key, value) {
				if (!value.fieldType) { return; }
				fields[key] = value;
			});

			for (var name in fields) {
				fields[name].widget.name = name;
			}

			NewClass._meta = {
				fields: fields
			};
			
			return NewClass;
		}
	}
});

var ModelForm = Form.extend({
	save: function(callback) {
		var saveModel = function(model) {
			var fields = this.getFields(),
				columns = Model.getColumns();

			for(var name in fields) {
				var column = columns[name];
				if (!column || column._fieldType == 'AutoField') { continue; }

				model[name] = this[name];
			}

			model.save(function(err, model) {
				if (err) {
					callback(err, this);
				} else { 
					// Reload the model
					Model.objects.filter({pk: model.pk}).fetchOne(function(err, model) {
						callback(err, err && this || new this.constructor(model));
					}.bind(this));
				}
			}.bind(this));
		}.bind(this);

		if (!this.clean()) {
			var message = 'Form does not validate:\n';
			for (var name in this.errors) {
				message += '* ' + name + ' - ' + this.errors[name] + '\n';
			}
			callback(new Error(message), this);
		}

		var Model = this.Model,
			pk = this[Model.pk.getName()];

		if (pk) {
			Model.objects.filter({pk: pk}).fetchOne(function(err, model) {
				if (err) {
					callback(err, this);
				} else {
					saveModel(model);
				}
			});
		} else {
			saveModel(new Model());
		}
	}
});

exports.formFromModel = function(Model, callback) {
	var columns = Model.getColumns(),
		prop = {
			Model: Model
		};
	drty.utils.eachChained(columns, function(name, column, next) {
		if (!column._fieldType) { continue; }

		var options = drty.utils.clone(column.getOptions());
		options.required = !('null' in options) || !options.null;
		options.label = options.verboseName;

		switch(column._fieldType) {
			case 'AutoField':
				prop[name] = new exports.IntegerField({required: false});
				prop[name].widget = new exports.widgets.HiddenInput();
				break;
				
			case 'IntegerField':
			case 'PositiveIntegerField':
			case 'SmallIntegerField':
			case 'PositiveSmallIntegerField':
				prop[name] = new exports.IntegerField(options);
				break;

			case 'ForeignKey':
				column.otherModel.objects.fetch(function(models) {
					var choices = {};
					for (var i = 0, model; (model = models[i]); i++) {
						choices[model.id] = String(model);
					}

					options.choices = choices;
					prop[name] = new exports.ChoiceField(options);
					next();
				});
				return;

			default:
				if (exports[column._fieldType]) {
					prop[name] = new exports[column._fieldType](options);
				}
				break;
		}

		if ('editable' in options && !options.editable) {
			prop[name].widget = new prop[name].defaultWidget({
				readonly: true
			});
		}

		next();
	}, function() {
		callback(ModelForm.extend(prop));
	});	
}

// ----------------------------------------
// Other exports
// ----------------------------------------

exports.widgets = require('./widgets');
drty.utils.mixin(exports, require('./fields'));

})();