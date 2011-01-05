(function() {

var drty = require('drty');

var Field = drty.Class.extend({
	initialize: function(params) {
		params = params || {};
		for (var param in params) {
			this[param] = params[param];
		}
		if (this.primaryKey) {
			this.notNull = true;
			this.autoIncrement = true;
		}
	},
	isPrimaryKey: function() {
		return this['primaryKey'] || false;
	},
	isRelationship: function() {
		return this.fieldType == 'foreignkey';
	},

	defineAccessors: function(Model, name) {
	}
});

var fields = {
	'integer': Field.extend({
			fieldType: 'integer'
		}),
	'string': Field.extend({
			fieldType: 'string'
		}),
	'text': Field.extend({
			fieldType: 'text'
		}),
	'boolean': Field.extend({
			fieldType: 'boolean'
		}),
	'dateTime': Field.extend({
			fieldType: 'datetime'
		}),
	'foreignKey': Field.extend({
			fieldType: 'foreignkey',
			initialize: function(model, params) {
				this.parent(params);
				this.model = model;
			},
			defineAccessors: function(Model, name) {
				var varName = '_' + name;
				Model.prototype.__defineGetter__(name, function() {
					return this[varName] || this[varName + '_id'];
				});
				Model.prototype.__defineSetter__(name, function(value) {
					if (typeof(value) == 'number') {
						this[varName] = null;
						this[varName + '_id'] = value;
					} else {
						this[varName] = value;
						this[varName + '_id'] = 'id' in value ? value.id : null;
					}
				});
			}
		})
};

for (var name in fields) {
	exports[name] = (function(ctor) {
		return function(params) {
			return new ctor(params);
		}
	})(fields[name]);
}

})();