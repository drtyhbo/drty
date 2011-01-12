var drty = require('drty'),
	directToTemplate = drty.views.generic.simple.directToTemplate,
	testCase = require('nodeunit').testCase;

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

module.exports = testCase({
	'basic': function(test) {
		drty.conf.settings.TEMPLATE_DIRS = [
			require('path').join(__dirname, '../../tests/templates1')
		];
		drty.conf.settings.TEMPLATE_CONTEXT_PROCESSORS = [
			function() {
				return {
					firstName: 'drty',
					lastName: 'hobo'
				};
			}
		];
		
		directToTemplate({}, {
			ok: function(s) {
				test.equal(s, 'drty hobo');
				test.done();
			}
		}, 'name.tpl', {});
	}
});