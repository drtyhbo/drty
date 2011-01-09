(function() {

var drty = require('drty');

exports.MySQL = drty.Class.extend({
	initialize: function() {
		this.mysqlRe = /([\n\r\\'"])/g;
		this.dbpool = new (require('./connectionpool').MySQLConnectionPool)();
	},
	
	escape: function(value) {
		if (typeof(value) == 'string') {
			value = '"' + value.replace(this.mysqlRe, '\\$1') + '"';
		}
		return value;
	},
	
	prepareColumn: function(Model, name, column) {
		var __mysql = null;

		switch(column.fieldType) {
		case 'IntegerField':
			__mysql = {
				sqlName: name,
				sqlType: 'integer'
			};
			break;
		case 'StringField':
			if (!column.params.maxLength) {
				throw new Error('Error: ' + Model.__meta.tableName + "." + name + ": StringField require a 'maxLength' property when using MySQL.");
			}
			__mysql = {
				sqlName: name,
				sqlType: 'varchar(' + column.params.maxLength + ')'
			};
			break;
		case 'TextField':
			__mysql = {
				sqlName: name,
				sqlType: 'text'
			};
			break;
		case 'BooleanField':
			__mysql = {
				sqlName: name,
				sqlType: 'tinyint',
				toSQL: function(value) {
					return value ? 1 : 0;
				},
				fromSQL: function(value) {
					return Boolean(value);
				}
			};
			break;
		case 'DateTimeField':
			__mysql = {
				sqlName: name,
				sqlType: 'datetime',
				toSQL: function(value) {
					return value;
				}
			};
			break;
		case 'ForeignKey':
			__mysql = {
				sqlName: name + '_id',
				sqlType: 'integer', 
				toSQL: function(value) {
					return value && value.id || value || null;
				}
			};
		
			Model.__mysql.foreignKeys[name] = column;
			break;
		}

		// sqlFullName is the fully qualified name mysql will use to look up this column
		__mysql.sqlFullName = Model.__meta.tableName + '.' + __mysql.sqlName;
		// sqlColumnName is the name that mysql will return for this column in the row data
		__mysql.sqlSelectName = Model.__meta.tableName + '__' + __mysql.sqlName;
		
		if (!__mysql.toSQL) {
			__mysql.toSQL = function(value) { return value || ''; }
		}
		
		var sqlColumnDef = __mysql.sqlName + ' ' + __mysql.sqlType;
		if (column.isNotNull()) {
			sqlColumnDef += ' NOT NULL';
		}
		if (column.isAutoIncrement()) {
			sqlColumnDef += ' AUTO_INCREMENT';
		}
		if (column.isPrimaryKey()) {
			sqlColumnDef += ', PRIMARY KEY(' + __mysql.sqlName + ')';
		}
		
		__mysql.sqlColumnDef = sqlColumnDef;
		column.__mysql = __mysql;
	},
	
	// Adds MySQL specific data to the model
	prepareModel: function(Model) {
		var columns = Model.__meta.columns;

		var sqlSelectAs = [];
		Model.__mysql = {
			foreignKeys: {},
			
			getSelectParts: function(SELECT, FROM, WHERE, selectRelated) {
				SELECT.push(sqlSelectAs.join(', '));
				FROM.push(Model.__meta.tableName);

				if (selectRelated) {
					// Add foreign keys to select
					for (var name in Model.__mysql.foreignKeys) {
						var column = Model.__mysql.foreignKeys[name];
						column.model.__mysql.getSelectParts(SELECT, FROM, WHERE, selectRelated);
						WHERE.push(column.__mysql.sqlFullName + '=' + column.model.__meta.tableName + '.id');
					}
				}
			},
			
			createModelFromRow: function(row, selectRelated) {
				var values = {};
				for (var name in columns) {
					if (name in Model.__mysql.foreignKeys) { continue; }

					var columnMeta = columns[name].__mysql;
					values[name] = columnMeta.fromSQL
						? columnMeta.fromSQL(row[columnMeta.sqlSelectName])
						: row[columnMeta.sqlSelectName];
				}
								
				if (selectRelated) {
					// iterate over foreign keys
					var foreignKeys = Model.__mysql.foreignKeys;
					for (var name in foreignKeys) {
						values[name] = foreignKeys[name].model.__mysql.createModelFromRow(row, selectRelated);
					}
				}

				return new Model(values);
			}
		}

		for (var name in columns) {
			var column = columns[name];

			this.prepareColumn(Model, name, column);
			sqlSelectAs.push(column.__mysql.sqlFullName + ' AS '
				+ column.__mysql.sqlSelectName);
		}
	},

	insert: function(model, callback) {
		var INSERT_COLUMNS = [],
			INSERT_VALUES = [],
			columns = model.__meta.columns;
		for (var name in columns) {
			var column = columns[name];
			if (column.autoIncrement) { continue; }

			var columnMeta = column.__mysql;
			INSERT_COLUMNS.push(columnMeta.sqlName);
			INSERT_VALUES.push(this.escape(columnMeta.toSQL(model[name])));
		}

		var sql = 'INSERT INTO `' + model.__meta.tableName + '` (' + INSERT_COLUMNS.join(', ') + ') VALUES(' + INSERT_VALUES.join(', ') + ')';
		this.dbpool.get(function(conn) {
			// do the query
			var q = conn.query(sql, function(error, res) {
				conn.close();
				if (error) { throw error; }
				callback(res.insertId);
			}.bind(this));

		}.bind(this));
	},

	update: function(model, callback) {
		var SET = [],
			columns = model.__meta.columns;
		for (var name in columns) {
			var column = columns[name];
			if (column.autoIncrement) { continue; }

			var columnMeta = column.__mysql;
			SET.push(columnMeta.sqlName + '=' + this.escape(columnMeta.toSQL(model[name])));
		}

		var sql = 'UPDATE `' + model.__meta.tableName + '` SET ' + SET.join(',') + ' WHERE id=' + model.id;
		this.dbpool.get(function(conn) {
			// do the query
			var q = conn.query(sql, function(error, res) {
				conn.close();
				if (error) { throw error; }
				if (callback) { callback(model); }
			}.bind(this));

		}.bind(this));
	},
	
	select: function(querySet, callback) {
		var SELECT = [], FROM = [], WHERE = [];

		querySet.model.__mysql.getSelectParts(SELECT, FROM, WHERE, querySet.selectRelated)

		// Add the filter statements to the WHERE clause
		var columns = querySet.model.__meta.columns;
		for (var name in querySet.filters) {
			var columnMeta = columns[name].__mysql;
			WHERE.push(columnMeta.sqlFullName + '=' + this.escape(columnMeta.toSQL(querySet.filters[name])));
		}
		
		var OPT = [];
		if (querySet.opt.orderBy) {
			OPT.push('ORDER BY ' + querySet.opt.orderBy.column
				+ (querySet.opt.orderBy.isDecending ? ' DESC' : ''));
		}
		if (querySet.opt.limit) { OPT.push('LIMIT ' + querySet.opt.limit); }

		var sql = 'SELECT ' + SELECT.join(', ') + ' from ' + FROM.join(', ') +
			(WHERE.length ? (' WHERE ' + WHERE.join(' AND ')) : '') + ' ' + OPT.join(' ');
		this.dbpool.get(function(conn) {
			// do the query
			conn.query(sql, function(error, res) {
				if (error) {
					conn.close();
					throw error;
				}
				// grab the results
				res.fetchAll(function(error, rows) {
					models = [];
					for (var i = 0, row; (row = rows[i]); i++) {
						models.push(querySet.model.__mysql.createModelFromRow(row, querySet.selectRelated));
					}
					conn.close();
					callback(models);
				}.bind(this));

			}.bind(this));

		}.bind(this));
	},
	
	create: function(model, callback) {
		var columns = [];

		for (var name in model.__meta.columns) {
			columns.push(model.__meta.columns[name].__mysql.sqlColumnDef);
		}

		var sql = 'CREATE TABLE IF NOT EXISTS `' + model.__meta.tableName + '` (' + columns.join(', ') + ')';
		this.dbpool.get(function(conn) {
			conn.query(sql, function(error) {
				if (error) { throw error; }
				if (callback) { callback(); }
			});
		}.bind(this));
	},
	
	validate: function(Model, callback) {
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
		this.dbpool.get(function(conn) {
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
		}.bind(this));
	}
});

})();