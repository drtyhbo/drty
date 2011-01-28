(function() {

var ValidationError = require('./exceptions').ValidationError;

var regexValidator = exports.regexValidator = function(re, message, code) {
	if (!(re instanceof RegExp)) {
		re = new RegExp(re);
	}

	return function(value) {
		if (!re.test(value)) {
			throw new ValidationError(message || 'The entry is invalid', code || 'invalid');
		}
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

exports.validateFloat = function(value) {
	if (isNaN(parseFloat(value))) {
		throw new ValidationError('A float is expected', 'invalid');
	}
}

exports.validateInteger = function(value) {
	var intVal = parseInt(value, 10);
	if (isNaN(intVal) || String(intVal) != value) {
		throw new ValidationError('An integer is expected', 'invalid');
	}
}

function propertyValidator(isGt, reference, message, code, property) {
	return function(value) {
		value = property ? value[property] : value;
		if (isGt 
				? (value > reference)
				: (value < reference)) {
			throw new ValidationError(message, code);
		}
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

	return function(value) {
		if (value instanceof Array) {
			for (var i = 0; i < value.length; i++) {
				if (!(value[i] in choices)) {
					throw new ValidationError(message, code);
				}
			}
		} else if (!(value in choices)) {
			throw new ValidationError(message, code);
		}
	}
}

exports.maxDigitsValidator = function(maxDigits) {
	return function(value) {
		if (value.replace('.', '').length > maxDigits) {
			throw new ValidationError('Number contains too many digits', 'maxDigits');			
		}
	}
}

exports.decimalPlacesValidator = function(decimalPlaces) {
	return function(value) {
		var decimal = value.split('.')[1];
		if (decimal && decimal.length > decimalPlaces) {
			throw new ValidationError('Number contains too many decimal places', 'maxDecimalPlaces');
			
		}
	}
}

})();