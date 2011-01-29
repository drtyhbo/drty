(function() {

var drty = require('drty');

var Widget = exports.Widget = drty.Class.extend({
	initialize: function(attr) {
		this.attr = attr || {};
	},
	
	attrAsList: function() {
		var attrList = [];
		for (var name in this.attr) {
			attrList.push(this.attr[name] === null
				? name
				: (name + '="' + this.attr[name] + '"'));
		}
		return attrList;
	},

	attrAsString: function() {
		var attrList = [
				'name="' + this.name + '"',
				'id="' + this.name + '"'
			].concat(this.attrAsList());
		return attrList.length ? (' ' + attrList.join(' ')) : '';
	},

	toJS: function(values) { return values[this.name]; },
	
	isHidden: function() { return false; }
})

var TextInput = exports.TextInput = Widget.extend({
	type: 'text',
	render: function(value) {
		var attrList = this.attrAsList();
		return '<input type="' + this.type + '"'
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

var FileInput = exports.FileInput = Field.extend({
	render: function(value) {
		var attrList = this.attrAsList();
		return '<input type="file"'
			+ this.attrAsString() + ' value="">'
			+ (value ? value.name : '');
	}
});

var Textarea = exports.Textarea = Widget.extend({
	render: function(value) {
		var attrList = this.attrAsList();
		return '<textarea' + this.attrAsString() + '>' + value + '</textarea>';
	}
});

var CheckboxInput = exports.CheckboxInput = Widget.extend({
	render: function(value) {
		var attrList = this.attrAsList();
		return '<input type="checkbox"' + this.attrAsString() + (value ? ' checked' : '') + '>';
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
			options = drty.utils.clone(options);
			delete options.choices;
		}
		this.attr = options;
	},

	render: function(value) {
		var attrList = this.attrAsList();

		var choices = [];
		for (name in this.choices) {
			var isSelected = value instanceof Array
				? value.indexOf(name) != -1
				: value == name;

			choices.push('<option value="' + name + '"'
				+ (isSelected ? ' selected' : '') + '>' + this.choices[name]
				+ '</option>')
		}

		return '<select' + this.attrAsString() + '>\n'
			+ choices.join('\n') + '\n</select>';
	}
});

var SelectMultiple = exports.SelectMultiple = Select.extend({
	initialize: function(options) {
		this.parent(drty.utils.merge({'multiple': null}, options));
	}
});

})();