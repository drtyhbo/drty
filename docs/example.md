## Tutorial

This is a brief tutorial to introduce you to creating a website with drty. By the end of this tutorial, you will have a fully functioning (albeit ghetto) blog platform. This tutorial assumes no familiarity with Django.

### startproject

The first step to building a site with drty is to create a new project. Luckily, drty comes prepackaged with a nifty binary, `drty-admin`, to help you get started. Type:

`drty-admin startproject blog`

This will create a "blog" directory containing some starter js files.

* settings.js - This file contains configuration parameters for your site. At the moment, your settings file isn't doing much, but we'll be changing that soon enough!
* urls.js - This file will eventually contain url pattern matching logic for the drty request router.
* manage.js - This file is the starting point for managing your project. Running `node manage.js` will give you a list of available commands.

### runserver

Let's test this shiz out.

1. Go to the "blog" directory and type `node manage.js runserver`. This command kickstarts an http server running on 127.0.0.1:8080.
2. Open a browser and visit http://127.0.0.1:8080.
3. It just works! But how?

Let's go through the files real quick.

### settings.js

Open your settings.js file. Starting on line 3:

    exports.settings = {

drty expects the settings hash to be exported from your settings file as `settings`.

    DATABASE: {
    	ENGINE: drty.db.backends.MySQL,
    	NAME: 'DATABASE NAME',
    	USER: 'USERNAME',
    	PASSWORD: 'PASSWORD',
    	HOST: '',
    	PORT: ''
    }

At the moment, we don't have a database specified. When we do, the settings will go in DATABASE.

    TEMPLATE_DIRS: [
    	// ENTER TEMPLATE DIRECTORIES HERE
    ]

The TEMPLATE_DIRS array contains the directories drty will search in when looking for template files. We'll fill this in later.

    INSTALLED_APPS: [
    	// drty.contrib.sessions
    ]

An app in drty is a grouping of related urls, views, forms, models and middleware that accomplishes a specific purpose. For example, drty comes packaged with an auth app (drty.contrib.auth) that implements basic user authentication. This package has a User model (drty.contrib.auth.models.User), as well as authentication middleware (drty.contrib.auth.middleware.AuthMiddleware).

    MIDDLEWARE_CLASSES: [
    	// drty.contrib.sessions.middleware.SessionMiddleware
    ]

drty supports both request and response middleware. Request middleware is executed in the order that it is listed in this array. Response middleware is executed in the opposite order. For example, if you have session and auth middleware installed, as in:

    MIDDLEWARE_CLASSES: [
    	drty.contrib.sessions.middleware.SessionMiddleware,
    	drty.contrib.auth.middleware.AuthMiddleware
    ]

The execution of a request will look like:

SessionMiddleware -> AuthMiddleware -> Your custom view -> AuthMiddleware -> SessionMiddleware

    ROOT_URLCONF: require('./urls').urlpatterns

This line tells drty about your url patterns. The settings and urls are split into seperate files, by default, to keep things clean, but this separation is not required.

### urls.js

Open your urls.js file. Starting on line 4:

	exports.urlpatterns = urls.patterns(
	        urls.url('^/$', drty.views.generic.simple.helloWorld)
	);

Patterns are created using the `drty.urls.patterns` function. The declaration is:

    function patterns(url1, url2, url3, url4, ...) { ... }

Where each url pattern is passed in as a parameter. Each url must be created using the `drty.urls.url` function. The declaration for url is:

    function url(pattern, view, name, parameters) { ... }

`pattern` is a regular expression that drty will match against when deciding where to route a request.
`view` is the function that will be executed when this pattern gets matched.
`name` name is the name used to identify this pattern. We'll learn more about name later.
`paramaters` is an array of parameters that will be passed to your view when it's called.

The provided patterns() call matches one, and only one url: /. When you request http://127.0.0.1:8080/, drty will route the request to the `drty.views.generic.simple.helloWorld` function. Let's take a look at that function.

    helloWorld: function(request, response) {
        response.ok('<center><h2>It just works!</h2></center>');
    }

Every view function is passed at least a request and a response parameter. The request parameter contains the following parameters:

`url` contains the request url.
`method` contains the request method. Either GET or POST.
`cookies` a hash of cookies passed into the request.
`GET` a hash of GET parameters.
`POST` a hash of POST parameters.