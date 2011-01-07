var assert = require('assert'),
	views = require('./index');

// ----- render -----

var globalRequest = 'request',
	globalResponse = 'response';

var calls = [];
views.render([
		function(request, response, next) {
			assert.equal(request, globalRequest);
			assert.equal(response, globalResponse);
			calls.push(1); next();
		},
		function(request, response, next) {
			assert.equal(request, globalRequest);
			assert.equal(response, globalResponse);
			calls.push(2); next();
		},
		function(request, response, next) {
			assert.equal(request, globalRequest);
			assert.equal(response, globalResponse);
			assert.strictEqual(next, null);
			calls.push(3);
		}
	], globalRequest, globalResponse, null);
assert.deepEqual(calls, [1, 2, 3]);

calls = [];
views.render(function(request, response, params) {
	assert.strictEqual(request, null);
	assert.strictEqual(response, null);
	assert.equal(params, 'params!');
	calls.push(1);
}, null, null, 'params!');
assert.deepEqual(calls, [1]);