(function() {

require('./commands').add('syncdb', function(argv) {
	var drty = require('drty'),
		models = drty.db.models.getAll();
	drty.utils.eachChained(models, function(name, Model, next) {
		Model.validate(function(isValid) {
			if (!isValid) { return; }
			Model.sync(next);
		});
	});
});

})();