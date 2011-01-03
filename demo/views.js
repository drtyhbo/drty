var drty = require('../lib/drty'),
	urls = drty.urls,
	views = drty.views;
	
var myForms = require('./forms');
	
views
	.add('root', function(request, response) {
		response.redirect(urls.reverse('login'));
	});
	
views
	.add('login', function(request, response) {
		var form;
		if (request.method == "POST") {
			form = new myForms.LoginForm(request.POST);
			if (form.clean()) {
				
			}
		} else {
			form = new myForms.LoginForm();
		}
		drty.templates.render
	})

views
	.add('^/logout/$', 'logout')
		.add('^/blog/:username/$', 'home')
		.add('^/post/$', 'post');