var drty = require('drty'),
	assert = require('assert'),
	template = require('./index');

// ----- load -----

template.load('template1.tpl', function(t) {
	assert.strictEqual(t, null);
});

drty.conf.settings.TEMPLATE_DIRS = [
	require('path').join(__dirname, '../../tests/templates1'),
	require('path').join(__dirname, '../../tests/templates2')
];

var template1 = 'template1.tpl';
function onLoadTemplate1(s) {
	assert.equal(s, 'Template 1!');
}

var template2 = 'template2.tpl';
function onLoadTemplate2(s) {
	assert.equal(s, 'Template 2!');
}

template.load(template1, function(t) {
	assert.notEqual(t, null);
	t.render({num1: 1}, onLoadTemplate1);
});

template.load(template2, function(t) {
	assert.notEqual(t, null);
	t.render({num2: 2}, onLoadTemplate2);
});

// ----- loadAndRender -----

template.loadAndRender(template1, {num1: 1}, onLoadTemplate1);
template.loadAndRender(template2, {num2: 2}, onLoadTemplate2);

// ----- render -----

template.render('Template {{ num1 }}!', {num1: 1}, onLoadTemplate1);
template.render('Template {{ num2 }}!', {num2: 2}, onLoadTemplate2);