/* Context processors add variables to the template contexts so they are
   available from within templates. */
exports.contextProcessor = function(request) {
	return {
		MEDIA_URL: '/media/',
		request: request
	};
}