var drty = require('drty'),
	MySQLConnectionPool = require('./connectionpool').MySQLConnectionPool,
	testCase = require('nodeunit').testCase;

drty.conf.settings.DATABASE = {
	ENGINE: drty.db.backends.MySQL,
	USER: 'demo',
	PASSWORD: 'demo',
	NAME: 'demo'
};

module.exports = testCase({
	'Lots of connections': function(test) {
		var dbpool = new MySQLConnectionPool(),
			num = 0;
		(function next(done) {
			if (num++ > 1000) { done(); return; }
			dbpool.get(function(conn) {
				conn.close();
				next(done);
			});
		})(function() {
			test.done();
		});
	}
});