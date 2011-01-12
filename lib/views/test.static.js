var drty = require('drty'),
	serve = drty.views.static.serve,
	testCase = require('nodeunit').testCase;

function getResponseTest(test, testContentType, testData) {
	return {
		headers: {},
		setHeader: function(key, val) {
			this.headers[key] = val;
		},
		ok: function(data) {
			test.equal(data.toString('ascii'), testData);
			test.deepEqual(this.headers, {
				'Content-Type': testContentType
			});
			test.done();
		}
	};
}

var documentRoot = require('path').join(__dirname, '../../tests/media');
module.exports = testCase({
	'invalid params': function(test) {
		test.throws(function() { serve({}); });
		test.done();
	},
	
	'not found': function(test) {
		serve({
			params: {
				path: 'fileNotFound.txt'
			}
		}, {
			notFound: function() {
				test.done();
			}
		}, documentRoot);
	},
	
	'..': function(test) {
		serve({
			params: {
				path: '../templates1/template1.tpl'
			}
		}, {
			notFound: function() {
				test.done();
			}
		}, documentRoot);
	},

	'txt': function(test) {
		serve({
			params: {
				path: 'test.txt'
			}
		},
		getResponseTest(test, 'text/plain', 'This is a txt file!'),
		documentRoot);
	},
	
	'css': function(test) {
		serve({
			params: {
				path: 'test.css'
			}
		}, 
		getResponseTest(test, 'text/css', 'This is a css file!'),
		documentRoot);
	},
	
	'full txt': function(test) {
		drty.conf.settings.ROOT_URLCONF = {
			urlpatterns: drty.urls.patterns(
				drty.urls.url('^/media/(?P<path>.*)$', serve, 'media', documentRoot)
			)
		};
		drty.urls.route({
			url: 'http://localhost/media/test.txt?params'
		},
		getResponseTest(test, 'text/plain', 'This is a txt file!'));
	},

	'full css': function(test) {
		drty.urls.route({
			url: 'http://localhost/media/test.css?params'
		},
		getResponseTest(test, 'text/css', 'This is a css file!'));
	}
});