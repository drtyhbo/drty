(function() {

require('./commands').add('dumpdata', function(argv) {
	var drty = require('drty');

	drty.db.models.serialize(function(entries) {
		console.log('module.exports = ' + JSON.stringify(entries) + ';');
	});
});

})();