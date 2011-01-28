(function() {

var drty = require('drty'),
	widgets = require('./widgets'),
	validators = drty.core.validators,
	ValidationError = drty.core.exceptions.ValidationError;

var errorMessages = {
	'required': 'This field is required',
	'invalid': 'Your entry is invalid',
	'minValue': 'Your entry is too small',
	'maxValue': 'Your entry is too large',
	'invalidChoice': 'You have selected an invalid choice',
	'minLength': 'The string is too short',
	'maxLength': 'The string is too long',
	'invalidChoice': 'You have selected an invalid choice',
	'maxDigits': 'Number contains too many digits',
	'maxDecimalPlaces': 'Number contains too many decimal places'
};

var Field = exports.Field = drty.Class.extend({
	initial: '',

	initialize: function(options) {
		options = options || {};

		this.options = options;
		this.widget = options.widget || new this.defaultWidget();

		this.defaultValidators = this.isRequired()
			? [validators.validateNotNull]
			: [];
	},
	
	getError: function(type) {
		return this.options.errorMessages && this.options.errorMessages[type];
	},
	
	fromJS: function(value) { return value; },
	toJS: function(value) { return value; },
	
	isRequired: function() { return (!('required' in this.options) || this.options.required); },

	validate: function(value) {
		var validators = this.defaultValidators
			.concat(this.options.validators || []);
		for (var i = 0, validator; (validator = validators[i]); i++) {
			validator(value);
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

	initialize: function(options) {
		this.parent(options);
		if (this.options.minLength) {
			this.defaultValidators.push(validators.minLengthValidator(this.options.minLength));
		}
		if (this.options.maxLength) {
			this.defaultValidators.push(validators.maxLengthValidator(this.options.maxLength));			
		}
	}
});

var ChoiceField = exports.ChoiceField = Field.extend({
	fieldType: 'ChoiceField',
	defaultWidget: widgets.Select,
	
	initialize: function(options) {
		if (!options || !options.choices) {
			throw new Error('Error: choices parameter required when creating a ChoiceField.');
		}

		options = drty.utils.clone(options);
		options.widget = options.widget || new this.defaultWidget({
			choices: options.choices
		});
		this.parent(options);

		this.defaultValidators.push(validators.inListValidator(options.choices));
	}
});

var MultipleChoiceField = exports.MultipleChoiceField = ChoiceField.extend({
	fieldType: 'MultipleChoiceField',
	defaultWidget: widgets.SelectMultiple
});

var TypedChoiceField = exports.TypedChoiceField = ChoiceField.extend({
	fieldType: 'TypedChoiceField',
	
	initialize: function(options) {
		this.parent(drty.utils.merge({
				coerce: function(val) { return val; },
				emptyValue: null
			}, options));
	},
	
	toJS: function(value) {
		if (value === '' || value === undefined) {
			return this.options.emptyValue;
		}
		return this.options.coerce(value);
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

var FloatField = exports.FloatField = Field.extend({
	fieldType: 'FloatField',
	defaultWidget: widgets.TextInput,

	initialize: function(options) {
		this.parent(options);

		this.defaultValidators.push(validators.validateFloat);
		if (this.options.minValue) {
			this.defaultValidators.push(validators.minValueValidator(this.options.minValue));
		}
		if (this.options.maxValue) {
			this.defaultValidators.push(validators.maxValueValidator(this.options.maxValue));
		}
	},

	toJS: function(value) {
		if (!value && value != 0) { return value; }
		return parseFloat(value);
	}
});

var DecimalField = exports.DecimalField = FloatField.extend({
	fieldType: 'DecimalField',
	
	initialize: function(options) {
		this.parent(options);

		if (this.options.maxDigits) {
			this.defaultValidators.push(validators.maxDigitsValidator(this.options.maxDigits));
		}
		if (this.options.decimalPlaces) {
			this.defaultValidators.push(validators.decimalPlacesValidator(this.options.decimalPlaces));
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
			throw new ValidationError(errorMessages['invalid'], 'invalid');
		}
		if (this.options.minValue && value < this.options.minValue) {
			throw new ValidationError(errorMessages['minValue'], 'minValue');
		}
		if (this.options.maxValue && value > this.options.maxValue) {
			throw new ValidationError(errorMessages['maxValue'], 'maxValue');
		}
	}
});

var RegexField = exports.RegexField = CharField.extend({
	fieldType: 'RegexField',
	defaultWidget: widgets.TextInput,
	
	initialize: function(options) {
		if (!options.regex) {
			throw new Error('regex option is required when using a RegexField');
		}

		this.regex = options.regex;
		if (!(this.regex instanceof RegExp)) {
			this.regex = new RegExp(this.regex);
		}

		this.parent(options);
	},
	
	validate: function(value) {
		this.parent(value);

		if (value && !(this.regex.test(value))) {
			throw new ValidationError(errorMessages['invalid'], 'invalid');
		}
	}
});

var EmailField = exports.EmailField = RegexField.extend({
	fieldType: 'EmailField',

	initialize: function(options) {
		this.parent(drty.utils.merge({
			errorMessages: {'invalid': 'A valid email address is required'},
			regex: /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/
		}, options));
	}
});

var IPAddressField = exports.IPAddressField = RegexField.extend({
	fieldType: 'IPAddressField',
	initialize: function(options) {
		this.parent(drty.utils.merge({
			errorMessages: {'invalid': 'A valid ip address is required'},
			regex: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
		}, options));
	}
});

var URLField = exports.URLField = RegexField.extend({
	fieldType: 'URLField',
	initialize: function(options) {
		this.parent(drty.utils.merge({
			errorMessages: {'invalid': 'A valid url is required'},
			regex: /^(ftp|http):\/\/([_a-z\d\-]+(\.[_a-z\d\-]+)+)(([_a-z\d\-\\\.\/]+[_a-z\d\-\\\/])+)*$/
		}, options));
	}
});

var SlugField = exports.SlugField = RegexField.extend({
	fieldType: 'SlugField',
	initialize: function(options) {
		this.parent(drty.utils.merge({
			errorMessages: {'invalid': 'Can only contain letters, numbers, underscores or hyphens'},
			regex: /^[a-zA-Z0-9_-]*$/
		}, options));
	}
});

var dateTimeInputFormats = [
	'%Y-%m-%d %H:%M:%S',
	'%Y-%m-%d %H:%M',
	'%Y-%m-%d',
	'%m/%d/%Y %H:%M:%S',
	'%m/%d/%Y %H:%M',
	'%m/%d/%Y',
	'%m/%d/%y %H:%M:%S',
	'%m/%d/%y %H:%M',
	'%m/%d/%y'
];

var DateTimeField = exports.DateTimeField = Field.extend({
	fieldType: 'DateTimeField',
	defaultWidget: widgets.TextInput,
	
	initialize: function(options) {
		var defaultOptions = {
			format: '%Y-%m-%d %H:%M:%S',
			errorMessages: { invalid: 'You have entered an invalid date and time.' }
		};
		if (!options || !options.inputFormats) {
			defaultOptions.inputFormats = dateTimeInputFormats;
		}
		this.parent(drty.utils.merge(defaultOptions, options));
	},
	
	toJS: function(value) {
		return this.stringToDate(value);
	},
	fromJS: function(value) {
		return drty.utils.strftime(value, this.options.format);
	},
	
	validate: function(value) {
		this.parent(value);
		if (value && !this.stringToDate(value)) {
			throw new ValidationError(errorMessages['invalid'], 'invalid');
		}
	},
	
	stringToDate: function(str) {
		for (var i = 0, inputFormat; (inputFormat = this.options.inputFormats[i]); i++) {
			var date = drty.utils.strptime(str, inputFormat);
			if (date) { return date; }
		}	
		return null;
	}
});

var dateInputFormats = [
	'%Y-%m-%d',
	'%m/%d/%Y',
	'%b %d %Y',
	'%b %d, %Y',
	'%d %b %Y',
	'%d %b, %Y',
	'%B %d %Y',
	'%B %d, %Y',
	'%d %B %Y',
	'%d %B, %Y',
]

var DateField = exports.DateField = DateTimeField.extend({
	fieldType: 'DateField',
	
	initialize: function(options) {
		var defaultOptions = {
			format: '%Y-%m-%d',
			errorMessages: { invalid: 'You have entered an invalid date.' }
		};
		if (!options || !options.inputFormats) {
			defaultOptions.inputFormats = dateInputFormats;
		}
		this.parent(drty.utils.merge(defaultOptions, options));
	}
});

var timeInputFormats = [
	'%H:%M:%S',
	'%H:%M',
]

var TimeField = exports.TimeField = DateTimeField.extend({
	fieldType: 'TimeField',
	
	initialize: function(options) {
		var defaultOptions = {
			format: '%H:%M:%S',
			errorMessages: { invalid: 'You have entered an invalid time.' }
		};
		if (!options || !options.inputFormats) {
			defaultOptions.inputFormats = timeInputFormats;
		}
		this.parent(drty.utils.merge(defaultOptions, options));
	}
});

var TextField = exports.TextField = CharField.extend({
	fieldType: 'TextField',
	defaultWidget: widgets.Textarea
});

})();