(function() {

var urls = require('drty').urls,
	patterns = urls.patterns, url = urls.url;

exports.urlpatterns = urls.patterns(require('./views'),
	url('^/$', 'root'),
);

})();