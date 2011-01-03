(function() {

exports.run = function() {
	var assert = require('assert'),
		drty = require('../lib/drty'),
		urls = drty.urls,
		views = drty.views;

	urls.add('^/url1/$', 'url1')
		.add('^/url1/:match/$', 'url2')
		.add('^/url1/:match1/:match2/$', 'url3')
		.add('^/media/', 'url4');
	
	var url1Ok = false;
	views.add('url1', function(request, response) {
			assert.equal(request.url, urls.reverse('url1'));
			assert.deepEqual(request.params, {});
			url1Ok = true;
		});

	var url2Ok = false;
	views.add('url2', function(request, response) {
			assert.deepEqual(request.params, {
				match: 'hey'
			});
			url2Ok = true;
		});

	var url3Ok = false;
	views.add('url3', function(request, response) {
			assert.equal(request.url, urls.reverse('url3', request.params.match1, request.params.match2));
			assert.deepEqual(request.params, {
				match1: 'hey',
				match2: 'there'
			});
			url3Ok = true;
		});

	var url4Ok = false;
	views.add('url4', function(request, response) {
			assert.equal(request.unmatched, 'this/part/is/unmatched');
			url4Ok = true;
		});

	assert.equal(urls.route({url: '/url1/'}), true);
	assert.equal(url1Ok, true);

	assert.equal(urls.route({url: '/url1/hey/'}), true);
	assert.equal(url2Ok, true);

	assert.equal(urls.route({url: '/url1/hey/there/'}), true);
	assert.equal(url3Ok, true);

	assert.equal(urls.route({url: '/media/this/part/is/unmatched'}), true);
	assert.equal(url4Ok, true);
	
	assert.equal(urls.route({url: '/this/url/doesnt/exist'}), false);
}

})();