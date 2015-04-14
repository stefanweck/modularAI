//Because Browserify encapsulates every module, use strict won't apply to the global scope and break everything
'use strict';

//Require necessary modules
var Task = require('./task.js');

/**
 * Decide Task constructor
 *
 * @class Decide
 * @classdesc Decide and return the result
 * Inherits from Task
 */
var Decide = function() {

    /**
     * Inherit the constructor from the Element class
     */
    Task.call(this);

    /**
     * @property {String} name - The name of this task.
     */
    this.name = 'Decide';

};

Decide.prototype = Object.create(Decide.prototype, {



});

//Export the Browserify module
module.exports = Decide;
