(function() {

var drty = require('../drty');

exports.Model = drty.Class.extend({
	initialize: function(meta, values) {
		for (var name in values) {
			this[name] = values[name];
		}
		this.__meta = meta;
	},
	save: function(callback) {
		if (!('id' in this)) {
			drty.models.conn.insert(this, function(id) {
				this.id = id;
				if (callback) { callback(this); }
			}.bind(this));
		} else {
			drty.models.conn.update(this, callback);
		}

		return this;
	}
});

})();