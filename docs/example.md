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

Load the drty library into `drty`.

    exports.settings = {

When drty calls `require()` on your settings.js file, it expects to find an export named settings.



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

drty supports a template language very similar to the Django templating language. This array contains a list of directories in which you would like drty to search for your template files. We'll fill this in later as well.



    INSTALLED_APPS: [
    	// drty.contrib.sessions
    ]

An app in drty is the same as an app in Django. It is a grouping of related urls, views, forms, models and middleware that accomplishes a specific purpose. For example, drty comes packaged with an app at drty.contrib.auth that implements basic user authentication. This package has a User model, as well as user authentication middleware. There's also a half finished app called admin that will provide basic web-based administration of your site (when finished!).



    MIDDLEWARE_CLASSES: [
    	// drty.contrib.sessions.middleware.SessionMiddleware
    ]

drty supports both request and response middleware. Request middleware is executed in the order that it is inserted into this array. Response middleware is executed in the opposite order. For example, if you have session and auth middleware installed as in:

    MIDDLEWARE_CLASSES: [
    	drty.contrib.sessions.middleware.SessionMiddleware,
    	drty.contrib.auth.middleware.AuthMiddleware
    ]

The execution will look like this:

SessionMiddleware -> AuthMiddleware -> Your custom view -> AuthMiddleware -> SessionMiddleware



    ROOT_URLCONF: require('./urls')

This line tells drty to start looking in your urls.js file when routing a url.
