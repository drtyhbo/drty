(function() {

require('./commands').add('runserver', function(argv) {
	require('../../../server/server').listen(argv[0] || 8080);
});

})();