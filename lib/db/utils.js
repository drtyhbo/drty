(function() {

exports.varNameToTableName = function(name) {
	name = name.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()
	return name.charAt(name.length - 1) != 's'
		? (name + 's')
		: name;
}

})();