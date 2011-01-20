(function() {

var drty = require('drty');

// ----------------------------------------
// Exceptions
// ----------------------------------------
var ValidationError = exports.ValidationError = drty.Class.extend({
	initialize: function(msg) {
		this.msg = msg;
	}
});

// ----------------------------------------
// Form
// ----------------------------------------

var Form = exports.Form = drty.Class.extend({
	initialize: function(values) {
		this.dirtyValues = drty.utils.clone(values) || {};
		this.cleanValues = {};
		this.errors = {};
		
		var fields = this.getFields();
		for (var name in fields) {
			(function(form, name, field) {
				form.__defineGetter__(name, function() {
					var value = '';

					if (name in form.cleanValues) { value = form.cleanValues[name]; }
					else if (name in form.dirtyValues) { value = form.dirtyValues[name]; }
					else if ('initial' in field.options) { value = field.options.initial; }

					return value;
				});
				form.__defineSetter__(name, function(value) {
					delete form.cleanValues[name];
					form.dirtyValues[name] = value;
				});
			})(this, name, fields[name]);
		}
	},
	
	getFields: function() { return this.constructor.__meta.fields; },

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
				var value = field.toJS(field.widget.toJS(this.dirtyValues));
				field.validate(value);
				
				this.cleanValues[name] = value;
				delete this.dirtyValues[name];
			} catch(e) {
				if (!(e instanceof ValidationError)) { throw e; }
				this.errors[name] = e.msg;
				isValid = false;
			}
		}

		return isValid;
	},
	
	asTable: function() {
		var rows = [];

		var fields = this.getFields();
		for (var name in fields) {
			var field = fields[name],
				value = field.fromJS(this[name]);

			if (field.widget.isHidden()) {
				rows.push(field.widget.render(value));
			} else {
				var label = field.options.label || this.nameToLabel(name),
					error = this.errors[name] ? ('<div class="error">' + this.errors[name] + '</div>') : '';
				rows.push('<tr' + (error ? ' class="error"' : '') + '><td><label for="'
					+ name + '">' + label + '</td><td>' + field.widget.render(value)
					+ error + '</td></tr>');
			}
		}

		return rows.join('\n');
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

			NewClass.__meta = {
				fields: fields
			};
			
			return NewClass;
		}
	}
});

exports.formFromModel = function(Model, callback) {
	var columns = Model.getColumns(),
		prop = {};
	drty.utils.eachChained(columns, function(name, column, next) {
		if (!column._fieldType) { continue; }

		var options = column.getOptions();
		options.required = !('null' in options) || !options.null;

		var field
		switch(column._fieldType) {
			case 'IntegerField':
			case 'PositiveIntegerField':
			case 'SmallIntegerField':
			case 'PositiveSmallIntegerField':
				prop[name] = new exports.IntegerField(options);
				break;

			case 'FloatField':
				throw new Error('Error: FloatField is not supported in a ModelForm yet.')

			case 'CharField':
				prop[name] = new exports.CharField(options);
				break;

			case 'EmailField':
				prop[name] = new exports.EmailField(options);
				break;

			case 'TextField':
				prop[name] = new exports.TextField(options);
				break;

			case 'BooleanField':
			case 'NullBooleanField':
				prop[name] = new exports.BooleanField(options);
				break;

			case 'DateField':
				throw new Error('Error: DateField is not supported in a ModelForm yet.')

			case 'DateTimeField':
				throw new Error('Error: DateTimeField is not supported in a ModelForm yet.')

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
		}
		next();
	}, function() {
		callback(Form.extend(prop));
	});	
}

// ----------------------------------------
// Other exports
// ----------------------------------------

exports.widgets = require('./widgets');
drty.utils.mixin(exports, require('./fields'));

})();