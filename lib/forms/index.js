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
		this.__dirtyValues = values || {};
		this.__cleanValues = {};
		this.__errors = {};
	},
	
	toString: function() { return this.asTable(); },

	clean: function() {
		var isValid = true;

		var meta = this.constructor.__meta;
		for (var name in meta.fields) {
			var field = meta.fields[name];

			try {
				this.__cleanValues[name] = field.toJS(field.widget.toJS(this.__dirtyValues));
				field.validate(this.__cleanValues[name]);
			} catch(e) {
				if (!(e instanceof ValidationError)) { throw e; }
				this.__errors[name] = e.msg;
				isValid = false;
			}
		}

		return isValid;
	},

	nameToLabel: function(name) {
		return name.charAt(0).toUpperCase() + name.substr(1).replace(/([a-z])([A-Z])/g, '$1 $2');
	},
	
	asTable: function() {
		var html = '';

		var meta = this.constructor.__meta;
		for (var name in meta.fields) {
			var field = meta.fields[name],
				value = field.fromJS(this.__cleanValues[name]
					|| this.__dirtyValues[name] || field.initial);

			if (field.widget.isHidden()) {
				html += field.widget.render(value);
			} else {
				var label = field.label || this.nameToLabel(name),
					error = this.__errors[name] ? ('<div class="error">' + this.__errors[name] + '</div>') : '';
				html += '<tr ' + (error ? 'class="error"' : '') + '><td valign="top"><label for="'
					+ name + '">' + label + '</td><td valign="top">' + field.widget.render(value)
					+ error + '</td></tr>\n';
			}
		}
		return html;
	}
});
Form.__onExtend__ = function(NewForm, properties) {
	// Extract the fields
	var fields = {};
	drty.utils.each(properties, function(key, value) {
		if (!value.fieldType) { return; }
		fields[key] = value;
	});
	
	for (var name in fields) {
		fields[name].widget.name = name;
	}

	NewForm.__meta = {fields: fields};
	NewForm.__onExtend = arguments.callee;
}

// ----------------------------------------
// Fields
// ----------------------------------------

var Field = exports.Field = drty.Class.extend({
	initial: '',

	initialize: function(options) {
		options = options || {};

		this.options = options;
		this.widget = options.widget || new this.defaultWidget();
		this.error = '';
	},
	
	fromJS: function(value) { return value; },
	toJS: function(value) { return value; },

	validate: function(value) {
		var isRequired = (!('required' in this.options)
			|| !this.options.required);
		if (!value && isRequired) {
			throw new ValidationError('This field is required');
		}
	}
});

var IntegerField = exports.IntegerField = Field.extend({
	fieldType: 'integer',
	defaultWidget: widgets.InputBox,

	toJS: function(value) {
		var numberValue = parseInt(value, 10);
		return isNaN(numberValue) ? value : numberValue;
	},
	validate: function(value) {
		this.parent(value);
		if (isNaN(parseInt(value, 10))) {
			throw new ValidationError('An integer is required');
		}
	}
});

var CharField = exports.CharField = Field.extend({
	fieldType: 'string',
	defaultWidget: widgets.TextInput
});

var TextField = exports.Textfield = Field.extend({
	fieldType: 'text',
	defaultWidget: widgets.Textarea
});

var BooleanField = exports.BooleanField = Field.extend({
	fieldType: 'boolean',
	defaultWidget: widgets.CheckboxInput,

	validate: function(value) { return true; }
});

var ChoiceField = exports.ChoiceField = Field.extend({
	fieldType: 'choice'	,
	defaultWidget: widgets.Select
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