;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//Because Browserify encapsulates every module, use strict won't apply to the global scope and break everything
'use strict';

/**
 * Event constructor
 *
 * Inspired by the great tutorial at:
 * https://corcoran.io/2013/06/01/building-a-minimal-javascript-event-system/
 *
 * @class Event
 * @classdesc An object that can announce and listen for events
 *
 */
var Event = function() {

    /**
     * @property {Object} events - An associative array with all the current events
     */
    this.events = {};

};

Event.prototype = {

    /**
     * Function that handles keydown events
     * @protected
     *
     * @param {String} type - The type of event that can be triggered
     * @param {Function} callback - The function that has to be performed as a callback
     * @param {Object} context - The object that should be accessible when the event is called
     */
    on: function(type, callback, context) {

        //If this.events doesn't have the event property, create an empty array
        if(!this.events.hasOwnProperty(type)) {
            this.events[type] = [];
        }

        //Insert the callback into the current event
        this.events[type].push([callback, context]);

    },

    /**
     * Function that is called when an event is triggered
     * @protected
     *
     * @param {String} type - The type of event that is triggered
     */
    trigger: function(type) {

        //Because we don't know how many arguments are being send to
        //the callbacks, let's get them all except the first one ( the tail )
        var tail = Array.prototype.slice.call(arguments, 1);

        //Get all the callbacks for the current event
        var callbacks = this.events[type];

        //Check if there are callbacks defined for this key, if not, stop!
        if(callbacks !== undefined) {

            //Loop through the callbacks and run each callback
            for(var i = 0; i < callbacks.length; i++) {

                //Get the current callback function
                var callback = callbacks[i][0];
                var context;

                //Get the current context object, if it exists
                if(callbacks[i][1] === undefined) {

                    //If the context is not defined, the scope is going to be this ( Event object )
                    context = this;

                }else{

                    //Get the context object
                    context = callbacks[i][1];

                }

                //Run the current callback and send the tail along with it
                //The apply() method calls a function with a given this value and arguments provided as an array
                callback.apply(context, tail);

            }

        }

    }

};

//Export the Browserify module
module.exports = Event;

},{}],2:[function(require,module,exports){
//Because Browserify encapsulates every module, use strict won't apply to the global scope and break everything
'use strict';

//Require necessary modules
var Group = require('../entity/group.js'),
    RobotFactory = require('../factories/robotfactory.js'),
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

        //Create the world object
        this.world = new World();

        //Create a new entity and add it to the group
        var firstRobot = RobotFactory.defaultRobot();

        //Add the entity to the group of all entities
        this.entities.addEntity(firstRobot);

        //Add the cube to the scene
        this.world.scene.add(firstRobot.mesh);

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

},{"../entity/group.js":5,"../factories/robotfactory.js":6,"../world/world.js":13}],3:[function(require,module,exports){
//Because Browserify encapsulates every module, use strict won't apply to the global scope and break everything
'use strict';

/**
 * Static Utilities Class
 *
 * @class Utils
 * @classdesc In this class are the functions stored that are being
 * used in other functions
 */
var Utils = {

    /**
     * Function to generate a random number between two values
     * @public
     *
     * @param {Number} from - The minimum number
     * @param {Number} to - The maximum number
     *
     * @return {Number} A random number between the two supplied values
     */
    randomNumber: function(from, to) {

        return Math.floor(Math.random() * (to - from + 1) + from);

    },

    /**
     * Function to generate a random number between two values and in certain steps
     * @public
     *
     * @param {Number} from - The minimum number
     * @param {Number} to - The maximum number
     * @param {Number} steps - The steps in which the random numbers will go
     *
     * @return {Number} A random number between the two supplied values
     */
    randomNumberSteps: function(from, to, steps) {

        return from + (steps * Math.floor(Math.random() * (to - from) / steps));

    },

    /**
     * Calculate the average from all values in an array
     *
     * @param {Array} array - The array being used for average calculations
     * @returns {Number}
     */
    averageArray: function(array) {

        var sum = 0;
        for(var i = 0; i < array.length; i++){
            sum += parseInt(array[i], 10);
        }

        return sum / array.length;

    }

};

//Export the Browserify module
module.exports = Utils;

},{}],4:[function(require,module,exports){
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

},{"../systems/measure.js":8,"../systems/task.js":9}],5:[function(require,module,exports){
//Because Browserify encapsulates every module, use strict won't apply to the global scope and break everything
'use strict';

//Require necessary modules
var Entity = require('./entity.js');

/**
 * Group constructor
 *
 * @class Group
 * @classdesc The object that holds multiple entities
 */
var Group = function() {

    /**
     * @property {Array} entities - Collection of all the entities in this group
     */
    this.entities = [];

};

Group.prototype = {

    /**
     * Function to add a new entity to this group
     * @public
     *
     * @param {Entity} entity - A reference to entity being added
     */
    addEntity: function(entity) {

        //Check if the entity is the correct object
        if(!entity instanceof Entity) {
            return;
        }

        //Add the current entity to the list
        this.entities.push(entity);

    },

    /**
     * Function to remove an entity from this group
     * @public
     *
     * @param {Entity} entity - A reference to entity being removed
     */
    removeEntity: function(entity) {

        //Check if the entity exists, if not, we don't have to delete it
        var index = this.entities.indexOf(entity);

        //The element doesn't exist in the list
        if(index === -1) {
            return;
        }

        //Remove the current entity from the group
        this.entities.splice(index, 1);

    },

    /**
     * Get all entities stored in this group
     * @public
     *
     * @returns {Array} - All entities stored in this group
     */
    getEntities: function() {

        return this.entities;

    }

};

//Export the Browserify module
module.exports = Group;

},{"./entity.js":4}],6:[function(require,module,exports){
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

},{"../entity/entity.js":4,"../tasks/mop.js":10,"../tasks/vacuum.js":12}],7:[function(require,module,exports){
//Because Browserify encapsulates every module, use strict won't apply to the global scope and break everything
'use strict';

//Require necessary modules
var System = require('./core/system.js');

//The initialize Module
var Intialize = function initializeSystem() {

    var options = {
        //Empty for now
    };

    //Create a new system
    var system = new System(options);

};

// shim layer with setTimeout fallback
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

//Initialize when fully loaded
window.addEventListener("load", Intialize);

//Export the Browserify module
module.exports = Intialize;

},{"./core/system.js":2}],8:[function(require,module,exports){
//Because Browserify encapsulates every module, use strict won't apply to the global scope and break everything
'use strict';

var Utils = require('../core/utils.js');

/**
 * Measurement System constructor
 *
 * @class MeasureSystem
 * @classdesc A system that manages all things measurement related
 *
 * @param {Entity} entity - A reference to the entity that owns this system
 */
var MeasureSystem = function(entity) {

    /**
     * @property {Entity} entity - A reference to the entity that owns this system
     */
    this.entity = entity;

    /**
     * @property {Array} audioLevels - An array which holds all the audio levels still being measured
     */
    this.audioLevels = [];

    /**
     * @property {Object} volumeControl - The VolumeControl slider
     */
    this.volumeControl = document.getElementById('volumeControl');

};

MeasureSystem.prototype = {

    /**
     * Check whether the entity is busy or needs a new task
     * @private
     */
    run: function() {

        this.measureAudio();

    },

    /**
     * Function to measure audio levels from the noise/audio sensor
     * Now faking data for demonstration purposes
     * @private
     */
    measureAudio: function() {

        var audioLevel = 0;

        //If the current task is vacuuming, make a lot of noise!
        if(this.entity.systems['task'].currentTask.name === 'Vacuum'){

            audioLevel = 70;

        }else{

            //Little to no noise
            audioLevel = 10;

        }

        //Push the value in the array
        this.audioLevels.push(audioLevel);

        //Update the UI
        this.volumeControl.setAttribute("style","width:"+audioLevel+"%");

    },

    /**
     * Calculate the average audio levels with the data collected so far
     * @public
     *
     * @return {Number} The average audio level measured over all the values recorded
     */
    calculateAverageAudio: function() {

        var averageAudio = Utils.averageArray(this.audioLevels);

        //Empty the array again
        this.audioLevels = [];

        //Return the average audio level
        return averageAudio;

    }

};

//Export the Browserify module
module.exports = MeasureSystem;

},{"../core/utils.js":3}],9:[function(require,module,exports){
//Because Browserify encapsulates every module, use strict won't apply to the global scope and break everything
'use strict';

var Event = require('../core/event.js'),
    Utils = require('../core/utils.js');

/**
 * Task System constructor
 *
 * @class TaskSystem
 * @classdesc A system that manages all things task related
 */
var TaskSystem = function() {

    /**
     * @property {Event} events - Holds all the events that need to be triggered within the task system
     */
    this.events = new Event();

    /**
     * @property {Array} tasks - An associative array filled with all the tasks to be executed
     */
    this.tasks = [];

    /**
     * @property {Task} currentTask - The task this system is currently executing
     */
    this.currentTask = null;

};

TaskSystem.prototype = {

    /**
     * Check whether the entity is busy or needs a new task
     * @private
     */
    run: function() {

        //Check if this entity is currently busy with his current task
        if(this.currentTask.state === 'busy'){
            return;
        }

        //There is a new task, so trigger that event
        this.events.trigger('finished');

        //Before loading new task, check audio levels on current task
        //If there are more than 5 audio levels there, make a decision if it's loud
        if(this.currentTask.measurements.audio.length >= 5) {

            var averageVolume = Utils.averageArray(this.currentTask.measurements.audio);

            if(averageVolume > 40){
                this.currentTask.isLoud = true;
            }else{
                this.currentTask.isLoud = false;
            }

        }

        //The entity is done with his current task, so he has to pick another one
        var possibleTasks = this.getPossibleTasks();

        //Pick a task to execute right now from all the available tasks
        this.currentTask = this.pickTask(possibleTasks);

        //Run the new current task!
        this.currentTask.run();

    },

    /**
     * Get a certain task from this entity
     * @public
     *
     * @param {Number} index - The number of the task that is going to be returned
     *
     * @return {Object} The task that this entity has at the specified index
     */
    getTask: function(index) {

        return this.tasks[index];

    },

    /**
     * Add a task to this entity
     * @public
     *
     * @param {Object} task - The task that is getting added to this entity
     */
    addTask: function(task) {

        //Add the task
        this.tasks.push(task);

        //Check if the entity needs to start with this task
        if(this.currentTask === null){

            this.currentTask = task;
            this.currentTask.run();

        }

    },

    /**
     * Remove a task from this entity
     * @public
     *
     * @param {Number} index - The number of the task that is going to be removed
     */
    removeTask: function(index) {

        //Remove the task
        this.task.splice(index, 1);

    },

    /**
     * Count the number of tasks and return the number
     * @public
     *
     * @returns {Number}
     */
    totalTasks: function() {

        return this.tasks.length();

    },

    /**
     * Get a list of all possible task to execute at this very moment
     * @private
     *
     * @returns {Array}
     */
    getPossibleTasks: function() {

        //The entity is done with his current task, so he has to pick another one
        var possibleTasks = [];
        var today = new Date();
        var hours = today.getHours();

        for(var i = 0; i < this.tasks.length; i++) {

            if(this.tasks[i].isLoud && hours >= 10 && hours <= 22){
                continue;
            }

            possibleTasks.push(this.tasks[i]);

        }

        return possibleTasks;

    },

    /**
     * Pick a task from a list of provided available tasks
     * @private
     *
     * @param {Array} tasks - An array with all the possible tasks to pick from
     *
     * @returns {Task}
     */
    pickTask: function (tasks) {

        //Let just assume the first task is the last task, doesn't really matter as long as we have a value to check against
        var oldestTask = tasks[0];

        //Loop through the provided tasks
        for(var i = 0; i < tasks.length; i++) {

            //If a task has never been executed before, just start with that one
            if(tasks[i].lastFinished === null){
                return tasks[i];
            }

            //If the current task is older than the current oldest task, replace it
            if(tasks[i].lastFinished < oldestTask.lastFinished){
                oldestTask = tasks[i];
            }

        }

        //Return the oldest task to execute now
        return oldestTask;

    }

};

//Export the Browserify module
module.exports = TaskSystem;

},{"../core/event.js":1,"../core/utils.js":3}],10:[function(require,module,exports){
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

},{"./task.js":11}],11:[function(require,module,exports){
//Because Browserify encapsulates every module, use strict won't apply to the global scope and break everything
'use strict';

/**
 * Task constructor
 *
 * @class Task
 * @classdesc The base class for tasks
 *
 * @param {Entity} entity - A reference to the entity that has this task
 */
var Task = function(entity) {

    /**
     * @property {String} name - The name of this status effect. This field is always required!
     */
    this.name = 'Base Task';

    /**
     * @property {String} state - The current state of this task. Can be Done, Busy, Problem, Planned
     */
    this.state = 'planned';

    /**
     * {Boolean} isLoud - Boolean if the task is loud or not
     */
    this.isLoud = null;

    /**
     * @property {Number} lastFinished - Timestamp of when the task is executed for the last time
     */
    this.lastFinished = null;

    /**
     * @property {Entity} entity - A reference to the entity that has this task
     */
    this.entity = entity;

    /**
     * @property {Object} measurements - Object which holds all measurements for the current task
     */
    this.measurements = {
        audio: []
    }

};

Task.prototype = {

    /**
     * Function that is called whenever the system updates
     * This function should be overwritten by custom tasks
     * @protected
     */
    run: function() {

        //Silence is golden

    },

    /**
     * Bootstrap and start this task
     * @protected
     */
    start: function() {

        this.state = 'busy';

    },

    /**
     * Finish this task and report results
     * @protected
     */
    finish: function() {

        //Change the state of the task
        this.state = 'done';

        //Create a timestamp for when this task is finished
        this.lastFinished = Date.now();

    }

};

//Export the Browserify module
module.exports = Task;

},{}],12:[function(require,module,exports){
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

},{"../core/utils.js":3,"./task.js":11}],13:[function(require,module,exports){
//Because Browserify encapsulates every module, use strict won't apply to the global scope and break everything
'use strict';

//Require necessary modules
// -- None yet

/**
 * World constructor
 *
 * @class World
 * @classdesc The World object holds all objects that are in the demonstration world, the map etc.
 */
var World = function() {

    /**
     * @property {THREE.Scene} scene - Reference to the scene
     */
    this.scene = null;

    /**
     * @property {THREE.PerspectiveCamera} camera - Reference to the camera
     */
    this.camera = null;

    /**
     * @property {THREE.WebGLRenderer} renderer - Reference to the renderer
     */
    this.renderer = null;

    /**
     * @property {THREE.TrackballControls} controls - Reference to the controls object
     */
    this.controls = null;

    //Initialize itself
    this.initialize();

};

World.prototype = {

    /**
     * Initialize the UI elements and add them to this container
     * @protected
     */
    initialize: function () {

        //Initialize the camera
        this.initializeCamera();

        //Initialize the mouse controls
        this.initializeControls();

        //Create the stage, add a light and a floor
        this.initializeStage();

        //Initialize the renderer and configure it
        this.initializeRenderer();

        //Add an event listener for when the user resizes his window
        window.addEventListener('resize', this.onWindowResize.bind(this), false);

    },

    /**
     * Initialize and setup the camera
     * @private
     */
    initializeCamera: function() {

        //Create a new camera object
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);

        //Configure the camera
        this.camera.position.set(120, 140, 150)

    },

    /**
     * Initialize and setup the controls
     * @private
     */
    initializeControls: function() {

        //Create a new controls object
        this.controls = new THREE.TrackballControls(this.camera);

        //Setup the controls
        this.controls.rotateSpeed = 1.0;
        this.controls.zoomSpeed = 1.2;
        this.controls.panSpeed = 1.0;
        this.controls.noZoom = false;
        this.controls.noPan = false;
        this.controls.staticMoving = true;
        this.controls.dynamicDampingFactor = 0.3;

    },

    /**
     * Initialize and setup the stage
     * @private
     */
    initializeStage: function() {

        //Create a new scene and add an ambient light
        this.scene = new THREE.Scene();

        //Create a new hemilight
        var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);

        //Configure the hemilight
        hemiLight.color.setHSL(0.6, 1, 0.6);
        hemiLight.groundColor.setHSL(0.095, 1, 0.75);
        hemiLight.position.set(0, 500, 0);

        //Add the hemilight to the stage
        this.scene.add(hemiLight);

        //Create a new directional light
        var dirLight = new THREE.DirectionalLight(0xffffff, 1);

        //Configure the directional light
        dirLight.color.setHSL(0.1, 1, 0.95);
        dirLight.position.set(-1, 1, 4);
        dirLight.position.multiplyScalar(50);

        //Add the light to the scene
        this.scene.add(dirLight);

        //Default ariable for the light
        var d = 500;

        //Configure the light
        dirLight.castShadow = true;
        dirLight.shadowMapWidth = 2048;
        dirLight.shadowMapHeight = 2048;
        dirLight.shadowCameraLeft = -d;
        dirLight.shadowCameraRight = d;
        dirLight.shadowCameraTop = d;
        dirLight.shadowCameraBottom = -d;
        dirLight.shadowCameraFar = 3500;
        dirLight.shadowBias = -0.0001;
        dirLight.shadowDarkness = 0.35;

        //Default variables for the grid
        var gridSize = 500;
        var gridStep = 20;

        //Create new geometry and material objects for the grid
        var geometry = new THREE.Geometry();
        var material = new THREE.LineBasicMaterial({color: "white"});

        //Dynamically create the grid
        for(var i = -gridSize; i <= gridSize; i += gridStep){
            geometry.vertices.push(new THREE.Vector3(-gridSize, -0.04, i));
            geometry.vertices.push(new THREE.Vector3(gridSize, -0.04, i));

            geometry.vertices.push(new THREE.Vector3(i, -0.04, -gridSize));
            geometry.vertices.push(new THREE.Vector3(i, -0.04, gridSize));
        }

        //Create the grid object and position it
        var line = new THREE.Line(geometry, material, THREE.LinePieces);
        line.position.set(-10, -10, 10);

        //Add the grid to the scene
        this.scene.add(line);

    },

    /**
     * Initialize and setup the renderer
     * @private
     */
    initializeRenderer: function() {

        //Create a new renderer object
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });

        //Configure the renderer
        this.renderer.setClearColor(0xf0f0f0);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.sortObjects = false;
        this.renderer.shadowMapEnabled = true;
        this.renderer.shadowMapType = THREE.PCFShadowMap;

        //Append the renderer to the HTML body
        document.body.appendChild(this.renderer.domElement);

    },

    /**
     * Function that is executed every time the window resizes
     * @private
     */
    onWindowResize: function() {

        //Change the camera's aspect rating and update it
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        //Change the size of the renderer to the new window size
        this.renderer.setSize(window.innerWidth, window.innerHeight);

    },

    /**
     * All the functions that need to be executed every time the system updates
     * @protected
     */
    update: function () {

        //Update the controls to match the users interaction
        this.controls.update();

        //Render the scene again
        this.renderer.render(this.scene, this.camera);

    }

};

