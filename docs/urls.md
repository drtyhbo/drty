## Urls

The url routing works as follows:

 1. User makes an http request. For example: http://localhost:8080/login/.
 1. drty extracts the pathname information from the url. For example: /login/.
 1. drty matches this pathname against a set of specified url patterns and routes the request to the appropriate view.

The set of url patterns that drty uses for routing is specified by the `ROOT_URLCONF` parameter in the settings file. Let's take a look at an example urls.js file:

    var drty = require('drty'),
        urls = drty.urls,
		views = require('./blog/views');

    exports.urlpatterns = urls.patterns(
        urls.url('^/login/$', views.login, 'login'),
        urls.url('^/logout/$', views.logout, 'logout'),
        urls.url('^/register/$', views.register, 'register'),
        urls.url('^/home/$', views.home, 'home'),
        urls.url('^/blog/(?P<blogId>[^/]*)/$', views.blog, 'blog'),
        urls.url('^/media/(?P<path>.*)$', drty.views.static.serve, 'media', [
            require('path').join(__dirname, 'media')
        ])
    );

Let's start with the functions.

    drty.urls.patterns(url1, url2, url3, ...)

This function takes a variable number of urls as parameters and returns an instance of a Patterns object. You should never need to access this Patterns object directly.

    drty.urls.url(pattern, viewFnc, id, params)

 * `pattern` is a regular expression that drty will use when matching a request url.
 * `viewFnc` is the function drty will call when it recieves a request matching `pattern`.
 * `id` is an id used to reference this url.
 * `params` is an array of parameters that will be passed as arguments to your view.

Now, back to the example above. That list of url patterns will match the following urls:

/login/
/logout/
/register/
/home/
/blog/*/
/media/*

The /login/, /logout/, /register/, and /home/ are straightforward. When matched, they route the request directly to the views.

/blog/*/ is more complicated. When matched, drty sets the request.params.blogId variable to the value of *. For example, if /blog/10/ is the url, the request.params.blogId variable will be 10.

The Patterns object contains two important functions.

    Patterns = drty.Class.extend({
    
    ...
    
    route: function(request, response) { ... }
    reverse: function(id, ...) { ... }
    
    ....
    
    })

 * `route` Takes a request and response object and routes that request to the appropriate view. Returns true if an appropriate view could be found, or false otherwise. You should
 * `reverse` Given a url id, returns the associated url. The ... is a list of parameters to use when building the url. More on this later.