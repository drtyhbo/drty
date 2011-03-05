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

exports.serialize = function(cb) {
	var entries = [];
	
	drty.utils.eachChained(models, function(name, Model, next) {
		Model.objects.fetch(function(err, models) {
			if (err) { throw err; }
			for (var i = 0, model; (model = models[i]); i++) {
				entries.push(model.serialize());
			}
			next();
		});
	}, function() {
		cb(entries);
	});
}

exports.deserialize = function(entries, cb) {
	var modelsByTable = {};
	drty.utils.each(models, function(name, Model) {
		modelsByTable[Model.getTableName()] = Model;
	});
	
	drty.utils.eachChained(entries, function(name, entry, next) {
		var Model = modelsByTable[entry.tableName];
		if (!Model) { next(); return; }

		Model.deserialize(entry, function(err) {
			if (err) { throw err; }
			next();
		});
	});
}

// ----------------------------------------
// Model
// ----------------------------------------

var Model = exports.Model = drty.Class.extend({
	initialize: function(values) {
		if (this.constructor == Model) {
			throw new Error('Model is an abstract class and cannot be instantiated directly. Please extend() it.')
		}

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
	save: function(options, callback) {
		options = options || {};
		if (options.constructor == Function) {
			callback = options;
			options = {};
		}

		var conn = drty.db.getBackend();

		var values = this._values,
			isInsert = (!('id' in values) && !options.forceUpdate)
				|| options.forceInsert;
		drty.utils.eachChained(this.getColumns(), function(name, column, next) {
			if (name in values) {
				if (values[name] === undefined && isInsert) {
					values[name] = column.getInitialValue();
				}
				column.prepForDB(values[name], function(err, value) {
					if (err) { callback(err); return; }

					values[name] = value;
					next();
				});
			} else {
				values[name] = isInsert ? column.getInitialValue() : values[name];
				next();
			}
		}, function() {
			conn[isInsert ? 'insert' : 'update'](this, callback);
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
	
	serialize: function() {
		var o = {tableName: this.getTableName()};

		drty.utils.each(this.getColumns(), function(name, column) {
			o[name] = this[name];
		}.bind(this));

		return o;
	},
	
	static: {
		sync: function(callback) { drty.db.getBackend().create(this, callback); },
		validate: function(callback) { drty.db.getBackend().validate(this, callback); },
		sql: function() { return drty.db.getBackend().sql(this); },

		getTableName: function() { return this._meta.tableName; },
		getColumns: function() { return this._meta.columns; },
		getForeignKeys: function() { return this._meta.foreignKeys; },

		deserialize: function(o, cb) {
			var Model = this;
			this.objects.filter({pk: o.id}).fetchOne(function(err, model) {
				if (err) { cb(err); return; }
				if (model) { cb(null); return; }

				var model = new Model();
				drty.utils.each(Model.getColumns(), function(name, column) {
					model[name] = o[name];
				});
				model.save({forceInsert: true}, function(err) {
					cb(err, model);
				});
			});
		},

		toForm: function(callback) {
			var columns = this.getColumns(),
				prop = {
					Model: this
				};
			drty.utils.eachChained(columns, function(name, column, next) {
				if (!column._fieldType) { return; }

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
						column.otherModel.objects.fetch(function(err, models) {
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