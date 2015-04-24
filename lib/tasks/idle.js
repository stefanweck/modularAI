//Because Browserify encapsulates every module, use strict won't apply to the global scope and break everything
'use strict';

//Require necessary modules
var Task = require('./task.js');

/**
 * Idle Task constructor
 *
 * @class Idle
 * @classdesc Execute a given task and return the result
 * Inherits from Task
 */
var Idle = function(entity) {

    /**
     * Inherit the constructor from the Element class
     */
    Task.call(this, entity);

    /**
     * @property {String} name - The name of this task.
     */
    this.name = 'Idle';

};

Idle.prototype = Object.create(Task.prototype, {

    /**
     * Function that is called whenever the system updates
     * @protected
     */
    run: {
        value: function() {

            //Start the task
            this.start();

            //Execute the task
            console.log('I\'m idling now');

            //Let the idle automatically finish in 3 seconds
            setTimeout(this.finish.bind(this), 3000);

        }
    }

});

//Export the Browserify module
module.exports = Idle;
