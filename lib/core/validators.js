(function() {

var ValidationError = require('./exceptions').ValidationError;

var regexValidator = exports.regexValidator = function(re, message, code) {
	if (!(re instanceof RegExp)) {
		re = new RegExp(re);
	}

	return function(value, cb) {
		cb(!re.test(value)
			? new ValidationError(message || 'The entry is invalid', code || 'invalid')
			: null);
	}
}

exports.validateEmail = regexValidator(/^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/i,
	'A valid email address is required');
exports.validateSlug = regexValidator(/^[a-zA-Z0-9_-]*$/,
	'This field can only contain letters, numbers, underscores or hyphens');
exports.validateIpv4Address = regexValidator(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
	'A valid ip address is required');
exports.validateURL = regexValidator(/^(ftp|https?):\/\/([_a-z\d\-]+(\.[_a-z\d\-]+)+)(([_a-z\d\-\\\.\/]+[_a-z\d\-\\\/])+)*(\?.*)?$/,
	'A valid url is required');
	
exports.validateURLExists = function(value, cb) {
	require('request')({url: value}, function(error) {
		cb(error
			? new ValidationError('The URL is invalid', 'invalid_link')
			: null);
	});
}

exports.validateFloat = function(value, cb) {
	cb(isNaN(parseFloat(value))
		? new ValidationError('A float is expected', 'invalid')
		: null);
}

exports.validateInteger = function(value, cb) {
	var intVal = parseInt(value, 10);
	cb(isNaN(intVal) || String(intVal) != value
		? new ValidationError('An integer is expected', 'invalid')
		: null);
}

function propertyValidator(isGt, reference, message, code, property) {
	return function(value, cb) {
		value = property ? value[property] : value;
		cb((isGt ? (value > reference) : (value < reference))
			? new ValidationError(message, code)
			: null);
	}
}

exports.maxValueValidator = function(maxValue) {
	return propertyValidator(true, maxValue,
		'Ensure the value is less than ' + maxValue, 'maxValue');
}

exports.minValueValidator = function(minValue) {
	return propertyValidator(false, minValue,
		'Ensure the value is greater than ' + minValue, 'minValue');
}

exports.maxLengthValidator = function(maxLength) {
	return propertyValidator(true, maxLength,
		'Too many characters. Max length: ' + maxLength, 'maxLength', 'length');
}

exports.minLengthValidator = function(minLength) {
	return propertyValidator(false, minLength,
		'Too few characters. Min length: ' + minLength, 'minLength', 'length');
}

exports.inListValidator = function(choices) {
	var message = 'Invalid selection',
		code = 'invalidChoice';

	return function(value, cb) {
		var err = null;
		if (value instanceof Array) {
			for (var i = 0; i < value.length; i++) {
				if (!(value[i] in choices)) {
					err = new ValidationError(message, code);
					break;
				}
			}
		} else if (!(value in choices)) {
			err = new ValidationError(message, code);
		}
		cb(err);
	}
}

exports.maxDigitsValidator = function(maxDigits) {
	return function(value, cb) {
		cb(value.replace('.', '').length > maxDigits
			? new ValidationError('Number contains too many digits', 'maxDigits')
			: null);			
	}
}

exports.decimalPlacesValidator = function(decimalPlaces) {
	return function(value, cb) {
		var decimal = value.split('.')[1];
		cb(decimal && decimal.length > decimalPlaces
			? new ValidationError('Number contains too many decimal places', 'maxDecimalPlaces')
			: null);
	}
}

})();