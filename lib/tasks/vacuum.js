//Because Browserify encapsulates every module, use strict won't apply to the global scope and break everything
'use strict';

//Require necessary modules
var Task = require('./task.js'),
    Utils = require('../core/utils.js');

/**
 * Vacuum Task constructor
 *
 * @class Vacuum
 * @classdesc Execute a given task and return the result
 * Inherits from Task
 */
var Vacuum = function(entity) {

    /**
     * Inherit the constructor from the Element class
     */
    Task.call(this, entity);

    /**
     * @property {String} name - The name of this task.
     */
    this.name = 'Vacuum';

};

Vacuum.prototype = Object.create(Task.prototype, {

    /**
     * Function that is called whenever the system updates
     * @protected
     */
    run: {
        value: function() {

            //Start the task
            this.start();

            //Execute the task
            console.log('I\'m vacuuming now');

            //Get a new random position on the map to go to
            var newPosition = {
                x: Utils.randomNumberSteps(-100, 100, 20),
                z: Utils.randomNumberSteps(-100, 100, 20)
            };

            //Calculate the X and Z distance
            var distance = {
                x: Math.abs(newPosition.x - this.entity.mesh.position.x),
                z: Math.abs(newPosition.z - this.entity.mesh.position.z)
            };

            //Calculate the total distance and the time it would take to traverse that distance
            var totalDistance = distance.x + distance.z;
            var time = totalDistance / 35;

            //Start the Tween animation in the demonstration world
            TweenMax.to(this.entity.mesh.position, time, {
                x : newPosition.x,
                z : newPosition.z,
                onComplete: this.finish.bind(this)
            });

        }
    }

});

//Export the Browserify module
module.exports = Vacuum;
