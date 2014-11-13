/**
 * This grunt file compiles and combines all of the client-side
 * content.
 */
'use strict';

//Setup the paths for the files
var paths = {
	js:['*.js'],
	html:['public/views'],
	css:['!bower_components/**']
};

/**
 * A function that setups the grunt task to build and validate
 * all of the front-end assets
 * @function initializeGrunt
 * @param grunt {object} The grunt object
 */
function initializeGrunt(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		assets: grunt.file.readJSON("presentation.json")
	})
}	

// Export the grunt file. 
module.exports = initializeGrunt;




