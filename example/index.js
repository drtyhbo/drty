exports.contextProcessor = function(request) {
	return {
		MEDIA_URL: '/media/',
		request: request
	};
}