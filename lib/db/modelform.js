(function() {

var drty = require('drty');

exports.ModelForm = drty.forms.Form.extend({
	initialize: function(values, model) {
		this.parent(values);
		this.model = model;
	},

	save: function(cb) {
		var model = this.model || new Model(),
			fields = this.getFields(),
			columns = this.Model.getColumns();

		// copy the values from this form into the model instance
		for(var name in fields) {
			var column = columns[name];
			if (!column || column._fieldType == 'AutoField') {
				continue;
			}
			if (column._fieldType == 'FileField' && !this[name] && model[name]) {
				this[name] = model[name];
			}

			model[name] = this[name];
		}

		this.clean(function(err) {
			if (err) {
				return cb(err, this);
			}
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