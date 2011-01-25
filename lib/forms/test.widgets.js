var drty = require('drty'),
	widgets = require('./widgets'),
	testCase = require('nodeunit').testCase;

module.exports = testCase({
	'basic': function(test) {
		var widget = new widgets.TextInput({
			class: 'test_class',
			id: 'test_id'
		});
		widget.name = 'test';

		test.equal(widget.render('test'), '<input type="text" name="test" id="test" class="test_class" id="test_id" value="test">');
		test.done();
	},
	
	'TextInput': function(test) {
		var widget = new widgets.TextInput();
		widget.name = 'test';

		test.equal(widget.render('test'), '<input type="text" name="test" id="test" value="test">');
		test.equal(widget.isHidden(), false);
		test.done();		
	},
	
	'HiddenInput': function(test) {
		var widget = new widgets.HiddenInput();
		widget.name = 'test';

		test.equal(widget.render('test'), '<input type="hidden" name="test" id="test" value="test">');
		test.equal(widget.isHidden(), true);
		test.done();
	},

	'PasswordInput': function(test) {
		var widget = new widgets.PasswordInput();
		widget.name = 'test';

		test.equal(widget.render('test'), '<input type="password" name="test" id="test" value="test">');
		test.equal(widget.isHidden(), false);
		test.done();		
	},
	
	'Textarea': function(test) {
		var widget = new widgets.Textarea({
			class: 'test_class'
		});
		widget.name = 'test';

		test.equal(widget.render('test'), '<textarea name="test" id="test" class="test_class">test</textarea>');
		test.equal(widget.isHidden(), false);
		test.done();
	},
	
	'CheckboxInput': function(test) {
		var widget = new widgets.CheckboxInput({
			class: 'test_class'
		});
		widget.name = 'test';

		test.equal(widget.render(true), '<input type="checkbox" name="test" id="test" class="test_class" checked>');
		test.equal(widget.render(false), '<input type="checkbox" name="test" id="test" class="test_class">');
		test.equal(widget.isHidden(), false);
		test.done();		
	},
	
	'Select': function(test) {
		var widget = new widgets.Select({
			class: 'test_class',
			choices: {
				'choice1': 'Choice 1',
				'choice2': 'Choice 2'
			}
		});
		widget.name = 'test';
		
		test.equal(widget.render(), '<select name="test" id="test" class="test_class">\n\
<option value="choice1">Choice 1</option>\n\
<option value="choice2">Choice 2</option>\n\
</select>');
		test.equal(widget.render('choice1'), '<select name="test" id="test" class="test_class">\n\
<option value="choice1" selected>Choice 1</option>\n\
<option value="choice2">Choice 2</option>\n\
</select>');
		test.equal(widget.render('choice2'), '<select name="test" id="test" class="test_class">\n\
<option value="choice1">Choice 1</option>\n\
<option value="choice2" selected>Choice 2</option>\n\
</select>');
		test.done();
	},
	
	'SeletMultiple': function(test) {
		var widget = new widgets.SelectMultiple({
			class: 'test_class',
			choices: {
				'choice1': 'Choice 1',
				'choice2': 'Choice 2'
			}
		});
		widget.name = 'test';

		test.equal(widget.render(), '<select name="test" id="test" multiple class="test_class">\n\
<option value="choice1">Choice 1</option>\n\
<option value="choice2">Choice 2</option>\n\
</select>');
		test.equal(widget.render('choice1'), '<select name="test" id="test" multiple class="test_class">\n\
<option value="choice1" selected>Choice 1</option>\n\
<option value="choice2">Choice 2</option>\n\
</select>');
		test.equal(widget.render('choice2'), '<select name="test" id="test" multiple class="test_class">\n\
<option value="choice1">Choice 1</option>\n\
<option value="choice2" selected>Choice 2</option>\n\
</select>');
		test.done();
	}
});