//Because Browserify encapsulates every module, use strict won't apply to the global scope and break everything
'use strict';

//Require necessary modules
var Task = require('./task.js');

/**
 * Navigate Task constructor
 *
 * @class Navigate
 * @classdesc Navigate a task and return the result
 * Inherits from Task
 */
var Navigate = function() {

    /**
     * Inherit the constructor from the Element class
     */
    Task.call(this);

    /**
     * @property {String} name - The name of this task.
     */
    this.name = 'Navigate';

};

Navigate.prototype = Object.create(Task.prototype, {



});

//Export the Browserify module
module.exports = Navigate;
