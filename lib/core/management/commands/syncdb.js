(function() {

require('./commands').add('syncdb', function(argv) {
	require('drty').models.syncAll();
});

})();