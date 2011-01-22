(function() {

var drty = require('drty'),
	widgets = require('./widgets'),
	ValidationError = require('./index').ValidationError;

var errorMessages = {
	'required': 'This field is required',
	'invalid': 'Your entry is invalid',
	'minValue': 'Your entry is too small',
	'maxValue': 'Your entry is too large',
	'invalidChoice': 'You have selected an invalid choice'
};

var Field = exports.Field = drty.Class.extend({
	initial: '',

	initialize: function(options) {
		options = options || {};

		this.options = options;
		this.widget = options.widget || new this.defaultWidget();
	},
	
	getError: function(type) {
		return (this.options.errorMessages
			&& this.options.errorMessages[type]) || errorMessages[type];
	},
	
	fromJS: function(value) { return value; },
	toJS: function(value) { return value; },
	
	isRequired: function() { return (!('required' in this.options) || this.options.required); },

	validate: function(value) {
		if ((value === undefined || value === '') && this.isRequired()) {
			throw new ValidationError(this.getError('required'));
		}
	}
});

var NumberField = Field.extend({
	defaultWidget: widgets.TextInput,
	
	validate: function(value) {
		this.parent(value);
		if (value !== undefined && isNaN(value)) {
			throw new ValidationError(this.getError('invalid'));
		}
		if (this.options.minValue && value < this.options.minValue) {
			throw new ValidationError(this.getError('minValue'));
		}
		if (this.options.maxValue && value > this.options.maxValue) {
			throw new ValidationError(this.getError('maxValue'));
		}
	}	
});

var BooleanField = exports.BooleanField = Field.extend({
	fieldType: 'boolean',
	defaultWidget: widgets.CheckboxInput,

	validate: function(value) { return Boolean(value); }
});

var CharField = exports.CharField = Field.extend({
	fieldType: 'string',
	defaultWidget: widgets.TextInput
});

var ChoiceField = exports.ChoiceField = Field.extend({
	fieldType: 'choice'	,
	defaultWidget: widgets.Select,
	
	initialize: function(options) {
		options = options || {};

		if (!options.choices) {
			throw new Error('Error: choices parameter required when creating a ChoiceField.');
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
			throw new ValidationError(this.getError('invalidChoice'));
		}
	}
});

var EmailField = exports.EmailField = CharField.extend({
	fieldType: 'email',
	initialize: function(options) {
		this.parent(drty.utils.merge({
			errorMessages: {'invalid': 'A valid email address is required'}
		}, options));
	},

	validate: function(value) {
		this.parent(value);
		if (!/^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/.test(value)) {
			throw new ValidationError(this.getError('invalid'));
		}
	}
});

var FloatField = exports.FloatField = NumberField.extend({
	fieldType: 'float',

	initialize: function(options) {
		this.parent(drty.utils.merge({
			errorMessages: {
				'invalid': 'A float is required'
			}
		}, options));
	},

	toJS: function(value) {
		return parseFloat(value);
	}
});

var IntegerField = exports.IntegerField = NumberField.extend({
	fieldType: 'integer',

	initialize: function(options) {
		this.parent(drty.utils.merge({
			errorMessages: {
				'invalid': 'An integer is required'
			}
		}, options));
	},

	toJS: function(value) {
		if (!value && value != 0) { return value; }

		var intVal = parseInt(value, 10);
		// A float will correctly parse to an int. Verify that
		// the intVal as a string matches the passed in string.
		return String(intVal) == value ? intVal : NaN;
	},
});

var IPAddressField = exports.IPAddressField = CharField.extend({
	fieldType: 'ipaddress',
	initialize: function(options) {
		this.parent(drty.utils.merge({
			errorMessages: {'invalid': 'A valid ip address is required'}
		}, options));
	},

	validate: function(value) {
		this.parent(value);
		if (!/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(value)) {
			throw new ValidationError(this.getError('invalid'));
		}
		var pieces = value.split('.');
		for (var i = 0; i < pieces.length; i++) {
			if (parseInt(pieces[i], 10) > 255) {
				throw new ValidationError(this.getError('invalid'));
			}
		}
	}
});

var TextField = exports.TextField = Field.extend({
	fieldType: 'text',
	defaultWidget: widgets.Textarea
});

})();