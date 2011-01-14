## Tutorial

This is a brief tutorial to introduce you to creating a website with drty. By the end of this tutorial, you will have a fully functioning (albeit ghetto) blog platform. This tutorial assumes no familiarity with Django.

### startproject

The first step to building a drty site is to create a new project. Luckily, drty comes prepackaged with a nifty binary, `drty-admin` to help you get started. To create your project, type:

`drty-admin startproject blog`

This will create a "blog" directory containing some starter js files.

* settings.js - This file contains configuration parameters for your site. At the moment, your settings file isn't doing much, but we'll be changing that soon enough!
* urls.js - This file will eventually contain url pattern matching logic.
* manage.js - This file is the starting point for managing your project. Running `node manage.js` will give you a list of available commands.

### runserver

Let's test this shiz out.

1. Go to the "blog" directory and type `node manage.js runserver`. This command kickstarts an http server running on 127.0.0.1:8080.
2. Open a browser and visit http://127.0.0.1:8080.
3. It just works! But how?

Let's go through the files real quick.

### settings.js

Open your settings.js file. Starting on line 1:

    var drty = require('drty');

Thi line loads the drty library into `drty`.

    exports.settings = {

This line is required because drty expects to find an export name settings when it calls `require()` on your settings.js file.

    DATABASE: {
    	ENGINE: drty.db.backends.MySQL,
    	NAME: 'DATABASE NAME',
    	USER: 'USERNAME',
    	PASSWORD: 'PASSWORD',
    	HOST: '',
    	PORT: ''
    }

At the moment, we don't have a database specified. When we do, the settings will go here.

    TEMPLATE_DIRS: [
    	// ENTER TEMPLATE DIRECTORIES HERE
    ]

drty supports template file loading and rendering. This array contains a list of directories in which you would like drty to search for your template files. We'll fill this in later as well.

    INSTALLED_APPS: [
    	// drty.contrib.sessions
    ]

An app in drty is a grouping of related urls, views, forms, models and middleware that accomplishes a specific purpose. For example, drty comes packaged with an auth app (drty.contrib.auth) that implements basic user authentication. This package has a User model, as well as authentication middleware. There's also a half finished app called adminthat will provide basic web-based administration of your site (when completed).

    MIDDLEWARE_CLASSES: [
    	// drty.contrib.sessions.middleware.SessionMiddleware
    ]

drty supports both request and response middleware. Request middleware is executed in the order that it is listed in this array. Response middleware is executed in the opposite order. For example, if you have session and auth middleware installed as in:

    MIDDLEWARE_CLASSES: [
    	drty.contrib.sessions.middleware.SessionMiddleware,
    	drty.contrib.auth.middleware.AuthMiddleware
    ]

The execution will look like this:

SessionMiddleware -> AuthMiddleware -> Your custom view -> AuthMiddleware -> SessionMiddleware

    ROOT_URLCONF: require('./urls')

This line tells drty to use the url patterns in your urls.js file. In actuality, you could copy and paste the urlpatterns export of urls.js in place of this require as in:

    ROOT_URLCONF: {
        urlpatterns: drty.urls.patterns(
	        drty.urls.url('^/$', drty.views.generic.simple.helloWorld)
	    )
    }

and everything would still work a-ok. The settings and urls are split into separate files to keep things clean.

### urls.js

Open your urls.js file. Starting on line 1:

    var drty = require('drty'),

This line loads the drty library into `drty`.

    urls = drty.urls;

This line aliases `drty.urls` to `urls` so our code is shorter!

    exports.urlpatterns = urls.patterns(
        urls.url('^/$', drty.views.generic.simple.helloWorld)
    );

Aight, drty expects the url patterns to be in a hash it expects to find a urlpatterns export. For example, when drty loads your settings.js file and parses the ROOT_URLCONF parameter, it will expect to f

    DATABASE: {
    	ENGINE: drty.db.backends.MySQL,
    	NAME: 'DATABASE NAME',
    	USER: 'USERNAME',
    	PASSWORD: 'PASSWORD',
    	HOST: '',
    	PORT: ''
    }

At the moment, we don't have a database specified. When we do, the settings will go here.

    TEMPLATE_DIRS: [
    	// ENTER TEMPLATE DIRECTORIES HERE
    ]

drty supports template file loading and rendering. This array contains a list of directories in which you would like drty to search for your template files. We'll fill this in later as well.

    INSTALLED_APPS: [
    	// drty.contrib.sessions
    ]

An app in drty is a grouping of related urls, views, forms, models and middleware that accomplishes a specific purpose. For example, drty comes packaged with an auth app (drty.contrib.auth) that implements basic user authentication. This package has a User model, as well as authentication middleware. There's also a half finished app called adminthat will provide basic web-based administration of your site (when completed).

    MIDDLEWARE_CLASSES: [
    	// drty.contrib.sessions.middleware.SessionMiddleware
    ]

drty supports both request and response middleware. Request middleware is executed in the order that it is listed in this array. Response middleware is executed in the opposite order. For example, if you have session and auth middleware installed as in:

    MIDDLEWARE_CLASSES: [
    	drty.contrib.sessions.middleware.SessionMiddleware,
    	drty.contrib.auth.middleware.AuthMiddleware
    ]

The execution will look like this:

SessionMiddleware -> AuthMiddleware -> Your custom view -> AuthMiddleware -> SessionMiddleware

    ROOT_URLCONF: require('./urls')

This line tells drty to start looking in your urls.js file for url patterns.
