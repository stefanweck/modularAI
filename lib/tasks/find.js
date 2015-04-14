//Because Browserify encapsulates every module, use strict won't apply to the global scope and break everything
'use strict';

//Require necessary modules
var Task = require('./task.js');

/**
 * Find Task constructor
 *
 * @class Find
 * @classdesc Find a task and return the result
 * Inherits from Task
 */
var Find = function() {

    /**
     * Inherit the constructor from the Element class
     */
    Task.call(this);

    /**
     * @property {String} name - The name of this task.
     */
    this.name = 'Find';

};

Find.prototype = Object.create(Task.prototype, {



});

//Export the Browserify module
module.exports = Find;
