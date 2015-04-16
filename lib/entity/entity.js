//Because Browserify encapsulates every module, use strict won't apply to the global scope and break everything
'use strict';

var TaskSystem = require('../systems/task.js');

/**
 * Entity constructor
 *
 * @class Entity
 * @classdesc A single entity that has certain behaviour to be executed
 *
 * @param {String} name - The name of this entity
 */
var Entity = function(name) {

    /**
     * @property {String} name - The name of this entity
     */
    this.name = name;

    /**
     * @property {Array} systems - An associative array filled with all the systems that need to be called every step
     */
    this.systems = {};

    //Initialize itself
    this.initialize();

};

Entity.prototype = {

    /**
     * Initialize the entity, create new objects and apply settings
     * @private
     */
    initialize: function() {

        this.systems['task'] = new TaskSystem();

    },

    /**
     * Execute all the systems on this entity every step of the loop
     * @public
     */
    run: function() {


        for(var system in this.systems) {
            if (this.systems.hasOwnProperty(system)) {
                this.systems[system].run();
            }
        }

    }

};

//Export the Browserify module
module.exports = Entity;
