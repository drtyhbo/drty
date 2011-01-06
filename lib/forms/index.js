(function() {

var drty = require('drty'),
	widgets = require('./widgets');

// ----------------------------------------
// Form
// ----------------------------------------

var Form = exports.Form = drty.Class.extend({
	initialize: function(values) {
		this.dirtyValues = values || {};
		this.cleanValues = {};
	},
	
	toString: function() { return this.asTable(); },

	clean: function() {
		var isValid = true;

		var meta = this.constructor.__meta;
		for (var name in meta.fields) {
			var field = meta.fields[name];

			this.cleanValues[name] = field.toJS(field.widget.toJS(this.dirtyValues));
			isValid = isValid && field.validate(this.cleanValues[name]);
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
				value = field.fromJS(this.cleanValues[name]
					|| this.dirtyValues[name] || field.initial);

			if (field.widget.isHidden()) {
				html += field.widget.render(value);
			} else {
				var label = field.label || this.nameToLabel(name),
					error = field.error ? ('<span class="error">' + field.error + '</span>') : '';
				html += '<tr ' + (error ? 'class="error"' : '') + '><td><label for="'
					+ name + '">' + label + '</td><td>' + field.widget.render(value)
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
			this.error = 'This field is required';
			return false;
		}
		return true;
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
		if (!this.parent(value)) { return false; }
		if (isNaN(parseInt(value, 10))) {
			this.error = 'An integer is required';
			return false;
		}
		return true;
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

// ----------------------------------------
// Other exports
// ----------------------------------------

exports.widgets = widgets;

})();