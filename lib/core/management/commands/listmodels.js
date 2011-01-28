(function() {

var drty = require('drty');

require('./commands').add('listmodels', function(argv) {
	console.log('Active models:')
	drty.utils.each(drty.db.models.getAll(), function(tableName, model) {
		console.log('  ' + model.getTableName());
	});
});

})();