(function() {

var drty = require('drty');

var ColumnMeta = drty.Class.extend({
	initialize: function(Model, column) {
		this.Model = Model;
		this.column = column;
		this.sqlName = column.getDbColumn()
			|| this.nameToSqlName(column.getName());
	},

	nameToSqlName: function(name) {
		return name.replace(/([a-zA-Z])([A-Z][a-z])/g, '$1_$2').toLowerCase();
	},
	
	getSqlName: function() { return this.sqlName; },
	getSqlType: function() { return this.sqlType; },

	getQualifiedName: function() { return this.Model.getTableName() + '.' + this.sqlName; },
	getSelectName: function() { return this.Model.getTableName() + '__' + this.sqlName; },
	getAsStatement: function() { return this.getQualifiedName() + ' AS ' + this.getSelectName(); },

	getColumnDef: function() {
		var sqlColumnDef = this.sqlName + ' ' + this.sqlType;
		
		if (this.column.getMaxLength && this.column.getMaxLength()) {
			sqlColumnDef += '(' + this.column.getMaxLength() + ')';
		}
		if (this.column.getFieldType() == 'DecimalField') {
			sqlColumnDef += '(' + this.column.getMaxDigits()
				+ ', ' + this.column.getDecimalPlaces() + ')';
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
		if (this.column.isUnique()) {
			sqlColumnDef += ', UNIQUE(' + this.sqlName + ')';
		}
		if (this.column.isPrimaryKey()) {
			sqlColumnDef += ', PRIMARY KEY(' + this.sqlName + ')';
		}
		if (this.column.isIndex()) {
			sqlColumnDef += ', INDEX(' + this.sqlName + ')';			
		}
		
		return sqlColumnDef;
	},

	isUnsigned: function() { return false; },
	isAutoIncrement: function() { return false; },
	
	toSQL: function(value) { return value; },
	toJS: function(value) { return value; }
});

exports.IntegerFieldMeta = ColumnMeta.extend({
	sqlType: 'integer',
});

exports.PositiveIntegerFieldMeta = ColumnMeta.extend({
	sqlType: 'integer',
	isUnsigned: function() { return true; }
});

exports.SmallIntegerFieldMeta = ColumnMeta.extend({
	sqlType: 'smallint',
});

exports.PositiveSmallIntegerFieldMeta = ColumnMeta.extend({
	sqlType: 'smallint',
	isUnsigned: function() { return true; }
});

exports.AutoFieldMeta = exports.PositiveIntegerFieldMeta.extend({
	isAutoIncrement: function() { return true; }
});

exports.FloatFieldMeta = ColumnMeta.extend({
	sqlType: 'double',
});

exports.DecimalFieldMeta = ColumnMeta.extend({
	sqlType: 'decimal'
});

exports.CharFieldMeta = ColumnMeta.extend({
	sqlType: 'varchar',
	
	initialize: function(Model, column) {
		this.parent(Model, column);

		if (!column.getMaxLength()) {
			throw new Error('Error: StringField require a "maxLength" property when using MySQL.');
		}
	}
});

exports.TextFieldMeta = ColumnMeta.extend({
	sqlType: 'text',
});

exports.BooleanFieldMeta = ColumnMeta.extend({
	sqlType: 'tinyint',

	isUnsigned: function() { return true; },
	
	toSQL: function(value) { return value ? 1 : 0; },
	toJS: function(value) { return Boolean(value); }
});

exports.DateTimeFieldMeta = ColumnMeta.extend({
	sqlType: 'datetime',

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

exports.ForeignKeyMeta = exports.IntegerFieldMeta.extend({

	initialize: function(Model, column) {
		this.parent(Model, column);
		this.sqlName = column.getDbColumn() ||
			this.nameToSqlName(column.getName()) + '_id';
	},

	isUnsigned: function() { return true; },
	toSQL: function(value) { return value && value.id || value || null; }
});

exports.getMetaForColumn = function(Model, column) {
	var metaForType = {
		'AutoField': exports.AutoFieldMeta,
		'IntegerField': exports.IntegerFieldMeta,
		'PositiveIntegerField': exports.PositiveIntegerFieldMeta,
		'SmallIntegerField': exports.SmallIntegerFieldMeta,
		'PositiveSmallIntegerField': exports.PositiveSmallIntegerFieldMeta,
		'FloatField': exports.FloatFieldMeta,
		'DecimalField': exports.DecimalFieldMeta,
		'CharField': exports.CharFieldMeta,
		'EmailField': exports.CharFieldMeta,
		'IPAddressField': exports.CharFieldMeta,
		'URLField': exports.CharFieldMeta,
		'SlugField': exports.CharFieldMeta,
		'TextField': exports.TextFieldMeta,
		'BooleanField': exports.BooleanFieldMeta,
		'NullBooleanField': exports.BooleanFieldMeta,
		'DateTimeField': exports.DateTimeFieldMeta,
		'DateField': exports.DateTimeFieldMeta,
		'TimeField': exports.DateTimeFieldMeta,
		'ForeignKey': exports.ForeignKeyMeta
	};
	
	return (new metaForType[column.getFieldType()](Model, column));
}

})();