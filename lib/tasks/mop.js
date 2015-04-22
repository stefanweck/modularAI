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
var Mop = function(entity) {

    /**
     * Inherit the constructor from the Element class
     */
    Task.call(this, entity);

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

            //Start the Tween animation in the demonstration world
            TweenMax.to(this.entity.mesh.rotation, 3, {
                y : this.entity.mesh.rotation.y + 10,
                onComplete: this.finish.bind(this)
            });

        }
    }

});

//Export the Browserify module
module.exports = Mop;
