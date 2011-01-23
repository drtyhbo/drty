var utils = require('./index'),
	testCase = require('nodeunit').testCase;

module.exports = testCase({
	'merge': function(test) {
		test.deepEqual(utils.merge({a: true}, {b: true}), {a: true, b: true});
		test.deepEqual(utils.merge({a: {a: true}}, {a: {b: true}}), {a: {a: true, b: true}});
		test.deepEqual(utils.merge('a', 'b'), {});
		test.done()		
	},

	'mixin': function(test) {
		var o = {a: true};
		utils.mixin(o, {b: true});
		test.deepEqual(o, {a: true, b: true});

		var o = {a: {a: true}};
		utils.mixin(o, {a: {b: true}});
		test.deepEqual(o, {a: {a: true, b: true}});

		var o = 'a';
		utils.mixin(o, 'b');
		test.deepEqual(o, 'a');

		test.done();
	},

	'clone': function(test) {
		test.deepEqual(utils.clone({a: true}), {a: true});
		test.deepEqual(utils.clone({a: {a: true}}), {a: {a: true}});
		test.done();
	},
	
	'each': function(test) {
		var arrEach = [1, 2, 3, 4, 5],
			arrTest = [];
		utils.each(arrEach, function(key, value) {
			arrTest[key] = value;
		});
		test.deepEqual(arrTest, arrEach);

		var objEach = {
				a: 1,
				b: 2,
				c: 3,
				d: 4
			},
			objTest = {};
		utils.each(objEach, function(key, value) {
			objTest[key] = value;
		});
		test.deepEqual(objTest, objEach);
		
		test.done();
	},
	
	'eachChained': function(test) {
		arrEach = [1, 2, 3, 4, 5];
		arrTest = [];
		arrChainedFinished = false;

		utils.eachChained(arrEach, function(key, value, next) {
			arrTest.push(value);
			next();
		}, function() {
			arrChainedFinished = true;
		});
		test.deepEqual(arrTest, arrEach);
		test.equal(arrChainedFinished, true);

		objEach = {
			a: 1,
			b: 2,
			c: 3,
			d: 4
		};
		objTest = {};
		objChainedFinished = false;

		utils.eachChained(objEach, function(key, value, next) {
			objTest[key] = value;
			next();
		}, function() {
			objChainedFinished = true;
		});
		test.deepEqual(objTest, objEach);
		test.equal(objChainedFinished, true);		

		test.done();
	},
	
	'stripRe': function(test) {
		test.equal(utils.stripRe('^/login/$'), '/login/');
		test.equal(utils.stripRe('^/blog/(?P<blogId>[^/]*)$'), '/blog/');
		test.equal(utils.stripRe('^/media/(?P<path>.*)$'), '/media/');		

		test.done();
	},
	
	'strftime': function(test) {
		test.equal(utils.strftime(new Date(1294822671384), '%Y %m %d %H %M %S %A'),
			'2011 01 12 08 57 51 Jan');
		test.equal(utils.strftime(new Date(1294822671384), '[%d/%A/%Y %H:%M:%S]'),
			'[12/Jan/2011 08:57:51]');

		test.done();
	},
	
	'strptime': function(test) {
		test.equal(utils.strptime('2011-01-23 10:00:52', '%Y-%m-%d %H:%M:%S').getTime(),
			new Date(2011, 0, 23, 10, 0, 52).getTime());
		test.equal(utils.strptime('2011-1-23 10:05', '%Y-%m-%d %H:%M').getTime(),
			new Date(2011, 0, 23, 10, 5).getTime());
		test.equal(utils.strptime('2011-1-23', '%Y-%m-%d').getTime(),
			new Date(2011, 0, 23).getTime());
		test.equal(utils.strptime('1/23/2011 5:15:01', '%m/%d/%Y %H:%M:%S').getTime(),
			new Date(2011, 0, 23, 5, 15, 1).getTime());
		test.equal(utils.strptime('1/23/2011 5:15', '%m/%d/%Y %H:%M').getTime(),
			new Date(2011, 0, 23, 5, 15).getTime());
		test.equal(utils.strptime('1/23/2011', '%m/%d/%Y').getTime(),
			new Date(2011, 0, 23).getTime());

		// no match should return null
		test.strictEqual(utils.strptime('201-01-23 10:00:52', '%Y-%m-%d %H:%M:%S'), null);
		test.strictEqual(utils.strptime('2011-01-23 10:00', '%Y-%m-%d %H:%M:%S'), null);

		test.done();
	}
});