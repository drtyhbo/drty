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
			var value = values[name];
			this.dirtyValues[name] = value.pk && value.pk || value;

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

	clean: function(cb) {
		var invalidFields = [];

		var fields = this.getFields();
		drty.utils.eachChained(fields, function(name, field, next, done) {
			var value = field.widget.toJS(this.dirtyValues);
			field.validate(value, function(err) {
				if (err) {
					invalidFields.push(name);
					this.errors[name] = field.getError(err.code) || err.msg;
				} else {
					this.cleanValues[name] = value ? field.toJS(value) : value;
					delete this.dirtyValues[name];
				}
				next();
			}.bind(this));
		}.bind(this), function() {
			cb(invalidFields.length
				? new Error('The following fields do not validate: ' + invalidFields.join(', '))
				: null);
		}.bind(this));
	},
	
	fieldsToHTML: function(format) {
		var rows = [];
		var fields = this.getFields();
		for (var name in fields) {
			var field = fields[name],
				value = field.fromJS(this[name]);

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

// ----------------------------------------
// Other exports
// ----------------------------------------

exports.widgets = require('./widgets');
drty.utils.mixin(exports, require('./fields'));

})();