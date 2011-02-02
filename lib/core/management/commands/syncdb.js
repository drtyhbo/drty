(function() {

require('./commands').add('syncdb', function(argv) {
	var drty = require('drty');

	drty.utils.eachChained(drty.db.models.getAll(), function(name, Model, next) {
		Model.sync(function(err) {
			if (err) { throw err; }
			next();
		});
	}, function() {
		require('./loaddata').loadFixtures();
	});
});

})();