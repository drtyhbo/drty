(function() {

var dirty = require('../dirty');

exports.Model = Class({
	initialize: function(values) {
		for (var name in values) {
			this[name] = values[name];
		}
		this.__meta = Object.clone(this.$constructor.__meta);
	},
	save: function(callback) {
		if (!('id' in this)) {
			dirty.models.conn.insert(this, function(id) {
				this.id = id;
				if (callback) { callback(this); }
			}.bind(this));
		} else {
			dirty.models.conn.update(this, callback);
		}

		return this;
	}
});

})();