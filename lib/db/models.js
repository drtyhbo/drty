(function() {

var drty = require('drty');

var models = {};
exports.loadFromApp = function(app) {
	drty.utils.each(app.models || {}, function(name, Model) {		
		if (Model._abstract) { return; }
		models[name] = Model;
	});
}

exports.getAll = function() { return models }

// ----------------------------------------
// Model
// ----------------------------------------

var Model = exports.Model = drty.Class.extend({
	initialize: function(values) {
		this._values = drty.utils.clone(values);

		var columns = this.getColumns();
		for (var name in columns) {
			(function(obj, name) {
				var getter = function() {
					return obj._values[name];
				};
				var setter = function(value) {
					obj._values[name] = value;
				};
				
				obj.__defineGetter__(name, getter);
				obj.__defineSetter__(name, setter);
				if (columns[name].isPrimaryKey()) {
					obj.__defineGetter__('pk', getter);
					obj.__defineSetter__('pk', setter);
				}
			})(this, name);
		}
	},
	save: function(callback) {
		var conn = drty.db.getBackend();

		var values = this._values,
			isNew = !('id' in values);
		drty.utils.eachChained(this.getColumns(), function(name, column, next) {
			if (name in values) {
				column.prepForDB(values[name], function(err, value) {
					if (err) { callback(err); return; }

					values[name] = value;
					next();
				});
			} else {
				values[name] = isNew ? column.getInitialValue() : values[name];
				next();
			}
		}, function() {
			conn[isNew ? 'insert' : 'update'](this, callback);
		}.bind(this));

		return this;
	},
	
	delete: function(callback) {
		// TODO: delete all models that depend on this model
		drty.db.getBackend().delete(this, callback);
	},
	
	getTableName: function() { return this.constructor.getTableName(); },
	getColumns: function() { return this.constructor.getColumns(); },
	getForeignKeys: function() { return this.constructor.getForeignKeys(); },

	static: {
		sync: function(callback) { drty.db.getBackend().create(this, callback); },
		validate: function(callback) { drty.db.getBackend().validate(this, callback); },

		getTableName: function() { return this._meta.tableName; },
		getColumns: function() { return this._meta.columns; },
		getForeignKeys: function() { return this._meta.foreignKeys; },

		toForm: function(callback) {
			var columns = this.getColumns(),
				prop = {
					Model: this
				};
			drty.utils.eachChained(columns, function(name, column, next) {
				if (!column._fieldType) { continue; }

				var options = drty.utils.clone(column.getOptions());
				options.required = !('null' in options) || !options.null;
				options.label = options.verboseName;

				switch(column._fieldType) {
					case 'IntegerField':
					case 'PositiveIntegerField':
					case 'SmallIntegerField':
					case 'PositiveSmallIntegerField':
						prop[name] = new drty.forms.IntegerField(options);
						break;

					case 'ForeignKey':
						column.otherModel.objects.fetch(function(models) {
							var choices = {};
							for (var i = 0, model; (model = models[i]); i++) {
								choices[model.id] = String(model);
							}

							options.choices = choices;
							prop[name] = new drty.forms.ChoiceField(options);
							next();
						});
						return;

					default:
						if (drty.forms[column._fieldType]) {
							prop[name] = new drty.forms[column._fieldType](options);
						}
						break;
				}

				if ('editable' in options && !options.editable) {
					prop[name].widget = new prop[name].defaultWidget({
						readonly: true
					});
				}

				next();
			}, function() {
				callback(require('./modelform').ModelForm.extend(prop));
			});	
		},

		extend: function(prop) {
			var NewModel = this.parent(prop);

			if (!NewModel.prototype.tableName) {
				throw new Error('Error: "tableName" missing in Model');
			}

			// Extract the columns from the list of fields
			var columns = {}, foreignKeys = {}, 
				pk = null;
			drty.utils.each(NewModel.prototype, function(name, column) {
				if (!column.getFieldType) { return; }

				column.setName(name);
				columns[name] = column;
				if (column.isRelationship()) {
					foreignKeys[name] = column;
				}

				if (column.isPrimaryKey()) { pk = column; }
			});

			if (!pk) {
				pk = columns['id'] = NewModel.prototype.id = new exports.AutoField({primaryKey: true});
				pk.setName('id');
			}
			
			NewModel.pk = pk;
			NewModel.__defineGetter__('objects', function() {
				return new exports.QuerySet(NewModel);
			});
			NewModel._meta = {
				tableName: NewModel.prototype.tableName,
				columns: columns,
				foreignKeys: foreignKeys
			}

			this._abstract = true;

			return NewModel;
		}
	}
});

// ----------------------------------------
// Other exports
// ----------------------------------------

exports.QuerySet = require('./queryset').QuerySet;
drty.utils.mixin(exports, require('./fields'));

})();