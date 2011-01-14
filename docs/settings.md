Let's go over the parts of the settings file.

    exports.settings = {

drty expects the settings file to export the settings symbol.

        DATABASE: {
            ENGINE: drty.db.backends.MySQL,
            NAME: 'DATABASE NAME',
            USER: 'USERNAME',
            PASSWORD: 'PASSWORD',
            HOST: '',
            PORT: ''
        }

This block configures drty to work with your database. At the moment, MySQL is the only backend that has been implemented.

`ENGINE` must be `drty.db.backends.MySQL`.
`NAME` specifies the database name.
`USER` specifies the MySQL username.
`PASSWORD` specifies the MySQL password.
`HOST` specifies the hostname. Defaults to 'localhost'.
`PORT` specifies the db port. Defaults to 3306.

        TEMPLATE_DIRS: [
            // ENTER TEMPLATE DIRECTORIES HERE
        ]

The TEMPLATE_DIRS array contains a list of directories that drty will look in when loading templates. Click here for more information about templates.

        INSTALLED_APPS: [
            // drty.contrib.sessions
        ]

The INSTALLED_APPS array contains the list of applications that drty will load. Click here for more information about applications.

        MIDDLEWARE_CLASSES: [
            // drty.contrib.sessions.middleware.SessionMiddleware
        ]

The MIDDLEWARE_CLASSES array contains the list of middleware classes that drty will use. Click here for more information about middleware.

        ROOT_URLCONF: require('./urls').urlpatterns

ROOT_URLCONF tells drty which patterns to use when routing urls. Click here for more information about urls.