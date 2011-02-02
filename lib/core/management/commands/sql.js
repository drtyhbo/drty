(function() {

require('./commands').add('sql', function(argv) {
	var drty = require('drty');

	drty.utils.each(drty.db.models.getAll(), function(name, Model) {
		var sql = Model.sql() + ';';
		sql = sql
			.replace('(', '(\n    ')
			.replace(/, /g, ',\n    ')
			.replace(');', '\n);');
		console.log(sql);
		console.log('');
	});
});

})();