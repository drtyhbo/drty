(function() {

var drty = require('drty');

var mysqlRe = /([\n\r\\'"])/g;
function escapeSQL(value) {
	if (typeof(value) == 'string') {
		value = '"' + value.replace(mysqlRe, '\\$1') + '"';
	}
	return value;
}

exports.Insert = drty.Class.extend({
	initialize: function(model) {
		this.model = model;
	},
	
	getSQL: function() {
		var INSERT_COLUMNS = [], INSERT_VALUES = [];
		
		var model = this.model;
		drty.utils.each(model.getColumns(), function(name, column) {
			if (column.autoIncrement) { return; }

			var meta = column.__mysql;
			INSERT_COLUMNS.push(meta.getSqlName());
			INSERT_VALUES.push(escapeSQL(meta.toSQL(model[name])));
		});

		return 'INSERT INTO `' + this.model.getTableName() + '` (' + INSERT_COLUMNS.join(', ') + ') VALUES(' + INSERT_VALUES.join(', ') + ')';
	}
});

exports.Update = drty.Class.extend({
	initialize: function(model) {
		this.model = model;
	},

	getSQL: function() {
		var SET = [];

		var model = this.model;
		drty.utils.each(model.getColumns(), function(name, column) {
			if (column.autoIncrement) { continue; }

			var meta = column.__mysql;
			SET.push(meta.getSqlName() + '=' + escapeSQL(meta.toSQL(model[name])));
		});

		return 'UPDATE `' + this.model.getTableName() + '` SET ' + SET.join(',') + ' WHERE id=' + this.model.id;
	}
});

exports.Select = drty.Class.extend({
	initialize: function(querySet) {
		this.querySet = querySet;
	},

	getSelectParts: function(Model, SELECT, FROM, WHERE, selectRelated) {
		var sqlSelectAs = [], columns = Model.getColumns();
		for (var name in columns) {
			sqlSelectAs.push(columns[name].__mysql.getAsStatement());
		}

		SELECT.push(sqlSelectAs.join(', '));
		FROM.push(this.Model.getTableName());

		if (selectRelated) {
			var foreignKeys = Model.getForeignKeys();
			for (var name in foreignKeys) {
				var foreignKey = foreignKeys[name];

				this.getSelectParts(foreignKey.model, SELECT, FROM, WHERE, selectRelated);
				WHERE.push(foreignKey.__mysql.getQualifiedName()
					+ '=' + Model.getTableName() + '.id');
			}
		}
	},

	getSQL: function() {
		var SELECT = [], FROM = [], WHERE = [], OPT = [],
			Model = this.querySet.model;

		this.getSelectParts(Model, SELECT, FROM, WHERE, this.querySet.selectRelated)

		// Add the filter statements to the WHERE clause
		var columns = Model.getColumns();
		for (var name in this.querySet.filters) {
			var columnMeta = columns[name].__mysql;
			WHERE.push(columnMeta.getQualifiedName() + '=' + this.escape(columnMeta.toSQL(querySet.filters[name])));
		}
		
		if (querySet.opt.orderBy) {
			OPT.push('ORDER BY ' + querySet.opt.orderBy.column
				+ (querySet.opt.orderBy.isDecending ? ' DESC' : ''));
		}
		if (querySet.opt.limit) { OPT.push('LIMIT ' + querySet.opt.limit); }

		return 'SELECT ' + SELECT.join(', ') + ' from ' + FROM.join(', ') +
			(WHERE.length ? (' WHERE ' + WHERE.join(' AND ')) : '') + ' ' + OPT.join(' ');
	}
});

exports.Create = drty.Class.extend({
	initialize: function(Model) {
		this.Model = Model;
	},
	
	getSQL: function() {
		var COLUMNS = [];
		
		drty.utils.each(this.Model.getColumns(), function(name, column) {
			COLUMNS.push(column.__mysql.getColumnDef());
		});

		return 'CREATE TABLE IF NOT EXISTS `' + this.Model.getTableName() + '` (' + COLUMNS.join(', ') + ')';
	}
});

})();