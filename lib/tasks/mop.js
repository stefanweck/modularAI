//Because Browserify encapsulates every module, use strict won't apply to the global scope and break everything
'use strict';

//Require necessary modules
var Task = require('./task.js');

/**
 * Mopping Task constructor
 *
 * @class Mop
 * @classdesc Execute a given task and return the result
 * Inherits from Task
 */
var Mop = function() {

    /**
     * Inherit the constructor from the Element class
     */
    Task.call(this);

    /**
     * @property {String} name - The name of this task.
     */
    this.name = 'Mop';

};

Mop.prototype = Object.create(Task.prototype, {

    /**
     * Function that is called whenever the system updates
     * @protected
     */
    run: {
        value: function() {

            //Start the task
            this.start();

            //Execute the task
            console.log('I\'m mopping the floor now');

            //Make sure the task ends in 5 seconds
            setTimeout(this.finish.bind(this), 4000);

        }
    }

});

//Export the Browserify module
module.exports = Mop;
