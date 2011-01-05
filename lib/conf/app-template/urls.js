var urls = require('drty').urls;

exports.urlpatterns = urls.patterns(require('./views'),
	urls.url('$', 'root')
);