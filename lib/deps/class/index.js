/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
	var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\bparent\b/ : /.*/;
	// The base Class implementation (does nothing)
	var Class = exports.Class = function(){};
	
	// Create a new Class that inherits from this class
	Class.extend = function(prop, staticprop) {
		prop = prop || {};
		staticprop = staticprop || {};

		// Instantiate a base class (but only create the instance,
		// don't run the init constructor)
		initializing = true;
		var prototype = new this();
		initializing = false;
		
		function populatePrototype(prop, _super, prototype, copyMissing) {
			// Copy the properties over onto the new prototype
			for (var name in prop) {
				// Check if we're overwriting an existing function
				prototype[name] = typeof prop[name] == "function" && 
					typeof _super[name] == "function" && fnTest.test(prop[name]) ?
					(function(name, fn){
						return function() {
							var tmp = this.parent;
							// Add a new .parent() method that is the same method
							// but on the super-class
							this.parent = _super[name];

							// The method only need to be bound temporarily, so we
							// remove it when we're done executing
							var ret = fn.apply(this, arguments);
							this.parent = tmp;

							return ret;
						};
					})(name, prop[name]) :
					prop[name];
			}
			
			if (copyMissing) {
				for (var name in _super) {
					if (name in prop) { continue; }
					prototype[name] = _super[name];
				}
			}
		}
				
		// The dummy class constructor
		function Class() {
			// All construction is actually done in the init method
			if ( !initializing && this.initialize )
				this.initialize.apply(this, arguments);
		}
		
		// Populate the prototype
		populatePrototype(prop, this.prototype, prototype);
		Class.prototype = prototype;
		Class.prototype.constructor = Class;

		// Populate the class methods
		var classMethods = Class._classMethods = {};
		populatePrototype(staticprop, this._classMethods || {}, classMethods, true);
		for (var name in classMethods) {
			Class[name] = classMethods[name];
		}
		
		Class.extend = arguments.callee;

		return Class;
	};
})();