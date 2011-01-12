var drty = require('drty'),
	middleware = require('./index'),
	testCase = require('nodeunit').testCase;

var calls = [];
module.exports = testCase({
	'setUp': function(complete) {
		calls = [];
		complete();
	},

	'handleRequest 1': function(test) {
		middleware.add({
			handleRequest: function(request, response, next) {
				calls.push('req_1');
				next();
			}
		});
		middleware.handleRequest(null, null, function() {
			test.deepEqual(calls, ['req_1']);
			test.done();
		});
	},

	'handleRequest 2': function(test) {
		middleware.add({
			handleRequest: function(request, response, next) {
				calls.push('req_2');
				next();
			}
		});
		middleware.handleRequest(null, null, function() {
			test.deepEqual(calls, ['req_1', 'req_2']);
			test.done();
		});
	},

	'handleResponse 1': function(test) {
		middleware.add({
			handleResponse: function(request, response, next) {
				calls.push('res_1');
				next();
			}
		});
		middleware.handleResponse(null, null, function() {
			test.deepEqual(calls, ['res_1']);
			test.done();
		});
	},

	'handleResponse 2': function(test) {
		middleware.add({
			handleResponse: function(request, response, next) {
				calls.push('res_2');
				next();
			}
		});
		middleware.handleResponse(null, null, function() {
			test.deepEqual(calls, ['res_2', 'res_1']);
			test.done();
		});
	},
	
	'handleBoth': function(test) {
		middleware.handleRequest(null, null, function() {
			middleware.handleResponse(null, null, function() {
				test.deepEqual(calls, ['req_1', 'req_2', 'res_2', 'res_1']);
				test.done();
			});
		});
	}
});