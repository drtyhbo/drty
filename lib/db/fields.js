(function() {
	
var drty = require('drty');

var Field = drty.Class.extend({
	initialize: function(options) {
		this.__options = options || {};

		if (this.__options.primaryKey) {
			this.__options.null = false;
		}
	},
	
	getFieldType: function() { return this._fieldType; },
	
	setName: function(name) { this._name = name; },
	getName: function() { return this._name; },
	setModel: function(Model) { this._Model = Model; },
	getModel: function() { return this._Model; },
	
	getOptions: function() { return this.__options; },
	
	isNull: function() { return Boolean(this.__options.null); },
	isPrimaryKey: function() { return this.__options.primaryKey || false; },
	isRelationship: function() { return this._fieldType == 'foreignkey'; },
	isUnique: function() { return this.__options.unique || false; },
	getDbColumn: function() { return this.__options.dbColumn || null; },

	getInitialValue: function() { return this.__options.default || null; },
	massage: function(value) { return value; },
	validate: function(value) { return true; }
});

exports.AutoField = Field.extend({
	_fieldType: 'AutoField',
});

exports.IntegerField = Field.extend({
	_fieldType: 'IntegerField'
});

exports.PositiveIntegerField = Field.extend({
	_fieldType: 'PositiveIntegerField'
});

exports.SmallIntegerField = Field.extend({
	_fieldType: 'SmallIntegerField'
});

exports.PositiveSmallIntegerField = Field.extend({
	_fieldType: 'PositiveSmallIntegerField'
});

exports.FloatField = Field.extend({
	_fieldType: 'FloatField',
});

exports.CharField = Field.extend({
	_fieldType: 'CharField',
	
	getMaxLength: function() { return this.__options.maxLength; }
});

exports.EmailField = exports.CharField.extend({
	_fieldType: 'EmailField',
	initialize: function(maxLength, options) {
		maxLength = maxLength || 75;
		this.parent(drty.utils.merge({maxLength: maxLength}, options));
	}
});

exports.TextField = Field.extend({
	_fieldType: 'TextField'
});

exports.BooleanField = Field.extend({
	_fieldType: 'BooleanField'
});

exports.NullBooleanField = exports.BooleanField.extend({
	_fieldType: 'NullBooleanField',
	initialize: function(options) {
		this.parent(drty.utils.merge({null: true}, options));		
	}
});

exports.DateTimeField = Field.extend({
	_fieldType: 'DateTimeField',
	
	getInitialValue: function() {
		return this.__options.autoNowAdd ? new Date() : this.default;
	},

	massage: function(value) {
		if (!value) { return value; }

		return new Date(value.getFullYear(), value.getMonth(), value.getDate(),
			value.getHours(), value.getMinutes(), value.getSeconds());
	}
});

exports.DateField = Field.extend({
	_fieldType: 'DateField',

	massage: function(value) {
		if (!value) { return value; }

		return new Date(value.getFullYear(), value.getMonth(), value.getDate());
	}
});

exports.ForeignKey = Field.extend({
	_fieldType: 'ForeignKey',

	initialize: function(model, options) {
		this.parent(options);
		this.otherModel = model;
	},

	isRelationship: function() { return true; }
});

})();