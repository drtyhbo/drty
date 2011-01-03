(function() {

var drty = require('../drty');

var Form = drty.Class.extend({
	initialize: function(meta, values) {
		this.__meta = meta;
		this.dirtyValues = values || {};
	},

	clean: function() {
		var isValid = true;

		for (var name in this.__meta.fields) {
			var field = this.__meta.fields[name];

			this[name] = field.toJS(field.widget.toJS(this.dirtyValues));
			isValid = isValid && field.validate(this[name]);
		}
		
		return isValid;
	},
	
	toTable: function() {
		var html = '';

		for (var name in this.__meta.fields) {
			var field = this.__meta.fields[name],
				value = field.fromJS(name in this && this[name]
					|| this.drtyValues[name] || field.initial);

			if (field.widget.isHidden()) {
				html += field.widget.render(value);
			} else {
				var label = field.label || (name.charAt(0).toUpperCase() + name.substr(1)),
					error = field.error ? ('<span class="error">' + field.error + '</span>') : '';
				html += '<tr ' + (error ? 'class="error"' : '') + '><td><label for="'
					+ name + '">' + label + '</td><td>' + field.widget.render(value)
					+ error + '</td></tr>\n';
			}
		}
		return html;
	}
});

exports.fields = require('./fields');
exports.widgets = require('./widgets')

exports.add = function(properties) {
	// Extract the columns from the list of fields
	var fields = {}, members = {};
	for (var name in properties) {
		var property = properties[name];
		if (property.fieldType) {
			fields[name] = property;
		} else {
			members[name] = property;
		}
	}

	members.initialize = function(values) {
		this.parent({fields: fields}, values);
	}

	// initialize the name of each widget
	for (var name in fields) {
		fields[name].widget.name = name;
	}
	return Form.extend(members);
}

})();