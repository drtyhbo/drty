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
	try { field.validate(field.toJS(value)); }
	catch(e){ test.equal(e.msg, error); }
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

		test.equal(field.toJS('100'), 100);
		test.ok(isNaN(field.toJS('abcd')));
		test.ok(isNaN(field.toJS('100.5')));

		test.doesNotThrow(function() { field.validate(field.toJS('100')) });
		test.doesNotThrow(function() { field.validate(field.toJS('25')) });
		
		test.throws(function() { field.validate(field.toJS('abcd')) });
		test.throws(function() { field.validate(field.toJS('100.5')) });
		test.throws(function() { field.validate(field.toJS('100.0')) });
		test.throws(function() { field.validate(field.toJS('24')) });
		test.throws(function() { field.validate(field.toJS('101')) });

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

		test.equal(field.toJS('100.556'), 100.556);

		test.ok(isNaN(field.toJS('abcd')));
		test.ok(!isNaN(field.toJS('100')));
		test.ok(!isNaN(field.toJS('100.23456')));

		test.doesNotThrow(function() { field.validate(field.toJS('100')) });
		test.doesNotThrow(function() { field.validate(field.toJS('99.99')) });
		test.doesNotThrow(function() { field.validate(field.toJS('26.0')) });

		test.throws(function() { field.validate(field.toJS('abcd')) });
		test.throws(function() { field.validate(field.toJS('100.25')) });
		test.throws(function() { field.validate(field.toJS('0')) });

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
		test.equal(field.toJS('abcd'), 'abcd');
		test.equal(field.toJS(''), '');

		test.doesNotThrow(function() { field.validate(field.toJS('abcd')) });
		test.throws(function() { field.validate(field.toJS('a')); })
		test.throws(function() { field.validate(field.toJS('abcdefghijklmnopqrst')); })

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
		test.equal(field.toJS('abcd'), 'abcd');
		test.equal(field.toJS(''), '');

		test.doesNotThrow(function() { field.validate(field.toJS('abcd')) });
		test.throws(function() { field.validate(field.toJS('a')); })
		test.throws(function() { field.validate(field.toJS('abcdefghijklmnopqrst')); })

		validateError(test, field, 'a', 'minLength');
		validateError(test, field, 'abcdefghijklmnop', 'maxLength');

		validateRequired(test, forms.CharField, 'abcd');

		test.done();
	},

	'BooleanField': function(test) {
		var field = new forms.BooleanField();

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
	
	'EmailField': function(test) {
		var field = new forms.EmailField({
			errorMessages: {
				invalid: 'invalid'
			}
		});

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
			errorMessages: {
				invalid: 'invalid'
			}
		});

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
	}
});