(function() {

var drty = require('drty'),
	dbpool = new (require('./connectionpool').MySQLConnectionPool)();
	
exports.insert = function(model, callback) {
	var insertSQL = new require('./statements').Insert(model);
	dbpool.get(function(conn) {
		// do the query
		var q = conn.query(insertSQL.getSQL(), function(error, res) {
			conn.close();
			if (error) { throw error; }
			callback(res.insertId);
		});
	});
}

exports.update = function(model, callback) {
	var updateSQL = new require('./statements').Update(model);
	dbpool.get(function(conn) {
		// do the query
		var q = conn.query(updateSQL.getSQL(), function(error, res) {
			conn.close();
			if (error) { throw error; }
			if (callback) { callback(model); }
		});
	});
}
	
exports.select = function(querySet, callback) {
	function createModelFromRow(Model, row, selectRelated) {
		var values = {};
		for (var name in columns) {
			var column = columns[name];
			if (selectRelated && column.isForeignKey()) {
				values[name] = createModelFromRow(foreignKeys[name].model, row, selectRelated);
			} else {
				var meta = column.__mysql;
				values[name] = columnMeta.fromSQL(row[columnMeta.getSelectName()]);
			}
		}

		return new Model(values);
	}

	var select = new require('./statements').Select(querySet);
	dbpool.get(function(conn) {
		// do the query
		conn.query(select.getSQL(), function(error, res) {
			if (error) {
				conn.close();
				throw error;
			}
			// grab the results
			res.fetchAll(function(error, rows) {
				models = [];
				for (var i = 0, row; (row = rows[i]); i++) {
					models.push(createModelFromRow(querySet.model, row, querySet.selectRelated));
				}
				conn.close();
				callback(models);
			});
		});
	});
},
	
exports.create = function(model, callback) {
	var create = new require('./statements').Create(model);
	dbpool.get(function(conn) {
		conn.query(create.getSQL(), function(error) {
			if (error) { throw error; }
			if (callback) { callback(); }
		});
	});
},
	
exports.validate = function(Model, callback) {
	var mysqlFieldTypes = {
		0x03: 'IntegerField',
		0xFC: 'TextField',
		0xFD: 'StringField'
	};

	var mysqlFieldFlags = {
		0x0001: 'isNotNull',
	    0x0002: 'isPrimaryKey',
		0x0200: 'isAutoIncrement'
	};

	var meta = Model.__meta,
		columns = meta.columns;
	
	var sql = 'SELECT * FROM ' + meta.tableName + ' LIMIT 1';
	dbpool.get(function(conn) {
		conn.query(sql, function(error, res) {
			var fields = res.fetchFieldsSync();

			// check the MySQL fields
			for (var name in columns) {
				var column = columns[name];

				for (var i = 0, field; (field = fields[i]); i++) {
					if (field.name == name) {
						if (column.fieldType != mysqlFieldTypes[field.type]) {
							throw new Error("Error: Column '" + name + "' in table '" + meta.tableName + "' has an invalid type. Expected: " + mysqlFieldTypes[field.type]);
						}
						for (var flag in mysqlFieldFlags) {
							if ((field.flags & flag) && !column[mysqlFieldFlags[flag]]()) {
								throw new Error("Error: Column '" + name + "' in table '" + meta.tableName + "' has invalid flags.");
							}
						}
						break;
					}
				}
				if (i == fields.length) {
					throw new Error("Error: Unknown column '" + name + "' in table '" + meta.tableName + "'");
				}
			}
			callback();
		});
	});
}

})();