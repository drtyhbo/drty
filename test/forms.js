(function() {

exports.run = function() {
	var assert = require('assert'),
		forms = require('../lib/drty').forms;

	var Form1 = forms.add({
				i: forms.fields.integer(),
				s: forms.fields.string(),
				t: forms.fields.text(),
				b: forms.fields.boolean()
			});

	// test an a-ok form
	var f1 = new Form1({i: '10', s: '10', t: '10', b: ''});
	assert.equal(f1.clean(), true);
	assert.strictEqual(f1.i, 10);
	assert.strictEqual(f1.s, "10");
	assert.strictEqual(f1.t, "10");
	assert.strictEqual(f1.b, false);

	f1 = new Form1({i: '10', s: '10', t: '10', b: 'on'});
	assert.equal(f1.clean(), true);
	assert.strictEqual(f1.b, true);

	// test a form with a type error
	var f1 = new Form1({i: 'abc', s: '10', t: '10', b: ''});
	assert.equal(f1.clean(), false);

	// test a form with variables missing
	var f1 = new Form1({i: '10', s: '10'});
	assert.equal(f1.clean(), false);

	// test a form with a boolean missing (which is ok, assumed false).
	var f1 = new Form1({i: '10', s: '10', t: '10'});
	assert.equal(f1.clean(), true);
}

})();