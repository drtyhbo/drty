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

exports.formatDate = function(date, format) {
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	
	function pad(num) {
		return num < 10 
			? '0' + num
			: String(num);
	}
	
	var year = date.getFullYear(),
		month = pad(date.getUTCMonth() + 1),
		day = pad(date.getUTCDate()),
		hour = pad(date.getUTCHours()),
		min = pad(date.getUTCMinutes()),
		sec = pad(date.getUTCSeconds());

	return format
		.replace('%Y', year)
		.replace('%M', month)
		.replace('%D', day)
		.replace('%h', hour)
		.replace('%m', min)
		.replace('%s', sec)
		.replace('%A', months[date.getUTCMonth()]);
}

// TODO: doesn't work with nested params!
exports.stripRe = function(str) {
	str = str.replace(/^\^?([^$]*)\$?$/g, '$1');
	return str.replace(/\([^)]*\)/g, '');
}

exports.getStdinData = function(dataRequested, callback) {
	var dataRecieved = {};

	exports.eachChained(dataRequested, function(name, value, next) {
		var isRequired = name.charAt(0) == '*';
		if (isRequired) { name = name.substr(1); }

		process.stdout.write((isRequired ? '* ' : '') + value + ': ');

		var dataCb = function(chunk) {
			var data = chunk.toString().replace('\n', '');
			if (isRequired && !data) {
				process.stdout.write(value + ': ');
				return;
			}

			dataRecieved[name] = data;
			stdin.removeListener('data', dataCb);

			next();			
		}

		var stdin = process.openStdin();
		stdin.on('data', dataCb);
	}, function() {
		callback(dataRecieved);
	});
}

})()