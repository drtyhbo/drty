var views = require('./index'),
	testCase = require('nodeunit').testCase;

var globalRequest = {request: true},
	globalResponse = {response: true};

module.exports = testCase({
	'basic': function(test) {
		views.render(function(request, response, next) {
			test.deepEqual(request, globalRequest);
			test.deepEqual(response, globalResponse);
			test.strictEqual(next, null);
			test.done();
		}, globalRequest, globalResponse, null);
	},

	'chained views': function(test) {
		var calls = [];
		views.render([
				function(request, response, next) {
					test.deepEqual(request, globalRequest);
					test.deepEqual(response, globalResponse);
					calls.push(1);
					next();
				},
				function(request, response, next) {
					test.deepEqual(request, globalRequest);
					test.deepEqual(response, globalResponse);
					calls.push(2);
					next();
				},
				function(request, response, next) {
					test.deepEqual(request, globalRequest);
					test.deepEqual(response, globalResponse);
					test.strictEqual(next, null);
					test.deepEqual(calls, [1, 2]);
					test.done();
				}
			], globalRequest, globalResponse, null);
	},
	
	'params': function(test) {
		var passedParams = ['1', '2', '3', {thorough: 'test'}];
		views.render(function(request, response, params) {
			test.strictEqual(request, null);
			test.strictEqual(response, null);
			test.deepEqual(params, passedParams);
			test.done();
		}, null, null, passedParams);
	}
});