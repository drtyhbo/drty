(function() {

var drty = require('drty');

var mysqlRe = /([\n\r\\"])/g;
function escapeSQL(value) {
	if (value === null) {
		value = 'NULL'
	} else if (typeof(value) == 'string') {
		value = '"' + value.replace(mysqlRe, '\\$1') + '"';
	}
	return value;
}

var prepareModel = exports.prepareModel = function(Model) {
	if (Model._mysql) { return; }

	Model._mysql = {};
	drty.utils.each(Model.getColumns(), function(name, column) {
		column._mysql = require('./columnmeta').getMetaForColumn(Model, column);
	});
}

exports.Insert = drty.Class.extend({
	initialize: function(model) {
		prepareModel(model.constructor);
		this.model = model;
	},
	
	getSQL: function() {
		var INSERT_COLUMNS = [], INSERT_VALUES = [];
		var model = this.model;

		drty.utils.each(model.getColumns(), function(name, column) {
			if (column.isPrimaryKey()) { return; }

			var meta = column._mysql;
			INSERT_COLUMNS.push('`' + meta.getSqlName() + '`');
			INSERT_VALUES.push(escapeSQL(meta.toSQL(model[name])));
		});

		return 'INSERT INTO `' + this.model.getTableName() + '` (' + INSERT_COLUMNS.join(', ') + ') VALUES(' + INSERT_VALUES.join(', ') + ')';
	}
});

exports.Update = drty.Class.extend({
	initialize: function(model) {
		prepareModel(model.constructor);
		this.model = model;
	},

	getSQL: function() {
		var SET = [];

		var model = this.model;
		drty.utils.each(model.getColumns(), function(name, column) {
			if (column.isPrimaryKey()) { return; }

			var value = model[name];
			if (value === undefined) { value = null; }

			var meta = column._mysql;
			SET.push('`' + meta.getSqlName() + '`=' + escapeSQL(meta.toSQL(value)));
		});

		return 'UPDATE `' + this.model.getTableName() + '` SET ' + SET.join(', ') + ' WHERE id=' + this.model.id;
	}
});

exports.Select = drty.Class.extend({
	initialize: function(querySet) {
		this.querySet = querySet;
	},

	getSelectParts: function(Model, SELECT, JOIN, ON, WHERE, selectRelated) {
		prepareModel(Model);

		var sqlSelectAs = [], columns = Model.getColumns();
		for (var name in columns) {
			sqlSelectAs.push(columns[name]._mysql.getAsStatement());
		}

		SELECT.push(sqlSelectAs.join(', '));

		if (selectRelated) {
			var foreignKeys = Model.getForeignKeys();
			for (var name in foreignKeys) {
				var foreignKey = foreignKeys[name];

				this.getSelectParts(foreignKey.otherModel, SELECT, JOIN, ON, WHERE, selectRelated);

				JOIN.push('`' + foreignKey.otherModel.getTableName() + '`');
				ON.push(foreignKey._mysql.getQualifiedName()
					+ '=' + foreignKey.otherModel.getTableName() + '.id');
			}
		}
	},

	getSQL: function() {
		var SELECT = [], JOIN = [], ON = [], WHERE = [], OPT = [],
			qs = this.querySet,
			Model = qs.model;

		this.getSelectParts(Model, SELECT, JOIN, ON, WHERE, qs.selectRelated)

		// Add the filter statements to the WHERE clause
		var columns = Model.getColumns();
		for (var i = 0, filter; (filter = qs.filters[i]); i++) {
			var columnMeta = columns[filter.name]._mysql;
			WHERE.push(columnMeta.getQualifiedName() + filter.lookup + escapeSQL(columnMeta.toSQL(filter.value)));
		}
		
		if (qs.opt.orderBy) {
			OPT.push('ORDER BY ' + querySet.opt.orderBy.name
				+ (querySet.opt.orderBy.isDecending ? ' DESC' : ''));
		}
		if (qs.opt.limit) { OPT.push('LIMIT ' + qs.opt.limit); }

		return 'SELECT ' + SELECT.join(', ')
			+ ' FROM ' + Model.getTableName()
			+ (JOIN.length
				? (' LEFT JOIN (' + JOIN.join(',') + ') ON (' + ON.join(' AND ') + ')')
				: '')
			+ (WHERE.length ? (' WHERE ' + WHERE.join(' AND ')) : '')
			+ (OPT.length ? (' ' + OPT.join(' ')) : '');
	}
});

exports.Delete = drty.Class.extend({
	initialize: function(model) {
		prepareModel(model.constructor);
		this.model = model;
	},

	getSQL: function() {
		return 'DELETE FROM `' + this.model.getTableName() + '` WHERE id=' + this.model.id;
	}
});

exports.Create = drty.Class.extend({
	initialize: function(Model) {
		prepareModel(Model);
		this.Model = Model;
	},
	
	getSQL: function() {
		var COLUMNS = [];
		
		drty.utils.each(this.Model.getColumns(), function(name, column) {
			COLUMNS.push(column._mysql.getColumnDef());
		});

		return 'CREATE TABLE `' + this.Model.getTableName() + '` (' + COLUMNS.join(', ') + ')';
	}
});

})();