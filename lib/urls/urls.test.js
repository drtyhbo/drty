var drty = require('drty'),
	assert = require('assert'),
	urls = require('./index');

var viewsAssert = {};
var views = {
	root: function() {
		viewsAssert.root = true;
	},
	profile: function(request, response) {
		assert.equal(request.params.userId, 5);
		viewsAssert.profile = true;
	},
	static: function(request, response, extra) {
		assert.equal(extra, 'extra');
		viewsAssert.static = true;
	},
	test: function(request, response) {
		assert.equal(request.params.letters, 'demo');
		assert.equal(request.params.numbers, '1234');
		viewsAssert.test = true;
	}
};

drty.conf.settings.ROOT_URLCONF = {
	urlpatterns: urls.patterns(views,
		urls.url('^/$', 'root', 'root'),
		urls.url('^/profile/(?P<userId>[^/]+)/', 'profile', 'profile'),
		urls.url('^/static/', 'static', 'static', ['extra']),
		urls.url('^/test/(?P<letters>[a-zA-Z]+)(?P<numbers>[0-9]+)/', 'test', 'test')
	)
};

urls.route({url: '/'}, {});
urls.route({url: '/profile/5/'}, {});
urls.route({url: '/static/'}, {});
urls.route({url: '/test/demo1234/'}, {});
assert.equal(urls.route({url: '/notfound/'}), false);

assert.equal(urls.reverse('root'), '/');
assert.equal(urls.reverse('profile', 5), '/profile/5/');
assert.equal(urls.reverse('static'), '/static/');
assert.equal(urls.reverse('test', 'demo', 1234), '/test/demo1234/');

for (var name in views) {
	assert.equal(viewsAssert[name], true);
}