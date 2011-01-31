var validators = require('./validators'),
	testCase = require('nodeunit').testCase;

module.exports = testCase({
	'validateEmail': function(test) {
		validators.validateEmail('user@domain.com', function(err) { test.equal(err, null); });
		validators.validateEmail('user@domain.co.uk', function(err) { test.equal(err, null); });
		validators.validateEmail('first.last@domain.com', function(err) { test.equal(err, null); });
		validators.validateEmail('first.last@domain.co.uk', function(err) { test.equal(err, null); });
		validators.validateEmail('first-last@domain.com', function(err) { test.equal(err, null); });
		validators.validateEmail('first_last@domain.com', function(err) { test.equal(err, null); });
		validators.validateEmail('first+last@domain.com', function(err) { test.equal(err, null); });
		
		validators.validateEmail('user@domain.', function(err) { test.ok(err); });
		validators.validateEmail('user@', function(err) { test.ok(err); });
		validators.validateEmail('user!@domain.com', function(err) { test.ok(err); });
		validators.validateEmail('user@domain!.com', function(err) { test.ok(err); });

		test.done();
	},
	
	'validateSlug': function(test) {
		validators.validateSlug('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-', function(err) { test.equal(err, null); });
		validators.validateSlug('abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz', function(err) { test.equal(err, null); });
		validators.validateSlug('ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ', function(err) { test.equal(err, null); });
		validators.validateSlug('0123456789_-0123456789_-', function(err) { test.equal(err, null); });
		
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
		validators.validateIpv4Address('123.213.99.0', function(err) { test.equal(err, null); });
		validators.validateIpv4Address('0.0.0.0', function(err) { test.equal(err, null); });
		validators.validateIpv4Address('255.255.255.255', function(err) { test.equal(err, null); });

		validators.validateIpv4Address('1.1.1', function(err) { test.ok(err); });
		validators.validateIpv4Address('256.256.256.256', function(err) { test.ok(err); });
		validators.validateIpv4Address('1234.1.1.1', function(err) { test.ok(err); });
		validators.validateIpv4Address('1.1234.1.1', function(err) { test.ok(err); });
		validators.validateIpv4Address('1.1.1234.1', function(err) { test.ok(err); });
		validators.validateIpv4Address('1.1.1.1234', function(err) { test.ok(err); });
		
		test.done();		
	},

	'validateURL': function(test) {

		var protocols = ['http:', 'https:', 'ftp:'];

		for (var i = 0, protocol; (protocol = protocols[i]); i++) {
			validators.validateURL(protocol + '//test.com', function(err) { test.equal(err, null); });
			validators.validateURL(protocol + '//www.test.com', function(err) { test.equal(err, null); });
			validators.validateURL(protocol + '//test.com/path', function(err) { test.equal(err, null); });
			validators.validateURL(protocol + '//www.test.com/path', function(err) { test.equal(err, null); });
			validators.validateURL(protocol + '//test.com/path/path2', function(err) { test.equal(err, null); });
			validators.validateURL(protocol + '//www.test.com/path/path2', function(err) { test.equal(err, null); });
			validators.validateURL(protocol + '//test.com/path/path2.html', function(err) { test.equal(err, null); });
			validators.validateURL(protocol + '//www.test.com/path/path2.html', function(err) { test.equal(err, null); });
			validators.validateURL(protocol + '//test.com/path/path2.html?q=1', function(err) { test.equal(err, null); });
			validators.validateURL(protocol + '//www.test.com/path/path2.html?q=1', function(err) { test.equal(err, null); });
		}
		
		validators.validateURL('http:/test.com', function(err) { test.ok(err); });
		validators.validateURL('http://te!st.com', function(err) { test.ok(err); });
		validators.validateURL('htp://test.com', function(err) { test.ok(err); });
		validators.validateURL('http//test.com', function(err) { test.ok(err); });
		validators.validateURL('http:test.com', function(err) { test.ok(err); });
		validators.validateURL('http://test.com/this is a path with spaces/', function(err) { test.ok(err); });

		test.done();
	},
	
	'maxValueValidator': function(test) {
		var validator = validators.maxValueValidator(100);
		
		validator(50, function(err) { test.equal(err, null); });
		validator(100, function(err) { test.equal(err, null); });

		validator(101, function(err) { test.ok(err); });
		test.done();
	},

	'minValueValidator': function(test) {
		var validator = validators.minValueValidator(100);
		
		validator(101, function(err) { test.equal(err, null); });
		validator(100, function(err) { test.equal(err, null); });

		validator(50, function(err) { test.ok(err); });
		test.done();
	},

	'maxLengthValidator': function(test) {
		var validator = validators.maxLengthValidator(5);
		
		validator('ab', function(err) { test.equal(err, null); });
		validator('abcde', function(err) { test.equal(err, null); });

		validator('abcdef', function(err) { test.ok(err); });
		validator('      ', function(err) { test.ok(err); });

		test.done();
	},

	'minLengthValidator': function(test) {
		var validator = validators.minLengthValidator(5);
		
		validator('abcde', function(err) { test.equal(err, null); });
		validator('abcdef', function(err) { test.equal(err, null); });

		validator('abcd', function(err) { test.ok(err); });
		validator('    ', function(err) { test.ok(err); });

		test.done();
	},

	'inListValidator': function(test) {
		var validator = validators.inListValidator({
			'1': '',
			'2': '',
			'3': '',
			'4': ''
		});

		validator(1, function(err) { test.equal(err, null); });
		validator(2, function(err) { test.equal(err, null); });
		validator(3, function(err) { test.equal(err, null); });
		validator(4, function(err) { test.equal(err, null); });
		validator([1, 2], function(err) { test.equal(err, null); });
		validator([1, 4], function(err) { test.equal(err, null); });

		validator(5, function(err) { test.ok(err); });
		validator([1, 2, 5], function(err) { test.ok(err); });

		validator = validators.inListValidator([1, 2, 3, 4]);
		
		test.done();
	}

});