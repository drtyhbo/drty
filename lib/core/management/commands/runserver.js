(function() {

require('./commands').add('runserver', function(argv) {
	console.log('Validating models...\n');
	
	var drty = require('drty'),
		models = drty.db.models.getAll();

	drty.utils.eachChained(models, function(name, Model, next) {
		Model.validate(next);
	}, function() {
		require('../../../server/server').listen(argv[0] || 8080);
	});
});

})();