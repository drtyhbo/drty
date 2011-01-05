var models = require('./models');

exports.root = function(request, response) {
	models.Blog.objects.filter({'title': 'hey'}).fetchOne();
	response.ok('It works!');
}
