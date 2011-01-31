(function() {

var drty = require('drty'),
	widgets = require('./widgets'),
	validators = drty.core.validators,
	ValidationError = drty.core.exceptions.ValidationError;

var Field = exports.Field = drty.Class.extend({
	initial: '',

	initialize: function(options) {
		this._options = options || {};
		this.widget = this._options.widget || new this.defaultWidget();

		this.defaultValidators = [];
	},
	
	getError: function(type) {
		return this._options.errorMessages && this._options.errorMessages[type];
	},
	
	getInitial: function() { return this._options.initial; },
	getLabel: function() { return this._options.label; },
	getHelpText: function() { return this._options.helpText; },
	
	fromJS: function(value) { return value; },
	toJS: function(value) { return value; },
	
	isRequired: function() { return (!('required' in this._options) || this._options.required); },

	validate: function(value, cb) {
		if (value === undefined || value === '') {
			if (this.isRequired()) {
				cb(new ValidationError('This field is required', 'required'));
			}
		} else {
			var validators = this.defaultValidators
				.concat(this._options.validators || []);
			drty.utils.eachChained(validators, function(name, validator, next, done) {
				validator(value, function(err) {
					if (err) { done(err); }
					else { next(); }
				});
			}, cb);
		}
	}
});

var BooleanField = exports.BooleanField = Field.extend({
	fieldType: 'BooleanField',
	defaultWidget: widgets.CheckboxInput,

	toJS: function(value) { return Boolean(value); }
});

var CharField = exports.CharField = Field.extend({
	fieldType: 'CharField',
	defaultWidget: widgets.TextInput,

	initialize: function(options) {
		this.parent(options);
		if (this._options.minLength) {
			this.defaultValidators.push(validators.minLengthValidator(this._options.minLength));
		}
		if (this._options.maxLength) {
			this.defaultValidators.push(validators.maxLengthValidator(this._options.maxLength));			
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
				emptyValue: ''
			}, options));
	},
	
	toJS: function(value) {
		if (value === '' || value === undefined) {
			return this._options.emptyValue;
		}
		return this._options.coerce(value);
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

var NumberField = Field.extend({
	defaultWidget: widgets.TextInput,

	initialize: function(options) {
		this.parent(options);
		
		if (this._options && this._options.minValue) {
			this.defaultValidators.push(validators.minValueValidator(this._options.minValue));
		}
		if (this._options && this._options.maxValue) {
			this.defaultValidators.push(validators.maxValueValidator(this._options.maxValue));
		}
	}	
});

var FloatField = exports.FloatField = NumberField.extend({
	fieldType: 'FloatField',

	initialize: function(options) {
		this.parent(options);
		this.defaultValidators.push(validators.validateFloat);
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

		if (this._options && this._options.maxDigits) {
			this.defaultValidators.push(validators.maxDigitsValidator(this._options.maxDigits));
		}
		if (this._options && this._options.decimalPlaces) {
			this.defaultValidators.push(validators.decimalPlacesValidator(this._options.decimalPlaces));
		}
	}
});

var IntegerField = exports.IntegerField = NumberField.extend({
	fieldType: 'IntegerField',

	initialize: function(options) {
		this.parent(options);
		this.defaultValidators.push(validators.validateInteger);
	},

	toJS: function(value) {
		if (!value && value != 0) { return value; }
		return parseInt(value, 10);
	}
});

var RegexField = exports.RegexField = Field.extend({
	fieldType: 'RegexField',
	defaultWidget: widgets.TextInput,
	
	initialize: function(options) {
		if (!options.regex) {
			throw new Error('regex option is required when using a RegexField');
		}

		this.parent(options);		
		this.defaultValidators.push(validators.regexValidator(options.regex));
	}
});

var EmailField = exports.EmailField = Field.extend({
	fieldType: 'EmailField',
	defaultWidget: widgets.TextInput,

	initialize: function(options) {
		this.parent(options);
		this.defaultValidators.push(validators.validateEmail);
	}
});

var IPAddressField = exports.IPAddressField = Field.extend({
	fieldType: 'IPAddressField',
	defaultWidget: widgets.TextInput,

	initialize: function(options) {
		this.parent(options);
		this.defaultValidators.push(validators.validateIpv4Address);
	}
});

var URLField = exports.URLField = Field.extend({
	fieldType: 'URLField',
	defaultWidget: widgets.TextInput,

	initialize: function(options) {
		this.parent(options);
		this.defaultValidators.push(validators.validateURL);
	}
});

var SlugField = exports.SlugField = Field.extend({
	fieldType: 'SlugField',
	defaultWidget: widgets.TextInput,

	initialize: function(options) {
		this.parent(options);
		this.defaultValidators.push(validators.validateSlug);
	}
});

var DateTimeField = exports.DateTimeField = Field.extend({
	fieldType: 'DateTimeField',
	defaultWidget: widgets.TextInput,
	defaultInputFormats: [
		'%Y-%m-%d %H:%M:%S',
		'%Y-%m-%d %H:%M',
		'%Y-%m-%d',
		'%m/%d/%Y %H:%M:%S',
		'%m/%d/%Y %H:%M',
		'%m/%d/%Y',
	],
	defaultFormat: '%Y-%m-%d %H:%M:%S',
	errorMessageWhenInvalid: 'Valid date and time required',
	
	initialize: function(options) {
		this.parent(options);
		this.defaultValidators.push(function(value, cb) {
			cb(value && !this.stringToDate(value)
				? new ValidationError(this.errorMessageWhenInvalid, 'invalid')
				: null);
		}.bind(this));
	},
	
	toJS: function(value) {
		return this.stringToDate(value);
	},
	fromJS: function(value) {
		return drty.utils.strftime(this._options.format || this.defaultFormat, value);
	},

	stringToDate: function(str) {
		var inputFormats = this._options.inputFormats ||
			this.defaultInputFormats;

		for (var i = 0, inputFormat; (inputFormat = inputFormats[i]); i++) {
			var date = drty.utils.strptime(inputFormat, str);
			if (date) { return date; }
		}	
		return null;
	}
});

var DateField = exports.DateField = DateTimeField.extend({
	fieldType: 'DateField',
	defaultInputFormats: [
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
	],
	defaultFormat: '%Y-%m-%d',
	errorMessageWhenInvalid: 'Valid date required'
});


var TimeField = exports.TimeField = DateTimeField.extend({
	fieldType: 'TimeField',
	defaultInputFormats: [
		'%H:%M:%S',
		'%H:%M',
	],
	defaultFormat: '%H:%M:%S',
	errorMessageWhenInvalid: 'Valid time required'
});

var TextField = exports.TextField = CharField.extend({
	fieldType: 'TextField',
	defaultWidget: widgets.Textarea
});

var JSONField = exports.JSONField = Field.extend({
	fieldType: 'TextField',
	defaultWidget: widgets.Textarea,

	initialize: function(options) {
		this.parent(options);
		this.defaultValidators.push(function(value, cb) {
			var error = null;
			try {
				JSON.parse(value);
			} catch(e) {
				error = new ValidationError('JSON is expected', 'invalid');
			}
			cb(error);
		});
	},

	toJS: function(value) { return JSON.parse(value); },
	fromJS: function(value) { return JSON.stringify(value); }	
});

var FileField = exports.FileField = Field.extend({
	fieldType: 'FileField',
	defaultWidget: widgets.FileInput,
	
	fromJS: function(value) {
		return value && value.constructor != drty.core.files.UploadedFile
			? value
			: null;
	}
});

})();