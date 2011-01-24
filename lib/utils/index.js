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

var shortMonthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	monthsList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var shortMonthsMap = {},
	monthsMap = {};
for (var i = 0; i < shortMonthsList.length; i++) {
	shortMonthsMap[shortMonthsList[i].toLowerCase()] = i;
	monthsMap[monthsList[i].toLowerCase()] = i;
}

exports.strftime = function(date, format) {

	function pad(num) {
		return num < 10 ? ('0' + num) : String(num);
	}
	
	return format.replace(/%./g, function(value) {
		switch(value.charAt(1)) {
			case 'Y': return date.getFullYear();
			case 'm': return pad(date.getMonth() + 1);
			case 'd': return pad(date.getDate());
			case 'H': return pad(date.getHours());
			case 'M': return pad(date.getMinutes());
			case 'S': return pad(date.getSeconds());
			case 'b': return shortMonthsList[date.getMonth()];
			case 'B': return monthsList[date.getMonth()];
		}	
		return '';
	});
}

exports.strptime = function(str, format) {
	var match = str.match(new RegExp('^'
		+ format
			.replace(/%b/g, '(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)')
			.replace(/%B/g, '(january|february|march|april|may|june|july|august|september|october|november|december)')
			.replace(/%Y/g, '([1-9][0-9]{3})')
			.replace(/%./g, '([0-9]{1,2})')
		+ '$', 'i'));
	if (!match) { return null; }

	var year = 0, month = 0, day = 0, hour = 0, minute = 0, second = 0;

	var formatMatch = format.match(/%./gi);
	for (var i = 0; i < formatMatch.length; i++) {
		var intVal = parseInt(match[i + 1], 10);
		switch(formatMatch[i].charAt(1)) {
			case 'Y': year = intVal; break;
			case 'm': month = intVal - 1; break;
			case 'd': day = intVal; break;
			case 'H': hour = intVal; break;
			case 'M': minute = intVal; break;
			case 'S': second = intVal; break;
			case 'b': month = shortMonthsMap[match[i + 1].toLowerCase()]; break;
			case 'B': month = monthsMap[match[i + 1].toLowerCase()]; break;
		}
	}
	
	return new Date(year, month, day, hour, minute, second);
}

})()