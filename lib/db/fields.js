(function() {
	
var drty = require('drty');

var Field = drty.Class.extend({
	initialize: function(options) {
		this._options = options || {};

		if (this._options.primaryKey) {
			this._options.null = false;
		}
	},
	
	getFieldType: function() { return this._fieldType; },
	
	setName: function(name) { this._name = name; },
	getName: function() { return this._name; },
	setModel: function(Model) { this._Model = Model; },
	getModel: function() { return this._Model; },
	
	getOptions: function() { return this._options; },

	isNull: function() { return Boolean(this._options.null); },
	isPrimaryKey: function() { return this._options.primaryKey || false; },
	isRelationship: function() { return this._fieldType == 'foreignkey'; },
	isUnique: function() { return this._options.unique || false; },
	getDbColumn: function() { return this._options.dbColumn || null; },
	isIndex: function() { return this._options.dbIndex || false; },
	isAutoNow: function() { return this._options.autoNow || false; },
	isAutoNowAdd: function() { return this._options.autoNowAdd || false; },

	getInitialValue: function() {
		if (!('default' in this._options)) { return undefined; }

		return typeof(this._options.default) == 'function'
			? this._options.default()
			: this._options.default;
	},
	toJS: function(value) { return value; },
	prepForDB: function(value, callback) { callback(null, value); },
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
	initialize: function(options) {
		if (!options || !options.maxDigits || !options.decimalPlaces) {
			throw new Error('Error: Must specify maxDigits and decimalPlaces parameters when using a DecimalField.');
		}
		this.parent(options);
	},
	
	getMaxDigits: function() { return this._options.maxDigits; },
	getDecimalPlaces: function() { return this._options.decimalPlaces; }
});

exports.CharField = Field.extend({
	_fieldType: 'CharField',
	
	getMaxLength: function() { return this._options.maxLength; }
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

exports.JSONField = Field.extend({
	_fieldType: 'JSONField'
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
	
	prepForDB: function(value, callback) {
		if (!value && this.isAutoNow()) {
			value = new Date();
		}
		callback(null, value ? this._filterDate(value) : value);
	},

	_filterDate: function(value) {
		return new Date(value.getFullYear(), value.getMonth(), value.getDate(),
			value.getHours(), value.getMinutes(), value.getSeconds());
	}
});

exports.TimeField = exports.DateTimeField.extend({
	_fieldType: 'TimeField',

	_filterDate: function(value) {
		return new Date(0, 0, 0,
			value.getHours(), value.getMinutes(), value.getSeconds());
	}
});

exports.DateField = exports.DateTimeField.extend({
	_fieldType: 'DateField',

	_filterDate: function(value) {
		return new Date(value.getFullYear(), value.getMonth(), value.getDate());
	}
});

exports.FileField = exports.CharField.extend({
	_fieldType: 'FileField',
	_fileCtor: drty.core.files.File,
	
	initialize: function(options) {
		this.parent(drty.utils.merge({
			maxLength: 100,
			uploadTo: '/'
		}, options));
	},
	
	toJS: function(value) {
		if (!value) { return value; }

		var mediaRoot = drty.conf.getSetting('MEDIA_ROOT',
			'FileField requires that MEDIA_ROOT be in the settings');

		return new this._fileCtor(require('path').join(mediaRoot, value));
	},
	
	prepForDB: function(value, callback) {
		if (!value) { callback(null, null); return; }

		var mediaRoot = drty.conf.getSetting('MEDIA_ROOT',
			'FileField requires that MEDIA_ROOT be in the settings');

		var path = require('path'),
			destRel = path.join(
				drty.utils.strftime(this._options.uploadTo, new Date()), value.name),
			dest = path.join(mediaRoot, destRel);

		value.save(dest, function(err, file) {
			callback(err, file ? destRel : null);
		})
	}
});

exports.ImageField = exports.FileField.extend({
	_fieldType: 'ImageField',
	_fileCtor: drty.core.files.ImageFile
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