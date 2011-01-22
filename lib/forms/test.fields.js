var drty = require('drty'),
	forms = require('./index'),
	testCase = require('nodeunit').testCase;

var options = {
	tests: {
		'required': function(ctor, okValue, test, requiredOptions) {
			var field = new ctor(requiredOptions);
			test.doesNotThrow(function() { field.validate(okValue); })
			test.throws(function() { field.validate(); })

			var field = new ctor(drty.utils.merge({required: true}, requiredOptions));
			test.doesNotThrow(function() { field.validate(okValue); })
			test.throws(function() { field.validate(); })

			var field = new ctor(drty.utils.merge({required: false}, requiredOptions));
			test.doesNotThrow(function() { field.validate(okValue); })
			test.doesNotThrow(function() { field.validate(); })
		}
	},
	
	IntegerField: ['required'],
	CharField: ['required'],
	TextField: ['required']
}

function testOptions(fieldType, okValue, test, requiredOptions) {
	var ctor = forms[fieldType];

	var tests = options[fieldType];
	if (tests) {
		for (var i = 0; i < tests.length; i++) {
			options.tests[tests[i]](ctor, okValue, test, requiredOptions || {});
		}
	}
}

module.exports = testCase({
	'IntegerField': function(test) {
		var field = new forms.IntegerField();
		test.equal(field.toJS('100'), 100);
		test.ok(isNaN(field.toJS('abcd')));
		test.doesNotThrow(function() { field.validate(field.toJS('100')) });
		test.throws(function() { field.validate(field.toJS('abcd')) });
		test.throws(function() { field.validate(field.toJS('100.5')) });
		test.throws(function() { field.validate(field.toJS('100.0')) });

		testOptions('IntegerField', 100, test);

		test.done();
	},

	'FloatField': function(test) {
		var field = new forms.FloatField();
		test.equal(field.toJS('100.556'), 100.556);
		test.ok(isNaN(field.toJS('abcd')));
		test.ok(!isNaN(field.toJS('100')));
		test.ok(!isNaN(field.toJS('100.23456')));
		test.doesNotThrow(function() { field.validate(field.toJS('100')) });
		test.doesNotThrow(function() { field.validate(field.toJS('100.01')) });
		test.doesNotThrow(function() { field.validate(field.toJS('0.01')) });
		test.throws(function() { field.validate(field.toJS('abcd')) });
		test.throws(function() { field.validate(field.toJS('')) });

		testOptions('FloatField', 100.75, test);

		test.done();
	},

	'CharField': function(test) {
		var field = new forms.CharField();
		test.equal(field.toJS('abcd'), 'abcd');
		test.doesNotThrow(function() { field.validate(field.toJS('abcd')) });
		test.throws(function() { field.validate(field.toJS()) });

		testOptions('CharField', 'abcd', test);

		test.done();
	},

	'TextField': function(test) {
		var field = new forms.TextField();
		test.equal(field.toJS('abcd'), 'abcd');
		test.doesNotThrow(function() { field.validate(field.toJS('abcd')) });
		test.throws(function() { field.validate(field.toJS()) });

		testOptions('TextField', 'abcd', test);

		test.done();
	},

	'BooleanField': function(test) {
		var field = new forms.BooleanField();
		test.equal(field.toJS(true), true);
		test.equal(field.toJS(false), false);

		testOptions('BooleanField', true, test);

		test.done();
	},

	'ChoiceField': function(test) {
		test.throws(function() { new forms.ChoiceField(); });
		var field = new forms.ChoiceField({
			choices: {
				'choice1': 'Choice 1',
				'choice2': 'Choice 2'
			}
		});
		test.equal(field.toJS('choice1'), 'choice1');
		test.doesNotThrow(function() { field.validate('choice1'); });
		test.doesNotThrow(function() { field.validate('choice2'); });
		test.throws(function() { field.validate('choiceNotFound'); });
		
		testOptions('ChoiceField', 'choice1', test, {
			choices: {
				'choice1': 'Choice 1',
				'choice2': 'Choice 2'
			}
		});

		test.done();
	},
	
	'EmailField': function(test) {
		var field = new forms.EmailField();
		test.equal(field.toJS('abcd'), 'abcd');
		test.doesNotThrow(function() { field.validate('myemail@domain.com'); });
		test.throws(function() { field.validate('myemail'); });
		test.throws(function() { field.validate('myemail@domain'); });
		test.throws(function() { field.validate('myemail@domain.'); });

		testOptions('EmailField', 'myemail@domain.com', test);

		test.done();
	},
	
	'IPAddressField': function(test) {
		var field = new forms.IPAddressField();
		test.equal(field.toJS('abcd'), 'abcd');
		test.doesNotThrow(function() { field.validate('1.1.1.1'); });
		test.doesNotThrow(function() { field.validate('192.168.1.1'); });
		test.doesNotThrow(function() { field.validate('255.255.255.255'); });
		test.throws(function() { field.validate('256.1.1.1'); });
		test.throws(function() { field.validate('abcd'); });
		test.throws(function() { field.validate('1.1.1'); });

		testOptions('IPAddressField', '192.168.1.1', test);

		test.done();
	}
});