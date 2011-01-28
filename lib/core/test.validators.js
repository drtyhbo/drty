var validators = require('./validators'),
	testCase = require('nodeunit').testCase;

/*	var regexValidator = exports.regexValidator = function(re, message, code) {
		return function(value) {
			if (!re.test(value)) {
				throw new ValidationError(message || 'The entry is invalid', code || 'invalid');
			}
		}
	}

	function propertyValidator(isGt, reference, message, code, property) {
		return function(value) {
			value = property ? value[property] : value;
			if (isGt 
					? (value > reference)
					: (value < reference)) {
				throw new ValidationError(code);
			}
		}
	}

	exports.maxValueValidator = function(maxValue) {
		return propertyValidator(true, maxValue, 'Value is too large', 'max_value');
	}

	exports.minValueValidator = function(minValue) {
		return propertyValidator(false, minValue, 'Value is too small', 'min_value');
	}

	exports.maxLengthValidator = function(maxLength) {
		return propertyValidator(true, maxLength, 'Too many characters', 'max_length', 'length');
	}

	exports.minLengthValidator = function(minLength) {
		return propertyValidator(false, minLength,
			'Too few characters. Min: ' + minLength, 'min_length', 'length');
	}

	exports.inListValidator = function(choices, message, code) {
		return function(value) {
			if (value !== undefined) {
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
	}*/
module.exports = testCase({
	'validateEmail': function(test) {
		test.doesNotThrow(function() { validators.validateEmail('user@domain.com'); });
		test.doesNotThrow(function() { validators.validateEmail('user@domain.co.uk'); });
		test.doesNotThrow(function() { validators.validateEmail('first.last@domain.com'); });
		test.doesNotThrow(function() { validators.validateEmail('first.last@domain.co.uk'); });
		test.doesNotThrow(function() { validators.validateEmail('first-last@domain.com'); });
		test.doesNotThrow(function() { validators.validateEmail('first_last@domain.com'); });
		test.doesNotThrow(function() { validators.validateEmail('first+last@domain.com'); });
		
		test.throws(function() { validators.validateEmail('user@domain.'); });
		test.throws(function() { validators.validateEmail('user@'); });
		test.throws(function() { validators.validateEmail('user!@domain.com'); });
		test.throws(function() { validators.validateEmail('user@domain!.com'); });

		test.done();
	},
	
	'validateSlug': function(test) {
		test.doesNotThrow(function() { validators.validateSlug('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-'); });
		test.doesNotThrow(function() { validators.validateSlug('abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz'); });
		test.doesNotThrow(function() { validators.validateSlug('ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ'); });
		test.doesNotThrow(function() { validators.validateSlug('0123456789_-0123456789_-'); });
		
		function isValid(char) {
			return (char >= 'a' && char <= 'z')
				|| (char >= 'A' && char <= 'Z')
				|| (char >= '0' && char <= '9')
				|| char == '_'
				|| char == '-';
			
		}
		for (var i = 0; i < 255; i++) {
			var char = String.fromCharCode(i);
			if (isValid(char)) { continue; }

			test.throws(function() { field.validate(char); })
		}
		
		test.done();
	},
	
	'validateIpv4Address': function(test) {
		test.doesNotThrow(function() { validators.validateIpv4Address('123.213.99.0'); });
		test.doesNotThrow(function() { validators.validateIpv4Address('0.0.0.0'); });
		test.doesNotThrow(function() { validators.validateIpv4Address('255.255.255.255'); });

		test.throws(function() { validators.validateIpv4Address('1.1.1'); });
		test.throws(function() { validators.validateIpv4Address('256.256.256.256'); });
		test.throws(function() { validators.validateIpv4Address('1234.1.1.1'); });
		test.throws(function() { validators.validateIpv4Address('1.1234.1.1'); });
		test.throws(function() { validators.validateIpv4Address('1.1.1234.1'); });
		test.throws(function() { validators.validateIpv4Address('1.1.1.1234'); });
		
		test.done();		
	},

	'validateURL': function(test) {

		var protocols = ['http:', 'https:', 'ftp:'];

		for (var i = 0, protocol; (protocol = protocols[i]); i++) {
			test.doesNotThrow(function() { validators.validateURL(protocol + '//test.com'); });
			test.doesNotThrow(function() { validators.validateURL(protocol + '//www.test.com'); });
			test.doesNotThrow(function() { validators.validateURL(protocol + '//test.com/path'); });
			test.doesNotThrow(function() { validators.validateURL(protocol + '//www.test.com/path'); });
			test.doesNotThrow(function() { validators.validateURL(protocol + '//test.com/path/path2'); });
			test.doesNotThrow(function() { validators.validateURL(protocol + '//www.test.com/path/path2'); });
			test.doesNotThrow(function() { validators.validateURL(protocol + '//test.com/path/path2.html'); });
			test.doesNotThrow(function() { validators.validateURL(protocol + '//www.test.com/path/path2.html'); });
			test.doesNotThrow(function() { validators.validateURL(protocol + '//test.com/path/path2.html?q=1'); });
			test.doesNotThrow(function() { validators.validateURL(protocol + '//www.test.com/path/path2.html?q=1'); });
		}
		
		test.throws(function() { validators.validateURL('http:/test.com'); });
		test.throws(function() { validators.validateURL('http://te!st.com'); });
		test.throws(function() { validators.validateURL('htp://test.com'); });
		test.throws(function() { validators.validateURL('http//test.com'); });
		test.throws(function() { validators.validateURL('http:test.com'); });
		test.throws(function() { validators.validateURL('http://test.com/this is a path with spaces/'); });

		test.done();
	},
	
	'maxValueValidator': function(test) {
		var validator = validators.maxValueValidator(100);
		
		test.doesNotThrow(function() { validator(50); });
		test.doesNotThrow(function() { validator(100); })

		test.throws(function() { validator(101); });
		test.done();
	},

	'minValueValidator': function(test) {
		var validator = validators.minValueValidator(100);
		
		test.doesNotThrow(function() { validator(101); });
		test.doesNotThrow(function() { validator(100); })

		test.throws(function() { validator(50); });
		test.done();
	},

	'maxLengthValidator': function(test) {
		var validator = validators.maxLengthValidator(5);
		
		test.doesNotThrow(function() { validator('ab'); });
		test.doesNotThrow(function() { validator('abcde'); })

		test.throws(function() { validator('abcdef'); });
		test.throws(function() { validator('      '); });

		test.done();
	},

	'minLengthValidator': function(test) {
		var validator = validators.minLengthValidator(5);
		
		test.doesNotThrow(function() { validator('abcde'); });
		test.doesNotThrow(function() { validator('abcdef'); })

		test.throws(function() { validator('abcd'); });
		test.throws(function() { validator('    '); });

		test.done();
	},

	'inListValidator': function(test) {
		var validator = validators.inListValidator({
			'1': '',
			'2': '',
			'3': '',
			'4': ''
		});

		test.doesNotThrow(function() { validator(1); });
		test.doesNotThrow(function() { validator(2); });
		test.doesNotThrow(function() { validator(3); })
		test.doesNotThrow(function() { validator(4); });
		test.doesNotThrow(function() { validator([1, 2]); });
		test.doesNotThrow(function() { validator([1, 4]); });

		test.throws(function() { validator(5); });
		test.throws(function() { validator([1, 2, 5]); });

		validator = validators.inListValidator([1, 2, 3, 4]);

		try {
			validator(5);
		} catch(e) {
			test.equal(e.code, 'invalidChoice');
		}
		
		test.done();
	}

});