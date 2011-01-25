var drty = require('drty'),
	forms = require('./index'),
	testCase = require('nodeunit').testCase;

function validateRequired(test, ctor, okValue, requiredOptions) {
	requiredOptions = requiredOptions || {};

	var field = new ctor(requiredOptions);
	test.doesNotThrow(function() { field.validate(okValue); });
	test.throws(function() { field.validate(); });

	var field = new ctor(drty.utils.merge({required: true}, requiredOptions));
	test.doesNotThrow(function() { field.validate(okValue); });
	test.throws(function() { field.validate(); });

	var field = new ctor(drty.utils.merge({required: false}, requiredOptions));
	test.doesNotThrow(function() { field.validate(okValue); });
	test.doesNotThrow(function() { field.validate(); });
}

function validateError(test, field, value, error) {
	try { field.validate(value); }
	catch(e) {
		test.ok(e instanceof forms.ValidationError);
		test.equal(e.msg, error);
	}
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

		test.doesNotThrow(function() { field.validate('100'); });
		test.doesNotThrow(function() { field.validate('25'); });
		
		test.throws(function() { field.validate('abcd'); });
		test.throws(function() { field.validate('100.5'); });
		test.throws(function() { field.validate('100.0'); });
		test.throws(function() { field.validate('24'); });
		test.throws(function() { field.validate('101'); });

		validateError(test, field, 'abcd', 'invalid');
		validateError(test, field, '24', 'minValue');
		validateError(test, field, '101', 'maxValue');

		validateRequired(test, forms.IntegerField, 50, test)

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

		test.doesNotThrow(function() { field.validate('100'); });
		test.doesNotThrow(function() { field.validate('99.99'); });
		test.doesNotThrow(function() { field.validate('26.0'); });

		test.throws(function() { field.validate('abcd'); });
		test.throws(function() { field.validate('100.25'); });
		test.throws(function() { field.validate('0'); });

		validateError(test, field, 'abcd', 'invalid');
		validateError(test, field, '24', 'minValue');
		validateError(test, field, '101', 'maxValue');

		validateRequired(test, forms.FloatField, 50.05);

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

		test.doesNotThrow(function() { field.validate('abcd'); });
		test.throws(function() { field.validate('a'); })
		test.throws(function() { field.validate('abcdefghijklmnopqrst'); })

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

		test.doesNotThrow(function() { field.validate('abcd'); });
		test.throws(function() { field.validate('a'); })
		test.throws(function() { field.validate('abcdefghijklmnopqrst'); })

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

		test.doesNotThrow(function() { field.validate('choice1'); });
		test.doesNotThrow(function() { field.validate('choice2'); });

		test.throws(function() { field.validate('choiceNotFound'); });

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

		test.doesNotThrow(function() { field.validate(['choice1', 'choice3']); });
		test.doesNotThrow(function() { field.validate(['choice4', 'choice5', 'choice3']); });
		test.doesNotThrow(function() { field.validate('choice1'); });

		test.throws(function() { field.validate(['choice1', 'choice2', 'choiceNotFound']); });
		test.throws(function() { field.validate('choiceNotFound'); });

		validateError(test, field, 'choiceNotFound', 'invalidChoice');
		
		validateRequired(test, forms.ChoiceField, ['choice1', 'choice2'], {
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

		test.doesNotThrow(function() { field.validate('myemail@domain.com'); });

		test.throws(function() { field.validate(''); });
		test.throws(function() { field.validate('myemail'); });
		test.throws(function() { field.validate('myemail@domain'); });
		test.throws(function() { field.validate('myemail@domain.'); });

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

		test.doesNotThrow(function() { field.validate('1.1.1.1'); });
		test.doesNotThrow(function() { field.validate('192.168.1.1'); });
		test.doesNotThrow(function() { field.validate('255.255.255.255'); });

		test.throws(function() { field.validate('256.1.1.1'); });
		test.throws(function() { field.validate('abcd'); });
		test.throws(function() { field.validate('1.1.1'); });

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

			test.doesNotThrow(function() { field.validate('a'); });
			test.doesNotThrow(function() { field.validate('aabb'); });
			test.doesNotThrow(function() { field.validate('ddccbbaa'); });

			test.throws(function() { field.validate('f'); });
			test.throws(function() { field.validate('abcdef'); });
			test.throws(function() { field.validate('jklmnop'); });

			validateError(test, field, 'fghi', 'invalid');

			validateRequired(test, forms.IPAddressField, 'abcd', {
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

		test.doesNotThrow(function() { field.validate('http://www.google.com'); });
		test.doesNotThrow(function() { field.validate('http://www.test.co.uk/this/is/a/path'); });
		test.doesNotThrow(function() { field.validate('http://www.google.com/this/is/a/path'); });

		test.throws(function() { field.validate('htp:/www.google.com/this/is/a/path'); });
		test.throws(function() { field.validate('abcd'); });
		test.throws(function() { field.validate('www.google.com'); });

		validateError(test, field, 'fghi', 'invalid');

		validateRequired(test, forms.URLField, 'http://www.google.com');

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

		test.doesNotThrow(function() { field.validate('2010-1-12 12:15:7'); });
		test.doesNotThrow(function() { field.validate('2010-1-12 12:15'); });
		test.doesNotThrow(function() { field.validate('2010-1-12'); });
		test.doesNotThrow(function() { field.validate('1/12/2010 12:15:7'); });
		test.doesNotThrow(function() { field.validate('1/12/2010 12:15'); });
		test.doesNotThrow(function() { field.validate('1/12/2010'); });
		
		test.throws(function() { field.validate('1/12/201'); })
		test.throws(function() { field.validate('1/12/2010 12:15:17 wtf'); })

		var field = new forms.DateTimeField({
			inputFormats: ['%Y %m %d %H %M %S'],
			errorMessages: { invalid: 'invalid' }
		});

		test.doesNotThrow(function() { field.validate('2010 1 12 12 15 17'); })
		test.throws(function() { field.validate('2010-1-12 12:15:7'); });

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

		test.doesNotThrow(function() { field.validate('2010-1-12'); });
		test.doesNotThrow(function() { field.validate('1/12/2010'); });
		test.doesNotThrow(function() { field.validate('jan 12 2010'); });
		test.doesNotThrow(function() { field.validate('jan 12, 2010'); });
		test.doesNotThrow(function() { field.validate('12 jan 2010'); });
		test.doesNotThrow(function() { field.validate('12 jan, 2010'); });
		test.doesNotThrow(function() { field.validate('january 12 2010'); });
		test.doesNotThrow(function() { field.validate('january 12, 2010'); });
		test.doesNotThrow(function() { field.validate('12 january 2010'); });
		test.doesNotThrow(function() { field.validate('12 january, 2010'); });
		
		test.throws(function() { field.validate('1/12/201'); })
		test.throws(function() { field.validate('janua 12, 2010'); })

		var field = new forms.DateTimeField({
			inputFormats: ['%Y %B %d'],
			errorMessages: { invalid: 'invalid' }
		});

		test.doesNotThrow(function() { field.validate('2010 january 12'); })
		test.throws(function() { field.validate('2010-1-12'); });

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

		test.doesNotThrow(function() { field.validate('12:15:30'); });
		test.doesNotThrow(function() { field.validate('12:15'); });

		test.throws(function() { field.validate('12'); })
		test.throws(function() { field.validate('12:155'); });

		var field = new forms.DateTimeField({
			errorMessages: { invalid: 'invalid' }
		});

		validateError(test, field, 'fghi', 'invalid');

		validateRequired(test, forms.TimeField, '12:15');

		test.done();
	}
});