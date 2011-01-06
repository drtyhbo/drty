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

exports.each = function(obj, eachCallback) {
	for (var key in obj) {
		eachCallback(key, obj[key]);
	}
}

exports.eachChained = function(obj, eachCallback, doneCallback) {
	var list = exports.keys(obj);
	
	(function next() {
		if (!list.length) { 
			if (doneCallback) { doneCallback(); }
			return;
		}

		var name = list.shift();
		eachCallback(name, obj[name], next);
	})();
}

exports.keys = function(obj) {
	var list = [];
	for (var key in obj) { list.push(key); }
	return list;
}

exports.stripRe = function(str) {
	return str.replace(/[\^\$]/g, '');
}