//Because Browserify encapsulates every module, use strict won't apply to the global scope and break everything
'use strict';

//Require necessary modules
var Entity = require('../entity/entity.js'),
    Vacuum = require('../tasks/vacuum.js'),
    Mop = require('../tasks/mop.js');

/**
 * @class RobotFactory
 * @classdesc A factory that returns pre made robots with
 * a set of tasks
 */
var RobotFactory = {

    /**
     * Function that returns a new default robot
     * @public
     *
     * @return {Entity} An default robot with all available tasks
     */
    defaultRobot: function() {

        //Create the new Entity object
        var entity = new Entity('Default');

        //Add the available tasks
        entity.systems['task'].addTask(new Vacuum(entity));
        entity.systems['task'].addTask(new Mop(entity));

        //Return the entity
        return entity;

    }

};

//Export the Browserify module
module.exports = RobotFactory;
