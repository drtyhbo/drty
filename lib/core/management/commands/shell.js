(function() {

require('./commands').add('shell', function(argv) {
	require('repl').start('>>> ');
});

})();