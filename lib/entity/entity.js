//Because Browserify encapsulates every module, use strict won't apply to the global scope and break everything
'use strict';

var TaskSystem = require('../systems/task.js'),
    MeasureSystem = require('../systems/measure.js');

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

    /**
     * @property {THREE.Mesh} mesh - The 3D model mesh
     */
    this.mesh = null;

    //Initialize itself
    this.initialize();

};

Entity.prototype = {

    /**
     * Initialize the entity, create new objects and apply settings
     * @private
     */
    initialize: function() {

        //Add systems
        this.systems['task'] = new TaskSystem();
        this.systems['measure'] = new MeasureSystem(this);

        //Configure systems
        this.systems['task'].events.on('finished', this.finishedTask.bind(this), this);

        //Create the Three.js shape for the demonstration world
        this.createMesh();

    },

    /**
     * Create the THREE.js mesh and store it in this object
     * @private
     */
    createMesh: function() {

        //Create a reusable geometry object for a cube
        var geometry = new THREE.BoxGeometry(20, 20, 20);

        //Create the new cube object with the geometry
        this.mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff}));

        //Position the cube
        this.mesh.position.set(0, 0 ,0);

        //Configure the cube
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

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

    },

    /**
     * Callback function for whenever the a task in the task system is finished
     * @private
     */
    finishedTask: function(){

        //Get the average audio levels from the measure system
        var averageAudio = this.systems['measure'].calculateAverageAudio();

        //Push the average audio level into the measurements array in the current task
        this.systems['task'].currentTask.measurements.audio.push(averageAudio);

    }

};

//Export the Browserify module
module.exports = Entity;
