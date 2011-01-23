(function() {

var drty = require('drty'),
	widgets = require('./widgets'),
	ValidationError = require('./index').ValidationError;

var errorMessages = {
	'required': 'This field is required',
	'invalid': 'Your entry is invalid',
	'minValue': 'Your entry is too small',
	'maxValue': 'Your entry is too large',
	'invalidChoice': 'You have selected an invalid choice',
	'minLength': 'The string is too short',
	'maxLength': 'The string is too long',
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

var BooleanField = exports.BooleanField = Field.extend({
	fieldType: 'BooleanField',
	defaultWidget: widgets.CheckboxInput,

	validate: function(value) { return Boolean(value); }
});

var CharField = exports.CharField = Field.extend({
	fieldType: 'CharField',
	defaultWidget: widgets.TextInput,

	validate: function(value) {
		this.parent(value);
		if (this.options.minLength && value.length < this.options.minLength) {
			throw new ValidationError(this.getError('minLength'));
		}
		if (this.options.maxLength && value.length > this.options.maxLength) {
			throw new ValidationError(this.getError('maxLength'));
		}
	}
});

var ChoiceField = exports.ChoiceField = Field.extend({
	fieldType: 'ChoiceField',
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

var NullBooleanField = exports.NullBooleanField = ChoiceField.extend({
	fieldType: 'NullBooleanField',

	toJS: function(value) {
		return value == '-1'
			? null
			: value == '1';
	},
	fromJS: function(value) {
		return value === null 
			? '-1'
			: value && '1' || '0';
	},

	initialize: function(options) {
		this.parent(drty.utils.merge({
			choices: {
				'-1': 'Unknown',
				'0': 'No',
				'1': 'Yes'
			}
		}, options));
	}
});

var EmailField = exports.EmailField = CharField.extend({
	fieldType: 'EmailField',
	initialize: function(options) {
		this.parent(drty.utils.merge({
			errorMessages: {'invalid': 'A valid email address is required'}
		}, options));
	},

	validate: function(value) {
		this.parent(value);
		if (value && !/^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/.test(value)) {
			throw new ValidationError(this.getError('invalid'));
		}
	}
});

var FloatField = exports.FloatField = Field.extend({
	fieldType: 'FloatField',
	defaultWidget: widgets.TextInput,

	initialize: function(options) {
		this.parent(drty.utils.merge({
			errorMessages: {'invalid': 'A float is required'}
		}, options));
	},

	toJS: function(value) {
		if (!value && value != 0) { return value; }
		return parseFloat(value);
	},

	validate: function(value) {
		this.parent(value);
		if (value !== undefined && isNaN(parseFloat(value))) {
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

var IntegerField = exports.IntegerField = Field.extend({
	fieldType: 'IntegerField',
	defaultWidget: widgets.TextInput,

	initialize: function(options) {
		this.parent(drty.utils.merge({
			errorMessages: { 'invalid': 'An integer is required' }
		}, options));
	},

	toJS: function(value) {
		if (!value && value != 0) { return value; }
		return parseInt(value, 10);
	},

	validate: function(value) {
		this.parent(value);
		
		var intVal = parseInt(value, 10);
		if (value !== undefined 
				&& (isNaN(intVal) || String(intVal) != value)) {
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

var IPAddressField = exports.IPAddressField = CharField.extend({
	fieldType: 'IPAddressField',
	initialize: function(options) {
		this.parent(drty.utils.merge({
			errorMessages: {'invalid': 'A valid ip address is required'}
		}, options));
	},

	validate: function(value) {
		this.parent(value);
		if (value) {
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
	}
});

var TextField = exports.TextField = CharField.extend({
	fieldType: 'TextField',
	defaultWidget: widgets.Textarea
});

})();