(function() {

exports.run = function() {	
	var assert = require('assert'),
		drty = require('../lib/drty');

	drty.templates.config({
		DIR: 'templates/'
	});

	// test basic rendering
	drty.templates.render('templates/test_basic.tpl', null, function(data) {
		assert.equal(data, 'Basic!');
	});

	// test a single replacement
	drty.templates.render('templates/test_replacement.tpl', {
		replacement: 'Replacement'
	}, function(data) {
		assert.equal(data, 'Replacement!');
	});

	// test a double replacement
	drty.templates.render('templates/test_replacement2.tpl', {
		replacement1: 'Replacement1',
		replacement2: 'Replacement2'
	}, function(data) {
		assert.equal(data, 'Replacement1 Replacement2!');
	});

	// test a url reverse replacement
	drty.urls.add('^/test/$', 'test');
	drty.templates.render('templates/test_reverse.tpl', null, function(data) {
		assert.equal(data, '/test/');
	});

	// test a section statement
	drty.templates.render('templates/test_section.tpl', {
		bool: true
	}, function(data) {
		assert.equal(data, 'true');
	});

	drty.templates.render('templates/test_section.tpl', {
		bool: false
	}, function(data) {
		assert.equal(data, 'false');
	});

	// test a repeated section statement
	drty.templates.render('templates/test_repeated.tpl', {
		arr: [1, 2, 3]
	}, function(data) {
		assert.equal(data, '1 2 3 ');
	});
}

})();