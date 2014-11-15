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
		assets: grunt.file.readJSON("presentation.json"),
		clean:['bower_components/build'],
		watch:{
			js:{
				files:languages.js,
				tasks:['jshint'],
				options:{
					livereload:true
				}
			},
			html:{
				files:languages.html,
				options:{
					livereload:true,
					interval:500
				}
			},
			css:{
				files:languages.css,
				tasks:['csslint'],
				options:{
					livereload:true
				}
			},
			jshint:{
				all:{
					src:languages.js,
					options:{
						jshintrc: true
					}
				}
			},
			uglify:{
				core:{
					options:{
						mangle:false
					},
					files: '<%= assets/languages.js %>'
				}
			},
			csslint:{
				options:{
					csslintrc: '.csslintrc'
				},
				src: languages.css
			},
			cssmin:{
				core:{
					files: '<%= assets.languages.css %>'
				}
			},
			nodemon:{
				dev:{
					script:'server.js',
					options:{
						args:[],
						ignore:['node_modules/**'],
						ext:'js,html',
						nodeArgs:['--debug'],
						delayTime:1,
						cwd:__dirname
					}
				}
			},
			concurrent:{
				tasks:['nodemon', 'watch'],
				options:{
					logConcurrentOutput: true
				}
			},
			mochaTest:{
				options:{
					reporter:'spec',
					require:[
					   "server.js"
					]
				},
				src:['tests']
			},
			env:{
				test:{
					NODE_ENV:'test'
				}
			},
			karma:{
				unit:{
					configFile:'karma.js'
				}
			}
		}
	});
	
	// Load the npm tasks, and tasks for dev/production
	require('load-grunt-tasks')(grunt);
	if(process.env.NODE_ENV === 'production'){
		grunt.registerStack('default', ['clean', 'cssmin', 'uglify', 'concurrent']);
	}else{
		grunt.registerTask('default', ['clean', 'jshint', 'csslint', 'concurrent']);
	}
	grunt.registerTask('test',['env:test', 'mochaTest', 'karma:unit']);
}	

// Export the grunt file. 
module.exports = initializeGrunt;




