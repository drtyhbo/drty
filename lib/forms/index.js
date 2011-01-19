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
		this.dirtyValues = values || {};
		this.cleanValues = {};
		this.errors = {};
	},
	
	getMeta: function() { return this.constructor.__meta; },
	toString: function() { return this.asTable(); },
	nameToLabel: function(name) {
		return name.charAt(0).toUpperCase() + name.substr(1).replace(/([a-z])([A-Z])/g, '$1 $2');
	},

	clean: function() {
		var isValid = true;

		var meta = this.getMeta();
		for (var name in meta.fields) {
			var field = meta.fields[name];

			try {
				this.cleanValues[name] = field.toJS(field.widget.toJS(this.dirtyValues));
				field.validate(this.cleanValues[name]);
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

		var meta = this.getMeta();
		for (var name in meta.fields) {
			var field = meta.fields[name],
				value = field.fromJS(this.cleanValues[name]
					|| this.dirtyValues[name] || field.options.initial || '');

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
		fromModel: function(Model, callback) {
			var columns = Model.getColumns(),
				prop = {};
			drty.utils.eachChained(columns, function(name, column, next) {
				if (!column._fieldType) { continue; }
				
				var field;
				switch(column._fieldType) {
					case 'IntegerField':
					case 'PositiveIntegerField':
					case 'SmallIntegerField':
					case 'PositiveSmallIntegerField':
						prop[name] = new exports.IntegerField();
						break;

					case 'FloatField':
						throw new Error('Error: FloatField is not supported in a ModelForm yet.')

					case 'CharField':
						prop[name] = new exports.CharField();
						break;

					case 'EmailField':
						prop[name] = new exports.EmailField();
						break;

					case 'TextField':
						prop[name] = new exports.TextField();
						break;

					case 'BooleanField':
					case 'NullBooleanField':
						prop[name] = new exports.BooleanField();
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

							prop[name] = new exports.ChoiceField({
								choices: choices
							});
							next();
						});
						return;
				}
				next();
			}, function() {
				callback(Form.extend(prop));
			});
		},
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

// ----------------------------------------
// Other exports
// ----------------------------------------

exports.widgets = require('./widgets');
drty.utils.mixin(exports, require('./fields'));

})();