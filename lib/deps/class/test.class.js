var Class = require('./index').Class,
	testCase = require('nodeunit').testCase;

module.exports = testCase({
	'prototype': function(test) {
		var BaseClass = Class.extend({
			initialize: function() {
				this.count = 1;
			},
			fnc1: function() {
				this.count++;
			},
			fnc2: function() {
				this.count++;
			}
		});
		var inst = new BaseClass();
		inst.fnc1();
		inst.fnc2();
		
		test.equal(inst.count, 3);
		test.done();
	},
	
	'static fnc': function(test) {
		var BaseClass = Class.extend({},{
			count: 1,
			
			staticFnc1: function() {
				this.count++;
			},
			staticFnc2: function() {
				this.count++;
			}
		});
		BaseClass.staticFnc1();
		BaseClass.staticFnc2();
		
		test.equal(BaseClass.count, 3);
		test.done();
	},

	'inherit prototype': function(test) {
		var calls = {
			'base_init': false,
			'base_fnc1': false,
			'base_fnc2': false,
			'base_fnc3': false,
			'sub_init': false,
			'sub_fnc1': false,
			'sub_fnc2': false,
			'sub_sub_init': false,
			'sub_sub_fnc1': false,
			'sub_sub_fnc3': false
		}
		var BaseClass = Class.extend({
			initialize: function() {
				calls['base_init'] = true;
			},
			fnc1: function() {
				calls['base_fnc1'] = true;
			},
			fnc2: function() {
				calls['base_fnc2'] = true;
			},
			fnc3: function() {
				calls['base_fnc3'] = true;
			}
		}),
		SubClass = BaseClass.extend({
			initialize: function() {
				calls['sub_init'] = true;
				this.parent();
			},
			fnc1: function() {
				calls['sub_fnc1'] = true;
				this.parent();
			},
			fnc2: function() {
				calls['sub_fnc2'] = true;
				this.parent();
			}			
		});
		SubSubClass = SubClass.extend({
			initialize: function() {
				calls['sub_sub_init'] = true;
				this.parent();
			},
			fnc1: function() {
				calls['sub_sub_fnc1'] = true;
				this.parent();
			},
			fnc3: function() {
				calls['sub_sub_fnc3'] = true;
				this.parent();
			}
		});
		
		var inst = new SubSubClass();
		inst.fnc1();
		inst.fnc2();
		inst.fnc3();
		
		for (var call in calls) {
			test.ok(calls[call]);
		}

		test.done();
	},

	'inherit static': function(test) {
		var calls = {
			'base_staticFnc1': false,
			'base_staticFnc2': false,
			'base_staticFnc3': false,
			'sub_staticFnc1': false,
			'sub_staticFnc2': false,
			'sub_sub_staticFnc1': false,
			'sub_sub_staticFnc3': false
		}
		var BaseClass = Class.extend({}, {
			staticFnc1: function() {
				calls['base_staticFnc1'] = true;
			},
			staticFnc2: function() {
				calls['base_staticFnc2'] = true;
			},
			staticFnc3: function() {
				calls['base_staticFnc3'] = true;
			}
		}),
		SubClass = BaseClass.extend({}, {
			staticFnc1: function() {
				calls['sub_staticFnc1'] = true;
				this.parent();
			},
			staticFnc2: function() {
				calls['sub_staticFnc2'] = true;
				this.parent();
			}			
		});
		SubSubClass = SubClass.extend({}, {
			staticFnc1: function() {
				calls['sub_sub_staticFnc1'] = true;
				this.parent();
			},
			staticFnc3: function() {
				calls['sub_sub_staticFnc3'] = true;
				this.parent();
			}
		});

		SubSubClass.staticFnc1();
		SubSubClass.staticFnc2();
		SubSubClass.staticFnc3();
		
		for (var call in calls) {
			test.ok(calls[call]);
		}

		test.done();
	}
})