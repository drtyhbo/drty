var drty = require('../lib/drty'),
	urls = drty.urls;

urls
	.add('^/$', 'root')
	.add('^/login/$', 'login')
	.add('^/logout/$', 'logout')
	.add('^/blog/:username/$', 'home')
	.add('^/post/$', 'post');