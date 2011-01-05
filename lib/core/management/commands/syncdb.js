(function() {

require('./commands').add('syncdb', function(argv) {
	var drty = require('drty'),
		models = drty.db.models.getAll();
	drty.utils.eachChained(models, function(name, model, next) {
		model.sync(next);
	});
});

})();