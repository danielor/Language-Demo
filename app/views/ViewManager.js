var StringUtils = require('Language').StringUtils;
/**
 * The view manager defines all of the endpoints that contain
 * different views.
 * @class ViewManager
 */
var ViewManager = (function(a){
	/**
	 * The main application manager
	 * @name app
	 * @type {object}
	 * @memberof ViewManager
	 */
	var appManager = a;
	
	/**
	 * An instance of a lanaguage object
	 * @name stringUtils
	 * @type {StringUtils}
	 * @memberof ViewManager
	 */
	var stringUtils = new StringUtils();
	
	/**
	 * Setup the views in this web app
	 * @function setupViews
	 * @memberof ViewManager
	 */
	function setupViews(){
		var managerBlock = appManager.getManagerBlock();
		var expressApp = managerBlock.express;
		
		// The view endpoints
		// TODO: Refactor into enclosed views with a generic
		// interface.
		expressApp.get("/", onGetHomeView);
		expressApp.post("/length", onPostLength);
	}
	
	/**
	 * Get the home view of the application
	 * @function onGetHomeView
	 * @param req {object} An express.js request
	 * @param res {object} An express.js response
	 * @memberof ViewManager
	 */
	function onGetHomeView(req, res){
		res.render("home",{
			"bowerAssets" : "/bower_components",
			"appAssets" : "/public"
		});
	}
	
	/** 51
	 * Return the lenght of a string as a transaction
	 * @function onPostLength
	 * @param req {object} An express.js request
	 * @param res {object} An express.js response
	 * @memberof ViewManager
	 */
	function onPostLength(req, res){
		var string = req.body.string;
		res.send({
			"result": stringUtils.length(string, 0)
		});
		
	}
	
	/*
	 * The public interface of the view manager closure
	 */
	return{
		setupViews:setupViews
	}
});

// Export the view manager
module.exports.ViewManager = ViewManager;
