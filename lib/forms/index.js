(function() {

var drty = require('drty'),
	widgets = require('./widgets');

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
// Fields
// ----------------------------------------

var Field = exports.Field = drty.Class.extend({
	initial: '',

	initialize: function(options) {
		options = options || {};

		this.options = options;
		this.widget = options.widget || new this.defaultWidget();
	},
	
	fromJS: function(value) { return value; },
	toJS: function(value) { return value; },
	
	isRequired: function() { return (!('required' in this.options) || this.options.required); },

	validate: function(value) {
		if ((value == undefined || value == '') && this.isRequired()) {
			throw new ValidationError('This field is required');
		}
	}
});

var IntegerField = exports.IntegerField = Field.extend({
	fieldType: 'integer',
	defaultWidget: widgets.TextInput,

	toJS: function(value) {
		var numberValue = parseInt(value, 10);
		return isNaN(numberValue) ? value : numberValue;
	},
	validate: function(value) {
		this.parent(value);
		if (value !== undefined && isNaN(value)) {
			throw new ValidationError('An integer is required');
		}
	}
});

var CharField = exports.CharField = Field.extend({
	fieldType: 'string',
	defaultWidget: widgets.TextInput
});

var TextField = exports.TextField = Field.extend({
	fieldType: 'text',
	defaultWidget: widgets.Textarea
});

var BooleanField = exports.BooleanField = Field.extend({
	fieldType: 'boolean',
	defaultWidget: widgets.CheckboxInput,

	validate: function(value) { return Boolean(value); }
});

var ChoiceField = exports.ChoiceField = Field.extend({
	fieldType: 'choice'	,
	defaultWidget: widgets.Select,
	
	initialize: function(options) {
		options = options || {};

		if (!options.choices) {
			throw new Error('Error: ChoiceField: choices parameter required when creating a ChoiceField.');
		}

		this.choices = options.choices || {};
		this.options = options;
		this.widget = options.widget || new this.defaultWidget({
			choices: options.choices
		});
	},
	
	validate: function(value) {
		this.parent(value);
		if (value !== undefined && !(value in this.choices)) {
			throw new ValidationError('Value is not in choices list');
		}
	}
});

var EmailField = exports.EmailField = CharField.extend({
	fieldType: 'email',
	validate: function(value) {
		this.parent(value);
		if (!/^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/.test(value)) {
			throw new ValidationError('A valid email address is required');
		}
	}
});

// ----------------------------------------
// Other exports
// ----------------------------------------

exports.widgets = widgets;

})();