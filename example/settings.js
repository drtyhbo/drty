var drty = require('drty');

exports.settings = {
	/* Database configuration parameters. */
	DATABASE: {
		ENGINE: drty.db.backends.MySQL,
		NAME: 'demo', // database name
		USER: 'demo', // database username
		PASSWORD: 'demo', // database password
		HOST: '',
		PORT: ''
	},
	/* drty will search in these directories for template files. */
	TEMPLATE_DIRS: [
		'templates'
	],
	/* List of apps used by this example.
	   sessions provides session support.
	   auth provides user authentication.
	   require('./blog') is the app that we've created that contains our blog logic. */
	INSTALLED_APPS: [
		drty.contrib.sessions,
		drty.contrib.auth,
		require('./blog')
	],
	/* List of middleware used by this example.
	   SessionMiddleware provides session support.
	      Adds a session object to the request.
	   AuthenticationMiddleware provides authentication support.
	      Adds a user object to the request if logged in. */
	MIDDLEWARE_CLASSES: [
		drty.contrib.sessions.middleware.SessionMiddleware,
		drty.contrib.auth.middleware.AuthenticationMiddleware
	],
	/* Functions that provide extra variables to template contexts. */
	TEMPLATE_CONTEXT_PROCESSORS: [
		require('./index').contextProcessor
	],
	
	/* drty.auth.loginRequired will redirect non logged-in users to this url. */
	LOGIN_URL: '/login/',

	/* drty will use these patterns to route urls. */
	ROOT_URLCONF: require('./urls').urlpatterns
};