//Export the Browserify module
module.exports = World;

},{}]},{},[7])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6L3hhbXBwL2h0ZG9jcy9tb2R1bGFyQUkvbGliL2NvcmUvZXZlbnQuanMiLCJEOi94YW1wcC9odGRvY3MvbW9kdWxhckFJL2xpYi9jb3JlL3N5c3RlbS5qcyIsIkQ6L3hhbXBwL2h0ZG9jcy9tb2R1bGFyQUkvbGliL2NvcmUvdXRpbHMuanMiLCJEOi94YW1wcC9odGRvY3MvbW9kdWxhckFJL2xpYi9lbnRpdHkvZW50aXR5LmpzIiwiRDoveGFtcHAvaHRkb2NzL21vZHVsYXJBSS9saWIvZW50aXR5L2dyb3VwLmpzIiwiRDoveGFtcHAvaHRkb2NzL21vZHVsYXJBSS9saWIvZmFjdG9yaWVzL3JvYm90ZmFjdG9yeS5qcyIsIkQ6L3hhbXBwL2h0ZG9jcy9tb2R1bGFyQUkvbGliL2luaXQuanMiLCJEOi94YW1wcC9odGRvY3MvbW9kdWxhckFJL2xpYi9zeXN0ZW1zL21lYXN1cmUuanMiLCJEOi94YW1wcC9odGRvY3MvbW9kdWxhckFJL2xpYi9zeXN0ZW1zL3Rhc2suanMiLCJEOi94YW1wcC9odGRvY3MvbW9kdWxhckFJL2xpYi90YXNrcy9tb3AuanMiLCJEOi94YW1wcC9odGRvY3MvbW9kdWxhckFJL2xpYi90YXNrcy90YXNrLmpzIiwiRDoveGFtcHAvaHRkb2NzL21vZHVsYXJBSS9saWIvdGFza3MvdmFjdXVtLmpzIiwiRDoveGFtcHAvaHRkb2NzL21vZHVsYXJBSS9saWIvd29ybGQvd29ybGQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIi8vQmVjYXVzZSBCcm93c2VyaWZ5IGVuY2Fwc3VsYXRlcyBldmVyeSBtb2R1bGUsIHVzZSBzdHJpY3Qgd29uJ3QgYXBwbHkgdG8gdGhlIGdsb2JhbCBzY29wZSBhbmQgYnJlYWsgZXZlcnl0aGluZ1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4vKipcclxuICogRXZlbnQgY29uc3RydWN0b3JcclxuICpcclxuICogSW5zcGlyZWQgYnkgdGhlIGdyZWF0IHR1dG9yaWFsIGF0OlxyXG4gKiBodHRwczovL2NvcmNvcmFuLmlvLzIwMTMvMDYvMDEvYnVpbGRpbmctYS1taW5pbWFsLWphdmFzY3JpcHQtZXZlbnQtc3lzdGVtL1xyXG4gKlxyXG4gKiBAY2xhc3MgRXZlbnRcclxuICogQGNsYXNzZGVzYyBBbiBvYmplY3QgdGhhdCBjYW4gYW5ub3VuY2UgYW5kIGxpc3RlbiBmb3IgZXZlbnRzXHJcbiAqXHJcbiAqL1xyXG52YXIgRXZlbnQgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBldmVudHMgLSBBbiBhc3NvY2lhdGl2ZSBhcnJheSB3aXRoIGFsbCB0aGUgY3VycmVudCBldmVudHNcclxuICAgICAqL1xyXG4gICAgdGhpcy5ldmVudHMgPSB7fTtcclxuXHJcbn07XHJcblxyXG5FdmVudC5wcm90b3R5cGUgPSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGdW5jdGlvbiB0aGF0IGhhbmRsZXMga2V5ZG93biBldmVudHNcclxuICAgICAqIEBwcm90ZWN0ZWRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIFRoZSB0eXBlIG9mIGV2ZW50IHRoYXQgY2FuIGJlIHRyaWdnZXJlZFxyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgZnVuY3Rpb24gdGhhdCBoYXMgdG8gYmUgcGVyZm9ybWVkIGFzIGEgY2FsbGJhY2tcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gVGhlIG9iamVjdCB0aGF0IHNob3VsZCBiZSBhY2Nlc3NpYmxlIHdoZW4gdGhlIGV2ZW50IGlzIGNhbGxlZFxyXG4gICAgICovXHJcbiAgICBvbjogZnVuY3Rpb24odHlwZSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcclxuXHJcbiAgICAgICAgLy9JZiB0aGlzLmV2ZW50cyBkb2Vzbid0IGhhdmUgdGhlIGV2ZW50IHByb3BlcnR5LCBjcmVhdGUgYW4gZW1wdHkgYXJyYXlcclxuICAgICAgICBpZighdGhpcy5ldmVudHMuaGFzT3duUHJvcGVydHkodHlwZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5ldmVudHNbdHlwZV0gPSBbXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vSW5zZXJ0IHRoZSBjYWxsYmFjayBpbnRvIHRoZSBjdXJyZW50IGV2ZW50XHJcbiAgICAgICAgdGhpcy5ldmVudHNbdHlwZV0ucHVzaChbY2FsbGJhY2ssIGNvbnRleHRdKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgd2hlbiBhbiBldmVudCBpcyB0cmlnZ2VyZWRcclxuICAgICAqIEBwcm90ZWN0ZWRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIFRoZSB0eXBlIG9mIGV2ZW50IHRoYXQgaXMgdHJpZ2dlcmVkXHJcbiAgICAgKi9cclxuICAgIHRyaWdnZXI6IGZ1bmN0aW9uKHR5cGUpIHtcclxuXHJcbiAgICAgICAgLy9CZWNhdXNlIHdlIGRvbid0IGtub3cgaG93IG1hbnkgYXJndW1lbnRzIGFyZSBiZWluZyBzZW5kIHRvXHJcbiAgICAgICAgLy90aGUgY2FsbGJhY2tzLCBsZXQncyBnZXQgdGhlbSBhbGwgZXhjZXB0IHRoZSBmaXJzdCBvbmUgKCB0aGUgdGFpbCApXHJcbiAgICAgICAgdmFyIHRhaWwgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xyXG5cclxuICAgICAgICAvL0dldCBhbGwgdGhlIGNhbGxiYWNrcyBmb3IgdGhlIGN1cnJlbnQgZXZlbnRcclxuICAgICAgICB2YXIgY2FsbGJhY2tzID0gdGhpcy5ldmVudHNbdHlwZV07XHJcblxyXG4gICAgICAgIC8vQ2hlY2sgaWYgdGhlcmUgYXJlIGNhbGxiYWNrcyBkZWZpbmVkIGZvciB0aGlzIGtleSwgaWYgbm90LCBzdG9wIVxyXG4gICAgICAgIGlmKGNhbGxiYWNrcyAhPT0gdW5kZWZpbmVkKSB7XHJcblxyXG4gICAgICAgICAgICAvL0xvb3AgdGhyb3VnaCB0aGUgY2FsbGJhY2tzIGFuZCBydW4gZWFjaCBjYWxsYmFja1xyXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9HZXQgdGhlIGN1cnJlbnQgY2FsbGJhY2sgZnVuY3Rpb25cclxuICAgICAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IGNhbGxiYWNrc1tpXVswXTtcclxuICAgICAgICAgICAgICAgIHZhciBjb250ZXh0O1xyXG5cclxuICAgICAgICAgICAgICAgIC8vR2V0IHRoZSBjdXJyZW50IGNvbnRleHQgb2JqZWN0LCBpZiBpdCBleGlzdHNcclxuICAgICAgICAgICAgICAgIGlmKGNhbGxiYWNrc1tpXVsxXSA9PT0gdW5kZWZpbmVkKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vSWYgdGhlIGNvbnRleHQgaXMgbm90IGRlZmluZWQsIHRoZSBzY29wZSBpcyBnb2luZyB0byBiZSB0aGlzICggRXZlbnQgb2JqZWN0IClcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0ID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy9HZXQgdGhlIGNvbnRleHQgb2JqZWN0XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dCA9IGNhbGxiYWNrc1tpXVsxXTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy9SdW4gdGhlIGN1cnJlbnQgY2FsbGJhY2sgYW5kIHNlbmQgdGhlIHRhaWwgYWxvbmcgd2l0aCBpdFxyXG4gICAgICAgICAgICAgICAgLy9UaGUgYXBwbHkoKSBtZXRob2QgY2FsbHMgYSBmdW5jdGlvbiB3aXRoIGEgZ2l2ZW4gdGhpcyB2YWx1ZSBhbmQgYXJndW1lbnRzIHByb3ZpZGVkIGFzIGFuIGFycmF5XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5hcHBseShjb250ZXh0LCB0YWlsKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn07XHJcblxyXG4vL0V4cG9ydCB0aGUgQnJvd3NlcmlmeSBtb2R1bGVcclxubW9kdWxlLmV4cG9ydHMgPSBFdmVudDtcclxuIiwiLy9CZWNhdXNlIEJyb3dzZXJpZnkgZW5jYXBzdWxhdGVzIGV2ZXJ5IG1vZHVsZSwgdXNlIHN0cmljdCB3b24ndCBhcHBseSB0byB0aGUgZ2xvYmFsIHNjb3BlIGFuZCBicmVhayBldmVyeXRoaW5nXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8vUmVxdWlyZSBuZWNlc3NhcnkgbW9kdWxlc1xyXG52YXIgR3JvdXAgPSByZXF1aXJlKCcuLi9lbnRpdHkvZ3JvdXAuanMnKSxcclxuICAgIFJvYm90RmFjdG9yeSA9IHJlcXVpcmUoJy4uL2ZhY3Rvcmllcy9yb2JvdGZhY3RvcnkuanMnKSxcclxuICAgIFdvcmxkID0gcmVxdWlyZSgnLi4vd29ybGQvd29ybGQuanMnKTtcclxuXHJcbi8qKlxyXG4gKiBTeXN0ZW0gQ29uc3RydWN0b3JcclxuICpcclxuICogQGNsYXNzIFN5c3RlbVxyXG4gKiBAY2xhc3NkZXNjIFRoZSBoZWFydCBvZiB0aGlzIG1vZHVsYXIgQUkhIEluIGhlcmUgd2UgcHJvdmlkZSBhY2Nlc3MgdG9cclxuICogYWxsIHRoZSBvdGhlciBvYmplY3RzIGFuZCBmdW5jdGlvbiwgYW5kIHdlIGhhbmRsZSB0aGUgc3RhcnR1cCBvZiB0aGUgc3lzdGVtXHJcbiAqXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSB1c2VyU2V0dGluZ3MgLSBUaGUgc2V0dGluZ3MgdGhhdCB0aGUgdXNlciBwcm92aWRlc1xyXG4gKi9cclxudmFyIFN5c3RlbSA9IGZ1bmN0aW9uKHVzZXJTZXR0aW5ncykge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtCb29sZWFufSBpc0luaXRpYWxpemVkIC0gVHJ1ZSB3aGVuIHRoZSBzeXN0ZW0gaXMgZnVsbHkgaW5pdGlhbGl6ZWRcclxuICAgICAqL1xyXG4gICAgdGhpcy5pc0luaXRpYWxpemVkID0gZmFsc2U7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcGVydHkge0dyb3VwfSBlbnRpdGllcyAtIEFsbCB0aGUgZW50aXRpZXMgY29udHJvbGxlZCBieSB0aGlzIHN5c3RlbVxyXG4gICAgICovXHJcbiAgICB0aGlzLmVudGl0aWVzID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wZXJ0eSB7V29ybGR9IHdvcmxkIC0gVGhlIHdvcmxkIGZvciBkZW1vbnN0cmF0aW5nIHB1cnBvc2VzXHJcbiAgICAgKi9cclxuICAgIHRoaXMud29ybGQgPSBudWxsO1xyXG5cclxuICAgIC8vTG9hZCBhbmQgdGhlbiBpbml0aWFsaXplIGl0c2VsZlxyXG4gICAgdGhpcy5pbml0aWFsaXplKCk7XHJcblxyXG59O1xyXG5cclxuU3lzdGVtLnByb3RvdHlwZSA9IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgdGhlIHN5c3RlbVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIC8vQ2hlY2sgaWYgdGhlIGdhbWUgaXMgYWxyZWFkeSBpbml0aWFsaXplZFxyXG4gICAgICAgIGlmKHRoaXMuaXNJbml0aWFsaXplZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL0NyZWF0ZSBhIG5ldyBncm91cCB0aGF0IHdpbGwgaG9sZCBhbGwgZW50aXRpZXNcclxuICAgICAgICB0aGlzLmVudGl0aWVzID0gbmV3IEdyb3VwKCk7XHJcblxyXG4gICAgICAgIC8vQ3JlYXRlIHRoZSB3b3JsZCBvYmplY3RcclxuICAgICAgICB0aGlzLndvcmxkID0gbmV3IFdvcmxkKCk7XHJcblxyXG4gICAgICAgIC8vQ3JlYXRlIGEgbmV3IGVudGl0eSBhbmQgYWRkIGl0IHRvIHRoZSBncm91cFxyXG4gICAgICAgIHZhciBmaXJzdFJvYm90ID0gUm9ib3RGYWN0b3J5LmRlZmF1bHRSb2JvdCgpO1xyXG5cclxuICAgICAgICAvL0FkZCB0aGUgZW50aXR5IHRvIHRoZSBncm91cCBvZiBhbGwgZW50aXRpZXNcclxuICAgICAgICB0aGlzLmVudGl0aWVzLmFkZEVudGl0eShmaXJzdFJvYm90KTtcclxuXHJcbiAgICAgICAgLy9BZGQgdGhlIGN1YmUgdG8gdGhlIHNjZW5lXHJcbiAgICAgICAgdGhpcy53b3JsZC5zY2VuZS5hZGQoZmlyc3RSb2JvdC5tZXNoKTtcclxuXHJcbiAgICAgICAgLy9VcGRhdGUgdGhlIHN5c3RlbSBmb3IgdGhlIGZpcnN0IHRpbWVcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG5cclxuICAgICAgICAvL1RoZSBzeXN0ZW0gaXMgZnVsbHkgaW5pdGlhbGl6ZWRcclxuICAgICAgICB0aGlzLmlzSW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBbGwgdGhlIGZ1bmN0aW9ucyB0aGF0IG5lZWQgdG8gYmUgZXhlY3V0ZWQgZXZlcnkgdGltZSB0aGUgc3lzdGVtIHVwZGF0ZXNcclxuICAgICAqIEJhc2ljYWxseSBhIGdhbWUgbG9vcFxyXG4gICAgICogQHByb3RlY3RlZFxyXG4gICAgICovXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAvL1JlcXVlc3QgYSBuZXcgYW5pbWF0aW9uIGZyYW1lIGFuZCBjYWxsIHRoZSB1cGRhdGUgZnVuY3Rpb24gYWdhaW5cclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy51cGRhdGUuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIC8vR2V0IGFsbCBlbnRpdGllcyBpbiB0aGUgc3lzdGVtXHJcbiAgICAgICAgdmFyIGVudGl0aWVzID0gdGhpcy5lbnRpdGllcy5nZXRFbnRpdGllcygpO1xyXG5cclxuICAgICAgICAvL0xvb3AgdGhyb3VnaCBhbGwgdGhlIGVudGl0aWVzXHJcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGVudGl0aWVzLmxlbmd0aDsgaSsrKXtcclxuXHJcbiAgICAgICAgICAgIC8vRXhlY3V0ZSB0aGUgcnVuIGNvbW1hbmQgZm9yIGVhY2ggZW50aXR5IHNvIGl0IHdpbGwgc3RhcnQgYWN0aW5nXHJcbiAgICAgICAgICAgIGVudGl0aWVzW2ldLnJ1bigpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vVXBkYXRlIHRoZSBkZW1vbnN0cmF0aW9uIHdvcmxkXHJcbiAgICAgICAgdGhpcy53b3JsZC51cGRhdGUoKTtcclxuXHJcbiAgICB9XHJcblxyXG59O1xyXG5cclxuLy9FeHBvcnQgdGhlIEJyb3dzZXJpZnkgbW9kdWxlXHJcbm1vZHVsZS5leHBvcnRzID0gU3lzdGVtO1xyXG4iLCIvL0JlY2F1c2UgQnJvd3NlcmlmeSBlbmNhcHN1bGF0ZXMgZXZlcnkgbW9kdWxlLCB1c2Ugc3RyaWN0IHdvbid0IGFwcGx5IHRvIHRoZSBnbG9iYWwgc2NvcGUgYW5kIGJyZWFrIGV2ZXJ5dGhpbmdcclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuLyoqXHJcbiAqIFN0YXRpYyBVdGlsaXRpZXMgQ2xhc3NcclxuICpcclxuICogQGNsYXNzIFV0aWxzXHJcbiAqIEBjbGFzc2Rlc2MgSW4gdGhpcyBjbGFzcyBhcmUgdGhlIGZ1bmN0aW9ucyBzdG9yZWQgdGhhdCBhcmUgYmVpbmdcclxuICogdXNlZCBpbiBvdGhlciBmdW5jdGlvbnNcclxuICovXHJcbnZhciBVdGlscyA9IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEZ1bmN0aW9uIHRvIGdlbmVyYXRlIGEgcmFuZG9tIG51bWJlciBiZXR3ZWVuIHR3byB2YWx1ZXNcclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZnJvbSAtIFRoZSBtaW5pbXVtIG51bWJlclxyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHRvIC0gVGhlIG1heGltdW0gbnVtYmVyXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBBIHJhbmRvbSBudW1iZXIgYmV0d2VlbiB0aGUgdHdvIHN1cHBsaWVkIHZhbHVlc1xyXG4gICAgICovXHJcbiAgICByYW5kb21OdW1iZXI6IGZ1bmN0aW9uKGZyb20sIHRvKSB7XHJcblxyXG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAodG8gLSBmcm9tICsgMSkgKyBmcm9tKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRnVuY3Rpb24gdG8gZ2VuZXJhdGUgYSByYW5kb20gbnVtYmVyIGJldHdlZW4gdHdvIHZhbHVlcyBhbmQgaW4gY2VydGFpbiBzdGVwc1xyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBmcm9tIC0gVGhlIG1pbmltdW0gbnVtYmVyXHJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdG8gLSBUaGUgbWF4aW11bSBudW1iZXJcclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzdGVwcyAtIFRoZSBzdGVwcyBpbiB3aGljaCB0aGUgcmFuZG9tIG51bWJlcnMgd2lsbCBnb1xyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4ge051bWJlcn0gQSByYW5kb20gbnVtYmVyIGJldHdlZW4gdGhlIHR3byBzdXBwbGllZCB2YWx1ZXNcclxuICAgICAqL1xyXG4gICAgcmFuZG9tTnVtYmVyU3RlcHM6IGZ1bmN0aW9uKGZyb20sIHRvLCBzdGVwcykge1xyXG5cclxuICAgICAgICByZXR1cm4gZnJvbSArIChzdGVwcyAqIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICh0byAtIGZyb20pIC8gc3RlcHMpKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2FsY3VsYXRlIHRoZSBhdmVyYWdlIGZyb20gYWxsIHZhbHVlcyBpbiBhbiBhcnJheVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IC0gVGhlIGFycmF5IGJlaW5nIHVzZWQgZm9yIGF2ZXJhZ2UgY2FsY3VsYXRpb25zXHJcbiAgICAgKiBAcmV0dXJucyB7TnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBhdmVyYWdlQXJyYXk6IGZ1bmN0aW9uKGFycmF5KSB7XHJcblxyXG4gICAgICAgIHZhciBzdW0gPSAwO1xyXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIHN1bSArPSBwYXJzZUludChhcnJheVtpXSwgMTApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN1bSAvIGFycmF5Lmxlbmd0aDtcclxuXHJcbiAgICB9XHJcblxyXG59O1xyXG5cclxuLy9FeHBvcnQgdGhlIEJyb3dzZXJpZnkgbW9kdWxlXHJcbm1vZHVsZS5leHBvcnRzID0gVXRpbHM7XHJcbiIsIi8vQmVjYXVzZSBCcm93c2VyaWZ5IGVuY2Fwc3VsYXRlcyBldmVyeSBtb2R1bGUsIHVzZSBzdHJpY3Qgd29uJ3QgYXBwbHkgdG8gdGhlIGdsb2JhbCBzY29wZSBhbmQgYnJlYWsgZXZlcnl0aGluZ1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG52YXIgVGFza1N5c3RlbSA9IHJlcXVpcmUoJy4uL3N5c3RlbXMvdGFzay5qcycpLFxyXG4gICAgTWVhc3VyZVN5c3RlbSA9IHJlcXVpcmUoJy4uL3N5c3RlbXMvbWVhc3VyZS5qcycpO1xyXG5cclxuLyoqXHJcbiAqIEVudGl0eSBjb25zdHJ1Y3RvclxyXG4gKlxyXG4gKiBAY2xhc3MgRW50aXR5XHJcbiAqIEBjbGFzc2Rlc2MgQSBzaW5nbGUgZW50aXR5IHRoYXQgaGFzIGNlcnRhaW4gYmVoYXZpb3VyIHRvIGJlIGV4ZWN1dGVkXHJcbiAqXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gVGhlIG5hbWUgb2YgdGhpcyBlbnRpdHlcclxuICovXHJcbnZhciBFbnRpdHkgPSBmdW5jdGlvbihuYW1lKSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gbmFtZSAtIFRoZSBuYW1lIG9mIHRoaXMgZW50aXR5XHJcbiAgICAgKi9cclxuICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5fSBzeXN0ZW1zIC0gQW4gYXNzb2NpYXRpdmUgYXJyYXkgZmlsbGVkIHdpdGggYWxsIHRoZSBzeXN0ZW1zIHRoYXQgbmVlZCB0byBiZSBjYWxsZWQgZXZlcnkgc3RlcFxyXG4gICAgICovXHJcbiAgICB0aGlzLnN5c3RlbXMgPSB7fTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wZXJ0eSB7VEhSRUUuTWVzaH0gbWVzaCAtIFRoZSAzRCBtb2RlbCBtZXNoXHJcbiAgICAgKi9cclxuICAgIHRoaXMubWVzaCA9IG51bGw7XHJcblxyXG4gICAgLy9Jbml0aWFsaXplIGl0c2VsZlxyXG4gICAgdGhpcy5pbml0aWFsaXplKCk7XHJcblxyXG59O1xyXG5cclxuRW50aXR5LnByb3RvdHlwZSA9IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgdGhlIGVudGl0eSwgY3JlYXRlIG5ldyBvYmplY3RzIGFuZCBhcHBseSBzZXR0aW5nc1xyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIC8vQWRkIHN5c3RlbXNcclxuICAgICAgICB0aGlzLnN5c3RlbXNbJ3Rhc2snXSA9IG5ldyBUYXNrU3lzdGVtKCk7XHJcbiAgICAgICAgdGhpcy5zeXN0ZW1zWydtZWFzdXJlJ10gPSBuZXcgTWVhc3VyZVN5c3RlbSh0aGlzKTtcclxuXHJcbiAgICAgICAgLy9Db25maWd1cmUgc3lzdGVtc1xyXG4gICAgICAgIHRoaXMuc3lzdGVtc1sndGFzayddLmV2ZW50cy5vbignZmluaXNoZWQnLCB0aGlzLmZpbmlzaGVkVGFzay5iaW5kKHRoaXMpLCB0aGlzKTtcclxuXHJcbiAgICAgICAgLy9DcmVhdGUgdGhlIFRocmVlLmpzIHNoYXBlIGZvciB0aGUgZGVtb25zdHJhdGlvbiB3b3JsZFxyXG4gICAgICAgIHRoaXMuY3JlYXRlTWVzaCgpO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgdGhlIFRIUkVFLmpzIG1lc2ggYW5kIHN0b3JlIGl0IGluIHRoaXMgb2JqZWN0XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBjcmVhdGVNZXNoOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgLy9DcmVhdGUgYSByZXVzYWJsZSBnZW9tZXRyeSBvYmplY3QgZm9yIGEgY3ViZVxyXG4gICAgICAgIHZhciBnZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSgyMCwgMjAsIDIwKTtcclxuXHJcbiAgICAgICAgLy9DcmVhdGUgdGhlIG5ldyBjdWJlIG9iamVjdCB3aXRoIHRoZSBnZW9tZXRyeVxyXG4gICAgICAgIHRoaXMubWVzaCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7Y29sb3I6IE1hdGgucmFuZG9tKCkgKiAweGZmZmZmZn0pKTtcclxuXHJcbiAgICAgICAgLy9Qb3NpdGlvbiB0aGUgY3ViZVxyXG4gICAgICAgIHRoaXMubWVzaC5wb3NpdGlvbi5zZXQoMCwgMCAsMCk7XHJcblxyXG4gICAgICAgIC8vQ29uZmlndXJlIHRoZSBjdWJlXHJcbiAgICAgICAgdGhpcy5tZXNoLmNhc3RTaGFkb3cgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMubWVzaC5yZWNlaXZlU2hhZG93ID0gdHJ1ZTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRXhlY3V0ZSBhbGwgdGhlIHN5c3RlbXMgb24gdGhpcyBlbnRpdHkgZXZlcnkgc3RlcCBvZiB0aGUgbG9vcFxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICovXHJcbiAgICBydW46IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICBmb3IodmFyIHN5c3RlbSBpbiB0aGlzLnN5c3RlbXMpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3lzdGVtcy5oYXNPd25Qcm9wZXJ0eShzeXN0ZW0pKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN5c3RlbXNbc3lzdGVtXS5ydW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2FsbGJhY2sgZnVuY3Rpb24gZm9yIHdoZW5ldmVyIHRoZSBhIHRhc2sgaW4gdGhlIHRhc2sgc3lzdGVtIGlzIGZpbmlzaGVkXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBmaW5pc2hlZFRhc2s6IGZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICAgIC8vR2V0IHRoZSBhdmVyYWdlIGF1ZGlvIGxldmVscyBmcm9tIHRoZSBtZWFzdXJlIHN5c3RlbVxyXG4gICAgICAgIHZhciBhdmVyYWdlQXVkaW8gPSB0aGlzLnN5c3RlbXNbJ21lYXN1cmUnXS5jYWxjdWxhdGVBdmVyYWdlQXVkaW8oKTtcclxuXHJcbiAgICAgICAgLy9QdXNoIHRoZSBhdmVyYWdlIGF1ZGlvIGxldmVsIGludG8gdGhlIG1lYXN1cmVtZW50cyBhcnJheSBpbiB0aGUgY3VycmVudCB0YXNrXHJcbiAgICAgICAgdGhpcy5zeXN0ZW1zWyd0YXNrJ10uY3VycmVudFRhc2subWVhc3VyZW1lbnRzLmF1ZGlvLnB1c2goYXZlcmFnZUF1ZGlvKTtcclxuXHJcbiAgICB9XHJcblxyXG59O1xyXG5cclxuLy9FeHBvcnQgdGhlIEJyb3dzZXJpZnkgbW9kdWxlXHJcbm1vZHVsZS5leHBvcnRzID0gRW50aXR5O1xyXG4iLCIvL0JlY2F1c2UgQnJvd3NlcmlmeSBlbmNhcHN1bGF0ZXMgZXZlcnkgbW9kdWxlLCB1c2Ugc3RyaWN0IHdvbid0IGFwcGx5IHRvIHRoZSBnbG9iYWwgc2NvcGUgYW5kIGJyZWFrIGV2ZXJ5dGhpbmdcclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy9SZXF1aXJlIG5lY2Vzc2FyeSBtb2R1bGVzXHJcbnZhciBFbnRpdHkgPSByZXF1aXJlKCcuL2VudGl0eS5qcycpO1xyXG5cclxuLyoqXHJcbiAqIEdyb3VwIGNvbnN0cnVjdG9yXHJcbiAqXHJcbiAqIEBjbGFzcyBHcm91cFxyXG4gKiBAY2xhc3NkZXNjIFRoZSBvYmplY3QgdGhhdCBob2xkcyBtdWx0aXBsZSBlbnRpdGllc1xyXG4gKi9cclxudmFyIEdyb3VwID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5fSBlbnRpdGllcyAtIENvbGxlY3Rpb24gb2YgYWxsIHRoZSBlbnRpdGllcyBpbiB0aGlzIGdyb3VwXHJcbiAgICAgKi9cclxuICAgIHRoaXMuZW50aXRpZXMgPSBbXTtcclxuXHJcbn07XHJcblxyXG5Hcm91cC5wcm90b3R5cGUgPSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGdW5jdGlvbiB0byBhZGQgYSBuZXcgZW50aXR5IHRvIHRoaXMgZ3JvdXBcclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0VudGl0eX0gZW50aXR5IC0gQSByZWZlcmVuY2UgdG8gZW50aXR5IGJlaW5nIGFkZGVkXHJcbiAgICAgKi9cclxuICAgIGFkZEVudGl0eTogZnVuY3Rpb24oZW50aXR5KSB7XHJcblxyXG4gICAgICAgIC8vQ2hlY2sgaWYgdGhlIGVudGl0eSBpcyB0aGUgY29ycmVjdCBvYmplY3RcclxuICAgICAgICBpZighZW50aXR5IGluc3RhbmNlb2YgRW50aXR5KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vQWRkIHRoZSBjdXJyZW50IGVudGl0eSB0byB0aGUgbGlzdFxyXG4gICAgICAgIHRoaXMuZW50aXRpZXMucHVzaChlbnRpdHkpO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGdW5jdGlvbiB0byByZW1vdmUgYW4gZW50aXR5IGZyb20gdGhpcyBncm91cFxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7RW50aXR5fSBlbnRpdHkgLSBBIHJlZmVyZW5jZSB0byBlbnRpdHkgYmVpbmcgcmVtb3ZlZFxyXG4gICAgICovXHJcbiAgICByZW1vdmVFbnRpdHk6IGZ1bmN0aW9uKGVudGl0eSkge1xyXG5cclxuICAgICAgICAvL0NoZWNrIGlmIHRoZSBlbnRpdHkgZXhpc3RzLCBpZiBub3QsIHdlIGRvbid0IGhhdmUgdG8gZGVsZXRlIGl0XHJcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5lbnRpdGllcy5pbmRleE9mKGVudGl0eSk7XHJcblxyXG4gICAgICAgIC8vVGhlIGVsZW1lbnQgZG9lc24ndCBleGlzdCBpbiB0aGUgbGlzdFxyXG4gICAgICAgIGlmKGluZGV4ID09PSAtMSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL1JlbW92ZSB0aGUgY3VycmVudCBlbnRpdHkgZnJvbSB0aGUgZ3JvdXBcclxuICAgICAgICB0aGlzLmVudGl0aWVzLnNwbGljZShpbmRleCwgMSk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBhbGwgZW50aXRpZXMgc3RvcmVkIGluIHRoaXMgZ3JvdXBcclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IC0gQWxsIGVudGl0aWVzIHN0b3JlZCBpbiB0aGlzIGdyb3VwXHJcbiAgICAgKi9cclxuICAgIGdldEVudGl0aWVzOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZW50aXRpZXM7XHJcblxyXG4gICAgfVxyXG5cclxufTtcclxuXHJcbi8vRXhwb3J0IHRoZSBCcm93c2VyaWZ5IG1vZHVsZVxyXG5tb2R1bGUuZXhwb3J0cyA9IEdyb3VwO1xyXG4iLCIvL0JlY2F1c2UgQnJvd3NlcmlmeSBlbmNhcHN1bGF0ZXMgZXZlcnkgbW9kdWxlLCB1c2Ugc3RyaWN0IHdvbid0IGFwcGx5IHRvIHRoZSBnbG9iYWwgc2NvcGUgYW5kIGJyZWFrIGV2ZXJ5dGhpbmdcclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy9SZXF1aXJlIG5lY2Vzc2FyeSBtb2R1bGVzXHJcbnZhciBFbnRpdHkgPSByZXF1aXJlKCcuLi9lbnRpdHkvZW50aXR5LmpzJyksXHJcbiAgICBWYWN1dW0gPSByZXF1aXJlKCcuLi90YXNrcy92YWN1dW0uanMnKSxcclxuICAgIE1vcCA9IHJlcXVpcmUoJy4uL3Rhc2tzL21vcC5qcycpO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBSb2JvdEZhY3RvcnlcclxuICogQGNsYXNzZGVzYyBBIGZhY3RvcnkgdGhhdCByZXR1cm5zIHByZSBtYWRlIHJvYm90cyB3aXRoXHJcbiAqIGEgc2V0IG9mIHRhc2tzXHJcbiAqL1xyXG52YXIgUm9ib3RGYWN0b3J5ID0ge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgbmV3IGRlZmF1bHQgcm9ib3RcclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHtFbnRpdHl9IEFuIGRlZmF1bHQgcm9ib3Qgd2l0aCBhbGwgYXZhaWxhYmxlIHRhc2tzXHJcbiAgICAgKi9cclxuICAgIGRlZmF1bHRSb2JvdDogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIC8vQ3JlYXRlIHRoZSBuZXcgRW50aXR5IG9iamVjdFxyXG4gICAgICAgIHZhciBlbnRpdHkgPSBuZXcgRW50aXR5KCdEZWZhdWx0Jyk7XHJcblxyXG4gICAgICAgIC8vQWRkIHRoZSBhdmFpbGFibGUgdGFza3NcclxuICAgICAgICBlbnRpdHkuc3lzdGVtc1sndGFzayddLmFkZFRhc2sobmV3IFZhY3V1bShlbnRpdHkpKTtcclxuICAgICAgICBlbnRpdHkuc3lzdGVtc1sndGFzayddLmFkZFRhc2sobmV3IE1vcChlbnRpdHkpKTtcclxuXHJcbiAgICAgICAgLy9SZXR1cm4gdGhlIGVudGl0eVxyXG4gICAgICAgIHJldHVybiBlbnRpdHk7XHJcblxyXG4gICAgfVxyXG5cclxufTtcclxuXHJcbi8vRXhwb3J0IHRoZSBCcm93c2VyaWZ5IG1vZHVsZVxyXG5tb2R1bGUuZXhwb3J0cyA9IFJvYm90RmFjdG9yeTtcclxuIiwiLy9CZWNhdXNlIEJyb3dzZXJpZnkgZW5jYXBzdWxhdGVzIGV2ZXJ5IG1vZHVsZSwgdXNlIHN0cmljdCB3b24ndCBhcHBseSB0byB0aGUgZ2xvYmFsIHNjb3BlIGFuZCBicmVhayBldmVyeXRoaW5nXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8vUmVxdWlyZSBuZWNlc3NhcnkgbW9kdWxlc1xyXG52YXIgU3lzdGVtID0gcmVxdWlyZSgnLi9jb3JlL3N5c3RlbS5qcycpO1xyXG5cclxuLy9UaGUgaW5pdGlhbGl6ZSBNb2R1bGVcclxudmFyIEludGlhbGl6ZSA9IGZ1bmN0aW9uIGluaXRpYWxpemVTeXN0ZW0oKSB7XHJcblxyXG4gICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgLy9FbXB0eSBmb3Igbm93XHJcbiAgICB9O1xyXG5cclxuICAgIC8vQ3JlYXRlIGEgbmV3IHN5c3RlbVxyXG4gICAgdmFyIHN5c3RlbSA9IG5ldyBTeXN0ZW0ob3B0aW9ucyk7XHJcblxyXG59O1xyXG5cclxuLy8gc2hpbSBsYXllciB3aXRoIHNldFRpbWVvdXQgZmFsbGJhY2tcclxud2luZG93LnJlcXVlc3RBbmltRnJhbWUgPSAoZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxyXG4gICAgICAgIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgICB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgICAgZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoY2FsbGJhY2ssIDEwMDAgLyA2MCk7XHJcbiAgICAgICAgfTtcclxufSkoKTtcclxuXHJcbi8vSW5pdGlhbGl6ZSB3aGVuIGZ1bGx5IGxvYWRlZFxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgSW50aWFsaXplKTtcclxuXHJcbi8vRXhwb3J0IHRoZSBCcm93c2VyaWZ5IG1vZHVsZVxyXG5tb2R1bGUuZXhwb3J0cyA9IEludGlhbGl6ZTtcclxuIiwiLy9CZWNhdXNlIEJyb3dzZXJpZnkgZW5jYXBzdWxhdGVzIGV2ZXJ5IG1vZHVsZSwgdXNlIHN0cmljdCB3b24ndCBhcHBseSB0byB0aGUgZ2xvYmFsIHNjb3BlIGFuZCBicmVhayBldmVyeXRoaW5nXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBVdGlscyA9IHJlcXVpcmUoJy4uL2NvcmUvdXRpbHMuanMnKTtcclxuXHJcbi8qKlxyXG4gKiBNZWFzdXJlbWVudCBTeXN0ZW0gY29uc3RydWN0b3JcclxuICpcclxuICogQGNsYXNzIE1lYXN1cmVTeXN0ZW1cclxuICogQGNsYXNzZGVzYyBBIHN5c3RlbSB0aGF0IG1hbmFnZXMgYWxsIHRoaW5ncyBtZWFzdXJlbWVudCByZWxhdGVkXHJcbiAqXHJcbiAqIEBwYXJhbSB7RW50aXR5fSBlbnRpdHkgLSBBIHJlZmVyZW5jZSB0byB0aGUgZW50aXR5IHRoYXQgb3ducyB0aGlzIHN5c3RlbVxyXG4gKi9cclxudmFyIE1lYXN1cmVTeXN0ZW0gPSBmdW5jdGlvbihlbnRpdHkpIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wZXJ0eSB7RW50aXR5fSBlbnRpdHkgLSBBIHJlZmVyZW5jZSB0byB0aGUgZW50aXR5IHRoYXQgb3ducyB0aGlzIHN5c3RlbVxyXG4gICAgICovXHJcbiAgICB0aGlzLmVudGl0eSA9IGVudGl0eTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXl9IGF1ZGlvTGV2ZWxzIC0gQW4gYXJyYXkgd2hpY2ggaG9sZHMgYWxsIHRoZSBhdWRpbyBsZXZlbHMgc3RpbGwgYmVpbmcgbWVhc3VyZWRcclxuICAgICAqL1xyXG4gICAgdGhpcy5hdWRpb0xldmVscyA9IFtdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtPYmplY3R9IHZvbHVtZUNvbnRyb2wgLSBUaGUgVm9sdW1lQ29udHJvbCBzbGlkZXJcclxuICAgICAqL1xyXG4gICAgdGhpcy52b2x1bWVDb250cm9sID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZvbHVtZUNvbnRyb2wnKTtcclxuXHJcbn07XHJcblxyXG5NZWFzdXJlU3lzdGVtLnByb3RvdHlwZSA9IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIHdoZXRoZXIgdGhlIGVudGl0eSBpcyBidXN5IG9yIG5lZWRzIGEgbmV3IHRhc2tcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIHJ1bjogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHRoaXMubWVhc3VyZUF1ZGlvKCk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEZ1bmN0aW9uIHRvIG1lYXN1cmUgYXVkaW8gbGV2ZWxzIGZyb20gdGhlIG5vaXNlL2F1ZGlvIHNlbnNvclxyXG4gICAgICogTm93IGZha2luZyBkYXRhIGZvciBkZW1vbnN0cmF0aW9uIHB1cnBvc2VzXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBtZWFzdXJlQXVkaW86IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgYXVkaW9MZXZlbCA9IDA7XHJcblxyXG4gICAgICAgIC8vSWYgdGhlIGN1cnJlbnQgdGFzayBpcyB2YWN1dW1pbmcsIG1ha2UgYSBsb3Qgb2Ygbm9pc2UhXHJcbiAgICAgICAgaWYodGhpcy5lbnRpdHkuc3lzdGVtc1sndGFzayddLmN1cnJlbnRUYXNrLm5hbWUgPT09ICdWYWN1dW0nKXtcclxuXHJcbiAgICAgICAgICAgIGF1ZGlvTGV2ZWwgPSA3MDtcclxuXHJcbiAgICAgICAgfWVsc2V7XHJcblxyXG4gICAgICAgICAgICAvL0xpdHRsZSB0byBubyBub2lzZVxyXG4gICAgICAgICAgICBhdWRpb0xldmVsID0gMTA7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9QdXNoIHRoZSB2YWx1ZSBpbiB0aGUgYXJyYXlcclxuICAgICAgICB0aGlzLmF1ZGlvTGV2ZWxzLnB1c2goYXVkaW9MZXZlbCk7XHJcblxyXG4gICAgICAgIC8vVXBkYXRlIHRoZSBVSVxyXG4gICAgICAgIHRoaXMudm9sdW1lQ29udHJvbC5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLFwid2lkdGg6XCIrYXVkaW9MZXZlbCtcIiVcIik7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIENhbGN1bGF0ZSB0aGUgYXZlcmFnZSBhdWRpbyBsZXZlbHMgd2l0aCB0aGUgZGF0YSBjb2xsZWN0ZWQgc28gZmFyXHJcbiAgICAgKiBAcHVibGljXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBUaGUgYXZlcmFnZSBhdWRpbyBsZXZlbCBtZWFzdXJlZCBvdmVyIGFsbCB0aGUgdmFsdWVzIHJlY29yZGVkXHJcbiAgICAgKi9cclxuICAgIGNhbGN1bGF0ZUF2ZXJhZ2VBdWRpbzogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBhdmVyYWdlQXVkaW8gPSBVdGlscy5hdmVyYWdlQXJyYXkodGhpcy5hdWRpb0xldmVscyk7XHJcblxyXG4gICAgICAgIC8vRW1wdHkgdGhlIGFycmF5IGFnYWluXHJcbiAgICAgICAgdGhpcy5hdWRpb0xldmVscyA9IFtdO1xyXG5cclxuICAgICAgICAvL1JldHVybiB0aGUgYXZlcmFnZSBhdWRpbyBsZXZlbFxyXG4gICAgICAgIHJldHVybiBhdmVyYWdlQXVkaW87XHJcblxyXG4gICAgfVxyXG5cclxufTtcclxuXHJcbi8vRXhwb3J0IHRoZSBCcm93c2VyaWZ5IG1vZHVsZVxyXG5tb2R1bGUuZXhwb3J0cyA9IE1lYXN1cmVTeXN0ZW07XHJcbiIsIi8vQmVjYXVzZSBCcm93c2VyaWZ5IGVuY2Fwc3VsYXRlcyBldmVyeSBtb2R1bGUsIHVzZSBzdHJpY3Qgd29uJ3QgYXBwbHkgdG8gdGhlIGdsb2JhbCBzY29wZSBhbmQgYnJlYWsgZXZlcnl0aGluZ1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG52YXIgRXZlbnQgPSByZXF1aXJlKCcuLi9jb3JlL2V2ZW50LmpzJyksXHJcbiAgICBVdGlscyA9IHJlcXVpcmUoJy4uL2NvcmUvdXRpbHMuanMnKTtcclxuXHJcbi8qKlxyXG4gKiBUYXNrIFN5c3RlbSBjb25zdHJ1Y3RvclxyXG4gKlxyXG4gKiBAY2xhc3MgVGFza1N5c3RlbVxyXG4gKiBAY2xhc3NkZXNjIEEgc3lzdGVtIHRoYXQgbWFuYWdlcyBhbGwgdGhpbmdzIHRhc2sgcmVsYXRlZFxyXG4gKi9cclxudmFyIFRhc2tTeXN0ZW0gPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wZXJ0eSB7RXZlbnR9IGV2ZW50cyAtIEhvbGRzIGFsbCB0aGUgZXZlbnRzIHRoYXQgbmVlZCB0byBiZSB0cmlnZ2VyZWQgd2l0aGluIHRoZSB0YXNrIHN5c3RlbVxyXG4gICAgICovXHJcbiAgICB0aGlzLmV2ZW50cyA9IG5ldyBFdmVudCgpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheX0gdGFza3MgLSBBbiBhc3NvY2lhdGl2ZSBhcnJheSBmaWxsZWQgd2l0aCBhbGwgdGhlIHRhc2tzIHRvIGJlIGV4ZWN1dGVkXHJcbiAgICAgKi9cclxuICAgIHRoaXMudGFza3MgPSBbXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wZXJ0eSB7VGFza30gY3VycmVudFRhc2sgLSBUaGUgdGFzayB0aGlzIHN5c3RlbSBpcyBjdXJyZW50bHkgZXhlY3V0aW5nXHJcbiAgICAgKi9cclxuICAgIHRoaXMuY3VycmVudFRhc2sgPSBudWxsO1xyXG5cclxufTtcclxuXHJcblRhc2tTeXN0ZW0ucHJvdG90eXBlID0ge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2sgd2hldGhlciB0aGUgZW50aXR5IGlzIGJ1c3kgb3IgbmVlZHMgYSBuZXcgdGFza1xyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgcnVuOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgLy9DaGVjayBpZiB0aGlzIGVudGl0eSBpcyBjdXJyZW50bHkgYnVzeSB3aXRoIGhpcyBjdXJyZW50IHRhc2tcclxuICAgICAgICBpZih0aGlzLmN1cnJlbnRUYXNrLnN0YXRlID09PSAnYnVzeScpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL1RoZXJlIGlzIGEgbmV3IHRhc2ssIHNvIHRyaWdnZXIgdGhhdCBldmVudFxyXG4gICAgICAgIHRoaXMuZXZlbnRzLnRyaWdnZXIoJ2ZpbmlzaGVkJyk7XHJcblxyXG4gICAgICAgIC8vQmVmb3JlIGxvYWRpbmcgbmV3IHRhc2ssIGNoZWNrIGF1ZGlvIGxldmVscyBvbiBjdXJyZW50IHRhc2tcclxuICAgICAgICAvL0lmIHRoZXJlIGFyZSBtb3JlIHRoYW4gNSBhdWRpbyBsZXZlbHMgdGhlcmUsIG1ha2UgYSBkZWNpc2lvbiBpZiBpdCdzIGxvdWRcclxuICAgICAgICBpZih0aGlzLmN1cnJlbnRUYXNrLm1lYXN1cmVtZW50cy5hdWRpby5sZW5ndGggPj0gNSkge1xyXG5cclxuICAgICAgICAgICAgdmFyIGF2ZXJhZ2VWb2x1bWUgPSBVdGlscy5hdmVyYWdlQXJyYXkodGhpcy5jdXJyZW50VGFzay5tZWFzdXJlbWVudHMuYXVkaW8pO1xyXG5cclxuICAgICAgICAgICAgaWYoYXZlcmFnZVZvbHVtZSA+IDQwKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFRhc2suaXNMb3VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRUYXNrLmlzTG91ZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9UaGUgZW50aXR5IGlzIGRvbmUgd2l0aCBoaXMgY3VycmVudCB0YXNrLCBzbyBoZSBoYXMgdG8gcGljayBhbm90aGVyIG9uZVxyXG4gICAgICAgIHZhciBwb3NzaWJsZVRhc2tzID0gdGhpcy5nZXRQb3NzaWJsZVRhc2tzKCk7XHJcblxyXG4gICAgICAgIC8vUGljayBhIHRhc2sgdG8gZXhlY3V0ZSByaWdodCBub3cgZnJvbSBhbGwgdGhlIGF2YWlsYWJsZSB0YXNrc1xyXG4gICAgICAgIHRoaXMuY3VycmVudFRhc2sgPSB0aGlzLnBpY2tUYXNrKHBvc3NpYmxlVGFza3MpO1xyXG5cclxuICAgICAgICAvL1J1biB0aGUgbmV3IGN1cnJlbnQgdGFzayFcclxuICAgICAgICB0aGlzLmN1cnJlbnRUYXNrLnJ1bigpO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgYSBjZXJ0YWluIHRhc2sgZnJvbSB0aGlzIGVudGl0eVxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCAtIFRoZSBudW1iZXIgb2YgdGhlIHRhc2sgdGhhdCBpcyBnb2luZyB0byBiZSByZXR1cm5lZFxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIHRhc2sgdGhhdCB0aGlzIGVudGl0eSBoYXMgYXQgdGhlIHNwZWNpZmllZCBpbmRleFxyXG4gICAgICovXHJcbiAgICBnZXRUYXNrOiBmdW5jdGlvbihpbmRleCkge1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy50YXNrc1tpbmRleF07XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhIHRhc2sgdG8gdGhpcyBlbnRpdHlcclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdGFzayAtIFRoZSB0YXNrIHRoYXQgaXMgZ2V0dGluZyBhZGRlZCB0byB0aGlzIGVudGl0eVxyXG4gICAgICovXHJcbiAgICBhZGRUYXNrOiBmdW5jdGlvbih0YXNrKSB7XHJcblxyXG4gICAgICAgIC8vQWRkIHRoZSB0YXNrXHJcbiAgICAgICAgdGhpcy50YXNrcy5wdXNoKHRhc2spO1xyXG5cclxuICAgICAgICAvL0NoZWNrIGlmIHRoZSBlbnRpdHkgbmVlZHMgdG8gc3RhcnQgd2l0aCB0aGlzIHRhc2tcclxuICAgICAgICBpZih0aGlzLmN1cnJlbnRUYXNrID09PSBudWxsKXtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFRhc2sgPSB0YXNrO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUYXNrLnJ1bigpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZSBhIHRhc2sgZnJvbSB0aGlzIGVudGl0eVxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCAtIFRoZSBudW1iZXIgb2YgdGhlIHRhc2sgdGhhdCBpcyBnb2luZyB0byBiZSByZW1vdmVkXHJcbiAgICAgKi9cclxuICAgIHJlbW92ZVRhc2s6IGZ1bmN0aW9uKGluZGV4KSB7XHJcblxyXG4gICAgICAgIC8vUmVtb3ZlIHRoZSB0YXNrXHJcbiAgICAgICAgdGhpcy50YXNrLnNwbGljZShpbmRleCwgMSk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIENvdW50IHRoZSBudW1iZXIgb2YgdGFza3MgYW5kIHJldHVybiB0aGUgbnVtYmVyXHJcbiAgICAgKiBAcHVibGljXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge051bWJlcn1cclxuICAgICAqL1xyXG4gICAgdG90YWxUYXNrczogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnRhc2tzLmxlbmd0aCgpO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgYSBsaXN0IG9mIGFsbCBwb3NzaWJsZSB0YXNrIHRvIGV4ZWN1dGUgYXQgdGhpcyB2ZXJ5IG1vbWVudFxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9XHJcbiAgICAgKi9cclxuICAgIGdldFBvc3NpYmxlVGFza3M6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAvL1RoZSBlbnRpdHkgaXMgZG9uZSB3aXRoIGhpcyBjdXJyZW50IHRhc2ssIHNvIGhlIGhhcyB0byBwaWNrIGFub3RoZXIgb25lXHJcbiAgICAgICAgdmFyIHBvc3NpYmxlVGFza3MgPSBbXTtcclxuICAgICAgICB2YXIgdG9kYXkgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIHZhciBob3VycyA9IHRvZGF5LmdldEhvdXJzKCk7XHJcblxyXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLnRhc2tzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICBpZih0aGlzLnRhc2tzW2ldLmlzTG91ZCAmJiBob3VycyA+PSAxMCAmJiBob3VycyA8PSAyMil7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcG9zc2libGVUYXNrcy5wdXNoKHRoaXMudGFza3NbaV0pO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBwb3NzaWJsZVRhc2tzO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQaWNrIGEgdGFzayBmcm9tIGEgbGlzdCBvZiBwcm92aWRlZCBhdmFpbGFibGUgdGFza3NcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtBcnJheX0gdGFza3MgLSBBbiBhcnJheSB3aXRoIGFsbCB0aGUgcG9zc2libGUgdGFza3MgdG8gcGljayBmcm9tXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1Rhc2t9XHJcbiAgICAgKi9cclxuICAgIHBpY2tUYXNrOiBmdW5jdGlvbiAodGFza3MpIHtcclxuXHJcbiAgICAgICAgLy9MZXQganVzdCBhc3N1bWUgdGhlIGZpcnN0IHRhc2sgaXMgdGhlIGxhc3QgdGFzaywgZG9lc24ndCByZWFsbHkgbWF0dGVyIGFzIGxvbmcgYXMgd2UgaGF2ZSBhIHZhbHVlIHRvIGNoZWNrIGFnYWluc3RcclxuICAgICAgICB2YXIgb2xkZXN0VGFzayA9IHRhc2tzWzBdO1xyXG5cclxuICAgICAgICAvL0xvb3AgdGhyb3VnaCB0aGUgcHJvdmlkZWQgdGFza3NcclxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGFza3MubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIC8vSWYgYSB0YXNrIGhhcyBuZXZlciBiZWVuIGV4ZWN1dGVkIGJlZm9yZSwganVzdCBzdGFydCB3aXRoIHRoYXQgb25lXHJcbiAgICAgICAgICAgIGlmKHRhc2tzW2ldLmxhc3RGaW5pc2hlZCA9PT0gbnVsbCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFza3NbaV07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vSWYgdGhlIGN1cnJlbnQgdGFzayBpcyBvbGRlciB0aGFuIHRoZSBjdXJyZW50IG9sZGVzdCB0YXNrLCByZXBsYWNlIGl0XHJcbiAgICAgICAgICAgIGlmKHRhc2tzW2ldLmxhc3RGaW5pc2hlZCA8IG9sZGVzdFRhc2subGFzdEZpbmlzaGVkKXtcclxuICAgICAgICAgICAgICAgIG9sZGVzdFRhc2sgPSB0YXNrc1tpXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vUmV0dXJuIHRoZSBvbGRlc3QgdGFzayB0byBleGVjdXRlIG5vd1xyXG4gICAgICAgIHJldHVybiBvbGRlc3RUYXNrO1xyXG5cclxuICAgIH1cclxuXHJcbn07XHJcblxyXG4vL0V4cG9ydCB0aGUgQnJvd3NlcmlmeSBtb2R1bGVcclxubW9kdWxlLmV4cG9ydHMgPSBUYXNrU3lzdGVtO1xyXG4iLCIvL0JlY2F1c2UgQnJvd3NlcmlmeSBlbmNhcHN1bGF0ZXMgZXZlcnkgbW9kdWxlLCB1c2Ugc3RyaWN0IHdvbid0IGFwcGx5IHRvIHRoZSBnbG9iYWwgc2NvcGUgYW5kIGJyZWFrIGV2ZXJ5dGhpbmdcclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy9SZXF1aXJlIG5lY2Vzc2FyeSBtb2R1bGVzXHJcbnZhciBUYXNrID0gcmVxdWlyZSgnLi90YXNrLmpzJyk7XHJcblxyXG4vKipcclxuICogTW9wcGluZyBUYXNrIGNvbnN0cnVjdG9yXHJcbiAqXHJcbiAqIEBjbGFzcyBNb3BcclxuICogQGNsYXNzZGVzYyBFeGVjdXRlIGEgZ2l2ZW4gdGFzayBhbmQgcmV0dXJuIHRoZSByZXN1bHRcclxuICogSW5oZXJpdHMgZnJvbSBUYXNrXHJcbiAqL1xyXG52YXIgTW9wID0gZnVuY3Rpb24oZW50aXR5KSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbmhlcml0IHRoZSBjb25zdHJ1Y3RvciBmcm9tIHRoZSBFbGVtZW50IGNsYXNzXHJcbiAgICAgKi9cclxuICAgIFRhc2suY2FsbCh0aGlzLCBlbnRpdHkpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSBvZiB0aGlzIHRhc2suXHJcbiAgICAgKi9cclxuICAgIHRoaXMubmFtZSA9ICdNb3AnO1xyXG5cclxufTtcclxuXHJcbk1vcC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFRhc2sucHJvdG90eXBlLCB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGdW5jdGlvbiB0aGF0IGlzIGNhbGxlZCB3aGVuZXZlciB0aGUgc3lzdGVtIHVwZGF0ZXNcclxuICAgICAqIEBwcm90ZWN0ZWRcclxuICAgICAqL1xyXG4gICAgcnVuOiB7XHJcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgLy9TdGFydCB0aGUgdGFza1xyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0KCk7XHJcblxyXG4gICAgICAgICAgICAvL0V4ZWN1dGUgdGhlIHRhc2tcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0lcXCdtIG1vcHBpbmcgdGhlIGZsb29yIG5vdycpO1xyXG5cclxuICAgICAgICAgICAgLy9TdGFydCB0aGUgVHdlZW4gYW5pbWF0aW9uIGluIHRoZSBkZW1vbnN0cmF0aW9uIHdvcmxkXHJcbiAgICAgICAgICAgIFR3ZWVuTWF4LnRvKHRoaXMuZW50aXR5Lm1lc2gucm90YXRpb24sIDMsIHtcclxuICAgICAgICAgICAgICAgIHkgOiB0aGlzLmVudGl0eS5tZXNoLnJvdGF0aW9uLnkgKyAxMCxcclxuICAgICAgICAgICAgICAgIG9uQ29tcGxldGU6IHRoaXMuZmluaXNoLmJpbmQodGhpcylcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0pO1xyXG5cclxuLy9FeHBvcnQgdGhlIEJyb3dzZXJpZnkgbW9kdWxlXHJcbm1vZHVsZS5leHBvcnRzID0gTW9wO1xyXG4iLCIvL0JlY2F1c2UgQnJvd3NlcmlmeSBlbmNhcHN1bGF0ZXMgZXZlcnkgbW9kdWxlLCB1c2Ugc3RyaWN0IHdvbid0IGFwcGx5IHRvIHRoZSBnbG9iYWwgc2NvcGUgYW5kIGJyZWFrIGV2ZXJ5dGhpbmdcclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuLyoqXHJcbiAqIFRhc2sgY29uc3RydWN0b3JcclxuICpcclxuICogQGNsYXNzIFRhc2tcclxuICogQGNsYXNzZGVzYyBUaGUgYmFzZSBjbGFzcyBmb3IgdGFza3NcclxuICpcclxuICogQHBhcmFtIHtFbnRpdHl9IGVudGl0eSAtIEEgcmVmZXJlbmNlIHRvIHRoZSBlbnRpdHkgdGhhdCBoYXMgdGhpcyB0YXNrXHJcbiAqL1xyXG52YXIgVGFzayA9IGZ1bmN0aW9uKGVudGl0eSkge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSBvZiB0aGlzIHN0YXR1cyBlZmZlY3QuIFRoaXMgZmllbGQgaXMgYWx3YXlzIHJlcXVpcmVkIVxyXG4gICAgICovXHJcbiAgICB0aGlzLm5hbWUgPSAnQmFzZSBUYXNrJztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBzdGF0ZSAtIFRoZSBjdXJyZW50IHN0YXRlIG9mIHRoaXMgdGFzay4gQ2FuIGJlIERvbmUsIEJ1c3ksIFByb2JsZW0sIFBsYW5uZWRcclxuICAgICAqL1xyXG4gICAgdGhpcy5zdGF0ZSA9ICdwbGFubmVkJztcclxuXHJcbiAgICAvKipcclxuICAgICAqIHtCb29sZWFufSBpc0xvdWQgLSBCb29sZWFuIGlmIHRoZSB0YXNrIGlzIGxvdWQgb3Igbm90XHJcbiAgICAgKi9cclxuICAgIHRoaXMuaXNMb3VkID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBsYXN0RmluaXNoZWQgLSBUaW1lc3RhbXAgb2Ygd2hlbiB0aGUgdGFzayBpcyBleGVjdXRlZCBmb3IgdGhlIGxhc3QgdGltZVxyXG4gICAgICovXHJcbiAgICB0aGlzLmxhc3RGaW5pc2hlZCA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcGVydHkge0VudGl0eX0gZW50aXR5IC0gQSByZWZlcmVuY2UgdG8gdGhlIGVudGl0eSB0aGF0IGhhcyB0aGlzIHRhc2tcclxuICAgICAqL1xyXG4gICAgdGhpcy5lbnRpdHkgPSBlbnRpdHk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcGVydHkge09iamVjdH0gbWVhc3VyZW1lbnRzIC0gT2JqZWN0IHdoaWNoIGhvbGRzIGFsbCBtZWFzdXJlbWVudHMgZm9yIHRoZSBjdXJyZW50IHRhc2tcclxuICAgICAqL1xyXG4gICAgdGhpcy5tZWFzdXJlbWVudHMgPSB7XHJcbiAgICAgICAgYXVkaW86IFtdXHJcbiAgICB9XHJcblxyXG59O1xyXG5cclxuVGFzay5wcm90b3R5cGUgPSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGdW5jdGlvbiB0aGF0IGlzIGNhbGxlZCB3aGVuZXZlciB0aGUgc3lzdGVtIHVwZGF0ZXNcclxuICAgICAqIFRoaXMgZnVuY3Rpb24gc2hvdWxkIGJlIG92ZXJ3cml0dGVuIGJ5IGN1c3RvbSB0YXNrc1xyXG4gICAgICogQHByb3RlY3RlZFxyXG4gICAgICovXHJcbiAgICBydW46IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAvL1NpbGVuY2UgaXMgZ29sZGVuXHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEJvb3RzdHJhcCBhbmQgc3RhcnQgdGhpcyB0YXNrXHJcbiAgICAgKiBAcHJvdGVjdGVkXHJcbiAgICAgKi9cclxuICAgIHN0YXJ0OiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9ICdidXN5JztcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRmluaXNoIHRoaXMgdGFzayBhbmQgcmVwb3J0IHJlc3VsdHNcclxuICAgICAqIEBwcm90ZWN0ZWRcclxuICAgICAqL1xyXG4gICAgZmluaXNoOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgLy9DaGFuZ2UgdGhlIHN0YXRlIG9mIHRoZSB0YXNrXHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9ICdkb25lJztcclxuXHJcbiAgICAgICAgLy9DcmVhdGUgYSB0aW1lc3RhbXAgZm9yIHdoZW4gdGhpcyB0YXNrIGlzIGZpbmlzaGVkXHJcbiAgICAgICAgdGhpcy5sYXN0RmluaXNoZWQgPSBEYXRlLm5vdygpO1xyXG5cclxuICAgIH1cclxuXHJcbn07XHJcblxyXG4vL0V4cG9ydCB0aGUgQnJvd3NlcmlmeSBtb2R1bGVcclxubW9kdWxlLmV4cG9ydHMgPSBUYXNrO1xyXG4iLCIvL0JlY2F1c2UgQnJvd3NlcmlmeSBlbmNhcHN1bGF0ZXMgZXZlcnkgbW9kdWxlLCB1c2Ugc3RyaWN0IHdvbid0IGFwcGx5IHRvIHRoZSBnbG9iYWwgc2NvcGUgYW5kIGJyZWFrIGV2ZXJ5dGhpbmdcclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy9SZXF1aXJlIG5lY2Vzc2FyeSBtb2R1bGVzXHJcbnZhciBUYXNrID0gcmVxdWlyZSgnLi90YXNrLmpzJyksXHJcbiAgICBVdGlscyA9IHJlcXVpcmUoJy4uL2NvcmUvdXRpbHMuanMnKTtcclxuXHJcbi8qKlxyXG4gKiBWYWN1dW0gVGFzayBjb25zdHJ1Y3RvclxyXG4gKlxyXG4gKiBAY2xhc3MgVmFjdXVtXHJcbiAqIEBjbGFzc2Rlc2MgRXhlY3V0ZSBhIGdpdmVuIHRhc2sgYW5kIHJldHVybiB0aGUgcmVzdWx0XHJcbiAqIEluaGVyaXRzIGZyb20gVGFza1xyXG4gKi9cclxudmFyIFZhY3V1bSA9IGZ1bmN0aW9uKGVudGl0eSkge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5oZXJpdCB0aGUgY29uc3RydWN0b3IgZnJvbSB0aGUgRWxlbWVudCBjbGFzc1xyXG4gICAgICovXHJcbiAgICBUYXNrLmNhbGwodGhpcywgZW50aXR5KTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBuYW1lIC0gVGhlIG5hbWUgb2YgdGhpcyB0YXNrLlxyXG4gICAgICovXHJcbiAgICB0aGlzLm5hbWUgPSAnVmFjdXVtJztcclxuXHJcbn07XHJcblxyXG5WYWN1dW0ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShUYXNrLnByb3RvdHlwZSwge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgd2hlbmV2ZXIgdGhlIHN5c3RlbSB1cGRhdGVzXHJcbiAgICAgKiBAcHJvdGVjdGVkXHJcbiAgICAgKi9cclxuICAgIHJ1bjoge1xyXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIC8vU3RhcnQgdGhlIHRhc2tcclxuICAgICAgICAgICAgdGhpcy5zdGFydCgpO1xyXG5cclxuICAgICAgICAgICAgLy9FeGVjdXRlIHRoZSB0YXNrXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdJXFwnbSB2YWN1dW1pbmcgbm93Jyk7XHJcblxyXG4gICAgICAgICAgICAvL0dldCBhIG5ldyByYW5kb20gcG9zaXRpb24gb24gdGhlIG1hcCB0byBnbyB0b1xyXG4gICAgICAgICAgICB2YXIgbmV3UG9zaXRpb24gPSB7XHJcbiAgICAgICAgICAgICAgICB4OiBVdGlscy5yYW5kb21OdW1iZXJTdGVwcygtMTAwLCAxMDAsIDIwKSxcclxuICAgICAgICAgICAgICAgIHo6IFV0aWxzLnJhbmRvbU51bWJlclN0ZXBzKC0xMDAsIDEwMCwgMjApXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAvL0NhbGN1bGF0ZSB0aGUgWCBhbmQgWiBkaXN0YW5jZVxyXG4gICAgICAgICAgICB2YXIgZGlzdGFuY2UgPSB7XHJcbiAgICAgICAgICAgICAgICB4OiBNYXRoLmFicyhuZXdQb3NpdGlvbi54IC0gdGhpcy5lbnRpdHkubWVzaC5wb3NpdGlvbi54KSxcclxuICAgICAgICAgICAgICAgIHo6IE1hdGguYWJzKG5ld1Bvc2l0aW9uLnogLSB0aGlzLmVudGl0eS5tZXNoLnBvc2l0aW9uLnopXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAvL0NhbGN1bGF0ZSB0aGUgdG90YWwgZGlzdGFuY2UgYW5kIHRoZSB0aW1lIGl0IHdvdWxkIHRha2UgdG8gdHJhdmVyc2UgdGhhdCBkaXN0YW5jZVxyXG4gICAgICAgICAgICB2YXIgdG90YWxEaXN0YW5jZSA9IGRpc3RhbmNlLnggKyBkaXN0YW5jZS56O1xyXG4gICAgICAgICAgICB2YXIgdGltZSA9IHRvdGFsRGlzdGFuY2UgLyAzNTtcclxuXHJcbiAgICAgICAgICAgIC8vU3RhcnQgdGhlIFR3ZWVuIGFuaW1hdGlvbiBpbiB0aGUgZGVtb25zdHJhdGlvbiB3b3JsZFxyXG4gICAgICAgICAgICBUd2Vlbk1heC50byh0aGlzLmVudGl0eS5tZXNoLnBvc2l0aW9uLCB0aW1lLCB7XHJcbiAgICAgICAgICAgICAgICB4IDogbmV3UG9zaXRpb24ueCxcclxuICAgICAgICAgICAgICAgIHogOiBuZXdQb3NpdGlvbi56LFxyXG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZTogdGhpcy5maW5pc2guYmluZCh0aGlzKVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSk7XHJcblxyXG4vL0V4cG9ydCB0aGUgQnJvd3NlcmlmeSBtb2R1bGVcclxubW9kdWxlLmV4cG9ydHMgPSBWYWN1dW07XHJcbiIsIi8vQmVjYXVzZSBCcm93c2VyaWZ5IGVuY2Fwc3VsYXRlcyBldmVyeSBtb2R1bGUsIHVzZSBzdHJpY3Qgd29uJ3QgYXBwbHkgdG8gdGhlIGdsb2JhbCBzY29wZSBhbmQgYnJlYWsgZXZlcnl0aGluZ1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4vL1JlcXVpcmUgbmVjZXNzYXJ5IG1vZHVsZXNcclxuLy8gLS0gTm9uZSB5ZXRcclxuXHJcbi8qKlxyXG4gKiBXb3JsZCBjb25zdHJ1Y3RvclxyXG4gKlxyXG4gKiBAY2xhc3MgV29ybGRcclxuICogQGNsYXNzZGVzYyBUaGUgV29ybGQgb2JqZWN0IGhvbGRzIGFsbCBvYmplY3RzIHRoYXQgYXJlIGluIHRoZSBkZW1vbnN0cmF0aW9uIHdvcmxkLCB0aGUgbWFwIGV0Yy5cclxuICovXHJcbnZhciBXb3JsZCA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtUSFJFRS5TY2VuZX0gc2NlbmUgLSBSZWZlcmVuY2UgdG8gdGhlIHNjZW5lXHJcbiAgICAgKi9cclxuICAgIHRoaXMuc2NlbmUgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYX0gY2FtZXJhIC0gUmVmZXJlbmNlIHRvIHRoZSBjYW1lcmFcclxuICAgICAqL1xyXG4gICAgdGhpcy5jYW1lcmEgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtUSFJFRS5XZWJHTFJlbmRlcmVyfSByZW5kZXJlciAtIFJlZmVyZW5jZSB0byB0aGUgcmVuZGVyZXJcclxuICAgICAqL1xyXG4gICAgdGhpcy5yZW5kZXJlciA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcGVydHkge1RIUkVFLlRyYWNrYmFsbENvbnRyb2xzfSBjb250cm9scyAtIFJlZmVyZW5jZSB0byB0aGUgY29udHJvbHMgb2JqZWN0XHJcbiAgICAgKi9cclxuICAgIHRoaXMuY29udHJvbHMgPSBudWxsO1xyXG5cclxuICAgIC8vSW5pdGlhbGl6ZSBpdHNlbGZcclxuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xyXG5cclxufTtcclxuXHJcbldvcmxkLnByb3RvdHlwZSA9IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgdGhlIFVJIGVsZW1lbnRzIGFuZCBhZGQgdGhlbSB0byB0aGlzIGNvbnRhaW5lclxyXG4gICAgICogQHByb3RlY3RlZFxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIC8vSW5pdGlhbGl6ZSB0aGUgY2FtZXJhXHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplQ2FtZXJhKCk7XHJcblxyXG4gICAgICAgIC8vSW5pdGlhbGl6ZSB0aGUgbW91c2UgY29udHJvbHNcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVDb250cm9scygpO1xyXG5cclxuICAgICAgICAvL0NyZWF0ZSB0aGUgc3RhZ2UsIGFkZCBhIGxpZ2h0IGFuZCBhIGZsb29yXHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplU3RhZ2UoKTtcclxuXHJcbiAgICAgICAgLy9Jbml0aWFsaXplIHRoZSByZW5kZXJlciBhbmQgY29uZmlndXJlIGl0XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplUmVuZGVyZXIoKTtcclxuXHJcbiAgICAgICAgLy9BZGQgYW4gZXZlbnQgbGlzdGVuZXIgZm9yIHdoZW4gdGhlIHVzZXIgcmVzaXplcyBoaXMgd2luZG93XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMub25XaW5kb3dSZXNpemUuYmluZCh0aGlzKSwgZmFsc2UpO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIGFuZCBzZXR1cCB0aGUgY2FtZXJhXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplQ2FtZXJhOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgLy9DcmVhdGUgYSBuZXcgY2FtZXJhIG9iamVjdFxyXG4gICAgICAgIHRoaXMuY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDQ1LCB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCwgMSwgMTAwMDApO1xyXG5cclxuICAgICAgICAvL0NvbmZpZ3VyZSB0aGUgY2FtZXJhXHJcbiAgICAgICAgdGhpcy5jYW1lcmEucG9zaXRpb24uc2V0KDEyMCwgMTQwLCAxNTApXHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgYW5kIHNldHVwIHRoZSBjb250cm9sc1xyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZUNvbnRyb2xzOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgLy9DcmVhdGUgYSBuZXcgY29udHJvbHMgb2JqZWN0XHJcbiAgICAgICAgdGhpcy5jb250cm9scyA9IG5ldyBUSFJFRS5UcmFja2JhbGxDb250cm9scyh0aGlzLmNhbWVyYSk7XHJcblxyXG4gICAgICAgIC8vU2V0dXAgdGhlIGNvbnRyb2xzXHJcbiAgICAgICAgdGhpcy5jb250cm9scy5yb3RhdGVTcGVlZCA9IDEuMDtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLnpvb21TcGVlZCA9IDEuMjtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLnBhblNwZWVkID0gMS4wO1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMubm9ab29tID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5jb250cm9scy5ub1BhbiA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMuc3RhdGljTW92aW5nID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLmR5bmFtaWNEYW1waW5nRmFjdG9yID0gMC4zO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIGFuZCBzZXR1cCB0aGUgc3RhZ2VcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVTdGFnZTogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIC8vQ3JlYXRlIGEgbmV3IHNjZW5lIGFuZCBhZGQgYW4gYW1iaWVudCBsaWdodFxyXG4gICAgICAgIHRoaXMuc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcclxuXHJcbiAgICAgICAgLy9DcmVhdGUgYSBuZXcgaGVtaWxpZ2h0XHJcbiAgICAgICAgdmFyIGhlbWlMaWdodCA9IG5ldyBUSFJFRS5IZW1pc3BoZXJlTGlnaHQoMHhmZmZmZmYsIDB4ZmZmZmZmLCAwLjYpO1xyXG5cclxuICAgICAgICAvL0NvbmZpZ3VyZSB0aGUgaGVtaWxpZ2h0XHJcbiAgICAgICAgaGVtaUxpZ2h0LmNvbG9yLnNldEhTTCgwLjYsIDEsIDAuNik7XHJcbiAgICAgICAgaGVtaUxpZ2h0Lmdyb3VuZENvbG9yLnNldEhTTCgwLjA5NSwgMSwgMC43NSk7XHJcbiAgICAgICAgaGVtaUxpZ2h0LnBvc2l0aW9uLnNldCgwLCA1MDAsIDApO1xyXG5cclxuICAgICAgICAvL0FkZCB0aGUgaGVtaWxpZ2h0IHRvIHRoZSBzdGFnZVxyXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGhlbWlMaWdodCk7XHJcblxyXG4gICAgICAgIC8vQ3JlYXRlIGEgbmV3IGRpcmVjdGlvbmFsIGxpZ2h0XHJcbiAgICAgICAgdmFyIGRpckxpZ2h0ID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoMHhmZmZmZmYsIDEpO1xyXG5cclxuICAgICAgICAvL0NvbmZpZ3VyZSB0aGUgZGlyZWN0aW9uYWwgbGlnaHRcclxuICAgICAgICBkaXJMaWdodC5jb2xvci5zZXRIU0woMC4xLCAxLCAwLjk1KTtcclxuICAgICAgICBkaXJMaWdodC5wb3NpdGlvbi5zZXQoLTEsIDEsIDQpO1xyXG4gICAgICAgIGRpckxpZ2h0LnBvc2l0aW9uLm11bHRpcGx5U2NhbGFyKDUwKTtcclxuXHJcbiAgICAgICAgLy9BZGQgdGhlIGxpZ2h0IHRvIHRoZSBzY2VuZVxyXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGRpckxpZ2h0KTtcclxuXHJcbiAgICAgICAgLy9EZWZhdWx0IGFyaWFibGUgZm9yIHRoZSBsaWdodFxyXG4gICAgICAgIHZhciBkID0gNTAwO1xyXG5cclxuICAgICAgICAvL0NvbmZpZ3VyZSB0aGUgbGlnaHRcclxuICAgICAgICBkaXJMaWdodC5jYXN0U2hhZG93ID0gdHJ1ZTtcclxuICAgICAgICBkaXJMaWdodC5zaGFkb3dNYXBXaWR0aCA9IDIwNDg7XHJcbiAgICAgICAgZGlyTGlnaHQuc2hhZG93TWFwSGVpZ2h0ID0gMjA0ODtcclxuICAgICAgICBkaXJMaWdodC5zaGFkb3dDYW1lcmFMZWZ0ID0gLWQ7XHJcbiAgICAgICAgZGlyTGlnaHQuc2hhZG93Q2FtZXJhUmlnaHQgPSBkO1xyXG4gICAgICAgIGRpckxpZ2h0LnNoYWRvd0NhbWVyYVRvcCA9IGQ7XHJcbiAgICAgICAgZGlyTGlnaHQuc2hhZG93Q2FtZXJhQm90dG9tID0gLWQ7XHJcbiAgICAgICAgZGlyTGlnaHQuc2hhZG93Q2FtZXJhRmFyID0gMzUwMDtcclxuICAgICAgICBkaXJMaWdodC5zaGFkb3dCaWFzID0gLTAuMDAwMTtcclxuICAgICAgICBkaXJMaWdodC5zaGFkb3dEYXJrbmVzcyA9IDAuMzU7XHJcblxyXG4gICAgICAgIC8vRGVmYXVsdCB2YXJpYWJsZXMgZm9yIHRoZSBncmlkXHJcbiAgICAgICAgdmFyIGdyaWRTaXplID0gNTAwO1xyXG4gICAgICAgIHZhciBncmlkU3RlcCA9IDIwO1xyXG5cclxuICAgICAgICAvL0NyZWF0ZSBuZXcgZ2VvbWV0cnkgYW5kIG1hdGVyaWFsIG9iamVjdHMgZm9yIHRoZSBncmlkXHJcbiAgICAgICAgdmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkdlb21ldHJ5KCk7XHJcbiAgICAgICAgdmFyIG1hdGVyaWFsID0gbmV3IFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsKHtjb2xvcjogXCJ3aGl0ZVwifSk7XHJcblxyXG4gICAgICAgIC8vRHluYW1pY2FsbHkgY3JlYXRlIHRoZSBncmlkXHJcbiAgICAgICAgZm9yKHZhciBpID0gLWdyaWRTaXplOyBpIDw9IGdyaWRTaXplOyBpICs9IGdyaWRTdGVwKXtcclxuICAgICAgICAgICAgZ2VvbWV0cnkudmVydGljZXMucHVzaChuZXcgVEhSRUUuVmVjdG9yMygtZ3JpZFNpemUsIC0wLjA0LCBpKSk7XHJcbiAgICAgICAgICAgIGdlb21ldHJ5LnZlcnRpY2VzLnB1c2gobmV3IFRIUkVFLlZlY3RvcjMoZ3JpZFNpemUsIC0wLjA0LCBpKSk7XHJcblxyXG4gICAgICAgICAgICBnZW9tZXRyeS52ZXJ0aWNlcy5wdXNoKG5ldyBUSFJFRS5WZWN0b3IzKGksIC0wLjA0LCAtZ3JpZFNpemUpKTtcclxuICAgICAgICAgICAgZ2VvbWV0cnkudmVydGljZXMucHVzaChuZXcgVEhSRUUuVmVjdG9yMyhpLCAtMC4wNCwgZ3JpZFNpemUpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vQ3JlYXRlIHRoZSBncmlkIG9iamVjdCBhbmQgcG9zaXRpb24gaXRcclxuICAgICAgICB2YXIgbGluZSA9IG5ldyBUSFJFRS5MaW5lKGdlb21ldHJ5LCBtYXRlcmlhbCwgVEhSRUUuTGluZVBpZWNlcyk7XHJcbiAgICAgICAgbGluZS5wb3NpdGlvbi5zZXQoLTEwLCAtMTAsIDEwKTtcclxuXHJcbiAgICAgICAgLy9BZGQgdGhlIGdyaWQgdG8gdGhlIHNjZW5lXHJcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQobGluZSk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgYW5kIHNldHVwIHRoZSByZW5kZXJlclxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZVJlbmRlcmVyOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgLy9DcmVhdGUgYSBuZXcgcmVuZGVyZXIgb2JqZWN0XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHtcclxuICAgICAgICAgICAgYW50aWFsaWFzOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vQ29uZmlndXJlIHRoZSByZW5kZXJlclxyXG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0Q2xlYXJDb2xvcigweGYwZjBmMCk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcclxuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zb3J0T2JqZWN0cyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2hhZG93TWFwRW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zaGFkb3dNYXBUeXBlID0gVEhSRUUuUENGU2hhZG93TWFwO1xyXG5cclxuICAgICAgICAvL0FwcGVuZCB0aGUgcmVuZGVyZXIgdG8gdGhlIEhUTUwgYm9keVxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5yZW5kZXJlci5kb21FbGVtZW50KTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRnVuY3Rpb24gdGhhdCBpcyBleGVjdXRlZCBldmVyeSB0aW1lIHRoZSB3aW5kb3cgcmVzaXplc1xyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgb25XaW5kb3dSZXNpemU6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAvL0NoYW5nZSB0aGUgY2FtZXJhJ3MgYXNwZWN0IHJhdGluZyBhbmQgdXBkYXRlIGl0XHJcbiAgICAgICAgdGhpcy5jYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5jYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xyXG5cclxuICAgICAgICAvL0NoYW5nZSB0aGUgc2l6ZSBvZiB0aGUgcmVuZGVyZXIgdG8gdGhlIG5ldyB3aW5kb3cgc2l6ZVxyXG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWxsIHRoZSBmdW5jdGlvbnMgdGhhdCBuZWVkIHRvIGJlIGV4ZWN1dGVkIGV2ZXJ5IHRpbWUgdGhlIHN5c3RlbSB1cGRhdGVzXHJcbiAgICAgKiBAcHJvdGVjdGVkXHJcbiAgICAgKi9cclxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAvL1VwZGF0ZSB0aGUgY29udHJvbHMgdG8gbWF0Y2ggdGhlIHVzZXJzIGludGVyYWN0aW9uXHJcbiAgICAgICAgdGhpcy5jb250cm9scy51cGRhdGUoKTtcclxuXHJcbiAgICAgICAgLy9SZW5kZXIgdGhlIHNjZW5lIGFnYWluXHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5yZW5kZXIodGhpcy5zY2VuZSwgdGhpcy5jYW1lcmEpO1xyXG5cclxuICAgIH1cclxuXHJcbn07XHJcblxyXG4vL0V4cG9ydCB0aGUgQnJvd3NlcmlmeSBtb2R1bGVcclxubW9kdWxlLmV4cG9ydHMgPSBXb3JsZDtcclxuIl19
;