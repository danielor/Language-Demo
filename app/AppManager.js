
// The package imports
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var errorhandler = require('errorhandler');
var express = require('express');
var expressValidator = require('express-validator');
var lusca = require('lusca');
var morgan = require('morgan');
var path = require('path');

// The app imports

/**
 * A simple configuration manager that provides a simple interface
 * for dev, staging, and production run configurations
 * @class Configuration
 */
var Configuration = (function(){
	/**
	 * A simple function that returns the run port for the server
	 * @function getServerPort
	 * @memberof Configuration#
	 */
	function getServerPort(){
		return 8000;
	}
	
	/*
	 * The Configuration interface
	 */
	return {
		getServerPort:getServerPort
	}
});

/**
 * The app manager is the main class of the application. It initializes
 * the views and provides the necessary interfaces to start the
 * Node.js server
 * @class AppManager
 */
var AppManager = (function(){
	/**
	 * The main express.js app
	 * @name app
	 * @type {object}
	 * @memberof AppManager
	 */
	var app = null;
	
	/**
	 * The configuration of the app
	 * @name configuration
	 * @type {object}
	 * @memberof AppManager
	 */
	var configuration = new Configuration();
	
	/**
	 * An object that encapsulates all of the manager objects
	 * @name managerBlock
	 * @type {object}
	 * @memberof AppManager
	 */
	var managerBlock = {
		"configuration": configuration
	};
	
	/**
	 * Setup the express.js app. This function will add the
	 * basic middleware and functionality to get the server started
	 * under different configurations.
	 * @function _setupExpress
	 * @memberof AppManager
	 */
	function _setupExpress(){
		
		// The basic setup
		app = express();
		app.set('views', path.join(__dirname, 'public/view'));
		app.set('view engine','jade');
		app.use(morgan('combined'));
		app.use('/bower_components', express.static(__dirname + "/bower_components"));
		app.use('/public', express.static(__dirname + "/public"));
		app.use(expressValidator());
		app.use(cookieParser());
		app.use(bodyParser.urlencoded({extended:true}));
		app.use(lusca({
			csrf:true,
			xframe: 'SAMEORIGIN',
            hsts:{maxAge:31536000, includeSubDomains:true},
            xssProtection:true
		}));
		
	}
	
	/**
	 * The main starting point of the application. The start
	 * function initiates all of the manager classes. It is the
	 * entry point of the Lanaguage Demo application.
	 * @function start
	 * @memberof AppManager
	 */
	function start(){
		_setupExpress();
		
		// The config setup
		var port = configuration.getServerPort();
		app.listen(port);
	}
	
	/*
	 * The public interface of the AppManager closure
	 */
	return {
		start:start
	}
});

// Export the app manager
module.exports.AppManager = AppManager;