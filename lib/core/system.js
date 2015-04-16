//Because Browserify encapsulates every module, use strict won't apply to the global scope and break everything
'use strict';

//Require necessary modules
var Group = require('../entity/group.js'),
    Entity = require('../entity/entity.js'),
    Vacuum = require('../tasks/vacuum.js'),
    World = require('../world/world.js');

/**
 * System Constructor
 *
 * @class System
 * @classdesc The heart of this modular AI! In here we provide access to
 * all the other objects and function, and we handle the startup of the system
 *
 * @param {Object} userSettings - The settings that the user provides
 */
var System = function(userSettings) {

    /**
     * @property {Boolean} isInitialized - True when the system is fully initialized
     */
    this.isInitialized = false;

    /**
     * @property {Group} entities - All the entities controlled by this system
     */
    this.entities = null;

    /**
     * @property {World} world - The world for demonstrating purposes
     */
    this.world = null;

    //Load and then initialize itself
    this.initialize();

};

System.prototype = {

    /**
     * Initialize the system
     * @private
     */
    initialize: function() {

        //Check if the game is already initialized
        if(this.isInitialized) {
            return;
        }

        //Create a new group that will hold all entities
        this.entities = new Group();

        //Create a new entity and add it to the group
        var firstRobot = new Entity('Robin');
        firstRobot.systems['task'].addTask(new Vacuum());
        firstRobot.systems['task'].addTask(new Vacuum());
        this.entities.addEntity(firstRobot);

        //Create the world object
        this.world = new World();

        //Update the system for the first time
        this.update();

        //The system is fully initialized
        this.isInitialized = true;

    },

    /**
     * All the functions that need to be executed every time the system updates
     * Basically a game loop
     * @protected
     */
    update: function() {

        //Request a new animation frame and call the update function again
        requestAnimationFrame(this.update.bind(this));

        //Get all entities in the system
        var entities = this.entities.getEntities();

        //Loop through all the entities
        for(var i = 0; i < entities.length; i++){

            //Execute the run command for each entity so it will start acting
            entities[i].run();

        }

        //Update the demonstration world
        this.world.update();

    }

};

//Export the Browserify module
module.exports = System;
