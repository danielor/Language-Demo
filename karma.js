'use strict';

/**
 * This function configures Karma to function with the language
 * demo. 
 * @function configureKarma
 */
function configureKarma(config){
	var _ = require('loadsh');
	var presentation = require('./presentation.json');
	
	// Configure karma
	config.set({
		basePath:'.', 			// The base path 
		frameworks:['mocha'], 	// The testing framework
		files:_.flatten(_.values(assets.core.js)).concat([
		   'public/*.js',
		   'public/*/*.js'
		]),						// Files to add
		exclude:[],				// Files to exclude
		reporters:['progress','coverage'],
		preprocessors:{
			'public/controllers/*.js',
			'public/controllers/*/*.js',
			'public/services/*.js',
			'public/services/*/*.js'
		},
		coverageReporter:{
			type:'html',
			dir:'test/coverage'
		},
		port:9876,
		colors:true,
		logLevel:config.LOG_DEBUG,
		autoWatch:true,
		browsers:['PhantomJS'],
		captureTimeout: 60000,
		singleRun: true
	});
}

module.exports = configureKarma;