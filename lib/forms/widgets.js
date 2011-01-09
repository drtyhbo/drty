(function() {

var drty = require('drty');

var Widget = exports.Widget = drty.Class.extend({
	initialize: function(attr) {
		this.attr = attr || {};
	},
	
	attrAsList: function() {
		var attrList = [];
		for (var name in this.attr) {
			attrList.push(name + '="' + this.attr[name] + '"');
		}
		return attrList;
	},

	attrAsString: function() {
		var attrList = this.attrAsList();
		return attrList.length ? (' ' + attrList.join(' ')) : '';
	},

	toJS: function(values) { return values[this.name]; },
	
	isHidden: function() { return false; }
})

var TextInput = exports.TextInput = Widget.extend({
	type: 'text',
	render: function(value) {
		var attrList = this.attrAsList();
		return '<input type="' + this.type + '" name="' + this.name + '"'
			+ this.attrAsString() + ' value="' + value + '">';
	}
});

var HiddenInput = exports.HiddenInput = TextInput.extend({
	type: 'hidden',
	isHidden: function() { return true; }
});

var PasswordInput = exports.PasswordInput = TextInput.extend({
	type: 'password'
});

var Textarea = exports.Textarea = Widget.extend({
	render: function(value) {
		var attrList = this.attrAsList();
		return '<textarea name="' + this.name + '"'
			+ this.attrAsString() + '>' + value + '</textarea>';
	}
});

var CheckboxInput = exports.CheckboxInput = Widget.extend({
	render: function(value) {
		var attrList = this.attrAsList();
		return '<input type="checkbox" name="' + this.name + '"'
			+ this.attrAsString() + '' + (value ? ' checked' : '') + '>';
	},
	
	toJS: function(values) {
		return values[this.name] == 'on';
	}
});

var Select = exports.Select = Widget.extend({
	initialize: function(options) {
		options = options || {};

		this.choices = options.choices || [];
		if (options.choices) {
			delete options.choices;
		}
		this.attr = options;
	},

	render: function(value) {
		var attrList = this.attrAsList();

		var choices = [];
		for (name in this.choices) {
			choices.push('<option value="' + name + '"'
				+ (value == name ? ' selected' : '') + '>' + this.choices[name]
				+ '</option>')
		}

		return '<select name="' + this.name + '"' + this.attrAsString() + '>\n'
			+ choices.join('\n') + '\n</select>';
	}
});

})();