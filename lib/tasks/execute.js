//Because Browserify encapsulates every module, use strict won't apply to the global scope and break everything
'use strict';

//Require necessary modules
var Task = require('./task.js');

/**
 * Execute Task constructor
 *
 * @class Execute
 * @classdesc Execute a given task and return the result
 * Inherits from Task
 */
var Execute = function() {

    /**
     * Inherit the constructor from the Element class
     */
    Task.call(this);

    /**
     * @property {String} name - The name of this task.
     */
    this.name = 'Execute';

};

Execute.prototype = Object.create(Task.prototype, {

    /**
     * Function that is called whenever the system updates
     * @protected
     */
    run: {
        value: function() {

            //Start the task
            this.start();

            //Execute the task
            console.log('ga nu stofzuigen');

            //Make sure the task ends in 5 seconds
            setTimeout(this.finish.bind(this), 5000);

        }
    }

});

//Export the Browserify module
module.exports = Execute;
