(function() {

exports.loadFixtures = function(cb) {
	var drty = require('drty'),
		apps = drty.conf.getApps();

	console.log('Loading fixtures...');

	drty.utils.eachChained(apps, function(name, app, next) {
		if (!app.fixtures) { next(); return; }

		drty.utils.eachChained(app.fixtures, function(name, fixture, next) {
			drty.db.models.deserialize(fixture);
		}, function() {
			next();
		});
	}, function() {
		if (cb) { cb(); }
	});
}

require('./commands').add('loaddata', function(argv) {
	exports.loadFixtures();
});

})();