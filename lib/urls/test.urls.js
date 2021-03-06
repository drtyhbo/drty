var drty = require('drty'),
	urls = require('./index'),
	testCase = require('nodeunit').testCase;

var patterns = urls.patterns();

module.exports = testCase({
	'basic': function(test) {
		function root() {
			test.done();
		};

		patterns.concat(urls.patterns(urls.url('^/$', 'root', root)));
		patterns.route({url: '/'}, {});
	},
	
	'one url variable': function(test) {
		function profile(request, response) {
			test.equal(request.params.userId, 5);
			test.done();
		};
		
		patterns.concat(urls.patterns(urls.url('^/profile/(?P<userId>[^/]+)/$', 'profile', profile)));
		patterns.route({url: '/profile/5/'}, {});
	},
	
	'one url variable + fixed parameter': function(test) {
		function static(request, response, extra) {
			test.equal(extra, 'extra');
			test.equal(request.params.path, 'dir/filename.png');
			test.done();
		};	
		
		patterns.concat(urls.patterns(urls.url('^/media/(?P<path>.*)$', 'static', static, 'extra')));
		patterns.route({url: '/media/dir/filename.png'}, {});
	},
	
	'multiple url variables, inline view': function(test) {
		patterns.concat(urls.patterns(urls.url('^/test/(?P<letters>[a-zA-Z]+)(?P<numbers>[0-9]+)/$',
			'test', function(request, response) {
				test.equal(request.params.letters, 'demo');
				test.equal(request.params.numbers, '1234');
				test.done();
			})));
		patterns.route({url: '/test/demo1234/'}, {});
	},

	': syntax': function(test) {
		patterns.concat(urls.patterns(urls.url('^/myurl/:param1/:param2/$',
			'test', function(request, response) {
				test.equal(request.params.param1, 'drty');
				test.equal(request.params.param2, 'hobo');
				test.done();
			})));
		patterns.route({url: '/myurl/drty/hobo/'}, {});
	},
	
	'not found': function(test) {
		test.equal(patterns.route({url: '/notfound/'}), false);
		test.done();
	},
	
	'reverse': function(test) {
		test.equal(patterns.reverse('root'), '/');
		test.equal(patterns.reverse('profile', 5), '/profile/5/');
		test.equal(patterns.reverse('static', 'dir/filename.png'), '/media/dir/filename.png');
		test.throws(function() { patterns.reverse('static'); });
		test.equal(patterns.reverse('test', 'demo', 1234), '/test/demo1234/');
		test.done();		
	}
});