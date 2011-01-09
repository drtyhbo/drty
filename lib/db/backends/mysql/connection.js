(function() {

var drty = require('drty');

exports.MySQLConnection = drty.Class.extend({
	initialize: function(dbpool, conn) {
		this.dbpool = dbpool;
		this.conn = conn;
	},
	
	query: function(sql, callback) {
		this.conn.query(sql, callback);
	},
	
	close: function() {
		this.dbpool.available(this);
	}
});

})();