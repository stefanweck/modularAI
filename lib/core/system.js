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
