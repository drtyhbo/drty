var assert = require('assert'),
	utils = require('./index');

// ----- merge -----

assert.deepEqual(utils.merge({a: true}, {b: true}), {a: true, b: true});
assert.deepEqual(utils.merge({a: {a: true}}, {a: {b: true}}), {a: {a: true, b: true}});
assert.deepEqual(utils.merge('a', 'b'), {});

// ----- clone -----

assert.deepEqual(utils.clone({a: true}), {a: true});
assert.deepEqual(utils.clone({a: {a: true}}), {a: {a: true}});

// ----- each -----

var arrEach = [1, 2, 3, 4, 5],
	arrTest = [];
utils.each(arrEach, function(key, value) {
	arrTest[key] = value;
});
assert.deepEqual(arrTest, arrEach);

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
assert.deepEqual(objTest, objEach);

// ----- eachChained -----

arrEach = [1, 2, 3, 4, 5];
arrTest = [];
arrChainedFinished = false;

utils.eachChained(arrEach, function(key, value, next) {
	assert.equal(key, arrTest.length);
	arrTest.push(value);
	next();
}, function() {
	arrChainedFinished = true;
});
assert.deepEqual(arrTest, arrEach);
assert.equal(arrChainedFinished, true);

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
assert.deepEqual(objTest, objEach);
assert.equal(objChainedFinished, true);

// ----- keys -----

assert.deepEqual(utils.keys({0: true, 1: true, 2: true, hey: true, there: true, mofo: true}), ['0', '1', '2', 'hey', 'there', 'mofo']);

// ----- stripRe -----

assert.equal(utils.stripRe('^/login/$'), '/login/');
assert.equal(utils.stripRe('^/blog/(?P<blogId>[^/]*)$'), '/blog/');
assert.equal(utils.stripRe('^/media/(?P<path>.*)$'), '/media/');