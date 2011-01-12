var assert = require('assert'),
	Response = require('./response').Response;

// ----- initialize -----
var httpResponse = {
};

var response = new Response(httpResponse);
assert.deepEqual(response.httpResponse, httpResponse);

// ----- setResponseCallback -----
var callback = function() {}
response.setResponseCallback(callback);
assert.equal(response.responseCallback, callback);

// ----- fireResponseCallback -----
var wasCallbackFired = false;
response.setResponseCallback(function() {
	wasCallbackFired = true;
})
response.fireResponseCallback();
assert.strictEqual(wasCallbackFired, true);

// ----- setHeader, setCookie -----
response.setHeader('Content-type', 'image/png');
response.setCookie('sessionid', '1234');
assert.deepEqual(response.headers, {
	'Content-type': 'image/png',
	'Set-Cookie': 'sessionid=1234 ; path=/'
});

// ----- ok, redirect, notFound -----
response.headers = {};
wasCallbackFired = false;
response.setResponseCallback(function() {
	assert.equal(response.statusCode, 200);
	assert.equal(response.body, 'ok!');
	assert.deepEqual(response.headers, {
		'Content-type': 'text/plain'
	});
	wasCallbackFired = true;
});
response.ok('ok!', 'text/plain');
assert.strictEqual(wasCallbackFired, true);

response.headers = {};
wasCallbackFired = false;
response.setResponseCallback(function() {
	assert.equal(response.statusCode, 302);
	assert.deepEqual(response.headers, {
		'Location': 'http://www.redirect.com'
	});
	wasCallbackFired = true;
});
response.redirect('http://www.redirect.com');
assert.strictEqual(wasCallbackFired, true);

response.headers = {};
wasCallbackFired = false;
response.setResponseCallback(function() {
	assert.equal(response.statusCode, 404);
	wasCallbackFired = true;
});
response.notFound();
assert.strictEqual(wasCallbackFired, true);