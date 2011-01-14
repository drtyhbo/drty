exports.mixin = function(dst, o) {
	for (var key in o) {
		dst[key] = o[key];
	}
}