var drty = require('drty'),
	forms = require('./forms'),
	models = require('./models'),
	directToTemplate = drty.views.generic.simple.directToTemplate;

/* This is the login view. Views can either be specified as a single function
   or as an array of functions. If it's specified as an array, each function
   will be executed sequentially. Every function in the array except the last
   one will be passed a 'next' parameter. This paramater must be called to pass
   execution on to the next function in the list. */
exports.login = [
    /* This function checks the request object for the user object. If the user
       object exists, this user is already logged in, so we direct her to the 
       home page. drty.urls.reverse() takes an id for a url and returns the url. */
	function(request, response, next) {
		if (request.user) {
			response.redirect(drty.urls.reverse('home'));
		} else {
			next();
		}
	},
	function(request, response) {
		function render(context) {
			/* directToTemplate takes four parameters, the request, the response,
			   the template filename and the context variables to pass to the template. */
			directToTemplate(request, response, 'login.tpl', context);
		}

		/* First we check if this is a POST request. If it is, we can assume the
		   user submitted the login form. */
		if (request.method == 'POST') {
			/* We create a new instance of the LoginForm and pass the POST parameters
			   into the form. */
			var form = new forms.LoginForm(request.POST);
			/* form.clean() validates the user-supplied POST parameters, and returns true
			   if they are valid. Some cases where this function will return false is if
			   the user leaves the username or password fields blank. */
			if (form.clean()) {
				/* cleaned values are stored in the cleaneValues dict. */
				var username = form.cleanValues.username,
					password = form.cleanValues.password;

				/* authenticate checks the db for the specified username/password combination. */
				drty.contrib.auth.models.User.authenticate(username, password, function(error, user) {
					/* user not found or invalid username/password. */
					if (error) {
						render({
							form: form,
							error: 'Invalid username or password'
						});
					} else {
						/* user.login adds the user to the session object. */
						user.login(request);
						/* redirect the user */
						response.redirect(request.GET['next'] || drty.urls.reverse('home'));
					}
				});
			} else {
				/* The form didn't validate. Render it on the page (errors will show up inline). */
				render({form: form});
			}
		} else {
			/* The first time the user has visited the form. Render a fresh, blank, form. */
			render({form: new forms.LoginForm()});
		}
	}];

exports.register = function(request, response) {
	function render(context) {
		directToTemplate(request, response, 'register.tpl', context);
	}

	/* This view follows a very similar paradigm to the login view. */
	if (request.method == 'POST') {
		var form = new forms.RegisterForm(request.POST);
		if (form.clean()) {
			var username = form.cleanValues.username,
				password = form.cleanValues.password,
				email = form.cleanValues.email;

			/* createUser takes a username, password and email address and adds a new user
			   to the database. Passes the new user object in the callback. */
			drty.contrib.auth.models.User.create(username, password, email, '', '', function(error, user) {
				if (error) {
					render({
						form: form,
						error: "'" + username + "' has already been taken!"
					});
				} else {
					response.redirect(drty.urls.reverse('login'));
				}
			});
		} else {
			render({form: form});
		}
	} else {
		render({form: new forms.RegisterForm()});
	}
}

exports.logout = function(request, response) {
	if (request.user) {
		/* logout() clears the user from the session object. */
		request.user.logout(request);
	}
	response.redirect(drty.urls.reverse('login'));
}


exports.home = [
	/* loginRequired checks the session object for a logged in user. If a user is not
	   found, loginRequired redirects the user to the login page. */
	drty.contrib.auth.loginRequired,
	function(request, response) {
		function loadBlogs() {
			/* This is the equivalent of a select statement in MySQL. When calling filter, pass
			   a list of values that you would like drty to match on when querying the db. In this
			   example, we are looking for all blog objects that are owned by request.user. */
			models.Blog.objects.filter({owner: request.user}).fetch(function(error, blogs) {
				/* When found, render the blogs to home.tpl */
				directToTemplate(request, response, 'home.tpl', {
					blogs: blogs,
					createBlogForm: createBlogForm
				});
			});
		}

		/* This function follows a similar paradigm to login, register. */
		if (request.method == "POST") {
			var createBlogForm = new forms.CreateBlogForm(request.POST);
			if (createBlogForm.clean()) {
				var blog = new models.Blog({
					title: createBlogForm.cleanValues.title,
					isPublic: createBlogForm.cleanValues.isPublic,
					owner: request.user,
				}).save(function(error, blog) {
					if (error) {
						loadBlogs();
					} else {
						response.redirect(drty.urls.reverse('blog', blog.id));
					}
				});
			} else {
				loadBlogs();
			}
		} else {
			var createBlogForm = new forms.CreateBlogForm();
			loadBlogs();
		}
	}
];

/* This function checks to see if the currently logged in user has access to the specified blog.
   If he does, the function will call next() to pass execution on to the blog view. If not,
   the function will redirect the user to his home. */
function blogAccessRequired(request, response, next) {
	models.Blog.objects.filter({id: request.params.blogId}).fetchOne(function(error, blog) {
		if (error) {
			response.redirect(drty.urls.reverse('home'));
		} else {
			if (!blog.isPublic && (!request.user || blog.owner.id != request.user.id)) {
				response.redirect(drty.urls.reverse('home'));
			} else {
				request.blog = blog;
				next();
			}
		}
	});
}

exports.blog = [
    /* Verify the user has access to this blog. */
	blogAccessRequired,
	function(request, response) {
		function render(form) {
			/* Load all the entries in this blog. */
			models.Entry.objects.filter({blog: request.blog}).fetch(function(error, entries) {
				directToTemplate(request, response, 'blog.tpl', {
					blog: request.blog,
					entries: entries,
					createEntryForm: form
				});	
			});
		}
		if (request.method == "POST") {
			var form = new forms.CreateEntryForm(request.POST);
			if (form.clean()) {
				new models.Entry({
					blog: request.blog,
					title: form.cleanValues.title,
					body: form.cleanValues.body
				}).save(function(error, entry) {
					render(new forms.CreateEntryForm());
				});
			} else {
				render(form);
			}
		} else {
			var form = new forms.CreateEntryForm();
			render(form);
		}
	}
];
