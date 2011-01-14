(function() {

var drty = require('drty');

var ColumnMeta = drty.Class.extend({
	initialize: function(column) {
		this.column = column;
		this.sqlName = this.nameToSqlName(column.getName());
	},

	nameToSqlName: function(name) {
		return name.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
	},
	
	getSqlName: function() { return this.sqlName; },
	getSqlType: function() { return this.sqlType; },

	getQualifiedName: function() { return this.column.getModel().getTableName() + '.' + this.sqlName; },
	getSelectName: function() { return this.column.getModel().getTableName() + '__' + this.sqlName; },
	getAsStatement: function() { return this.getQualifiedName() + ' AS ' + this.getSelectName(); },

	getColumnDef: function() {
		var sqlColumnDef = this.sqlName + ' ' + this.sqlType;
		
		if (this.column.getMaxLength && this.column.getMaxLength()) {
			sqlColumnDef += '(' + this.column.getMaxLength() + ')';
		}
		if (this.isUnsigned()) {
			sqlColumnDef += ' UNSIGNED';
		}
		if (!this.column.isNull()) {
			sqlColumnDef += ' NOT NULL';
		}
		if (this.isAutoIncrement()) {
			sqlColumnDef += ' AUTO_INCREMENT';
		}
		if (this.column.isPrimaryKey()) {
			 sqlColumnDef += ', PRIMARY KEY(' + this.sqlName + ')';
		}
		
		return sqlColumnDef;
	},

	isUnsigned: function() { return false; },
	isAutoIncrement: function() { return false; },
	
	toSQL: function(value) { return value; },
	toJS: function(value) { return value; }
});

var IntegerFieldMeta = exports.IntegerFieldMeta = ColumnMeta.extend({
	initialize: function(column) {
		this.parent(column);
		this.sqlType = 'integer';
	},
	
	isUnsigned: function() { return this.column.isPrimaryKey() }
});

var AutoFieldMeta = exports.AutoFieldMeta = IntegerFieldMeta.extend({
	initialize: function(column) {
		this.parent(column);
	},
	
	isAutoIncrement: function() { return true; }
});

var CharFieldMeta = exports.CharFieldMeta = ColumnMeta.extend({
	initialize: function(column) {
		this.parent(column);

		if (!column.getMaxLength()) {
			throw new Error('Error: StringField require a "maxLength" property when using MySQL.');
		}
		this.sqlType = 'varchar';
	}
});

var TextFieldMeta = exports.TextFieldMeta = ColumnMeta.extend({
	initialize: function(column) {
		this.parent(column);
		this.sqlType = 'text';
	}
});

var BooleanFieldMeta = exports.BooleanFieldMeta = ColumnMeta.extend({
	initialize: function(column) {
		this.parent(column);
		this.sqlType = 'tinyint';
	},

	isUnsigned: function() { return true; },
	
	toSQL: function(value) { return value ? 1 : 0; },
	toJS: function(value) { return Boolean(value); }
});

var DateTimeFieldMeta = exports.DateTimeFieldMeta = ColumnMeta.extend({
	initialize: function(column) {
		this.parent(column);
		this.sqlType = 'datetime';
	},

	toSQL: function(value) {
		if (value === null) {
			return null;
		}

		function pad(num) {
			return num < 10 
				? '0' + num
				: String(num);
		}
		var year = value.getFullYear(),
			month = pad(value.getUTCMonth() + 1),
			day = pad(value.getUTCDate()),
			hour = pad(value.getUTCHours()),
			min = pad(value.getUTCMinutes()),
			sec = pad(value.getUTCSeconds());
			
		return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
	}
});

var ForeignKeyMeta = exports.ForeignKeyMeta = ColumnMeta.extend({
	initialize: function(column) {
		this.parent(column);

		this.sqlName = this.nameToSqlName(column.getName()) + '_id';
		this.sqlType = 'integer';
	},

	isUnsigned: function() { return true; },

	toSQL: function(value) { return value && value.id || value || null; }
});

exports.getMetaForColumn = function(column) {
	var metaForType = {
		'AutoField': AutoFieldMeta,
		'IntegerField': IntegerFieldMeta,
		'CharField': CharFieldMeta,
		'TextField': TextFieldMeta,
		'BooleanField': BooleanFieldMeta,
		'DateTimeField': DateTimeFieldMeta,
		'ForeignKey': ForeignKeyMeta
	};
	
	return (new metaForType[column.getFieldType()](column));
}

})();