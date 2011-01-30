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
		test.equal(utils.strftime('%Y %m %d %H %M %S %b', new Date(2011, 0, 12, 8, 57, 51)),
			'2011 01 12 08 57 51 Jan');
		test.equal(utils.strftime('[%d/%B/%Y %H:%M:%S]', new Date(2011, 0, 12, 8, 57, 51)),
			'[12/January/2011 08:57:51]');
		test.equal(utils.strftime('%Y %m %d %H %M %S %b', new Date(2011, 1, 12, 8, 57, 51)),
			'2011 02 12 08 57 51 Feb');
		test.equal(utils.strftime('[%d/%B/%Y %H:%M:%S]', new Date(2011, 1, 12, 8, 57, 51)),
			'[12/February/2011 08:57:51]');
		test.equal(utils.strftime('%Y %m %d %H %M %S %b', new Date(2011, 2, 12, 8, 57, 51)),
			'2011 03 12 08 57 51 Mar');
		test.equal(utils.strftime('[%d/%B/%Y %H:%M:%S]', new Date(2011, 2, 12, 8, 57, 51)),
			'[12/March/2011 08:57:51]');
		test.equal(utils.strftime('%Y %m %d %H %M %S %b', new Date(2011, 3, 12, 8, 57, 51)),
			'2011 04 12 08 57 51 Apr');
		test.equal(utils.strftime('[%d/%B/%Y %H:%M:%S]', new Date(2011, 3, 12, 8, 57, 51)),
			'[12/April/2011 08:57:51]');
		test.equal(utils.strftime('%Y %m %d %H %M %S %b', new Date(2011, 4, 12, 8, 57, 51)),
			'2011 05 12 08 57 51 May');
		test.equal(utils.strftime('[%d/%B/%Y %H:%M:%S]', new Date(2011, 4, 12, 8, 57, 51)),
			'[12/May/2011 08:57:51]');
		test.equal(utils.strftime('%Y %m %d %H %M %S %b', new Date(2011, 5, 12, 8, 57, 51)),
			'2011 06 12 08 57 51 Jun');
		test.equal(utils.strftime('[%d/%B/%Y %H:%M:%S]', new Date(2011, 5, 12, 8, 57, 51)),
			'[12/June/2011 08:57:51]');
		test.equal(utils.strftime('%Y %m %d %H %M %S %b', new Date(2011, 6, 12, 8, 57, 51)),
			'2011 07 12 08 57 51 Jul');
		test.equal(utils.strftime('[%d/%B/%Y %H:%M:%S]', new Date(2011, 6, 12, 8, 57, 51)),
			'[12/July/2011 08:57:51]');
		test.equal(utils.strftime('%Y %m %d %H %M %S %b', new Date(2011, 7, 12, 8, 57, 51)),
			'2011 08 12 08 57 51 Aug');
		test.equal(utils.strftime('[%d/%B/%Y %H:%M:%S]', new Date(2011, 7, 12, 8, 57, 51)),
			'[12/August/2011 08:57:51]');
		test.equal(utils.strftime('%Y %m %d %H %M %S %b', new Date(2011, 8, 12, 8, 57, 51)),
			'2011 09 12 08 57 51 Sep');
		test.equal(utils.strftime('[%d/%B/%Y %H:%M:%S]', new Date(2011, 8, 12, 8, 57, 51)),
			'[12/September/2011 08:57:51]');
		test.equal(utils.strftime('%Y %m %d %H %M %S %b', new Date(2011, 9, 12, 8, 57, 51)),
			'2011 10 12 08 57 51 Oct');
		test.equal(utils.strftime('[%d/%B/%Y %H:%M:%S]', new Date(2011, 9, 12, 8, 57, 51)),
			'[12/October/2011 08:57:51]');
		test.equal(utils.strftime('%Y %m %d %H %M %S %b', new Date(2011, 10, 12, 8, 57, 51)),
			'2011 11 12 08 57 51 Nov');
		test.equal(utils.strftime('[%d/%B/%Y %H:%M:%S]', new Date(2011, 10, 12, 8, 57, 51)),
			'[12/November/2011 08:57:51]');
		test.equal(utils.strftime('%Y %m %d %H %M %S %b', new Date(2011, 11, 12, 8, 57, 51)),
			'2011 12 12 08 57 51 Dec');
		test.equal(utils.strftime('[%d/%B/%Y %H:%M:%S]', new Date(2011, 11, 12, 8, 57, 51)),
			'[12/December/2011 08:57:51]');

		test.done();
	},
	
	'strptime': function(test) {
		test.equal(utils.strptime('%Y-%m-%d %H:%M:%S', '2011-01-23 10:00:52').getTime(),
			new Date(2011, 0, 23, 10, 0, 52).getTime());
		test.equal(utils.strptime('%Y-%m-%d %H:%M', '2011-1-23 10:05').getTime(),
			new Date(2011, 0, 23, 10, 5).getTime());
		test.equal(utils.strptime('%Y-%m-%d', '2011-1-23').getTime(),
			new Date(2011, 0, 23).getTime());
		test.equal(utils.strptime('%m/%d/%Y %H:%M:%S', '1/23/2011 5:15:01').getTime(),
			new Date(2011, 0, 23, 5, 15, 1).getTime());
		test.equal(utils.strptime('%m/%d/%Y %H:%M', '1/23/2011 5:15').getTime(),
			new Date(2011, 0, 23, 5, 15).getTime());
		test.equal(utils.strptime('%m/%d/%Y', '1/23/2011').getTime(),
			new Date(2011, 0, 23).getTime());

		test.equal(utils.strptime('%b/%d/%Y %H:%M', 'jAn/23/2011 5:15').getTime(),
			new Date(2011, 0, 23, 5, 15).getTime());
		test.equal(utils.strptime('%B/%d/%Y', 'JaNuARy/23/2011').getTime(),
			new Date(2011, 0, 23).getTime());
		test.equal(utils.strptime('%b/%d/%Y %H:%M', 'fEB/23/2011 5:15').getTime(),
			new Date(2011, 1, 23, 5, 15).getTime());
		test.equal(utils.strptime('%B/%d/%Y', 'FeBrUaRy/23/2011').getTime(),
			new Date(2011, 1, 23).getTime());
		test.equal(utils.strptime('%b/%d/%Y %H:%M', 'MAR/23/2011 5:15').getTime(),
			new Date(2011, 2, 23, 5, 15).getTime());
		test.equal(utils.strptime('%B/%d/%Y', 'mARch/23/2011').getTime(),
			new Date(2011, 2, 23).getTime());
		test.equal(utils.strptime('%b/%d/%Y %H:%M', 'apr/23/2011 5:15').getTime(),
			new Date(2011, 3, 23, 5, 15).getTime());
		test.equal(utils.strptime('%B/%d/%Y', 'april/23/2011').getTime(),
			new Date(2011, 3, 23).getTime());
		test.equal(utils.strptime('%b/%d/%Y %H:%M', 'May/23/2011 5:15').getTime(),
			new Date(2011, 4, 23, 5, 15).getTime());
		test.equal(utils.strptime('%B/%d/%Y', 'mAY/23/2011').getTime(),
			new Date(2011, 4, 23).getTime());
		test.equal(utils.strptime('%b/%d/%Y %H:%M', 'jun/23/2011 5:15').getTime(),
			new Date(2011, 5, 23, 5, 15).getTime());
		test.equal(utils.strptime('%B/%d/%Y', 'JUNE/23/2011').getTime(),
			new Date(2011, 5, 23).getTime());
		test.equal(utils.strptime('%b/%d/%Y %H:%M', 'Jul/23/2011 5:15').getTime(),
			new Date(2011, 6, 23, 5, 15).getTime());
		test.equal(utils.strptime('%B/%d/%Y', 'jULy/23/2011').getTime(),
			new Date(2011, 6, 23).getTime());
		test.equal(utils.strptime('%b/%d/%Y %H:%M', 'aug/23/2011 5:15').getTime(),
			new Date(2011, 7, 23, 5, 15).getTime());
		test.equal(utils.strptime('%B/%d/%Y', 'AUGUst/23/2011').getTime(),
			new Date(2011, 7, 23).getTime());
		test.equal(utils.strptime('%b/%d/%Y %H:%M', 'sep/23/2011 5:15').getTime(),
			new Date(2011, 8, 23, 5, 15).getTime());
		test.equal(utils.strptime('%B/%d/%Y', 'septembeR/23/2011').getTime(),
			new Date(2011, 8, 23).getTime());
		test.equal(utils.strptime('%b/%d/%Y %H:%M', 'oct/23/2011 5:15').getTime(),
			new Date(2011, 9, 23, 5, 15).getTime());
		test.equal(utils.strptime('%B/%d/%Y', 'OcTober/23/2011').getTime(),
			new Date(2011, 9, 23).getTime());
		test.equal(utils.strptime('%b/%d/%Y %H:%M', 'NOV/23/2011 5:15').getTime(),
			new Date(2011, 10, 23, 5, 15).getTime());
		test.equal(utils.strptime('%B/%d/%Y', 'november/23/2011').getTime(),
			new Date(2011, 10, 23).getTime());
		test.equal(utils.strptime('%b/%d/%Y %H:%M', 'dec/23/2011 5:15').getTime(),
			new Date(2011, 11, 23, 5, 15).getTime());
		test.equal(utils.strptime('%B/%d/%Y', 'december/23/2011').getTime(),
			new Date(2011, 11, 23).getTime());
		// no match should return null
		test.strictEqual(utils.strptime('%Y-%m-%d %H:%M:%S', '201-01-23 10:00:52'), null);
		test.strictEqual(utils.strptime('%Y-%m-%d %H:%M:%S', '2011-01-23 10:00'), null);

		test.done();
	}
});