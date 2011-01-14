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