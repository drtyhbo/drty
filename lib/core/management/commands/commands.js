(function() {

var drty = require('drty');

var commands = {};
exports.add = function(name, fnc) {
	commands[name] = fnc;
	return this;
}

exports.getAll = function() {
	return Object.keys(commands).sort();
}

exports.run = function(name, argv) {
	if (!(name in commands)) {
		console.log("Unknown command: '" + name + "'");
		return;
	}
	
	commands[name](argv);
	return true;
}

// import default commands
var fs = require('fs'),
	path = require('path');
var files = fs.readdirSync(__dirname);
for (var i = 0, filename; (filename = files[i]); i++) {
	if (filename == path.basename(__filename)
		|| filename.charAt(0) == '.') { continue; }
	require('./' + path.basename(filename, '.js'));
}

})();