(function() {

require('./commands').add('startproject', function(argv) {
	if (argv.length < 1) {
		console.log('Error: Enter a project name.');
		return;
	}

	var fs = require('fs'),
		path = require('path'),
		srcDir = path.normalize(__dirname + '/../../../conf/project-template'),
		destDir = path.join(process.cwd(), argv[0]);

	if (fs.mkdirSync(destDir, 0755)) {
		console.log('Error: Unable to create project directory.')
		return;
	}
	
	var files = fs.readdirSync(srcDir);
	for (var i = 0, filename; (filename = files[i]); i++) {
		var srcFile = path.join(srcDir, filename),
			destFile = path.join(destDir, filename);
		fs.writeFileSync(destFile, fs.readFileSync(srcFile));
	}
});

})();