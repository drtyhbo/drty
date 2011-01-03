(function() {

var assert = require('assert');

var Model1,
	Model2,
	conn;

exports.run = function() {
	var models = require('../lib/drty').models;
		
	var config = {
		DB: models.db.MySQL,
		HOST: 'localhost',
		USER: 'test',
		PASS: 'binn',
		NAME: 'test'
	};
	models.config(config);

	Model1 = models.add('model_1', {
				i: models.fields.integer(),
				s: models.fields.string({maxLength: 32}),
				t: models.fields.text(),
				b: models.fields.boolean()
			});
	Model2 = models.add('model_2', {
				f: models.fields.foreignKey(Model1),
				s: models.fields.string({maxLength: 32})
			});

	conn = require("mysql-libmysqlclient").createConnectionSync(config.HOST,
			config.USER, config.PASS, config.NAME);

	conn.querySync('DROP TABLE IF EXISTS model_1');
	conn.querySync('DROP TABLE IF EXISTS model_2');

	// verify that the tables have been constructed
	models.syncAll(runTests);
}

function runTests() {
	// SIMPLE TEST
	new Model1({
		i: 100,
		s: 'string',
		t: 'text',
		b: true
	}).save(function(m1) {
		var res = conn.querySync('SELECT * FROM model_1 where id=' + m1.id);
		assert.deepEqual(res.fetchAllSync(), [{
			i: 100,
			s: 'string',
			t: 'text',
			b: true,
			id: 1
		}]);

		m1.i = 200;
		m1.s = 'no-string';
		m1.t = 'no-text';
		m1.b = false;
		m1.save(function(m1) {
			var res = conn.querySync('SELECT * FROM model_1 where id=' + m1.id);
			assert.deepEqual(res.fetchAllSync(), [{
				i: 200,
				s: 'no-string',
				t: 'no-text',
				b: false,
				id: 1
			}]);
			
			Model1.objects.filter({id: 1}).fetchOne(function(m1) {
				assert.strictEqual(m1.i, 200);
				assert.strictEqual(m1.s, 'no-string');
				assert.strictEqual(m1.t, 'no-text');
				assert.strictEqual(m1.b, false);				
			});
		});
	});

	// FOREIGN KEY TEST
	new Model1({
		i: 100,
		s: 'string',
		t: 'text',
		b: true
	}).save(function(m1) {
		new Model2({
			f: m1,
			s: 'foreign-key'
		}).save(function(m2) {
			var res = conn.querySync('SELECT * FROM model_2');
			assert.deepEqual(res.fetchAllSync(), [{
				f_id: 2,
				s: 'foreign-key',
				id: 1
			}]);
			Model2.objects.filter({id: 1}).fetchOne(function(m2) {
				assert.strictEqual(m2.f.i, 100);
				assert.strictEqual(m2.f.s, 'string');
				assert.strictEqual(m2.f.t, 'text');
				assert.strictEqual(m2.f.b, true);				
				assert.strictEqual(m2.s, 'foreign-key');
			});
		});
	});
	
}

})();