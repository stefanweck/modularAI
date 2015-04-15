//Because Browserify encapsulates every module, use strict won't apply to the global scope and break everything
'use strict';

/**
 * Task constructor
 *
 * @class Task
 * @classdesc The base class for tasks
 */
var Task = function() {

    /**
     * @property {String} name - The name of this status effect. This field is always required!
     */
    this.name = 'Base Task';

    /**
     * @property {String} state - The current state of this task. Can be Done, Busy, Problem, Planned
     */
    this.state = 'planned';

};

Task.prototype = {

    /**
     * Function that is called whenever the system updates
     * This function should be overwritten by tasks
     * @protected
     */
    run: function() {

        //Silence is golden

    },

    start: function() {

        this.state = 'busy';

    },

    finish: function() {

        this.state = 'done';

    }

};

//Export the Browserify module
module.exports = Task;
