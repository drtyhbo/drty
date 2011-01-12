var drty = require('drty'),
	forms = require('./forms'),
	models = require('./models'),
	directToTemplate = drty.views.generic.simple.directToTemplate;

exports.login = [
	function(request, response, next) {
		if (request.user) {
			response.redirect(drty.urls.reverse('home'));
		} else {
			next();
		}
	},
	function(request, response) {
		function render(context) {
			directToTemplate(request, response, 'login.tpl', context);
		}
	
		if (request.method == 'POST') {
			var form = new forms.LoginForm(request.POST);
			if (form.clean()) {
				var username = form.cleanValues.username,
					password = form.cleanValues.password;

				drty.contrib.auth.authenticate(username, password, function(error, user) {
					if (error) {
						render({
							form: form,
							error: 'Invalid username or password'
						});
					} else {
						user.login(request);
						response.redirect(request.GET['next'] || drty.urls.reverse('home'));
					}
				});
			} else {
				render({form: form});
			}
		} else {
			render({form: new forms.LoginForm()});
		}
	}];

exports.register = function(request, response) {
	function render(context) {
		directToTemplate(request, response, 'register.tpl', context);
	}

	if (request.method == 'POST') {
		var form = new forms.RegisterForm(request.POST);
		if (form.clean()) {
			var username = form.cleanValues.username,
				password = form.cleanValues.password,
				email = form.cleanValues.email;

			drty.contrib.auth.createUser(username, password, email, '', '', function(error, user) {
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
		request.user.logout(request);
	}
	response.redirect(drty.urls.reverse('login'));
}


exports.home = [
	drty.contrib.auth.loginRequired,
	function(request, response) {
		function loadBlogs() {
			models.Blog.objects.filter({owner: request.user}).fetch(function(error, blogs) {
				directToTemplate(request, response, 'home.tpl', {
					blogs: blogs,
					createBlogForm: createBlogForm
				});
			});
		}

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
	blogAccessRequired,
	function(request, response) {
		function render(form) {
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
