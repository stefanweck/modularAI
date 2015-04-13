(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//Because Browserify encapsulates every module, use strict won't apply to the global scope and break everything
'use strict';

//Require necessary modules
// -- Nothing yet

/**
 * System Constructor
 *
 * @class System
 * @classdesc The heart of this modular AI! In here we provide access to
 * all the other objects and function, and we handle the startup of the system
 *
 * @param {Object} userSettings - The settings that the user provides
 */
var System = function(userSettings) {



};

System.prototype = {

    /**
     * Initialize the system
     * @protected
     */
    initialize: function()
    {

    }

};

//Export the Browserify module
module.exports = System;

},{}],2:[function(require,module,exports){
//Because Browserify encapsulates every module, use strict won't apply to the global scope and break everything
'use strict';

//Require necessary modules
var System = require('./core/system.js');

//The initialize Module
var Intialize = function initializeSystem() {

    var options = {
        //Empty for now
    };

    //Create a new system
    var system = new System(options);

};

//Initialize when fully loaded
window.addEventListener("load", Intialize);

//Export the Browserify module
module.exports = Intialize;

},{"./core/system.js":1}]},{},[2]);