(function() {

exports.run = function() {	
	var assert = require('assert'),
		drty = require('../lib/drty');

	drty.config({
		template: {
			DIR: 'templates/'
		}
	});

	// test basic rendering
	drty.template.render('test_basic.tpl', null, function(data) {
		assert.equal(data, 'Basic!');
	});

	// test a single replacement
	drty.template.render('test_replacement.tpl', {
		replacement: 'Replacement'
	}, function(data) {
		assert.equal(data, 'Replacement!');
	});

	// test a double replacement
	drty.template.render('test_replacement2.tpl', {
		replacement1: 'Replacement1',
		replacement2: 'Replacement2'
	}, function(data) {
		assert.equal(data, 'Replacement1 Replacement2!');
	});

	// test a url reverse replacement
	drty.urls.add('^/test/$', 'test');
	drty.template.render('test_reverse.tpl', null, function(data) {
		assert.equal(data, '/test/');
	});

	// test a section statement
	drty.template.render('test_section.tpl', {
		bool: true
	}, function(data) {
		assert.equal(data, 'true');
	});

	drty.template.render('test_section.tpl', {
		bool: false
	}, function(data) {
		assert.equal(data, 'false');
	});

	// test a repeated section statement
	drty.template.render('test_repeated.tpl', {
		arr: [1, 2, 3]
	}, function(data) {
		assert.equal(data, '1 2 3 ');
	});
}

})();