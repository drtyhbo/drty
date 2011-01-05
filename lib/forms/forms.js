(function() {

var drty = require('drty');

var Form = exports.Form = drty.Class.extend({
	initialize: function(values) {
		this.dirtyValues = values || {};
		this.cleanValues = {};
	},

	clean: function() {
		var isValid = true;

		var meta = this.constructor.__meta;
		for (var name in meta.fields) {
			var field = meta.fields[name];

			this.cleanValues[name] = field.toJS(field.widget.toJS(this.dirtyValues));
			isValid = isValid && field.validate(this.cleanValues[name]);
		}
		
		return isValid;
	},

	nameToLabel: function(name) {
		return name.charAt(0).toUpperCase() + name.substr(1).replace(/([a-z])([A-Z])/g, '$1 $2');
	},
	
	toTable: function() {
		var html = '';

		var meta = this.constructor.__meta;
		for (var name in meta.fields) {
			var field = meta.fields[name],
				value = field.fromJS(this.cleanValues[name]
					|| this.dirtyValues[name] || field.initial);

			if (field.widget.isHidden()) {
				html += field.widget.render(value);
			} else {
				var label = field.label || this.nameToLabel(name),
					error = field.error ? ('<span class="error">' + field.error + '</span>') : '';
				html += '<tr ' + (error ? 'class="error"' : '') + '><td><label for="'
					+ name + '">' + label + '</td><td>' + field.widget.render(value)
					+ error + '</td></tr>\n';
			}
		}
		return html;
	}
});
Form.__onExtend = function(NewForm, properties) {
	// Extract the fields
	var fields = {};
	drty.utils.each(properties, function(key, value) {
		if (!value.fieldType) { return; }
		fields[key] = value;
	});
	
	for (var name in fields) {
		fields[name].widget.name = name;
	}

	NewForm.__meta = {fields: fields};
	NewForm.__onExtend = arguments.callee;
}

exports.fields = require('./fields');
exports.widgets = require('./widgets')

})();