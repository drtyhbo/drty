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
	obj = obj || {};

	var list = Object.keys(obj);
	(function next() {
		if (!list.length) { 
			if (doneCallback) { doneCallback(); }
			return;
		}

		var name = list.shift();
		eachCallback(name, obj[name], next);
	})();
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

exports.strftime = function(date, format) {
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	
	function pad(num) {
		return num < 10 ? ('0' + num) : String(num);
	}
	
	return format.replace(/%./g, function(value) {
		switch(value.charAt(1)) {
			case 'Y': return date.getFullYear();
			case 'm': return pad(date.getUTCMonth() + 1);
			case 'd': return pad(date.getUTCDate());
			case 'H': return pad(date.getUTCHours());
			case 'M': return pad(date.getUTCMinutes());
			case 'S': return pad(date.getUTCSeconds());
			case 'A': return months[date.getMonth()];
		}	
		return '';
	});
}

exports.strptime = function(str, format) {
	var match = str.match(new RegExp('^'
		+ format
			.replace(/%Y/g, '([1-9][0-9]{3})')
			.replace(/%./g, '([0-9]{1,2})')
		+ '$'));
	if (!match) { return null; }

	var date = new Date(0, 0, 0, 0, 0, 0, 0);

	var formatMatch = format.match(/%./g);
	for (var i = 0; i < formatMatch.length; i++) {
		var intVal = parseInt(match[i + 1], 10);
		switch(formatMatch[i].charAt(1)) {
			case 'Y': date.setFullYear(intVal); break;
			case 'm': date.setMonth(intVal - 1); break;
			case 'd': date.setDate(intVal); break;
			case 'H': date.setHours(intVal); break;
			case 'M': date.setMinutes(intVal); break;
			case 'S': date.setSeconds(intVal); break;
		}
	}
	
	return date;
}

})()