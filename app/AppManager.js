
// The package imports
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var errorhandler = require('errorhandler');
var express = require('express');
var expressValidator = require('express-validator');
var lusca = require('lusca');
var morgan = require('morgan');
var path = require('path');
var redis = require('redis');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);


// The app imports
var viewManager = require('./views/ViewManager').ViewManager;
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
	
	/**
	 * A function that returns the environment's
	 * redis secret
	 * @function getRediSecret
	 * @memberof Configuration
	 */
	function getRedisSecret(){
		return process.env.REDIS || 'redisDevSecret';
	}
	
	/*
	 * The Configuration interface
	 */
	return {
		getServerPort:getServerPort,
		getRedisSecret:getRedisSecret
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
		"configuration": configuration,
	};
	
	/**
	 * A sipublic interface of the app manager
	 * @name appManagerInterface 
	 * @memberof AppManager
	 */
	var appManagerInterface = {
		start:start,
		getManagerBlock:getManagerBlock
	};

	
	/**
	 * Setup the express.js app. This function will add the
	 * basic middleware and functionality to get the server started
	 * under different configurations.
	 * @function _setupExpress
	 * @memberof AppManager
	 */
	function _setupExpress(){
		
		// The basic of the express app
		app = express();
		app.set('views', path.join(__dirname, '../public/view'));
		app.set('view engine','jade');
		app.use(morgan('combined'));
		app.use('/bower_components', express.static(__dirname + "/../bower_components"));
		app.use('/public', express.static(__dirname + "/../public"));
		console.log(__dirname + "../public");
		app.use(expressValidator());
		app.use(cookieParser());
		app.use(bodyParser.urlencoded({extended:true}));
		_setupRedis();
		app.use(lusca({
			csrf:true,
			xframe: 'SAMEORIGIN',
            hsts:{maxAge:31536000, includeSubDomains:true},
            xssProtection:true
		}));
		managerBlock.express = app;
	}
	
	/**
	 * Setup the redis cache. This function will create the redis
	 * cache and tie it to the express.js session
	 * @function _setupRedis
	 * @memberof AppManager
	 */
	function _setupRedis(){
		var redisClient = redis.createClient();
		app.use(session({ 
			store: new RedisStore({ttl:3600}), 
			secret: configuration.getRedisSecret(),
			saveUninitialized: false, 
			resave: false
		}));
		managerBlock.redis = redisClient;
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
		_setupRedis();
		
		// Initialize and save the main manager objects
		var ViewManager = new viewManager(appManagerInterface);
		managerBlock.views = ViewManager;
		
		// Setup the managers
		ViewManager.setupViews();
		
		// The config setup
		var port = configuration.getServerPort();
		app.listen(port);
	}
	
	/**
	 * Get the manager block. Return an object that encapsulates 
	 * all of the state managers of the app
	 * @name AppManager
	 */
	function getManagerBlock(){
		return managerBlock;
	}
	
	/*
	 * The public interface of the AppManager closure
	 */
	return appManagerInterface;
});

// Export the app manager
module.exports.AppManager = AppManager;