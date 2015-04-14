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

};

Task.prototype = {

    /**
     * Function that is called whenever the system updates
     * This function should be overwritten by tasks
     * @protected
     */
    run: function() {

        //Silence is golden

    }

};

//Export the Browserify module
module.exports = Task;
