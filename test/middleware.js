(function() {

exports.run = function() {
	var assert = require('assert'),
		drty = require('../lib/drty'),
		middleware = drty.middleware;

	var Middleware1 = drty.Class.extend({
		handleRequest: function(request, response, complete) {
			arr.push('req_m1');
			complete();
		}
	});

	var Middleware2 = drty.Class.extend({
		handleResponse: function(request, response, complete) {
			arr.push('res_m2');
			complete();
		}
	});
	
	var Middleware3 = drty.Class.extend({
		handleRequest: function(request, response, complete) {
			arr.push('req_m3');
			complete();
		},
		
		handleResponse: function(request, response, complete) {
			arr.push('res_m3');
			complete();
		}
	});

	middleware.add(new Middleware1());

	var arr = [];	
	middleware.handleRequest(null, null, function() {});
	assert.deepEqual(arr, ['req_m1']);

	arr = [];	
	middleware.handleResponse(null, null, function() {});
	assert.deepEqual(arr, []);

	middleware.add(new Middleware2());

	var arr = [];	
	middleware.handleRequest(null, null, function() {});
	assert.deepEqual(arr, ['req_m1']);

	arr = [];	
	middleware.handleResponse(null, null, function() {});
	assert.deepEqual(arr, ['res_m2']);

	middleware.add(new Middleware3());

	var arr = [];	
	middleware.handleRequest(null, null, function() {});
	assert.deepEqual(arr, ['req_m1', 'req_m3']);

	arr = [];	
	middleware.handleResponse(null, null, function() {});
	assert.deepEqual(arr, ['res_m3', 'res_m2']);
}

})();