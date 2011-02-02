(function() {

var drty = require('drty'),
	dbpool = new (require('./connectionpool').MySQLConnectionPool)();

exports.insert = function(model, callback) {
	var insertSQL = new (require('./statements').Insert)(model);
	dbpool.get(function(conn) {
		var q = conn.query(insertSQL.getSQL(), function(error, res) {
			conn.close();
			if (!error) {
				model.id = res.insertId;
			}
			if (callback) {
				callback(error, error ? null : model);
			}
		});
	});
}

exports.update = function(model, callback) {
	var updateSQL = new (require('./statements').Update)(model);
	dbpool.get(function(conn) {
		// do the query
		var q = conn.query(updateSQL.getSQL(), function(error, res) {
			conn.close();
			if (callback) {
				callback(error, model);
			}
		});
	});
}
	
exports.select = function(querySet, callback) {
	function createModelFromRow(Model, row, selectRelated) {
		if (row[Model.pk._mysql.getSelectName()] === null) {
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
				var meta = column._mysql;
				values[name] = column.toJS(meta.toJS(row[meta.getSelectName()]));
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

exports.delete = function(model, callback) {
	var deleteSQL = new (require('./statements').Delete)(model);
	dbpool.get(function(conn) {
		// do the query
		var q = conn.query(deleteSQL.getSQL(), function(error, res) {
			conn.close();
			if (callback) {
				callback(error, model);
			}
		});
	});
}

exports.create = function(Model, callback) {
	var create = new (require('./statements').Create)(Model);
	dbpool.get(function(conn) {

		// first check if the table has already been created
		var sql = 'SELECT * FROM ' + Model.getTableName() + ' LIMIT 1';
		conn.query(sql, function(error, res) {
			if (!error) {
				if (callback) { callback(null); }
				return;
			}

			console.log("Creating table '" + Model.getTableName() + "'");
			conn.query(create.getSQL(), function(err) {
				if (callback) { callback(err); }
			});
		});
	});
}

exports.validate = function(Model, callback) {
	var mysqlFieldTypes = {
		0x01: 'tinyint',
		0x02: 'smallint',
		0x03: 'integer',
		0x05: 'double',
		0x0A: 'date',
		0x0B: 'time',
		0x0C: 'datetime',
		0xF6: 'decimal',
		0xFC: 'text',
		0xFD: 'varchar'
	};

	var mysqlFieldFlags = {
		0x0001: function(column) { return column.isNull(); },
	    0x0002: function(column) { return !column.isPrimaryKey() },
		0x0200: function(column) { return !column.isPrimaryKey() }
	};

	require('./statements').prepareModel(Model);
	
	var sql = 'SELECT * FROM ' + Model.getTableName() + ' LIMIT 1';
	dbpool.get(function(conn) {
		conn.query(sql, function(error, res) {
			if (error) { throw error; }

			var fieldsArr = res.fetchFieldsSync();

			// Put the fields in a quick-lookup object
			var fields = {};
			for (var i = 0, field; (field = fieldsArr[i]); i++) {
				fields[field.name] = field;
			}

			drty.utils.each(Model.getColumns(), function(name, column) {
				var sqlName = column._mysql.getSqlName();

				if (!(sqlName in fields)) {
					throw new Error("Error: Local column '" + name + "' not in database.");
				}
				var field = fields[sqlName];
				if (column._mysql.getSqlType() != mysqlFieldTypes[field.type]) {
					throw new Error("Error: Column '" + name + "' has an invalid type. Expected: " + mysqlFieldTypes[field.type]);
				}
				for (var flag in mysqlFieldFlags) {
					if ((field.flags & flag) && mysqlFieldFlags[flag](column)) {
						throw new Error("Error: Column '" + name + "' in table '" + Model.getTableName() + "' has invalid flags.");
					}
				}
			});
			
			callback();
		});
	});
}

})();