(function() {

require('./commands').add('startproject', function(argv) {
	var drty = require('drty');

	if (argv.length < 1) {
		console.log('Error: Enter a project name.');
		return;
	}

	drty.conf.createDirFromTemplate(argv[0], 'project');
});

})();