(function() {

require('./commands').add('listurls', function(argv) {
	var drty = require('drty');

	console.log('Active urls:')
	drty.utils.each(drty.urls.getPatterns().urls, function(key, url) {
		console.log('  ' + url.url);
	});
});

})();