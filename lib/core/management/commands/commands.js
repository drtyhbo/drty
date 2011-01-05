(function() {

var drty = require('drty');

var commands = {};
exports.add = function(name, fnc) {
	commands[name] = fnc;
	return this;
}

exports.getAll = function() {
	return drty.utils.keys(commands).sort();
}

exports.run = function(name, argv) {
	if (!(name in commands)) {
		console.log("Unknown command: '" + name + "'");
		return;
	}
	
	commands[name](argv);
	return true;
}

// default commands
require('./runserver');
require('./syncdb');
require('./startproject');

})();