exports.merge = function() {
	var args = Array.prototype.slice.call(arguments),
		ret = {};
	for (var i = 0, o; (o = args[i]); i++) {
		for (var key in o) { ret[key] = o[key]; }
	}
	return ret;
}

exports.clone = function(o) {
	var ret = {};
	for (var key in o) { ret[o] = key; }
	return ret;
}

exports.eachChained = function(obj, eachCallback, callback) {
	var list = [];
	for (var name in obj) {
		list.push({
			name: name,
			value: obj[name]
		});
	}
	
	(function next() {
		if (!list.length) { callback(); return; }

		var item = list.shift(),
			name = item.name,
			value = item.value;
		eachCallback(name, value, next);
	})();
}