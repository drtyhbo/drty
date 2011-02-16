var assert = require('assert'),
	Request = require('./request').Request;

// ----- initialize -----
var httpRequest = {
	url: 'http://www.github.com/drtyhbo/drty?param1=yes&param2=please',
	method: 'GET',
	headers: {
		cookie: 'sessionid=1234; username=demo'
	}
};

var request = new Request(httpRequest);
assert.equal(request.url, 'http://www.github.com/drtyhbo/drty?param1=yes&param2=please');
assert.equal(request.method, 'GET');
assert.equal(request.httpRequest, httpRequest);

request.parse(function() {
	assert.deepEqual(request.cookies, {
		sessionid: '1234',
		username: 'demo'
	});
	assert.deepEqual(request.GET, {
		param1: 'yes',
		param2: 'please'
	});
});
