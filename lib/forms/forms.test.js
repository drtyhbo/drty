var drty = require('drty'),
	forms = require('./index'),
	testCase = require('nodeunit').testCase;

module.exports = testCase({
	setUp: function(complete) {
		var form = 
		complete();
	}
});

/*var Form = exports.Form = drty.Class.extend({
	initialize: function(values) {
		this.dirtyValues = values || {};
		this.cleanValues = {};
		this.errors = {};
	},
	
	toString: function() { return this.asTable(); },
	nameToLabel: function(name) {
		return name.charAt(0).toUpperCase() + name.substr(1).replace(/([a-z])([A-Z])/g, '$1 $2');
	},

	clean: function() {
		var isValid = true;

		var meta = this.constructor.__meta;
		for (var name in meta.fields) {
			var field = meta.fields[name];

			try {
				this.cleanValues[name] = field.toJS(field.widget.toJS(this.dirtyValues));
				field.validate(this.cleanValues[name]);
			} catch(e) {
				if (!(e instanceof ValidationError)) { throw e; }
				this.errors[name] = e.msg;
				isValid = false;
			}
		}

		return isValid;
	},
	
	asTable: function() {
		var html = '';

		var meta = this.constructor.__meta;
		for (var name in meta.fields) {
			var field = meta.fields[name],
				value = field.fromJS(this.cleanValues[name]
					|| this.dirtyValues[name] || field.options.initial || '');

			if (field.widget.isHidden()) {
				html += field.widget.render(value);
			} else {
				var label = field.options.label || this.nameToLabel(name),
					error = this.errors[name] ? ('<div class="error">' + this.errors[name] + '</div>') : '';
				html += '<tr ' + (error ? 'class="error"' : '') + '><td><label for="'
					+ name + '">' + label + '</td><td>' + field.widget.render(value)
					+ error + '</td></tr>\n';
			}
		}
		return html;
	}
});
Form.__onExtend__ = function(NewForm, properties) {
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
}*/