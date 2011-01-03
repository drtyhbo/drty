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