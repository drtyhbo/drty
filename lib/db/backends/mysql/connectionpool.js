(function() {

var drty = require('drty'),
	MySQLConnection = require('./connection').MySQLConnection;

exports.MySQLConnectionPool = drty.Class.extend({
	initialize: function() {
		this.pool = [];
		this.waitList = [];
		this.numConnections = 0;
	},
	
	get: function(callback) {
		if (!this.pool.length) {
			if (this.numConnections >= 15) {
				this.waitList.push(callback);
			} else {
				var settings = drty.conf.settings.DATABASE;
				var mysqlConn = require("mysql-libmysqlclient").createConnectionSync(settings.HOST || 'localhost',
						settings.USER, settings.PASSWORD, settings.NAME);
				this.numConnections++;
				callback(new MySQLConnection(this, mysqlConn));
			}
		} else {
			callback(this.pool.shift());
		}
	},
	
	available: function(conn) {
		if (this.waitList.length) {
			(this.waitList.shift())(conn);
		} else {
			this.pool.push(conn);
		}
	}
});

})();