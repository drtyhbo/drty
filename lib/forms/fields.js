(function() {

/*

How do forms work?

A form is a grouping of form fields.
A field contains a widget.
A widget 

*/

var widgets = require('./widgets');

var Field = exports.Field = Class.extend({
	initial: '',

	initialize: function(options) {
		this.options = options || {};
		this.widget = options.widget || new this.defaultWidget(options.attr);
		this.error = '';
	},
	
	fromJS: function(value) { return value; },
	toJS: function(value) { return value; },

	validate: function(value) {
		var isRequired = (!('required' in this.options)
			|| !this.options.required);
		if (!value && isRequired) {
			this.error = 'This field is required';
			return false;
		}
		return true;
	}
});

var IntegerField = exports.IntegerField = Field.extend({
	fieldType: 'integer',
	defaultWidget: widgets.InputBox,

	toJS: function(value) {
		var numberValue = parseInt(value, 10);
		return isNaN(numberValue) ? value : numberValue;
	},
	validate: function(value) {
		if (!this.parent(value)) { return false; }
		if (isNaN(parseInt(value, 10))) {
			this.error = 'An integer is required';
			return false;
		}
		return true;
	}
});

var StringField = exports.StringField = Field.extend({
	fieldType: 'string',
	defaultWidget: widgets.InputBox
});

var TextField = exports.Textfield = Field.extend({
	fieldType: 'text',
	defaultWidget: widgets.TextArea	
});

var BooleanField = exports.BooleanField = Field.extend({
	fieldType: 'boolean',
	defaultWidget: widgets.CheckBox	
});

var ChoiceField = exports.ChoiceField = Field.extend({
	fieldType: 'choice'	,
	defaultWidget: widgets.ChoiceBox
});

var fields = {
	'integer': IntegerField,
	'string': StringField,
	'text': TextField,
	'boolean': BooleanField,
	'choice': ChoiceField
};

for (var name in fields) {
	exports[name] = (function(ctor) {
		return function(params) {
			return new ctor(params);
		}
	})(fields[name]);
}

})();