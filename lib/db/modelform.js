(function() {

var drty = require('drty');

exports.ModelForm = drty.forms.Form.extend({
	initialize: function(values, model) {
		this.parent(values || model);
		this.model = model;
	},
	
	save: function(cb) {
		var model = this.model || new this.Model(),
			fields = this.getFields(),
			columns = this.Model.getColumns();

		for(var name in fields) {
			var column = columns[name];
			if (this[name] || (column._fieldType != 'FileField'
					&& column._fieldType != 'ImageField')) {
				continue;
			}
			this[name] = model[name];
		}

		this.clean(function(err) {
			if (err) {
				cb(err, this);
				return;
			}

			for(var name in fields) { model[name] = this[name]; }

			model.save(function(err, model) {
				if (err) {
					cb(err, this);
				} else { 
					// Reload the model
					this.Model.objects.filter({pk: model.pk}).fetchOne(function(err, model) {
						cb(err, err && this || new this.constructor(model));
					}.bind(this));
				}
			}.bind(this));
		}.bind(this));
	}
});

})();