(function() {

var drty = require('drty');

exports.ConfigurationError = drty.Class.extend({
	initialize: function(msg) {
		this.msg = 'Configuration Error: ' + msg;
	}
});

function loadApp(app) {
	drty.db.models.loadFromApp(app);
}

exports.settings = {};
exports.parseSettings = function(settings) {
	exports.settings = drty.utils.merge(require('./default-settings').settings, settings);
	
	var installedApps = settings.INSTALLED_APPS || [];
	for (var i = 0, app; (app = installedApps[i]); i++) {
		loadApp(app);
	}
	
	var installedMiddleware = settings.MIDDLEWARE_CLASSES || [];
	for (var i = 0, middleware; (middleware = installedMiddleware[i]); i++) {
		drty.middleware.add(new middleware());
	}
}

exports.getSetting = function(setting, errorMesssage) {
	if (!(setting in exports.settings) && errorMessage) {
		throw new Error(errorMessage);
	}
	return exports.settings[setting];
}

exports.createDirFromTemplate = function(dirName, type) {
	var fs = require('fs'),
		path = require('path'),
		srcDir = path.normalize(path.join(__dirname, type + '-template')),
		destDir = path.join(process.cwd(), dirName);

	try {
		fs.statSync(destDir);
	} catch(e) {
		if (fs.mkdirSync(destDir, 0755)) {
			console.log('Error: Unable to create ' + type + ' directory.')
			return;
		}
	}
	
	var files = fs.readdirSync(srcDir);
	for (var i = 0, filename; (filename = files[i]); i++) {
		var srcFile = path.join(srcDir, filename),
			destFile = path.join(destDir, filename);
		try {
			fs.statSync(destFile);
		} catch(e) {
			fs.writeFileSync(destFile, fs.readFileSync(srcFile));
		}
	}
}

})();