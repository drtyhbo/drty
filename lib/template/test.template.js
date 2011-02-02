var drty = require('drty'),
	template = require('./index'),
	testCase = require('nodeunit').testCase;

module.exports = testCase({
	'not found': function(test) {
		template.load('template1.tpl', function(t) {
			test.strictEqual(t, null);
			test.done();
		});
	},
		
	'loading templates 1': function(test) {
		drty.conf.settings.TEMPLATE_DIRS = [
			require('path').join(__dirname, '../../tests/templates1'),
			require('path').join(__dirname, '../../tests/templates2')
		];	

		template.load('template1.tpl', function(t) {
			test.notEqual(t, null);
			test.done();
		});
	},
	
	'loading templates 2': function(test) {
		template.load('template2.tpl', function(t) {
			test.notEqual(t, null);
			test.done();
		});
	},
	
	'rendering templates 1': function(test) {
		template.load('template1.tpl', function(t) {
			test.notEqual(t, null);
			t.render({num1: 1}, function(s) {
				test.equal(s, 'Template 1!');
				test.done();
			})
		});		
	},
	
	'rendering templates 2': function(test) {
		template.load('template2.tpl', function(t) {
			test.notEqual(t, null);
			t.render({num2: 2}, function(s) {
				test.equal(s, 'Template 2!');
				test.done();
			})
		});		
	},

	'loadAndRender 1': function(test) {
		template.loadAndRender('template1.tpl', {num1: 1}, function(s) {
			test.equal(s, 'Template 1!');
			test.done();
		});
	},
	
	'loadAndRender 2': function(test) {
		template.loadAndRender('template2.tpl', {num2: 2}, function(s) {
			test.equal(s, 'Template 2!');
			test.done();
		});
	},
	
	'render': function(test) {
		template.render('Template {{ num1 }}!', {num1: 1}, function(s) {
			test.equal(s, 'Template 1!');
			test.done();
		});
	},
	
	'no template dirs': function(test) {
		drty.conf.settings.TEMPLATE_DIRS = undefined;
		template.load(require('path').join(__dirname, '../../tests/templates1/template1.tpl'), function(t) {
			test.notEqual(t, null);
			test.done();
		});
	}
});