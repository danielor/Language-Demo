/**
 * The home manager manages the state of all of the information
 * associated with the home page
 * @constructor
 * @author Daniel Ortiz
 */
var HomeClientManager = (function(){
	/**
	 * A simple object that encapsulates the state associated with
	 * the length text function
	 * @name lengthState
	 * @type {object}
	 * @memberof HomeManager
	 */
	var lengthState = {
		"isSent":false,
		"isError":false,
	}
	
	/**
	 * This function sets up the home page demo
	 * @function init
	 * @memberof HomeManager
	 */
	function init(){
		setupNetworking();
		$(".lengthArea").on('change', onLengthChange);
		$(".lengthArea").on('keypress', function(event){
			_onLengthChange();
		});
	}
	
	/**
	 * Setup the networking for the client manager
	 * @function setupNetworking
	 * @memberof HomeManager
	 */
	function setupNetworking(){
		$.ajaxSetup({
            beforeSend: function(xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    var csrftoken = $("input[name='_csrf']").val();
                    xhr.setRequestHeader("x-csrf-token", csrftoken);
                }
            }
        });
	}
	
	/**                                                                     
     * Save methods for ajax                                                
     * @function csrfSafeMethod                                                 
     * @param method The save methods on the ajax                           
     * @memberof HomeManager#                                              
     */
    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection                
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    /**
     * A function that handles the length text information
     * @function _onLengthChange
     * @memberof HomeManager
     */
    function _onLengthChange(){
    	var lengthText = $(".lengthArea").val();
		if(!lengthState.isSent){
			lengthState.isSent = true;
			sendPayload("length",{"string": lengthText}, function(data){
				lengthState.isSent = false;
				lengthState.isError = false;
				$(".lengthAreaResult").text(data.result);
			}, function(data){
				lengthState.isSent = false;
				lengthState.isError = true;
				$(".lengthAreaResult").text("Unknown error");
			});
		}
    }
    
    /**
     * An internal function used to get the base url of the
     * current server
     * @function _getBaseURL
     * @memberof HomeManager
     */
    function _getBaseURL(){
    	return window.location.protocol+'//'+window.location.host+'/';
    }
    
    /**
     * A function that will post information to a particular endpoint with
     * a payload
     * @function sendPayload
     * @param endPoint The end point to send home
     * @param payload The payload to send to the data
     * @param successCallback A callback for a successful call
     * @param errorCallback A callback for an error call
     * @memberof HomeManager
     */
    function sendPayload(endPoint, payload, successCallback, errorCallback){
    	var effectiveURL = _getBaseURL() + endPoint;
    	$.ajax({
    		type:"POST",
    		url:effectiveURL,
    		data:payload
    	}).done(successCallback).fail(errorCallback)
    	
    }
    
	/**
	 * A function that handles the change of length associated with the 
	 * @function onLengthChange
	 * @memberof HomeManager
	 */
	function onLengthChange(e){
		_onLengthChange();
		
		// The stop stop the propagation
		e.stopPropagation();
		return false;
	}
	
	/*
	 * A simple constructor end point
	 */
	return {
		init:init
	}
})();

// Call the client manager when the operation is ready
$(document).ready(HomeClientManager.init);
