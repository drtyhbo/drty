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
	isIndex: function() { return this.__options.dbIndex || false; },
	isAutoNow: function() { return this.__options.autoNow || false; },
	isAutoNowAdd: function() { return this.__options.autoNowAdd || false; },

	getInitialValue: function() {
		if (!('default' in this.__options)) { return null; }

		return typeof(this.__options.default) == 'function'
			? this.__options.default()
			: this.__options.default;
	},
	prepValue: function(value) { return value; },
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

exports.DecimalField = Field.extend({
	_fieldType: 'DecimalField',
	initialize: function(maxDigits, decimalPlaces, options) {
		if (!maxDigits || !decimalPlaces) {
			throw new Error('Error: Must specify maxDigits and decimalPlaces parameters when using a DecimalField.');
		}
		this.parent(drty.utils.merge({
			maxDigits: maxDigits,
			decimalPlaces: decimalPlaces
		}, options || {}));
	},
	
	getMaxDigits: function() { return this.__options.maxDigits; },
	getDecimalPlaces: function() { return this.__options.decimalPlaces; }
});

exports.CharField = Field.extend({
	_fieldType: 'CharField',
	
	getMaxLength: function() { return this.__options.maxLength; }
});

exports.EmailField = exports.CharField.extend({
	_fieldType: 'EmailField',
	initialize: function(options) {
		this.parent(drty.utils.merge({maxLength: 75}, options));
	}
});

exports.IPAddressField = exports.CharField.extend({
	_fieldType: 'IPAddressField',
	initialize: function(options) {
		this.parent(drty.utils.merge({maxLength: 15}, options));
	}
});

exports.URLField = exports.CharField.extend({
	_fieldType: 'URLField',
	initialize: function(options) {
		this.parent(drty.utils.merge({maxLength: 200}, options));
	}
});

exports.SlugField = exports.CharField.extend({
	_fieldType: 'SlugField',
	initialize: function(options) {
		this.parent(drty.utils.merge({
			maxLength: 50,
			dbIndex: true
		}, options));
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
		return this.isAutoNowAdd() ? new Date() : this.default;
	},

	prepValue: function(value) {
		if (this.isAutoNow()) { value = new Date(); }
		else if (!value) { return value; }

		return new Date(value.getFullYear(), value.getMonth(), value.getDate(),
			value.getHours(), value.getMinutes(), value.getSeconds());
	}
});

exports.DateField = Field.extend({
	_fieldType: 'DateField',

	getInitialValue: function() {
		return this.isAutoNowAdd() ? new Date() : this.default;
	},

	prepValue: function(value) {
		if (this.isAutoNow()) { value = new Date(); }
		else if (!value) { return value; }

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