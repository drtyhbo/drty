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
	for (var i = 0; i < installedApps.length; i++) {
		var app = installedApps[i];
		if (!app) {
			throw new Error('App is undefined in INSTALLED_APPS');
		}
		loadApp(app);
	}
	
	var installedMiddleware = settings.MIDDLEWARE_CLASSES || [];
	for (var i = 0; i < installedMiddleware.length; i++) {
		var middleware = installedMiddleware[i];
		if (!middleware) {
			throw new Error('Middleware class is undefined in MIDDLEWARE_CLASSES');
		}
		drty.middleware.add(new middleware());
	}
}

function isInstalled(what, where) {
	for (var i = 0; where[i] && where[i] != what; i++) {}
	return i != where.length;
}

exports.isAppInstalled = function(app) {
	return isInstalled(app, exports.settings.INSTALLED_APPS);
}

exports.isMiddlewareInstalled = function(middleware) {
	return isInstalled(middleware, exports.settings.MIDDLEWARE_CLASSES);	
}

exports.getSetting = function(setting, errorMessage) {
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