(function() {

var Field = new Class({
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
	'integer': new Class({
			Extends: Field,
			fieldType: 'integer'
		}),
	'string': new Class({
			Extends: Field,
			fieldType: 'string'
		}),
	'text': new Class({
			Extends: Field,
			fieldType: 'text'
		}),
	'boolean': new Class({
			Extends: Field,
			fieldType: 'boolean'
		}),
	'dateTime': new Class({
			Extends: Field,
			fieldType: 'datetime'
		}),
	'foreignKey': new Class({
			Extends: Field,
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