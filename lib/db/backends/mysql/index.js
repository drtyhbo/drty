(function() {

var drty = require('drty'),
	dbpool = new (require('./connectionpool').MySQLConnectionPool)();
	
exports.insert = function(model, callback) {
	var insertSQL = new (require('./statements').Insert)(model);
	dbpool.get(function(conn) {
		// do the query
		var q = conn.query(insertSQL.getSQL(), function(error, res) {
			conn.close();
			callback(error, error ? null : res.insertId);
		});
	});
}

exports.update = function(model, callback) {
	var updateSQL = new (require('./statements').Update)(model);
	dbpool.get(function(conn) {
		// do the query
		var q = conn.query(updateSQL.getSQL(), function(error, res) {
			conn.close();
			if (callback) { callback(error, model); }
		});
	});
}
	
exports.select = function(querySet, callback) {
	function createModelFromRow(Model, row, selectRelated) {
		if (row[Model.pk.__mysql.getSelectName()] === null) {
			return null;
		}

		var values = {};
		var columns = Model.getColumns(),
			foreignKeys = Model.getForeignKeys();
		for (var name in columns) {
			var column = columns[name];
			if (selectRelated && column.isRelationship()) {
				values[name] = createModelFromRow(foreignKeys[name].otherModel, row, selectRelated);
			} else {
				var meta = column.__mysql;
				values[name] = meta.toJS(row[meta.getSelectName()]);
			}
		}

		return new Model(values);
	}

	var select = new (require('./statements').Select)(querySet);
	dbpool.get(function(conn) {
		// do the query
		conn.query(select.getSQL(), function(error, res) {
			if (error) {
				conn.close();
				callback(error, []);
			} else {
				// grab the results
				res.fetchAll(function(error, rows) {
					conn.close();
					if (error) {
						callback(error, []);
					} else {
						models = [];
						for (var i = 0, row; (row = rows[i]); i++) {
							models.push(createModelFromRow(querySet.model, row, querySet.selectRelated));
						}
						callback(error, models);
					}
				});
			}
		});
	});
},
	
exports.create = function(Model, callback) {
	var create = new (require('./statements').Create)(Model);
	dbpool.get(function(conn) {

		// first check if the table has already been created
		var sql = 'SELECT * FROM ' + Model.getTableName() + ' LIMIT 1';
		conn.query(sql, function(error, res) {
			if (!error) { callback(null); return; }

			console.log('Creating table ' + Model.getTableName() + '...');
			conn.query(create.getSQL(), function(error) {
				if (callback) { callback(error); }
			});
		});
	});
},
	
exports.validate = function(Model, callback) {
	var mysqlFieldTypes = {
		0x03: 'IntegerField',
		0x0C: 'DateTimeField',
		0xFC: 'TextField',
		0xFD: 'StringField'
	};

	var mysqlFieldFlags = {
		0x0001: 'isNotNull',
	    0x0002: 'isPrimaryKey',
		0x0200: 'isAutoIncrement'
	};
	
	var sql = 'SELECT * FROM ' + Model.getTableName() + ' LIMIT 1';
	dbpool.get(function(conn) {
		conn.query(sql, function(error, res) {
			var fieldsArr = res.fetchFieldsSync();

			// Put the fields in a quick-lookup object
			var fields = {};
			for (var i = 0, field; (field = fieldsArr[i]); i++) {
				fields[field.name] = field;
			}

			drty.utils.each(Model.getColumns(), function(name, column) {
				if (!(column.getSqlName() in fields)) {
					throw new Error("Error: Local column '" + name + "' not in database.");
				}
				
				var field = fields[column.getSqlName()];
				if (column.getFieldType() != mysqlFieldTypes[field.type]) {
					throw new Error("Error: Column '" + name + "' has an invalid type. Expected: " + mysqlFieldTypes[field.type]);
				}
				for (var flag in mysqlFieldFlags) {
					if ((field.flags & flag) && !column[mysqlFieldFlags[flag]]()) {
						throw new Error("Error: Column '" + name + "' in table '" + meta.tableName + "' has invalid flags.");
					}
				}
			});
			
			callback();
		});
	});
}

})();