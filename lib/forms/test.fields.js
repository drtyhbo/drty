var drty = require('drty'),
	forms = require('./index'),
	testCase = require('nodeunit').testCase;

function validateRequired(test, ctor, okValue, requiredOptions) {
	requiredOptions = requiredOptions || {};

	var field = new ctor(requiredOptions);
	field.validate(okValue, function(err) { test.equal(err, null); });
	field.validate(undefined, function(err) { test.ok(err); });

	var field = new ctor(drty.utils.merge({required: true}, requiredOptions));
	field.validate(okValue, function(err) { test.equal(err, null); });
	field.validate(undefined, function(err) { test.ok(err); });

	var field = new ctor(drty.utils.merge({required: false}, requiredOptions));
	field.validate(okValue, function(err) { test.equal(err, null); });
	field.validate(undefined, function(err) { test.equal(err, null); });
}

function validateError(test, field, value, code) {
	field.validate(value, function(err) {
		test.ok(err);
		test.ok(err instanceof drty.core.exceptions.ValidationError);      
		test.equal(err.code, code);
	});
}

module.exports = testCase({
	'IntegerField': function(test) {
		var field = new forms.IntegerField({
			minValue: 25,
			maxValue: 100,
			errorMessages: {
				invalid: 'invalid',
				minValue: 'minValue',
				maxValue: 'maxValue'
			}
		});

		test.equal(field.fieldType, 'IntegerField');
		test.equal(field.toJS('100'), 100);
		test.ok(isNaN(field.toJS('abcd')));

		field.validate('100', function(err) { test.equal(err, null); });
		field.validate('25', function(err) { test.equal(err, null); });
		
		field.validate('abcd', function(err) { test.ok(err); });
		field.validate('100.5', function(err) { test.ok(err); });
		field.validate('100.0', function(err) { test.ok(err); });
		field.validate('24', function(err) { test.ok(err); });
		field.validate('101', function(err) { test.ok(err); });

		validateError(test, field, 'abcd', 'invalid');
		validateError(test, field, '24', 'minValue');
		validateError(test, field, '101', 'maxValue');

	//	validateRequired(test, forms.IntegerField, 50, test)

		test.done();
	},

	'FloatField': function(test) {
		var field = new forms.FloatField({
			minValue: 25,
			maxValue: 100,
			errorMessages: {
				invalid: 'invalid',
				minValue: 'minValue',
				maxValue: 'maxValue'
			}
		});

		test.equal(field.fieldType, 'FloatField');
		test.equal(field.toJS('100.556'), 100.556);

		test.ok(isNaN(field.toJS('abcd')));
		test.ok(!isNaN(field.toJS('100')));
		test.ok(!isNaN(field.toJS('100.23456')));

		field.validate('100', function(err) { test.equal(err, null); });
		field.validate('99.99', function(err) { test.equal(err, null); });
		field.validate('26.0', function(err) { test.equal(err, null); });

		field.validate('abcd', function(err) { test.ok(err); });
		field.validate('100.25', function(err) { test.ok(err); });
		field.validate('0', function(err) { test.ok(err); });

		validateError(test, field, 'abcd', 'invalid');
		validateError(test, field, '24', 'minValue');
		validateError(test, field, '101', 'maxValue');

		validateRequired(test, forms.FloatField, 50.05);

		test.done();
	},

	'DecimalField': function(test) {	
		var field = new forms.DecimalField({
			minValue: 25,
			maxValue: 10000000,
			maxDigits: 10,
			decimalPlaces: 4,
			errorMessages: {
				invalid: 'invalid',
				minValue: 'minValue',
				maxValue: 'maxValue',
				maxDigits: 'maxDigits',
				maxDecimalPlaces: 'maxDecimalPlaces'
			}
		});

		test.equal(field.fieldType, 'DecimalField');
		test.equal(field.toJS('100.556'), 100.556);

		test.ok(isNaN(field.toJS('abcd')));
		test.ok(!isNaN(field.toJS('100')));
		test.ok(!isNaN(field.toJS('100.23456')));

		field.validate('10000000', function(err) { test.equal(err, null); });
		field.validate('9999999.99', function(err) { test.equal(err, null); });
		field.validate('26.0', function(err) { test.equal(err, null); });

		field.validate('abcd', function(err) { test.ok(err); }); // wtf
		field.validate('10000000.1', function(err) { test.ok(err); }); // max
		field.validate('0', function(err) { test.ok(err); }); // min
		field.validate('50.12345', function(err) { test.ok(err); }); // max decimal places
		field.validate('9999999.1234', function(err) { test.ok(err); }); // max digits

		validateError(test, field, 'abcd', 'invalid');
		validateError(test, field, '24', 'minValue');
		validateError(test, field, '10000000.1', 'maxValue');
		validateError(test, field, '1000000.1234', 'maxDigits');
		validateError(test, field, '50.12345', 'maxDecimalPlaces');

		validateRequired(test, forms.DecimalField, '50.05');

		test.done();
	},

	'CharField': function(test) {
		var field = new forms.CharField({
			minLength: 2,
			maxLength: 10,
			errorMessages: {
				minLength: 'minLength',
				maxLength: 'maxLength'
			}
		});

		test.equal(field.fieldType, 'CharField');
		test.equal(field.toJS('abcd'), 'abcd');
		test.equal(field.toJS(''), '');

		field.validate('abcd', function(err) { test.equal(err, null); });
		field.validate('a', function(err) { test.ok(err); });
		field.validate('abcdefghijklmnopqrst', function(err) { test.ok(err); });

		validateError(test, field, 'a', 'minLength');
		validateError(test, field, 'abcdefghijklmnop', 'maxLength');

		validateRequired(test, forms.CharField, 'abcd');

		test.done();
	},

	'TextField': function(test) {
		var field = new forms.TextField({
			minLength: 2,
			maxLength: 10,
			errorMessages: {
				minLength: 'minLength',
				maxLength: 'maxLength'
			}
		});
		
		test.equal(field.fieldType, 'TextField');
		test.equal(field.toJS('abcd'), 'abcd');
		test.equal(field.toJS(''), '');

		field.validate('abcd', function(err) { test.equal(err, null); });
		field.validate('a', function(err) { test.ok(err); });
		field.validate('abcdefghijklmnopqrst', function(err) { test.ok(err); });

		validateError(test, field, 'a', 'minLength');
		validateError(test, field, 'abcdefghijklmnop', 'maxLength');

		validateRequired(test, forms.CharField, 'abcd');

		test.done();
	},

	'BooleanField': function(test) {
		var field = new forms.BooleanField();

		test.equal(field.fieldType, 'BooleanField');
		test.equal(field.toJS(true), true);
		test.equal(field.toJS(false), false);

		test.done();
	},

	'ChoiceField': function(test) {
		test.throws(function() { new forms.ChoiceField(); });

		var field = new forms.ChoiceField({
			choices: {
				'choice1': 'Choice 1',
				'choice2': 'Choice 2'
			},
			errorMessages: {
				invalidChoice: 'invalidChoice'
			}
		});

		test.equal(field.fieldType, 'ChoiceField');

		test.equal(field.toJS('choice1'), 'choice1');

		field.validate('choice1', function(err) { test.equal(err, null); });
		field.validate('choice2', function(err) { test.equal(err, null); });

		field.validate('choiceNotFound', function(err) { test.ok(err); });

		validateError(test, field, 'choiceNotFound', 'invalidChoice');
		
		validateRequired(test, forms.ChoiceField, 'choice1', {
			choices: {
				'choice1': 'Choice 1',
				'choice2': 'Choice 2'
			}
		});

		test.done();
	},

	'MultipleChoiceField': function(test) {
		test.throws(function() { new forms.MultipleChoiceField(); });

		var field = new forms.MultipleChoiceField({
			choices: {
				'choice1': 'Choice 1',
				'choice2': 'Choice 2',
				'choice3': 'Choice 3',
				'choice4': 'Choice 4',
				'choice5': 'Choice 5'
			},
			errorMessages: {
				invalidChoice: 'invalidChoice'
			}
		});
		
		test.equal(field.fieldType, 'MultipleChoiceField');

		test.deepEqual(field.toJS(['choice1', 'choice2', 'choice3']), ['choice1', 'choice2', 'choice3']);

		field.validate(['choice1', 'choice3'], function(err) { test.equal(err, null); });
		field.validate(['choice4', 'choice5', 'choice3'], function(err) { test.equal(err, null); });
		field.validate('choice1', function(err) { test.equal(err, null); });

		field.validate(['choice1', 'choice2', 'choiceNotFound'], function(err) { test.ok(err); });
		field.validate('choiceNotFound', function(err) { test.ok(err); });

		validateError(test, field, 'choiceNotFound', 'invalidChoice');
		
		validateRequired(test, forms.ChoiceField, ['choice1', 'choice2'], {
			choices: {
				'choice1': 'Choice 1',
				'choice2': 'Choice 2'
			}
		});

		test.done();
	},
	
	'TypedChoiceField': function(test) {
		test.throws(function() { new forms.TypedChoiceField(); });

		var field = new forms.TypedChoiceField({
			choices: {
				'1': 'Choice 1',
				'2': 'Choice 2',
				'3': 'Choice 3',
				'4': 'Choice 4'
			},
			errorMessages: {
				invalidChoice: 'invalidChoice'
			},
			coerce: function(value) {
				return parseInt(value, 10);
			},
			emptyValue: 100
		});

		test.equal(field.fieldType, 'TypedChoiceField');

		test.strictEqual(field.toJS('1'), 1);
		test.strictEqual(field.toJS('2'), 2);
		test.strictEqual(field.toJS(), 100);

		field.validate('choiceNotFound', function(err) { test.ok(err); });

		var field = new forms.TypedChoiceField({
			choices: {
				'1': 'Choice 1',
				'2': 'Choice 2',
				'3': 'Choice 3',
				'4': 'Choice 4'
			},
			errorMessages: {
				invalidChoice: 'invalidChoice'
			}
		});

		test.strictEqual(field.toJS('1'), '1');
		test.strictEqual(field.toJS('2'), '2');
		test.strictEqual(field.toJS(), '');

		field.validate('choiceNotFound', function(err) { test.ok(err); });

		validateError(test, field, 'choiceNotFound', 'invalidChoice');
		
		validateRequired(test, forms.ChoiceField, 'choice1', {
			choices: {
				'choice1': 'Choice 1',
				'choice2': 'Choice 2'
			}
		});

		test.done();
	},

	'EmailField': function(test) {
		var field = new forms.EmailField({
			errorMessages: {
				invalid: 'invalid'
			}
		});

		test.equal(field.fieldType, 'EmailField');

		test.equal(field.toJS('abcd'), 'abcd');
		test.equal(field.toJS(''), '');

		field.validate('myemail@domain.com', function(err) { test.equal(err, null); });

		field.validate('', function(err) { test.ok(err); });
		field.validate('myemail', function(err) { test.ok(err); });
		field.validate('myemail@domain', function(err) { test.ok(err); });
		field.validate('myemail@domain.', function(err) { test.ok(err); });

		validateError(test, field, 'myemail', 'invalid');

		validateRequired(test, forms.EmailField, 'myemail@domain.com');

		test.done();
	},
	
	'IPAddressField': function(test) {
		var field = new forms.IPAddressField({
			errorMessages: { invalid: 'invalid' }
		});

		test.equal(field.fieldType, 'IPAddressField');

		test.equal(field.toJS('abcd'), 'abcd');
		test.equal(field.toJS(''), '');

		field.validate('1.1.1.1', function(err) { test.equal(err, null); });
		field.validate('192.168.1.1', function(err) { test.equal(err, null); });
		field.validate('255.255.255.255', function(err) { test.equal(err, null); });

		field.validate('256.1.1.1', function(err) { test.ok(err); });
		field.validate('abcd', function(err) { test.ok(err); });
		field.validate('1.1.1', function(err) { test.ok(err); });

		validateError(test, field, '1.1.1', 'invalid');

		validateRequired(test, forms.IPAddressField, '192.168.1.1');

		test.done();
	},
	
	'NullBooleanField': function(test) {
		var field = new forms.NullBooleanField();

		test.equal(field.fieldType, 'NullBooleanField');

		test.strictEqual(field.toJS('-1'), null);
		test.strictEqual(field.toJS('0'), false);
		test.strictEqual(field.toJS('1'), true);

		test.strictEqual(field.fromJS(null), '-1');
		test.strictEqual(field.fromJS(false), '0');
		test.strictEqual(field.fromJS(true), '1');
		
		validateRequired(test, forms.NullBooleanField, '-1');
		
		test.done();
	},

	'RegexField': function(test) {
		test.throws(function() { new forms.RegexField(); });

		var regexps = [
			'^[abcd]+$',
			/^[abcd]+$/
		];
		
		for (var i = 0; i < regexps.length; i++) {
			var field = new forms.RegexField({
				errorMessages: { invalid: 'invalid' },
				regex: regexps[i]
			});

			test.equal(field.fieldType, 'RegexField');

			test.equal(field.toJS('abcd'), 'abcd');
			test.equal(field.toJS(''), '');

			field.validate('a', function(err) { test.equal(err, null); });
			field.validate('aabb', function(err) { test.equal(err, null); });
			field.validate('ddccbbaa', function(err) { test.equal(err, null); });

			field.validate('f', function(err) { test.ok(err); });
			field.validate('abcdef', function(err) { test.ok(err); });
			field.validate('jklmnop', function(err) { test.ok(err); });

			validateError(test, field, 'fghi', 'invalid');

			validateRequired(test, forms.RegexField, 'abcd', {
				regex: regexps[i]
			});
		}

		test.done();
	},
	
	'URLField': function(test) {
		var field = new forms.URLField({
			errorMessages: { invalid: 'invalid' }
		});

		test.equal(field.fieldType, 'URLField');

		test.equal(field.toJS('http://www.google.com'), 'http://www.google.com');
		test.equal(field.toJS(''), '');

		field.validate('http://www.google.com', function(err) { test.equal(err, null); });
		field.validate('http://www.test.co.uk/this/is/a/path', function(err) { test.equal(err, null); });
		field.validate('http://www.google.com/this/is/a/path', function(err) { test.equal(err, null); });

		field.validate('htp:/www.google.com/this/is/a/path', function(err) { test.ok(err); });
		field.validate('abcd', function(err) { test.ok(err); });
		field.validate('www.google.com', function(err) { test.ok(err); });

		validateError(test, field, 'fghi', 'invalid');

		validateRequired(test, forms.URLField, 'http://www.google.com');

		test.done();
	},

	'SlugField': function(test) {
		var field = new forms.SlugField({
			errorMessages: { invalid: 'invalid' }
		});

		test.equal(field.fieldType, 'SlugField');

		test.equal(field.toJS('this is a sluggy slug'), 'this is a sluggy slug');
		test.equal(field.toJS(''), '');

		field.validate('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-', function(err) { test.equal(err, null); });
		field.validate('abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz', function(err) { test.equal(err, null); });
		field.validate('ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ', function(err) { test.equal(err, null); });
		field.validate('0123456789_-0123456789_-', function(err) { test.equal(err, null); });

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

			field.validate(char, function(err) { test.ok(err); });
		}

		validateError(test, field, '!', 'invalid');

		validateRequired(test, forms.SlugField, 'abcd');

		test.done();
	},

	'DateTimeField': function(test) {
		var field = new forms.DateTimeField();

		test.equal(field.fieldType, 'DateTimeField');

		test.equal(field.toJS('2010-1-12 12:15:7').getTime(),
			new Date(2010, 0, 12, 12, 15, 7).getTime());
		test.equal(field.toJS('2010-1-12 12:15').getTime(),
			new Date(2010, 0, 12, 12, 15).getTime());
		test.equal(field.toJS('2010-1-12').getTime(),
			new Date(2010, 0, 12).getTime());
		test.equal(field.toJS('1/12/2010 12:15:7').getTime(),
			new Date(2010, 0, 12, 12, 15, 7).getTime());
		test.equal(field.toJS('1/12/2010 12:15').getTime(),
			new Date(2010, 0, 12, 12, 15).getTime());
		test.equal(field.toJS('1/12/2010').getTime(),
			new Date(2010, 0, 12).getTime());

		field.validate('2010-1-12 12:15:7', function(err) { test.equal(err, null); });
		field.validate('2010-1-12 12:15', function(err) { test.equal(err, null); });
		field.validate('2010-1-12', function(err) { test.equal(err, null); });
		field.validate('1/12/2010 12:15:7', function(err) { test.equal(err, null); });
		field.validate('1/12/2010 12:15', function(err) { test.equal(err, null); });
		field.validate('1/12/2010', function(err) { test.equal(err, null); });
		
		field.validate('1/12/201', function(err) { test.ok(err); });
		field.validate('1/12/2010 12:15:17 wtf', function(err) { test.ok(err); });

		var field = new forms.DateTimeField({
			inputFormats: ['%Y %m %d %H %M %S'],
			errorMessages: { invalid: 'invalid' }
		});

		field.validate('2010 1 12 12 15 17', function(err) { test.equal(err, null); });
		field.validate('2010-1-12 12:15:7', function(err) { test.ok(err); });

		validateError(test, field, 'fghi', 'invalid');

		validateRequired(test, forms.DateTimeField, '2010-1-12 12:15:17');

		test.done();
	},

	'DateField': function(test) {
		var field = new forms.DateField();

		test.equal(field.fieldType, 'DateField');

		test.equal(field.toJS('2010-1-12').getTime(),
			new Date(2010, 0, 12).getTime());
		test.equal(field.toJS('1/12/2010').getTime(),
			new Date(2010, 0, 12).getTime());
		test.equal(field.toJS('jan 12 2010').getTime(),
			new Date(2010, 0, 12).getTime());
		test.equal(field.toJS('jan 12, 2010').getTime(),
			new Date(2010, 0, 12).getTime());
		test.equal(field.toJS('12 jan 2010').getTime(),
			new Date(2010, 0, 12).getTime());
		test.equal(field.toJS('12 jan, 2010').getTime(),
			new Date(2010, 0, 12).getTime());
		test.equal(field.toJS('january 12 2010').getTime(),
			new Date(2010, 0, 12).getTime());
		test.equal(field.toJS('january 12, 2010').getTime(),
			new Date(2010, 0, 12).getTime());
		test.equal(field.toJS('12 january 2010').getTime(),
			new Date(2010, 0, 12).getTime());
		test.equal(field.toJS('12 january, 2010').getTime(),
			new Date(2010, 0, 12).getTime());

		field.validate('2010-1-12', function(err) { test.equal(err, null); });
		field.validate('1/12/2010', function(err) { test.equal(err, null); });
		field.validate('jan 12 2010', function(err) { test.equal(err, null); });
		field.validate('jan 12, 2010', function(err) { test.equal(err, null); });
		field.validate('12 jan 2010', function(err) { test.equal(err, null); });
		field.validate('12 jan, 2010', function(err) { test.equal(err, null); });
		field.validate('january 12 2010', function(err) { test.equal(err, null); });
		field.validate('january 12, 2010', function(err) { test.equal(err, null); });
		field.validate('12 january 2010', function(err) { test.equal(err, null); });
		field.validate('12 january, 2010', function(err) { test.equal(err, null); });
		
		field.validate('1/12/201', function(err) { test.ok(err); });
		field.validate('janua 12, 2010', function(err) { test.ok(err); });

		var field = new forms.DateTimeField({
			inputFormats: ['%Y %B %d'],
			errorMessages: { invalid: 'invalid' }
		});

		field.validate('2010 january 12', function(err) { test.equal(err, null); });
		field.validate('2010-1-12', function(err) { test.ok(err); });

		validateError(test, field, 'fghi', 'invalid');

		validateRequired(test, forms.DateField, 'january 12, 2010');

		test.done();
	},

	'TimeField': function(test) {
		var field = new forms.TimeField();

		test.equal(field.fieldType, 'TimeField');

		test.equal(field.toJS('12:15:30').getTime(),
			new Date(0, 0, 0, 12, 15, 30).getTime());
		test.equal(field.toJS('12:15').getTime(),
			new Date(0, 0, 0, 12, 15, 0).getTime());

		field.validate('12:15:30', function(err) { test.equal(err, null); });
		field.validate('12:15', function(err) { test.equal(err, null); });

		field.validate('12', function(err) { test.ok(err); });
		field.validate('12:155', function(err) { test.ok(err); });

		var field = new forms.DateTimeField({
			errorMessages: { invalid: 'invalid' }
		});

		validateError(test, field, 'fghi', 'invalid');

		validateRequired(test, forms.TimeField, '12:15');

		test.done();
	}
});