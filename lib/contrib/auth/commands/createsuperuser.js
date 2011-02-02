(function() {

var drty = require('drty');

drty.core.management.commands.add('createsuperuser', function(argv) {
	drty.utils.getStdinData({
		'*username': 'Username',
		'*password': 'Password',
		'email': 'Email',
		'firstName': 'First Name',
		'lastName': 'Last Name'
	}, function(data) {
		drty.contrib.auth.models.User.create(data.username, data.password, data.email,
				data.firstName, data.lastName, function(error, user) {
			if (error) throw error;
			
			user.isAdmin = true;
			user.save();

			process.stdout.write('User "' + data.username + '" created successfully.\n\n');
			process.exit();
		});
	});
});

})();