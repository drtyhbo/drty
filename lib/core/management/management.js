(function() {

var drty = require('drty');

exports.execute = function(settings) {
	if (settings) {
		drty.conf.parseSettings(settings);
	}

	if (process.argv.length < 3) {
		console.log('Usage: node ' + require('path').basename(process.argv[1]) + ' subcommand [options]\n');
		console.log('Available subcommands:');

		var commandList = commands.getAll();
		for (var i = 0; i < commandList.length; i++) {
			console.log('  ' + commandList[i]);
		}

		return;
	}

	commands.run(process.argv[2], process.argv.slice(3));
}

var commands = exports.commands = require('./commands/commands');

})();