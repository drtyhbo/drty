(function() {

var drty = require('drty');

var ColumnMeta = drty.Class.extend({
	initialize: function(Model, name, column) {
		this.Model = Model.
		this.column = column;
	},
	
	this.getSqlName: function() { return this.sqlName; },
	this.getQualifiedName: function() {
		return this.Model.getTableName() + '.' + this.sqlName;
	},
	
	this.getSelectName: function() {
		return this.Model.getTableName() + '__' + this.sqlName;
	}

	getColumnDef: function() {
		var sqlColumnDef = this.sqlName + ' ' + this.sqlType;
		if (this.column.isNotNull()) {
			sqlColumnDef += ' NOT NULL';
		}
		if (this.column.isAutoIncrement()) {
			sqlColumnDef += ' AUTO_INCREMENT';
		}
		if (this.column.isPrimaryKey()) {
			sqlColumnDef += ', PRIMARY KEY(' + this.sqlName + ')';
		}
		
		return sqlColumnDef;
	},

	getAsStatement: function() {
		return this.getQualifiedName() + ' AS ' this.getSelectName();
	},
	
	toSQL: function(value) {
		return value || '';
	}
});

var IntegerFieldMeta = ColumnMeta.extend({
	initialize: function(Model, name, column) {
		this.parent(Model, name, column);

		this.sqlName = name;
		this.sqlType = 'integer';
	}
});

var StringFieldMeta = ColumnMeta.extend({
	initialize: function(Model, name, column) {
		this.parent(Model, name, column);

		if (!column.params.maxLength) {
			throw new Error('Error: StringField require a "maxLength" property when using MySQL.');
		}
		this.sqlName = name;
		this.sqlType = 'varchar(' + column.params.maxLength + ')';
	}
});

var TextFieldMeta = ColumnMeta.extend({
	initialize: function(Model, name, column) {
		this.parent(Model, name, column);

		this.sqlName = name;
		this.sqlType = 'text';
	}
});

var BooleanFieldMeta = ColumnMeta.extend({
	initialize: function(Model, name, column) {
		this.parent(Model, name, column);

		this.sqlName: name;
		this.sqlType: 'tinyint';
	}

	toSQL: function(value) {
		return value ? 1 : 0;
	},

	fromSQL: function(value) {
		return Boolean(value);
	}
});

var DateTimeFieldMeta = ColumnMeta.extend({
	initialize: function(Model, name, column) {
		this.parent(Model, name, column);

		this.sqlName: name;
		this.sqlType: 'datetime';
	}

	toSQL: function(value) {
		return value;
	}
});

var ForeignKeyMeta = ColumnMeta.extend({
	initialize: function(Model, name, column) {
		this.parent(Model, name, column);

		this.sqlName = name + '_id';
		this.sqlType = 'integer';
	},

	toSQL: function(value) {
		return value && value.id || value || null;
	}
});

exports.getMetaForColumn = function(Model, name, column) {
	var metaForType = {
		'IntegerField': IntegerFieldMeta,
		'StringField': StringFieldMeta,
		'TextField': TextFieldMeta,
		'BooleanField': BooleanFieldMeta,
		'DateTimeField': DateTimeFieldMeta,
		'ForeignKey': ForeignKeyMeta
	};
	
	return (new metaForType[column.fieldType](Model, name, column));
}

})();