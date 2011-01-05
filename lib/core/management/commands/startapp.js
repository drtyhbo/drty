(function() {

require('./commands').add('startapp', function(argv) {
	var drty = require('drty');

	if (argv.length < 1) {
		console.log('Error: Enter an app name.');
		return;
	}

	drty.conf.createDirFromTemplate(argv[0], 'app');
});

})();