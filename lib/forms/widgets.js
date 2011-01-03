(function() {

var Widget = exports.Widget = Class.extend({
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

	toJS: function(values) {
		return values[this.name];
	},
	
	isHidden: function() { return false; }
})

var InputBox = exports.InputBox = Widget.extend({
	type: 'text',

	render: function(value) {
		var attrList = this.attrAsList();
		return '<input type="' + this.type + '" name="' + this.name + '" '
			+ attrList.join(' ') + ' value="' + value + '">';
	}
});

var HiddenInputBox = exports.HiddenInputBox = InputBox.extend({
	type: 'hidden',

	isHidden: function() { return true; }
});

var TextArea = exports.TextArea = Widget.extend({
	render: function(value) {
		var attrList = this.attrAsList();
		return '<textarea name="' + this.name + '" ' + attrList.join(' ')
			+ '>' + value + '</textarea>';
	}
});

var CheckBox = exports.CheckBox = Widget.extend({
	render: function(value) {
		var attrList = this.attrAsList();
		return '<input type="checkbox" name="' + this.name + '" ' + attrList.join(' ')
			+ ' ' + (value ? 'checked' : '') + '>';
	},
	
	toJS: function(values) {
		return values[this.name] == 'on';
	}
});

var ChoiceBox = exports.ChoiceBox = Widget.extend({
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
			choices.push('<option value="' + name + '" '
				+ (value == name ? 'selected' : '') + '>' + this.choices[name]
				+ '</option>')
		}

		return '<select name="' + this.name + '" ' + attrList.join(' ') + '>'
			+ choices.join('\n') + '</select>';
	}
});

})();