/**
 * The main server file for Node.js. This file
 * instantiates the app manager and starts the
 * application.
 */
var appManagerClass = require('./app/AppManager').AppManager;
var AppManager = new appManagerClass();
AppManager.start();