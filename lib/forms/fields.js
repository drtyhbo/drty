(function() {

var drty = require('drty'),
	widgets = require('./widgets'),
	ValidationError = require('./index').ValidationError;

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
		if ((value === undefined || value === '') && this.isRequired()) {
			throw new ValidationError('This field is required');
		}
	}
});

var IntegerField = exports.IntegerField = Field.extend({
	fieldType: 'integer',
	defaultWidget: widgets.TextInput,

	toJS: function(value) {
		if (!value && value != 0) { return value; }

		var intVal = parseInt(value, 10);
		// A float will correctly parse to an int. Verify that
		// the intVal as a string matches the passed in string.
		return String(intVal) == value ? intVal : NaN;
	},

	validate: function(value) {
		this.parent(value);
		if (value !== undefined && isNaN(value)) {
			throw new ValidationError('An integer is required');
		}
	}
});

var FloatField = exports.FloatField = Field.extend({
	fieldType: 'float',
	defaultWidget: widgets.TextInput,

	toJS: function(value) {
		return parseFloat(value);
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

var IPAddressField = exports.IPAddressField = CharField.extend({
	fieldType: 'ipaddress',
	validate: function(value) {
		this.parent(value);
		if (!/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(value)) {
			throw new ValidationError('A valid ip address is required');
		}
		var pieces = value.split('.');
		for (var i = 0; i < pieces.length; i++) {
			if (parseInt(pieces[i], 10) > 255) {
				throw new ValidationError('A valid ip address is required');
			}
		}
	}
});

})();