(function() {

var mixin = exports.mixin = function() {
	var args = Array.prototype.slice.call(arguments),
		dest = args[0];
	for (var i = 1, o; (o = args[i]); i++) {
		if (typeof(o) != 'object') { continue; }

		for (var key in o) {
			if (!dest[key] || typeof(dest[key]) != 'object') {
				dest[key] = o[key];
			} else if (typeof(dest) == 'object') {
				mixin(dest[key], o[key]);
			}
		}
	}
}

var merge = exports.merge = function() {
	var args = Array.prototype.slice.call(arguments);

	var ret = {};
	args.unshift(ret);
	mixin.apply(this, args);

	return ret;
}

exports.clone = function(o) {
	var ret = {};
	for (var key in o) {
		ret[key] = o[key];
	}
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

// TODO: doesn't work with nested params!
exports.stripRe = function(str) {
	str = str.replace(/^\^?([^$]*)\$?$/g, '$1');
	return str.replace(/\([^)]*\)/g, '');
}

})()