(function() {

require('./commands').add('syncdb', function(argv) {
	var drty = require('drty');

	drty.utils.eachChained(drty.db.models.getAll(), function(name, Model, next) {
		Model.sync(next);
	});
});

})();