(function() {

exports.simple = {
	directToTemplate: function(request, response, filename, context) {
		var drty = require('drty');

		context = context || {};

		var processors = drty.conf.settings.TEMPLATE_CONTEXT_PROCESSORS || [];
		for (var i = 0, processor; (processor = processors[i]); i++) {
			context = drty.utils.merge(context, processor(request));
		}

		drty.template.loadAndRender(filename, context, function(s) {
			response.ok(s);
		});
	}	
};

})();