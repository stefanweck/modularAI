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
    Settings = require('../world/settings.js'),
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

    /**
     * @property {Settings} settings - Reference to the Settings object
     */
    this.settings = null;

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

        //Create the settings object
        this.settings = new Settings(this);

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

},{"../entity/group.js":5,"../factories/robotfactory.js":6,"../world/settings.js":13,"../world/world.js":14}],3:[function(require,module,exports){
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

        var audioLevel = globalSettings.globalNoise;

        //If the current task is vacuuming, make a lot of noise!
        if(this.entity.systems['task'].currentTask.name === 'Vacuum'){

            audioLevel += globalSettings.vacuumNoise;

        }else{

            //Little to no noise
            audioLevel += globalSettings.mopNoise;

        }

        //Push the value in the array
        this.audioLevels.push(audioLevel);

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

            //Clear the array, but add the average volume that was just measured
            this.currentTask.measurements.audio = [];
            this.currentTask.measurements.audio.push(averageVolume);

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

        for(var i = 0; i < this.tasks.length; i++) {

            if(this.tasks[i].isLoud && !(globalSettings.currentTime >= 9 && globalSettings.currentTime <= 22)){
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
 * Settings constructor
 *
 * @class Settings
 * @classdesc The Settings object holds the functionality for the GUI
 */
var Settings = function(system) {

    this.values = null;

    this.gui = null;

    this.system = system;

    this.initialize();

};

Settings.prototype = {

    initialize: function(s)
    {

        var today = new Date();

        var valuesObject = function ()
        {
            this.globalNoise = 10;
            this.vacuumNoise = 70;
            this.mopNoise = 0;
            this.currentTime = today.getHours();
        };

        this.values = new valuesObject();
        globalSettings = this.values;

        this.gui = new dat.GUI();

        var noiseFolder = this.gui.addFolder('Noise');
        noiseFolder.add(this.values, 'globalNoise', 0, 100);
        noiseFolder.add(this.values, 'vacuumNoise', 0, 100);
        noiseFolder.add(this.values, 'mopNoise', 0, 100);

        var timeFolder = this.gui.addFolder('Time');
        timeFolder.add(this.values, 'currentTime', 1, 24);

    }

};

//Export the Browserify module
module.exports = Settings;

},{}],14:[function(require,module,exports){
//Because Browserify encapsulates every module, use strict won't apply to the global scope and break everything
'use strict';

/**
 * World constructor
 *
 * @class World
 * @classdesc The World object holds all objects that are in the demonstration world, the map etc.
 */
var World = function() {

    /**
     * {Object} container - The container that holds the canvas object
     */
    this.container = null;

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

        //Get the container object for later use through this script
        this.container = document.getElementById('container');

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
        this.controls = new THREE.TrackballControls(this.camera, this.container);

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
        this.container.appendChild(this.renderer.domElement);

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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6L3hhbXBwL2h0ZG9jcy9tb2R1bGFyQUkvbGliL2NvcmUvZXZlbnQuanMiLCJEOi94YW1wcC9odGRvY3MvbW9kdWxhckFJL2xpYi9jb3JlL3N5c3RlbS5qcyIsIkQ6L3hhbXBwL2h0ZG9jcy9tb2R1bGFyQUkvbGliL2NvcmUvdXRpbHMuanMiLCJEOi94YW1wcC9odGRvY3MvbW9kdWxhckFJL2xpYi9lbnRpdHkvZW50aXR5LmpzIiwiRDoveGFtcHAvaHRkb2NzL21vZHVsYXJBSS9saWIvZW50aXR5L2dyb3VwLmpzIiwiRDoveGFtcHAvaHRkb2NzL21vZHVsYXJBSS9saWIvZmFjdG9yaWVzL3JvYm90ZmFjdG9yeS5qcyIsIkQ6L3hhbXBwL2h0ZG9jcy9tb2R1bGFyQUkvbGliL2luaXQuanMiLCJEOi94YW1wcC9odGRvY3MvbW9kdWxhckFJL2xpYi9zeXN0ZW1zL21lYXN1cmUuanMiLCJEOi94YW1wcC9odGRvY3MvbW9kdWxhckFJL2xpYi9zeXN0ZW1zL3Rhc2suanMiLCJEOi94YW1wcC9odGRvY3MvbW9kdWxhckFJL2xpYi90YXNrcy9tb3AuanMiLCJEOi94YW1wcC9odGRvY3MvbW9kdWxhckFJL2xpYi90YXNrcy90YXNrLmpzIiwiRDoveGFtcHAvaHRkb2NzL21vZHVsYXJBSS9saWIvdGFza3MvdmFjdXVtLmpzIiwiRDoveGFtcHAvaHRkb2NzL21vZHVsYXJBSS9saWIvd29ybGQvc2V0dGluZ3MuanMiLCJEOi94YW1wcC9odGRvY3MvbW9kdWxhckFJL2xpYi93b3JsZC93b3JsZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIi8vQmVjYXVzZSBCcm93c2VyaWZ5IGVuY2Fwc3VsYXRlcyBldmVyeSBtb2R1bGUsIHVzZSBzdHJpY3Qgd29uJ3QgYXBwbHkgdG8gdGhlIGdsb2JhbCBzY29wZSBhbmQgYnJlYWsgZXZlcnl0aGluZ1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4vKipcclxuICogRXZlbnQgY29uc3RydWN0b3JcclxuICpcclxuICogSW5zcGlyZWQgYnkgdGhlIGdyZWF0IHR1dG9yaWFsIGF0OlxyXG4gKiBodHRwczovL2NvcmNvcmFuLmlvLzIwMTMvMDYvMDEvYnVpbGRpbmctYS1taW5pbWFsLWphdmFzY3JpcHQtZXZlbnQtc3lzdGVtL1xyXG4gKlxyXG4gKiBAY2xhc3MgRXZlbnRcclxuICogQGNsYXNzZGVzYyBBbiBvYmplY3QgdGhhdCBjYW4gYW5ub3VuY2UgYW5kIGxpc3RlbiBmb3IgZXZlbnRzXHJcbiAqXHJcbiAqL1xyXG52YXIgRXZlbnQgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBldmVudHMgLSBBbiBhc3NvY2lhdGl2ZSBhcnJheSB3aXRoIGFsbCB0aGUgY3VycmVudCBldmVudHNcclxuICAgICAqL1xyXG4gICAgdGhpcy5ldmVudHMgPSB7fTtcclxuXHJcbn07XHJcblxyXG5FdmVudC5wcm90b3R5cGUgPSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGdW5jdGlvbiB0aGF0IGhhbmRsZXMga2V5ZG93biBldmVudHNcclxuICAgICAqIEBwcm90ZWN0ZWRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIFRoZSB0eXBlIG9mIGV2ZW50IHRoYXQgY2FuIGJlIHRyaWdnZXJlZFxyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgZnVuY3Rpb24gdGhhdCBoYXMgdG8gYmUgcGVyZm9ybWVkIGFzIGEgY2FsbGJhY2tcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gVGhlIG9iamVjdCB0aGF0IHNob3VsZCBiZSBhY2Nlc3NpYmxlIHdoZW4gdGhlIGV2ZW50IGlzIGNhbGxlZFxyXG4gICAgICovXHJcbiAgICBvbjogZnVuY3Rpb24odHlwZSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcclxuXHJcbiAgICAgICAgLy9JZiB0aGlzLmV2ZW50cyBkb2Vzbid0IGhhdmUgdGhlIGV2ZW50IHByb3BlcnR5LCBjcmVhdGUgYW4gZW1wdHkgYXJyYXlcclxuICAgICAgICBpZighdGhpcy5ldmVudHMuaGFzT3duUHJvcGVydHkodHlwZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5ldmVudHNbdHlwZV0gPSBbXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vSW5zZXJ0IHRoZSBjYWxsYmFjayBpbnRvIHRoZSBjdXJyZW50IGV2ZW50XHJcbiAgICAgICAgdGhpcy5ldmVudHNbdHlwZV0ucHVzaChbY2FsbGJhY2ssIGNvbnRleHRdKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgd2hlbiBhbiBldmVudCBpcyB0cmlnZ2VyZWRcclxuICAgICAqIEBwcm90ZWN0ZWRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIFRoZSB0eXBlIG9mIGV2ZW50IHRoYXQgaXMgdHJpZ2dlcmVkXHJcbiAgICAgKi9cclxuICAgIHRyaWdnZXI6IGZ1bmN0aW9uKHR5cGUpIHtcclxuXHJcbiAgICAgICAgLy9CZWNhdXNlIHdlIGRvbid0IGtub3cgaG93IG1hbnkgYXJndW1lbnRzIGFyZSBiZWluZyBzZW5kIHRvXHJcbiAgICAgICAgLy90aGUgY2FsbGJhY2tzLCBsZXQncyBnZXQgdGhlbSBhbGwgZXhjZXB0IHRoZSBmaXJzdCBvbmUgKCB0aGUgdGFpbCApXHJcbiAgICAgICAgdmFyIHRhaWwgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xyXG5cclxuICAgICAgICAvL0dldCBhbGwgdGhlIGNhbGxiYWNrcyBmb3IgdGhlIGN1cnJlbnQgZXZlbnRcclxuICAgICAgICB2YXIgY2FsbGJhY2tzID0gdGhpcy5ldmVudHNbdHlwZV07XHJcblxyXG4gICAgICAgIC8vQ2hlY2sgaWYgdGhlcmUgYXJlIGNhbGxiYWNrcyBkZWZpbmVkIGZvciB0aGlzIGtleSwgaWYgbm90LCBzdG9wIVxyXG4gICAgICAgIGlmKGNhbGxiYWNrcyAhPT0gdW5kZWZpbmVkKSB7XHJcblxyXG4gICAgICAgICAgICAvL0xvb3AgdGhyb3VnaCB0aGUgY2FsbGJhY2tzIGFuZCBydW4gZWFjaCBjYWxsYmFja1xyXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9HZXQgdGhlIGN1cnJlbnQgY2FsbGJhY2sgZnVuY3Rpb25cclxuICAgICAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IGNhbGxiYWNrc1tpXVswXTtcclxuICAgICAgICAgICAgICAgIHZhciBjb250ZXh0O1xyXG5cclxuICAgICAgICAgICAgICAgIC8vR2V0IHRoZSBjdXJyZW50IGNvbnRleHQgb2JqZWN0LCBpZiBpdCBleGlzdHNcclxuICAgICAgICAgICAgICAgIGlmKGNhbGxiYWNrc1tpXVsxXSA9PT0gdW5kZWZpbmVkKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vSWYgdGhlIGNvbnRleHQgaXMgbm90IGRlZmluZWQsIHRoZSBzY29wZSBpcyBnb2luZyB0byBiZSB0aGlzICggRXZlbnQgb2JqZWN0IClcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0ID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy9HZXQgdGhlIGNvbnRleHQgb2JqZWN0XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dCA9IGNhbGxiYWNrc1tpXVsxXTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy9SdW4gdGhlIGN1cnJlbnQgY2FsbGJhY2sgYW5kIHNlbmQgdGhlIHRhaWwgYWxvbmcgd2l0aCBpdFxyXG4gICAgICAgICAgICAgICAgLy9UaGUgYXBwbHkoKSBtZXRob2QgY2FsbHMgYSBmdW5jdGlvbiB3aXRoIGEgZ2l2ZW4gdGhpcyB2YWx1ZSBhbmQgYXJndW1lbnRzIHByb3ZpZGVkIGFzIGFuIGFycmF5XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5hcHBseShjb250ZXh0LCB0YWlsKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn07XHJcblxyXG4vL0V4cG9ydCB0aGUgQnJvd3NlcmlmeSBtb2R1bGVcclxubW9kdWxlLmV4cG9ydHMgPSBFdmVudDtcclxuIiwiLy9CZWNhdXNlIEJyb3dzZXJpZnkgZW5jYXBzdWxhdGVzIGV2ZXJ5IG1vZHVsZSwgdXNlIHN0cmljdCB3b24ndCBhcHBseSB0byB0aGUgZ2xvYmFsIHNjb3BlIGFuZCBicmVhayBldmVyeXRoaW5nXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8vUmVxdWlyZSBuZWNlc3NhcnkgbW9kdWxlc1xyXG52YXIgR3JvdXAgPSByZXF1aXJlKCcuLi9lbnRpdHkvZ3JvdXAuanMnKSxcclxuICAgIFJvYm90RmFjdG9yeSA9IHJlcXVpcmUoJy4uL2ZhY3Rvcmllcy9yb2JvdGZhY3RvcnkuanMnKSxcclxuICAgIFNldHRpbmdzID0gcmVxdWlyZSgnLi4vd29ybGQvc2V0dGluZ3MuanMnKSxcclxuICAgIFdvcmxkID0gcmVxdWlyZSgnLi4vd29ybGQvd29ybGQuanMnKTtcclxuXHJcbi8qKlxyXG4gKiBTeXN0ZW0gQ29uc3RydWN0b3JcclxuICpcclxuICogQGNsYXNzIFN5c3RlbVxyXG4gKiBAY2xhc3NkZXNjIFRoZSBoZWFydCBvZiB0aGlzIG1vZHVsYXIgQUkhIEluIGhlcmUgd2UgcHJvdmlkZSBhY2Nlc3MgdG9cclxuICogYWxsIHRoZSBvdGhlciBvYmplY3RzIGFuZCBmdW5jdGlvbiwgYW5kIHdlIGhhbmRsZSB0aGUgc3RhcnR1cCBvZiB0aGUgc3lzdGVtXHJcbiAqXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSB1c2VyU2V0dGluZ3MgLSBUaGUgc2V0dGluZ3MgdGhhdCB0aGUgdXNlciBwcm92aWRlc1xyXG4gKi9cclxudmFyIFN5c3RlbSA9IGZ1bmN0aW9uKHVzZXJTZXR0aW5ncykge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtCb29sZWFufSBpc0luaXRpYWxpemVkIC0gVHJ1ZSB3aGVuIHRoZSBzeXN0ZW0gaXMgZnVsbHkgaW5pdGlhbGl6ZWRcclxuICAgICAqL1xyXG4gICAgdGhpcy5pc0luaXRpYWxpemVkID0gZmFsc2U7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcGVydHkge0dyb3VwfSBlbnRpdGllcyAtIEFsbCB0aGUgZW50aXRpZXMgY29udHJvbGxlZCBieSB0aGlzIHN5c3RlbVxyXG4gICAgICovXHJcbiAgICB0aGlzLmVudGl0aWVzID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wZXJ0eSB7V29ybGR9IHdvcmxkIC0gVGhlIHdvcmxkIGZvciBkZW1vbnN0cmF0aW5nIHB1cnBvc2VzXHJcbiAgICAgKi9cclxuICAgIHRoaXMud29ybGQgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtTZXR0aW5nc30gc2V0dGluZ3MgLSBSZWZlcmVuY2UgdG8gdGhlIFNldHRpbmdzIG9iamVjdFxyXG4gICAgICovXHJcbiAgICB0aGlzLnNldHRpbmdzID0gbnVsbDtcclxuXHJcbiAgICAvL0xvYWQgYW5kIHRoZW4gaW5pdGlhbGl6ZSBpdHNlbGZcclxuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xyXG5cclxufTtcclxuXHJcblN5c3RlbS5wcm90b3R5cGUgPSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIHRoZSBzeXN0ZW1cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAvL0NoZWNrIGlmIHRoZSBnYW1lIGlzIGFscmVhZHkgaW5pdGlhbGl6ZWRcclxuICAgICAgICBpZih0aGlzLmlzSW5pdGlhbGl6ZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9DcmVhdGUgYSBuZXcgZ3JvdXAgdGhhdCB3aWxsIGhvbGQgYWxsIGVudGl0aWVzXHJcbiAgICAgICAgdGhpcy5lbnRpdGllcyA9IG5ldyBHcm91cCgpO1xyXG5cclxuICAgICAgICAvL0NyZWF0ZSB0aGUgd29ybGQgb2JqZWN0XHJcbiAgICAgICAgdGhpcy53b3JsZCA9IG5ldyBXb3JsZCgpO1xyXG5cclxuICAgICAgICAvL0NyZWF0ZSB0aGUgc2V0dGluZ3Mgb2JqZWN0XHJcbiAgICAgICAgdGhpcy5zZXR0aW5ncyA9IG5ldyBTZXR0aW5ncyh0aGlzKTtcclxuXHJcbiAgICAgICAgLy9DcmVhdGUgYSBuZXcgZW50aXR5IGFuZCBhZGQgaXQgdG8gdGhlIGdyb3VwXHJcbiAgICAgICAgdmFyIGZpcnN0Um9ib3QgPSBSb2JvdEZhY3RvcnkuZGVmYXVsdFJvYm90KCk7XHJcblxyXG4gICAgICAgIC8vQWRkIHRoZSBlbnRpdHkgdG8gdGhlIGdyb3VwIG9mIGFsbCBlbnRpdGllc1xyXG4gICAgICAgIHRoaXMuZW50aXRpZXMuYWRkRW50aXR5KGZpcnN0Um9ib3QpO1xyXG5cclxuICAgICAgICAvL0FkZCB0aGUgY3ViZSB0byB0aGUgc2NlbmVcclxuICAgICAgICB0aGlzLndvcmxkLnNjZW5lLmFkZChmaXJzdFJvYm90Lm1lc2gpO1xyXG5cclxuICAgICAgICAvL1VwZGF0ZSB0aGUgc3lzdGVtIGZvciB0aGUgZmlyc3QgdGltZVxyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcblxyXG4gICAgICAgIC8vVGhlIHN5c3RlbSBpcyBmdWxseSBpbml0aWFsaXplZFxyXG4gICAgICAgIHRoaXMuaXNJbml0aWFsaXplZCA9IHRydWU7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEFsbCB0aGUgZnVuY3Rpb25zIHRoYXQgbmVlZCB0byBiZSBleGVjdXRlZCBldmVyeSB0aW1lIHRoZSBzeXN0ZW0gdXBkYXRlc1xyXG4gICAgICogQmFzaWNhbGx5IGEgZ2FtZSBsb29wXHJcbiAgICAgKiBAcHJvdGVjdGVkXHJcbiAgICAgKi9cclxuICAgIHVwZGF0ZTogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIC8vUmVxdWVzdCBhIG5ldyBhbmltYXRpb24gZnJhbWUgYW5kIGNhbGwgdGhlIHVwZGF0ZSBmdW5jdGlvbiBhZ2FpblxyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnVwZGF0ZS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgLy9HZXQgYWxsIGVudGl0aWVzIGluIHRoZSBzeXN0ZW1cclxuICAgICAgICB2YXIgZW50aXRpZXMgPSB0aGlzLmVudGl0aWVzLmdldEVudGl0aWVzKCk7XHJcblxyXG4gICAgICAgIC8vTG9vcCB0aHJvdWdoIGFsbCB0aGUgZW50aXRpZXNcclxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgZW50aXRpZXMubGVuZ3RoOyBpKyspe1xyXG5cclxuICAgICAgICAgICAgLy9FeGVjdXRlIHRoZSBydW4gY29tbWFuZCBmb3IgZWFjaCBlbnRpdHkgc28gaXQgd2lsbCBzdGFydCBhY3RpbmdcclxuICAgICAgICAgICAgZW50aXRpZXNbaV0ucnVuKCk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9VcGRhdGUgdGhlIGRlbW9uc3RyYXRpb24gd29ybGRcclxuICAgICAgICB0aGlzLndvcmxkLnVwZGF0ZSgpO1xyXG5cclxuICAgIH1cclxuXHJcbn07XHJcblxyXG4vL0V4cG9ydCB0aGUgQnJvd3NlcmlmeSBtb2R1bGVcclxubW9kdWxlLmV4cG9ydHMgPSBTeXN0ZW07XHJcbiIsIi8vQmVjYXVzZSBCcm93c2VyaWZ5IGVuY2Fwc3VsYXRlcyBldmVyeSBtb2R1bGUsIHVzZSBzdHJpY3Qgd29uJ3QgYXBwbHkgdG8gdGhlIGdsb2JhbCBzY29wZSBhbmQgYnJlYWsgZXZlcnl0aGluZ1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4vKipcclxuICogU3RhdGljIFV0aWxpdGllcyBDbGFzc1xyXG4gKlxyXG4gKiBAY2xhc3MgVXRpbHNcclxuICogQGNsYXNzZGVzYyBJbiB0aGlzIGNsYXNzIGFyZSB0aGUgZnVuY3Rpb25zIHN0b3JlZCB0aGF0IGFyZSBiZWluZ1xyXG4gKiB1c2VkIGluIG90aGVyIGZ1bmN0aW9uc1xyXG4gKi9cclxudmFyIFV0aWxzID0ge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRnVuY3Rpb24gdG8gZ2VuZXJhdGUgYSByYW5kb20gbnVtYmVyIGJldHdlZW4gdHdvIHZhbHVlc1xyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBmcm9tIC0gVGhlIG1pbmltdW0gbnVtYmVyXHJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdG8gLSBUaGUgbWF4aW11bSBudW1iZXJcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IEEgcmFuZG9tIG51bWJlciBiZXR3ZWVuIHRoZSB0d28gc3VwcGxpZWQgdmFsdWVzXHJcbiAgICAgKi9cclxuICAgIHJhbmRvbU51bWJlcjogZnVuY3Rpb24oZnJvbSwgdG8pIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICh0byAtIGZyb20gKyAxKSArIGZyb20pO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGdW5jdGlvbiB0byBnZW5lcmF0ZSBhIHJhbmRvbSBudW1iZXIgYmV0d2VlbiB0d28gdmFsdWVzIGFuZCBpbiBjZXJ0YWluIHN0ZXBzXHJcbiAgICAgKiBAcHVibGljXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGZyb20gLSBUaGUgbWluaW11bSBudW1iZXJcclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0byAtIFRoZSBtYXhpbXVtIG51bWJlclxyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHN0ZXBzIC0gVGhlIHN0ZXBzIGluIHdoaWNoIHRoZSByYW5kb20gbnVtYmVycyB3aWxsIGdvXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBBIHJhbmRvbSBudW1iZXIgYmV0d2VlbiB0aGUgdHdvIHN1cHBsaWVkIHZhbHVlc1xyXG4gICAgICovXHJcbiAgICByYW5kb21OdW1iZXJTdGVwczogZnVuY3Rpb24oZnJvbSwgdG8sIHN0ZXBzKSB7XHJcblxyXG4gICAgICAgIHJldHVybiBmcm9tICsgKHN0ZXBzICogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKHRvIC0gZnJvbSkgLyBzdGVwcykpO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxjdWxhdGUgdGhlIGF2ZXJhZ2UgZnJvbSBhbGwgdmFsdWVzIGluIGFuIGFycmF5XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgLSBUaGUgYXJyYXkgYmVpbmcgdXNlZCBmb3IgYXZlcmFnZSBjYWxjdWxhdGlvbnNcclxuICAgICAqIEByZXR1cm5zIHtOdW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIGF2ZXJhZ2VBcnJheTogZnVuY3Rpb24oYXJyYXkpIHtcclxuXHJcbiAgICAgICAgdmFyIHN1bSA9IDA7XHJcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgc3VtICs9IHBhcnNlSW50KGFycmF5W2ldLCAxMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3VtIC8gYXJyYXkubGVuZ3RoO1xyXG5cclxuICAgIH1cclxuXHJcbn07XHJcblxyXG4vL0V4cG9ydCB0aGUgQnJvd3NlcmlmeSBtb2R1bGVcclxubW9kdWxlLmV4cG9ydHMgPSBVdGlscztcclxuIiwiLy9CZWNhdXNlIEJyb3dzZXJpZnkgZW5jYXBzdWxhdGVzIGV2ZXJ5IG1vZHVsZSwgdXNlIHN0cmljdCB3b24ndCBhcHBseSB0byB0aGUgZ2xvYmFsIHNjb3BlIGFuZCBicmVhayBldmVyeXRoaW5nXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBUYXNrU3lzdGVtID0gcmVxdWlyZSgnLi4vc3lzdGVtcy90YXNrLmpzJyksXHJcbiAgICBNZWFzdXJlU3lzdGVtID0gcmVxdWlyZSgnLi4vc3lzdGVtcy9tZWFzdXJlLmpzJyk7XHJcblxyXG4vKipcclxuICogRW50aXR5IGNvbnN0cnVjdG9yXHJcbiAqXHJcbiAqIEBjbGFzcyBFbnRpdHlcclxuICogQGNsYXNzZGVzYyBBIHNpbmdsZSBlbnRpdHkgdGhhdCBoYXMgY2VydGFpbiBiZWhhdmlvdXIgdG8gYmUgZXhlY3V0ZWRcclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSBvZiB0aGlzIGVudGl0eVxyXG4gKi9cclxudmFyIEVudGl0eSA9IGZ1bmN0aW9uKG5hbWUpIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBuYW1lIC0gVGhlIG5hbWUgb2YgdGhpcyBlbnRpdHlcclxuICAgICAqL1xyXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXl9IHN5c3RlbXMgLSBBbiBhc3NvY2lhdGl2ZSBhcnJheSBmaWxsZWQgd2l0aCBhbGwgdGhlIHN5c3RlbXMgdGhhdCBuZWVkIHRvIGJlIGNhbGxlZCBldmVyeSBzdGVwXHJcbiAgICAgKi9cclxuICAgIHRoaXMuc3lzdGVtcyA9IHt9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtUSFJFRS5NZXNofSBtZXNoIC0gVGhlIDNEIG1vZGVsIG1lc2hcclxuICAgICAqL1xyXG4gICAgdGhpcy5tZXNoID0gbnVsbDtcclxuXHJcbiAgICAvL0luaXRpYWxpemUgaXRzZWxmXHJcbiAgICB0aGlzLmluaXRpYWxpemUoKTtcclxuXHJcbn07XHJcblxyXG5FbnRpdHkucHJvdG90eXBlID0ge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZSB0aGUgZW50aXR5LCBjcmVhdGUgbmV3IG9iamVjdHMgYW5kIGFwcGx5IHNldHRpbmdzXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgLy9BZGQgc3lzdGVtc1xyXG4gICAgICAgIHRoaXMuc3lzdGVtc1sndGFzayddID0gbmV3IFRhc2tTeXN0ZW0oKTtcclxuICAgICAgICB0aGlzLnN5c3RlbXNbJ21lYXN1cmUnXSA9IG5ldyBNZWFzdXJlU3lzdGVtKHRoaXMpO1xyXG5cclxuICAgICAgICAvL0NvbmZpZ3VyZSBzeXN0ZW1zXHJcbiAgICAgICAgdGhpcy5zeXN0ZW1zWyd0YXNrJ10uZXZlbnRzLm9uKCdmaW5pc2hlZCcsIHRoaXMuZmluaXNoZWRUYXNrLmJpbmQodGhpcyksIHRoaXMpO1xyXG5cclxuICAgICAgICAvL0NyZWF0ZSB0aGUgVGhyZWUuanMgc2hhcGUgZm9yIHRoZSBkZW1vbnN0cmF0aW9uIHdvcmxkXHJcbiAgICAgICAgdGhpcy5jcmVhdGVNZXNoKCk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSB0aGUgVEhSRUUuanMgbWVzaCBhbmQgc3RvcmUgaXQgaW4gdGhpcyBvYmplY3RcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZU1lc2g6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAvL0NyZWF0ZSBhIHJldXNhYmxlIGdlb21ldHJ5IG9iamVjdCBmb3IgYSBjdWJlXHJcbiAgICAgICAgdmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KDIwLCAyMCwgMjApO1xyXG5cclxuICAgICAgICAvL0NyZWF0ZSB0aGUgbmV3IGN1YmUgb2JqZWN0IHdpdGggdGhlIGdlb21ldHJ5XHJcbiAgICAgICAgdGhpcy5tZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHtjb2xvcjogTWF0aC5yYW5kb20oKSAqIDB4ZmZmZmZmfSkpO1xyXG5cclxuICAgICAgICAvL1Bvc2l0aW9uIHRoZSBjdWJlXHJcbiAgICAgICAgdGhpcy5tZXNoLnBvc2l0aW9uLnNldCgwLCAwICwwKTtcclxuXHJcbiAgICAgICAgLy9Db25maWd1cmUgdGhlIGN1YmVcclxuICAgICAgICB0aGlzLm1lc2guY2FzdFNoYWRvdyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5tZXNoLnJlY2VpdmVTaGFkb3cgPSB0cnVlO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFeGVjdXRlIGFsbCB0aGUgc3lzdGVtcyBvbiB0aGlzIGVudGl0eSBldmVyeSBzdGVwIG9mIHRoZSBsb29wXHJcbiAgICAgKiBAcHVibGljXHJcbiAgICAgKi9cclxuICAgIHJ1bjogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIGZvcih2YXIgc3lzdGVtIGluIHRoaXMuc3lzdGVtcykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zeXN0ZW1zLmhhc093blByb3BlcnR5KHN5c3RlbSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3lzdGVtc1tzeXN0ZW1dLnJ1bigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxsYmFjayBmdW5jdGlvbiBmb3Igd2hlbmV2ZXIgdGhlIGEgdGFzayBpbiB0aGUgdGFzayBzeXN0ZW0gaXMgZmluaXNoZWRcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGZpbmlzaGVkVGFzazogZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgLy9HZXQgdGhlIGF2ZXJhZ2UgYXVkaW8gbGV2ZWxzIGZyb20gdGhlIG1lYXN1cmUgc3lzdGVtXHJcbiAgICAgICAgdmFyIGF2ZXJhZ2VBdWRpbyA9IHRoaXMuc3lzdGVtc1snbWVhc3VyZSddLmNhbGN1bGF0ZUF2ZXJhZ2VBdWRpbygpO1xyXG5cclxuICAgICAgICAvL1B1c2ggdGhlIGF2ZXJhZ2UgYXVkaW8gbGV2ZWwgaW50byB0aGUgbWVhc3VyZW1lbnRzIGFycmF5IGluIHRoZSBjdXJyZW50IHRhc2tcclxuICAgICAgICB0aGlzLnN5c3RlbXNbJ3Rhc2snXS5jdXJyZW50VGFzay5tZWFzdXJlbWVudHMuYXVkaW8ucHVzaChhdmVyYWdlQXVkaW8pO1xyXG5cclxuICAgIH1cclxuXHJcbn07XHJcblxyXG4vL0V4cG9ydCB0aGUgQnJvd3NlcmlmeSBtb2R1bGVcclxubW9kdWxlLmV4cG9ydHMgPSBFbnRpdHk7XHJcbiIsIi8vQmVjYXVzZSBCcm93c2VyaWZ5IGVuY2Fwc3VsYXRlcyBldmVyeSBtb2R1bGUsIHVzZSBzdHJpY3Qgd29uJ3QgYXBwbHkgdG8gdGhlIGdsb2JhbCBzY29wZSBhbmQgYnJlYWsgZXZlcnl0aGluZ1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4vL1JlcXVpcmUgbmVjZXNzYXJ5IG1vZHVsZXNcclxudmFyIEVudGl0eSA9IHJlcXVpcmUoJy4vZW50aXR5LmpzJyk7XHJcblxyXG4vKipcclxuICogR3JvdXAgY29uc3RydWN0b3JcclxuICpcclxuICogQGNsYXNzIEdyb3VwXHJcbiAqIEBjbGFzc2Rlc2MgVGhlIG9iamVjdCB0aGF0IGhvbGRzIG11bHRpcGxlIGVudGl0aWVzXHJcbiAqL1xyXG52YXIgR3JvdXAgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXl9IGVudGl0aWVzIC0gQ29sbGVjdGlvbiBvZiBhbGwgdGhlIGVudGl0aWVzIGluIHRoaXMgZ3JvdXBcclxuICAgICAqL1xyXG4gICAgdGhpcy5lbnRpdGllcyA9IFtdO1xyXG5cclxufTtcclxuXHJcbkdyb3VwLnByb3RvdHlwZSA9IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEZ1bmN0aW9uIHRvIGFkZCBhIG5ldyBlbnRpdHkgdG8gdGhpcyBncm91cFxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7RW50aXR5fSBlbnRpdHkgLSBBIHJlZmVyZW5jZSB0byBlbnRpdHkgYmVpbmcgYWRkZWRcclxuICAgICAqL1xyXG4gICAgYWRkRW50aXR5OiBmdW5jdGlvbihlbnRpdHkpIHtcclxuXHJcbiAgICAgICAgLy9DaGVjayBpZiB0aGUgZW50aXR5IGlzIHRoZSBjb3JyZWN0IG9iamVjdFxyXG4gICAgICAgIGlmKCFlbnRpdHkgaW5zdGFuY2VvZiBFbnRpdHkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9BZGQgdGhlIGN1cnJlbnQgZW50aXR5IHRvIHRoZSBsaXN0XHJcbiAgICAgICAgdGhpcy5lbnRpdGllcy5wdXNoKGVudGl0eSk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEZ1bmN0aW9uIHRvIHJlbW92ZSBhbiBlbnRpdHkgZnJvbSB0aGlzIGdyb3VwXHJcbiAgICAgKiBAcHVibGljXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtFbnRpdHl9IGVudGl0eSAtIEEgcmVmZXJlbmNlIHRvIGVudGl0eSBiZWluZyByZW1vdmVkXHJcbiAgICAgKi9cclxuICAgIHJlbW92ZUVudGl0eTogZnVuY3Rpb24oZW50aXR5KSB7XHJcblxyXG4gICAgICAgIC8vQ2hlY2sgaWYgdGhlIGVudGl0eSBleGlzdHMsIGlmIG5vdCwgd2UgZG9uJ3QgaGF2ZSB0byBkZWxldGUgaXRcclxuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmVudGl0aWVzLmluZGV4T2YoZW50aXR5KTtcclxuXHJcbiAgICAgICAgLy9UaGUgZWxlbWVudCBkb2Vzbid0IGV4aXN0IGluIHRoZSBsaXN0XHJcbiAgICAgICAgaWYoaW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vUmVtb3ZlIHRoZSBjdXJyZW50IGVudGl0eSBmcm9tIHRoZSBncm91cFxyXG4gICAgICAgIHRoaXMuZW50aXRpZXMuc3BsaWNlKGluZGV4LCAxKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IGFsbCBlbnRpdGllcyBzdG9yZWQgaW4gdGhpcyBncm91cFxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gLSBBbGwgZW50aXRpZXMgc3RvcmVkIGluIHRoaXMgZ3JvdXBcclxuICAgICAqL1xyXG4gICAgZ2V0RW50aXRpZXM6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5lbnRpdGllcztcclxuXHJcbiAgICB9XHJcblxyXG59O1xyXG5cclxuLy9FeHBvcnQgdGhlIEJyb3dzZXJpZnkgbW9kdWxlXHJcbm1vZHVsZS5leHBvcnRzID0gR3JvdXA7XHJcbiIsIi8vQmVjYXVzZSBCcm93c2VyaWZ5IGVuY2Fwc3VsYXRlcyBldmVyeSBtb2R1bGUsIHVzZSBzdHJpY3Qgd29uJ3QgYXBwbHkgdG8gdGhlIGdsb2JhbCBzY29wZSBhbmQgYnJlYWsgZXZlcnl0aGluZ1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4vL1JlcXVpcmUgbmVjZXNzYXJ5IG1vZHVsZXNcclxudmFyIEVudGl0eSA9IHJlcXVpcmUoJy4uL2VudGl0eS9lbnRpdHkuanMnKSxcclxuICAgIFZhY3V1bSA9IHJlcXVpcmUoJy4uL3Rhc2tzL3ZhY3V1bS5qcycpLFxyXG4gICAgTW9wID0gcmVxdWlyZSgnLi4vdGFza3MvbW9wLmpzJyk7XHJcblxyXG4vKipcclxuICogQGNsYXNzIFJvYm90RmFjdG9yeVxyXG4gKiBAY2xhc3NkZXNjIEEgZmFjdG9yeSB0aGF0IHJldHVybnMgcHJlIG1hZGUgcm9ib3RzIHdpdGhcclxuICogYSBzZXQgb2YgdGFza3NcclxuICovXHJcbnZhciBSb2JvdEZhY3RvcnkgPSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGdW5jdGlvbiB0aGF0IHJldHVybnMgYSBuZXcgZGVmYXVsdCByb2JvdFxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4ge0VudGl0eX0gQW4gZGVmYXVsdCByb2JvdCB3aXRoIGFsbCBhdmFpbGFibGUgdGFza3NcclxuICAgICAqL1xyXG4gICAgZGVmYXVsdFJvYm90OiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgLy9DcmVhdGUgdGhlIG5ldyBFbnRpdHkgb2JqZWN0XHJcbiAgICAgICAgdmFyIGVudGl0eSA9IG5ldyBFbnRpdHkoJ0RlZmF1bHQnKTtcclxuXHJcbiAgICAgICAgLy9BZGQgdGhlIGF2YWlsYWJsZSB0YXNrc1xyXG4gICAgICAgIGVudGl0eS5zeXN0ZW1zWyd0YXNrJ10uYWRkVGFzayhuZXcgVmFjdXVtKGVudGl0eSkpO1xyXG4gICAgICAgIGVudGl0eS5zeXN0ZW1zWyd0YXNrJ10uYWRkVGFzayhuZXcgTW9wKGVudGl0eSkpO1xyXG5cclxuICAgICAgICAvL1JldHVybiB0aGUgZW50aXR5XHJcbiAgICAgICAgcmV0dXJuIGVudGl0eTtcclxuXHJcbiAgICB9XHJcblxyXG59O1xyXG5cclxuLy9FeHBvcnQgdGhlIEJyb3dzZXJpZnkgbW9kdWxlXHJcbm1vZHVsZS5leHBvcnRzID0gUm9ib3RGYWN0b3J5O1xyXG4iLCIvL0JlY2F1c2UgQnJvd3NlcmlmeSBlbmNhcHN1bGF0ZXMgZXZlcnkgbW9kdWxlLCB1c2Ugc3RyaWN0IHdvbid0IGFwcGx5IHRvIHRoZSBnbG9iYWwgc2NvcGUgYW5kIGJyZWFrIGV2ZXJ5dGhpbmdcclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy9SZXF1aXJlIG5lY2Vzc2FyeSBtb2R1bGVzXHJcbnZhciBTeXN0ZW0gPSByZXF1aXJlKCcuL2NvcmUvc3lzdGVtLmpzJyk7XHJcblxyXG4vL1RoZSBpbml0aWFsaXplIE1vZHVsZVxyXG52YXIgSW50aWFsaXplID0gZnVuY3Rpb24gaW5pdGlhbGl6ZVN5c3RlbSgpIHtcclxuXHJcbiAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgICAvL0VtcHR5IGZvciBub3dcclxuICAgIH07XHJcblxyXG4gICAgLy9DcmVhdGUgYSBuZXcgc3lzdGVtXHJcbiAgICB2YXIgc3lzdGVtID0gbmV3IFN5c3RlbShvcHRpb25zKTtcclxuXHJcbn07XHJcblxyXG4vLyBzaGltIGxheWVyIHdpdGggc2V0VGltZW91dCBmYWxsYmFja1xyXG53aW5kb3cucmVxdWVzdEFuaW1GcmFtZSA9IChmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgICAgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxyXG4gICAgICAgIHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgICBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChjYWxsYmFjaywgMTAwMCAvIDYwKTtcclxuICAgICAgICB9O1xyXG59KSgpO1xyXG5cclxuLy9Jbml0aWFsaXplIHdoZW4gZnVsbHkgbG9hZGVkXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBJbnRpYWxpemUpO1xyXG5cclxuLy9FeHBvcnQgdGhlIEJyb3dzZXJpZnkgbW9kdWxlXHJcbm1vZHVsZS5leHBvcnRzID0gSW50aWFsaXplO1xyXG4iLCIvL0JlY2F1c2UgQnJvd3NlcmlmeSBlbmNhcHN1bGF0ZXMgZXZlcnkgbW9kdWxlLCB1c2Ugc3RyaWN0IHdvbid0IGFwcGx5IHRvIHRoZSBnbG9iYWwgc2NvcGUgYW5kIGJyZWFrIGV2ZXJ5dGhpbmdcclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIFV0aWxzID0gcmVxdWlyZSgnLi4vY29yZS91dGlscy5qcycpO1xyXG5cclxuLyoqXHJcbiAqIE1lYXN1cmVtZW50IFN5c3RlbSBjb25zdHJ1Y3RvclxyXG4gKlxyXG4gKiBAY2xhc3MgTWVhc3VyZVN5c3RlbVxyXG4gKiBAY2xhc3NkZXNjIEEgc3lzdGVtIHRoYXQgbWFuYWdlcyBhbGwgdGhpbmdzIG1lYXN1cmVtZW50IHJlbGF0ZWRcclxuICpcclxuICogQHBhcmFtIHtFbnRpdHl9IGVudGl0eSAtIEEgcmVmZXJlbmNlIHRvIHRoZSBlbnRpdHkgdGhhdCBvd25zIHRoaXMgc3lzdGVtXHJcbiAqL1xyXG52YXIgTWVhc3VyZVN5c3RlbSA9IGZ1bmN0aW9uKGVudGl0eSkge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtFbnRpdHl9IGVudGl0eSAtIEEgcmVmZXJlbmNlIHRvIHRoZSBlbnRpdHkgdGhhdCBvd25zIHRoaXMgc3lzdGVtXHJcbiAgICAgKi9cclxuICAgIHRoaXMuZW50aXR5ID0gZW50aXR5O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheX0gYXVkaW9MZXZlbHMgLSBBbiBhcnJheSB3aGljaCBob2xkcyBhbGwgdGhlIGF1ZGlvIGxldmVscyBzdGlsbCBiZWluZyBtZWFzdXJlZFxyXG4gICAgICovXHJcbiAgICB0aGlzLmF1ZGlvTGV2ZWxzID0gW107XHJcblxyXG59O1xyXG5cclxuTWVhc3VyZVN5c3RlbS5wcm90b3R5cGUgPSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVjayB3aGV0aGVyIHRoZSBlbnRpdHkgaXMgYnVzeSBvciBuZWVkcyBhIG5ldyB0YXNrXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBydW46IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB0aGlzLm1lYXN1cmVBdWRpbygpO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGdW5jdGlvbiB0byBtZWFzdXJlIGF1ZGlvIGxldmVscyBmcm9tIHRoZSBub2lzZS9hdWRpbyBzZW5zb3JcclxuICAgICAqIE5vdyBmYWtpbmcgZGF0YSBmb3IgZGVtb25zdHJhdGlvbiBwdXJwb3Nlc1xyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgbWVhc3VyZUF1ZGlvOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIGF1ZGlvTGV2ZWwgPSBnbG9iYWxTZXR0aW5ncy5nbG9iYWxOb2lzZTtcclxuXHJcbiAgICAgICAgLy9JZiB0aGUgY3VycmVudCB0YXNrIGlzIHZhY3V1bWluZywgbWFrZSBhIGxvdCBvZiBub2lzZSFcclxuICAgICAgICBpZih0aGlzLmVudGl0eS5zeXN0ZW1zWyd0YXNrJ10uY3VycmVudFRhc2submFtZSA9PT0gJ1ZhY3V1bScpe1xyXG5cclxuICAgICAgICAgICAgYXVkaW9MZXZlbCArPSBnbG9iYWxTZXR0aW5ncy52YWN1dW1Ob2lzZTtcclxuXHJcbiAgICAgICAgfWVsc2V7XHJcblxyXG4gICAgICAgICAgICAvL0xpdHRsZSB0byBubyBub2lzZVxyXG4gICAgICAgICAgICBhdWRpb0xldmVsICs9IGdsb2JhbFNldHRpbmdzLm1vcE5vaXNlO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vUHVzaCB0aGUgdmFsdWUgaW4gdGhlIGFycmF5XHJcbiAgICAgICAgdGhpcy5hdWRpb0xldmVscy5wdXNoKGF1ZGlvTGV2ZWwpO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxjdWxhdGUgdGhlIGF2ZXJhZ2UgYXVkaW8gbGV2ZWxzIHdpdGggdGhlIGRhdGEgY29sbGVjdGVkIHNvIGZhclxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4ge051bWJlcn0gVGhlIGF2ZXJhZ2UgYXVkaW8gbGV2ZWwgbWVhc3VyZWQgb3ZlciBhbGwgdGhlIHZhbHVlcyByZWNvcmRlZFxyXG4gICAgICovXHJcbiAgICBjYWxjdWxhdGVBdmVyYWdlQXVkaW86IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgYXZlcmFnZUF1ZGlvID0gVXRpbHMuYXZlcmFnZUFycmF5KHRoaXMuYXVkaW9MZXZlbHMpO1xyXG5cclxuICAgICAgICAvL0VtcHR5IHRoZSBhcnJheSBhZ2FpblxyXG4gICAgICAgIHRoaXMuYXVkaW9MZXZlbHMgPSBbXTtcclxuXHJcbiAgICAgICAgLy9SZXR1cm4gdGhlIGF2ZXJhZ2UgYXVkaW8gbGV2ZWxcclxuICAgICAgICByZXR1cm4gYXZlcmFnZUF1ZGlvO1xyXG5cclxuICAgIH1cclxuXHJcbn07XHJcblxyXG4vL0V4cG9ydCB0aGUgQnJvd3NlcmlmeSBtb2R1bGVcclxubW9kdWxlLmV4cG9ydHMgPSBNZWFzdXJlU3lzdGVtO1xyXG4iLCIvL0JlY2F1c2UgQnJvd3NlcmlmeSBlbmNhcHN1bGF0ZXMgZXZlcnkgbW9kdWxlLCB1c2Ugc3RyaWN0IHdvbid0IGFwcGx5IHRvIHRoZSBnbG9iYWwgc2NvcGUgYW5kIGJyZWFrIGV2ZXJ5dGhpbmdcclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIEV2ZW50ID0gcmVxdWlyZSgnLi4vY29yZS9ldmVudC5qcycpLFxyXG4gICAgVXRpbHMgPSByZXF1aXJlKCcuLi9jb3JlL3V0aWxzLmpzJyk7XHJcblxyXG4vKipcclxuICogVGFzayBTeXN0ZW0gY29uc3RydWN0b3JcclxuICpcclxuICogQGNsYXNzIFRhc2tTeXN0ZW1cclxuICogQGNsYXNzZGVzYyBBIHN5c3RlbSB0aGF0IG1hbmFnZXMgYWxsIHRoaW5ncyB0YXNrIHJlbGF0ZWRcclxuICovXHJcbnZhciBUYXNrU3lzdGVtID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcGVydHkge0V2ZW50fSBldmVudHMgLSBIb2xkcyBhbGwgdGhlIGV2ZW50cyB0aGF0IG5lZWQgdG8gYmUgdHJpZ2dlcmVkIHdpdGhpbiB0aGUgdGFzayBzeXN0ZW1cclxuICAgICAqL1xyXG4gICAgdGhpcy5ldmVudHMgPSBuZXcgRXZlbnQoKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXl9IHRhc2tzIC0gQW4gYXNzb2NpYXRpdmUgYXJyYXkgZmlsbGVkIHdpdGggYWxsIHRoZSB0YXNrcyB0byBiZSBleGVjdXRlZFxyXG4gICAgICovXHJcbiAgICB0aGlzLnRhc2tzID0gW107XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcGVydHkge1Rhc2t9IGN1cnJlbnRUYXNrIC0gVGhlIHRhc2sgdGhpcyBzeXN0ZW0gaXMgY3VycmVudGx5IGV4ZWN1dGluZ1xyXG4gICAgICovXHJcbiAgICB0aGlzLmN1cnJlbnRUYXNrID0gbnVsbDtcclxuXHJcbn07XHJcblxyXG5UYXNrU3lzdGVtLnByb3RvdHlwZSA9IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIHdoZXRoZXIgdGhlIGVudGl0eSBpcyBidXN5IG9yIG5lZWRzIGEgbmV3IHRhc2tcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIHJ1bjogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIC8vQ2hlY2sgaWYgdGhpcyBlbnRpdHkgaXMgY3VycmVudGx5IGJ1c3kgd2l0aCBoaXMgY3VycmVudCB0YXNrXHJcbiAgICAgICAgaWYodGhpcy5jdXJyZW50VGFzay5zdGF0ZSA9PT0gJ2J1c3knKXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9UaGVyZSBpcyBhIG5ldyB0YXNrLCBzbyB0cmlnZ2VyIHRoYXQgZXZlbnRcclxuICAgICAgICB0aGlzLmV2ZW50cy50cmlnZ2VyKCdmaW5pc2hlZCcpO1xyXG5cclxuICAgICAgICAvL0JlZm9yZSBsb2FkaW5nIG5ldyB0YXNrLCBjaGVjayBhdWRpbyBsZXZlbHMgb24gY3VycmVudCB0YXNrXHJcbiAgICAgICAgLy9JZiB0aGVyZSBhcmUgbW9yZSB0aGFuIDUgYXVkaW8gbGV2ZWxzIHRoZXJlLCBtYWtlIGEgZGVjaXNpb24gaWYgaXQncyBsb3VkXHJcbiAgICAgICAgaWYodGhpcy5jdXJyZW50VGFzay5tZWFzdXJlbWVudHMuYXVkaW8ubGVuZ3RoID49IDUpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBhdmVyYWdlVm9sdW1lID0gVXRpbHMuYXZlcmFnZUFycmF5KHRoaXMuY3VycmVudFRhc2subWVhc3VyZW1lbnRzLmF1ZGlvKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGF2ZXJhZ2VWb2x1bWUgPiA0MCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRUYXNrLmlzTG91ZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50VGFzay5pc0xvdWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9DbGVhciB0aGUgYXJyYXksIGJ1dCBhZGQgdGhlIGF2ZXJhZ2Ugdm9sdW1lIHRoYXQgd2FzIGp1c3QgbWVhc3VyZWRcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VGFzay5tZWFzdXJlbWVudHMuYXVkaW8gPSBbXTtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VGFzay5tZWFzdXJlbWVudHMuYXVkaW8ucHVzaChhdmVyYWdlVm9sdW1lKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL1RoZSBlbnRpdHkgaXMgZG9uZSB3aXRoIGhpcyBjdXJyZW50IHRhc2ssIHNvIGhlIGhhcyB0byBwaWNrIGFub3RoZXIgb25lXHJcbiAgICAgICAgdmFyIHBvc3NpYmxlVGFza3MgPSB0aGlzLmdldFBvc3NpYmxlVGFza3MoKTtcclxuXHJcbiAgICAgICAgLy9QaWNrIGEgdGFzayB0byBleGVjdXRlIHJpZ2h0IG5vdyBmcm9tIGFsbCB0aGUgYXZhaWxhYmxlIHRhc2tzXHJcbiAgICAgICAgdGhpcy5jdXJyZW50VGFzayA9IHRoaXMucGlja1Rhc2socG9zc2libGVUYXNrcyk7XHJcblxyXG4gICAgICAgIC8vUnVuIHRoZSBuZXcgY3VycmVudCB0YXNrIVxyXG4gICAgICAgIHRoaXMuY3VycmVudFRhc2sucnVuKCk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBhIGNlcnRhaW4gdGFzayBmcm9tIHRoaXMgZW50aXR5XHJcbiAgICAgKiBAcHVibGljXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IC0gVGhlIG51bWJlciBvZiB0aGUgdGFzayB0aGF0IGlzIGdvaW5nIHRvIGJlIHJldHVybmVkXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgdGFzayB0aGF0IHRoaXMgZW50aXR5IGhhcyBhdCB0aGUgc3BlY2lmaWVkIGluZGV4XHJcbiAgICAgKi9cclxuICAgIGdldFRhc2s6IGZ1bmN0aW9uKGluZGV4KSB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnRhc2tzW2luZGV4XTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGEgdGFzayB0byB0aGlzIGVudGl0eVxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0YXNrIC0gVGhlIHRhc2sgdGhhdCBpcyBnZXR0aW5nIGFkZGVkIHRvIHRoaXMgZW50aXR5XHJcbiAgICAgKi9cclxuICAgIGFkZFRhc2s6IGZ1bmN0aW9uKHRhc2spIHtcclxuXHJcbiAgICAgICAgLy9BZGQgdGhlIHRhc2tcclxuICAgICAgICB0aGlzLnRhc2tzLnB1c2godGFzayk7XHJcblxyXG4gICAgICAgIC8vQ2hlY2sgaWYgdGhlIGVudGl0eSBuZWVkcyB0byBzdGFydCB3aXRoIHRoaXMgdGFza1xyXG4gICAgICAgIGlmKHRoaXMuY3VycmVudFRhc2sgPT09IG51bGwpe1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VGFzayA9IHRhc2s7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFRhc2sucnVuKCk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlIGEgdGFzayBmcm9tIHRoaXMgZW50aXR5XHJcbiAgICAgKiBAcHVibGljXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IC0gVGhlIG51bWJlciBvZiB0aGUgdGFzayB0aGF0IGlzIGdvaW5nIHRvIGJlIHJlbW92ZWRcclxuICAgICAqL1xyXG4gICAgcmVtb3ZlVGFzazogZnVuY3Rpb24oaW5kZXgpIHtcclxuXHJcbiAgICAgICAgLy9SZW1vdmUgdGhlIHRhc2tcclxuICAgICAgICB0aGlzLnRhc2suc3BsaWNlKGluZGV4LCAxKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ291bnQgdGhlIG51bWJlciBvZiB0YXNrcyBhbmQgcmV0dXJuIHRoZSBudW1iZXJcclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TnVtYmVyfVxyXG4gICAgICovXHJcbiAgICB0b3RhbFRhc2tzOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGFza3MubGVuZ3RoKCk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBhIGxpc3Qgb2YgYWxsIHBvc3NpYmxlIHRhc2sgdG8gZXhlY3V0ZSBhdCB0aGlzIHZlcnkgbW9tZW50XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtBcnJheX1cclxuICAgICAqL1xyXG4gICAgZ2V0UG9zc2libGVUYXNrczogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIC8vVGhlIGVudGl0eSBpcyBkb25lIHdpdGggaGlzIGN1cnJlbnQgdGFzaywgc28gaGUgaGFzIHRvIHBpY2sgYW5vdGhlciBvbmVcclxuICAgICAgICB2YXIgcG9zc2libGVUYXNrcyA9IFtdO1xyXG5cclxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy50YXNrcy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgaWYodGhpcy50YXNrc1tpXS5pc0xvdWQgJiYgIShnbG9iYWxTZXR0aW5ncy5jdXJyZW50VGltZSA+PSA5ICYmIGdsb2JhbFNldHRpbmdzLmN1cnJlbnRUaW1lIDw9IDIyKSl7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcG9zc2libGVUYXNrcy5wdXNoKHRoaXMudGFza3NbaV0pO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBwb3NzaWJsZVRhc2tzO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQaWNrIGEgdGFzayBmcm9tIGEgbGlzdCBvZiBwcm92aWRlZCBhdmFpbGFibGUgdGFza3NcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtBcnJheX0gdGFza3MgLSBBbiBhcnJheSB3aXRoIGFsbCB0aGUgcG9zc2libGUgdGFza3MgdG8gcGljayBmcm9tXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMge1Rhc2t9XHJcbiAgICAgKi9cclxuICAgIHBpY2tUYXNrOiBmdW5jdGlvbiAodGFza3MpIHtcclxuXHJcbiAgICAgICAgLy9MZXQganVzdCBhc3N1bWUgdGhlIGZpcnN0IHRhc2sgaXMgdGhlIGxhc3QgdGFzaywgZG9lc24ndCByZWFsbHkgbWF0dGVyIGFzIGxvbmcgYXMgd2UgaGF2ZSBhIHZhbHVlIHRvIGNoZWNrIGFnYWluc3RcclxuICAgICAgICB2YXIgb2xkZXN0VGFzayA9IHRhc2tzWzBdO1xyXG5cclxuICAgICAgICAvL0xvb3AgdGhyb3VnaCB0aGUgcHJvdmlkZWQgdGFza3NcclxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGFza3MubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIC8vSWYgYSB0YXNrIGhhcyBuZXZlciBiZWVuIGV4ZWN1dGVkIGJlZm9yZSwganVzdCBzdGFydCB3aXRoIHRoYXQgb25lXHJcbiAgICAgICAgICAgIGlmKHRhc2tzW2ldLmxhc3RGaW5pc2hlZCA9PT0gbnVsbCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFza3NbaV07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vSWYgdGhlIGN1cnJlbnQgdGFzayBpcyBvbGRlciB0aGFuIHRoZSBjdXJyZW50IG9sZGVzdCB0YXNrLCByZXBsYWNlIGl0XHJcbiAgICAgICAgICAgIGlmKHRhc2tzW2ldLmxhc3RGaW5pc2hlZCA8IG9sZGVzdFRhc2subGFzdEZpbmlzaGVkKXtcclxuICAgICAgICAgICAgICAgIG9sZGVzdFRhc2sgPSB0YXNrc1tpXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vUmV0dXJuIHRoZSBvbGRlc3QgdGFzayB0byBleGVjdXRlIG5vd1xyXG4gICAgICAgIHJldHVybiBvbGRlc3RUYXNrO1xyXG5cclxuICAgIH1cclxuXHJcbn07XHJcblxyXG4vL0V4cG9ydCB0aGUgQnJvd3NlcmlmeSBtb2R1bGVcclxubW9kdWxlLmV4cG9ydHMgPSBUYXNrU3lzdGVtO1xyXG4iLCIvL0JlY2F1c2UgQnJvd3NlcmlmeSBlbmNhcHN1bGF0ZXMgZXZlcnkgbW9kdWxlLCB1c2Ugc3RyaWN0IHdvbid0IGFwcGx5IHRvIHRoZSBnbG9iYWwgc2NvcGUgYW5kIGJyZWFrIGV2ZXJ5dGhpbmdcclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy9SZXF1aXJlIG5lY2Vzc2FyeSBtb2R1bGVzXHJcbnZhciBUYXNrID0gcmVxdWlyZSgnLi90YXNrLmpzJyk7XHJcblxyXG4vKipcclxuICogTW9wcGluZyBUYXNrIGNvbnN0cnVjdG9yXHJcbiAqXHJcbiAqIEBjbGFzcyBNb3BcclxuICogQGNsYXNzZGVzYyBFeGVjdXRlIGEgZ2l2ZW4gdGFzayBhbmQgcmV0dXJuIHRoZSByZXN1bHRcclxuICogSW5oZXJpdHMgZnJvbSBUYXNrXHJcbiAqL1xyXG52YXIgTW9wID0gZnVuY3Rpb24oZW50aXR5KSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbmhlcml0IHRoZSBjb25zdHJ1Y3RvciBmcm9tIHRoZSBFbGVtZW50IGNsYXNzXHJcbiAgICAgKi9cclxuICAgIFRhc2suY2FsbCh0aGlzLCBlbnRpdHkpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSBvZiB0aGlzIHRhc2suXHJcbiAgICAgKi9cclxuICAgIHRoaXMubmFtZSA9ICdNb3AnO1xyXG5cclxufTtcclxuXHJcbk1vcC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFRhc2sucHJvdG90eXBlLCB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGdW5jdGlvbiB0aGF0IGlzIGNhbGxlZCB3aGVuZXZlciB0aGUgc3lzdGVtIHVwZGF0ZXNcclxuICAgICAqIEBwcm90ZWN0ZWRcclxuICAgICAqL1xyXG4gICAgcnVuOiB7XHJcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgLy9TdGFydCB0aGUgdGFza1xyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0KCk7XHJcblxyXG4gICAgICAgICAgICAvL0V4ZWN1dGUgdGhlIHRhc2tcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0lcXCdtIG1vcHBpbmcgdGhlIGZsb29yIG5vdycpO1xyXG5cclxuICAgICAgICAgICAgLy9TdGFydCB0aGUgVHdlZW4gYW5pbWF0aW9uIGluIHRoZSBkZW1vbnN0cmF0aW9uIHdvcmxkXHJcbiAgICAgICAgICAgIFR3ZWVuTWF4LnRvKHRoaXMuZW50aXR5Lm1lc2gucm90YXRpb24sIDMsIHtcclxuICAgICAgICAgICAgICAgIHkgOiB0aGlzLmVudGl0eS5tZXNoLnJvdGF0aW9uLnkgKyAxMCxcclxuICAgICAgICAgICAgICAgIG9uQ29tcGxldGU6IHRoaXMuZmluaXNoLmJpbmQodGhpcylcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0pO1xyXG5cclxuLy9FeHBvcnQgdGhlIEJyb3dzZXJpZnkgbW9kdWxlXHJcbm1vZHVsZS5leHBvcnRzID0gTW9wO1xyXG4iLCIvL0JlY2F1c2UgQnJvd3NlcmlmeSBlbmNhcHN1bGF0ZXMgZXZlcnkgbW9kdWxlLCB1c2Ugc3RyaWN0IHdvbid0IGFwcGx5IHRvIHRoZSBnbG9iYWwgc2NvcGUgYW5kIGJyZWFrIGV2ZXJ5dGhpbmdcclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuLyoqXHJcbiAqIFRhc2sgY29uc3RydWN0b3JcclxuICpcclxuICogQGNsYXNzIFRhc2tcclxuICogQGNsYXNzZGVzYyBUaGUgYmFzZSBjbGFzcyBmb3IgdGFza3NcclxuICpcclxuICogQHBhcmFtIHtFbnRpdHl9IGVudGl0eSAtIEEgcmVmZXJlbmNlIHRvIHRoZSBlbnRpdHkgdGhhdCBoYXMgdGhpcyB0YXNrXHJcbiAqL1xyXG52YXIgVGFzayA9IGZ1bmN0aW9uKGVudGl0eSkge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSBvZiB0aGlzIHN0YXR1cyBlZmZlY3QuIFRoaXMgZmllbGQgaXMgYWx3YXlzIHJlcXVpcmVkIVxyXG4gICAgICovXHJcbiAgICB0aGlzLm5hbWUgPSAnQmFzZSBUYXNrJztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBzdGF0ZSAtIFRoZSBjdXJyZW50IHN0YXRlIG9mIHRoaXMgdGFzay4gQ2FuIGJlIERvbmUsIEJ1c3ksIFByb2JsZW0sIFBsYW5uZWRcclxuICAgICAqL1xyXG4gICAgdGhpcy5zdGF0ZSA9ICdwbGFubmVkJztcclxuXHJcbiAgICAvKipcclxuICAgICAqIHtCb29sZWFufSBpc0xvdWQgLSBCb29sZWFuIGlmIHRoZSB0YXNrIGlzIGxvdWQgb3Igbm90XHJcbiAgICAgKi9cclxuICAgIHRoaXMuaXNMb3VkID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBsYXN0RmluaXNoZWQgLSBUaW1lc3RhbXAgb2Ygd2hlbiB0aGUgdGFzayBpcyBleGVjdXRlZCBmb3IgdGhlIGxhc3QgdGltZVxyXG4gICAgICovXHJcbiAgICB0aGlzLmxhc3RGaW5pc2hlZCA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcGVydHkge0VudGl0eX0gZW50aXR5IC0gQSByZWZlcmVuY2UgdG8gdGhlIGVudGl0eSB0aGF0IGhhcyB0aGlzIHRhc2tcclxuICAgICAqL1xyXG4gICAgdGhpcy5lbnRpdHkgPSBlbnRpdHk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcGVydHkge09iamVjdH0gbWVhc3VyZW1lbnRzIC0gT2JqZWN0IHdoaWNoIGhvbGRzIGFsbCBtZWFzdXJlbWVudHMgZm9yIHRoZSBjdXJyZW50IHRhc2tcclxuICAgICAqL1xyXG4gICAgdGhpcy5tZWFzdXJlbWVudHMgPSB7XHJcbiAgICAgICAgYXVkaW86IFtdXHJcbiAgICB9XHJcblxyXG59O1xyXG5cclxuVGFzay5wcm90b3R5cGUgPSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGdW5jdGlvbiB0aGF0IGlzIGNhbGxlZCB3aGVuZXZlciB0aGUgc3lzdGVtIHVwZGF0ZXNcclxuICAgICAqIFRoaXMgZnVuY3Rpb24gc2hvdWxkIGJlIG92ZXJ3cml0dGVuIGJ5IGN1c3RvbSB0YXNrc1xyXG4gICAgICogQHByb3RlY3RlZFxyXG4gICAgICovXHJcbiAgICBydW46IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAvL1NpbGVuY2UgaXMgZ29sZGVuXHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEJvb3RzdHJhcCBhbmQgc3RhcnQgdGhpcyB0YXNrXHJcbiAgICAgKiBAcHJvdGVjdGVkXHJcbiAgICAgKi9cclxuICAgIHN0YXJ0OiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9ICdidXN5JztcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRmluaXNoIHRoaXMgdGFzayBhbmQgcmVwb3J0IHJlc3VsdHNcclxuICAgICAqIEBwcm90ZWN0ZWRcclxuICAgICAqL1xyXG4gICAgZmluaXNoOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgLy9DaGFuZ2UgdGhlIHN0YXRlIG9mIHRoZSB0YXNrXHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9ICdkb25lJztcclxuXHJcbiAgICAgICAgLy9DcmVhdGUgYSB0aW1lc3RhbXAgZm9yIHdoZW4gdGhpcyB0YXNrIGlzIGZpbmlzaGVkXHJcbiAgICAgICAgdGhpcy5sYXN0RmluaXNoZWQgPSBEYXRlLm5vdygpO1xyXG5cclxuICAgIH1cclxuXHJcbn07XHJcblxyXG4vL0V4cG9ydCB0aGUgQnJvd3NlcmlmeSBtb2R1bGVcclxubW9kdWxlLmV4cG9ydHMgPSBUYXNrO1xyXG4iLCIvL0JlY2F1c2UgQnJvd3NlcmlmeSBlbmNhcHN1bGF0ZXMgZXZlcnkgbW9kdWxlLCB1c2Ugc3RyaWN0IHdvbid0IGFwcGx5IHRvIHRoZSBnbG9iYWwgc2NvcGUgYW5kIGJyZWFrIGV2ZXJ5dGhpbmdcclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy9SZXF1aXJlIG5lY2Vzc2FyeSBtb2R1bGVzXHJcbnZhciBUYXNrID0gcmVxdWlyZSgnLi90YXNrLmpzJyksXHJcbiAgICBVdGlscyA9IHJlcXVpcmUoJy4uL2NvcmUvdXRpbHMuanMnKTtcclxuXHJcbi8qKlxyXG4gKiBWYWN1dW0gVGFzayBjb25zdHJ1Y3RvclxyXG4gKlxyXG4gKiBAY2xhc3MgVmFjdXVtXHJcbiAqIEBjbGFzc2Rlc2MgRXhlY3V0ZSBhIGdpdmVuIHRhc2sgYW5kIHJldHVybiB0aGUgcmVzdWx0XHJcbiAqIEluaGVyaXRzIGZyb20gVGFza1xyXG4gKi9cclxudmFyIFZhY3V1bSA9IGZ1bmN0aW9uKGVudGl0eSkge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5oZXJpdCB0aGUgY29uc3RydWN0b3IgZnJvbSB0aGUgRWxlbWVudCBjbGFzc1xyXG4gICAgICovXHJcbiAgICBUYXNrLmNhbGwodGhpcywgZW50aXR5KTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBuYW1lIC0gVGhlIG5hbWUgb2YgdGhpcyB0YXNrLlxyXG4gICAgICovXHJcbiAgICB0aGlzLm5hbWUgPSAnVmFjdXVtJztcclxuXHJcbn07XHJcblxyXG5WYWN1dW0ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShUYXNrLnByb3RvdHlwZSwge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgd2hlbmV2ZXIgdGhlIHN5c3RlbSB1cGRhdGVzXHJcbiAgICAgKiBAcHJvdGVjdGVkXHJcbiAgICAgKi9cclxuICAgIHJ1bjoge1xyXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIC8vU3RhcnQgdGhlIHRhc2tcclxuICAgICAgICAgICAgdGhpcy5zdGFydCgpO1xyXG5cclxuICAgICAgICAgICAgLy9FeGVjdXRlIHRoZSB0YXNrXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdJXFwnbSB2YWN1dW1pbmcgbm93Jyk7XHJcblxyXG4gICAgICAgICAgICAvL0dldCBhIG5ldyByYW5kb20gcG9zaXRpb24gb24gdGhlIG1hcCB0byBnbyB0b1xyXG4gICAgICAgICAgICB2YXIgbmV3UG9zaXRpb24gPSB7XHJcbiAgICAgICAgICAgICAgICB4OiBVdGlscy5yYW5kb21OdW1iZXJTdGVwcygtMTAwLCAxMDAsIDIwKSxcclxuICAgICAgICAgICAgICAgIHo6IFV0aWxzLnJhbmRvbU51bWJlclN0ZXBzKC0xMDAsIDEwMCwgMjApXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAvL0NhbGN1bGF0ZSB0aGUgWCBhbmQgWiBkaXN0YW5jZVxyXG4gICAgICAgICAgICB2YXIgZGlzdGFuY2UgPSB7XHJcbiAgICAgICAgICAgICAgICB4OiBNYXRoLmFicyhuZXdQb3NpdGlvbi54IC0gdGhpcy5lbnRpdHkubWVzaC5wb3NpdGlvbi54KSxcclxuICAgICAgICAgICAgICAgIHo6IE1hdGguYWJzKG5ld1Bvc2l0aW9uLnogLSB0aGlzLmVudGl0eS5tZXNoLnBvc2l0aW9uLnopXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAvL0NhbGN1bGF0ZSB0aGUgdG90YWwgZGlzdGFuY2UgYW5kIHRoZSB0aW1lIGl0IHdvdWxkIHRha2UgdG8gdHJhdmVyc2UgdGhhdCBkaXN0YW5jZVxyXG4gICAgICAgICAgICB2YXIgdG90YWxEaXN0YW5jZSA9IGRpc3RhbmNlLnggKyBkaXN0YW5jZS56O1xyXG4gICAgICAgICAgICB2YXIgdGltZSA9IHRvdGFsRGlzdGFuY2UgLyAzNTtcclxuXHJcbiAgICAgICAgICAgIC8vU3RhcnQgdGhlIFR3ZWVuIGFuaW1hdGlvbiBpbiB0aGUgZGVtb25zdHJhdGlvbiB3b3JsZFxyXG4gICAgICAgICAgICBUd2Vlbk1heC50byh0aGlzLmVudGl0eS5tZXNoLnBvc2l0aW9uLCB0aW1lLCB7XHJcbiAgICAgICAgICAgICAgICB4IDogbmV3UG9zaXRpb24ueCxcclxuICAgICAgICAgICAgICAgIHogOiBuZXdQb3NpdGlvbi56LFxyXG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZTogdGhpcy5maW5pc2guYmluZCh0aGlzKVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSk7XHJcblxyXG4vL0V4cG9ydCB0aGUgQnJvd3NlcmlmeSBtb2R1bGVcclxubW9kdWxlLmV4cG9ydHMgPSBWYWN1dW07XHJcbiIsIi8vQmVjYXVzZSBCcm93c2VyaWZ5IGVuY2Fwc3VsYXRlcyBldmVyeSBtb2R1bGUsIHVzZSBzdHJpY3Qgd29uJ3QgYXBwbHkgdG8gdGhlIGdsb2JhbCBzY29wZSBhbmQgYnJlYWsgZXZlcnl0aGluZ1xuJ3VzZSBzdHJpY3QnO1xuXG4vL1JlcXVpcmUgbmVjZXNzYXJ5IG1vZHVsZXNcbi8vIC0tIE5vbmUgeWV0XG5cbi8qKlxuICogU2V0dGluZ3MgY29uc3RydWN0b3JcbiAqXG4gKiBAY2xhc3MgU2V0dGluZ3NcbiAqIEBjbGFzc2Rlc2MgVGhlIFNldHRpbmdzIG9iamVjdCBob2xkcyB0aGUgZnVuY3Rpb25hbGl0eSBmb3IgdGhlIEdVSVxuICovXG52YXIgU2V0dGluZ3MgPSBmdW5jdGlvbihzeXN0ZW0pIHtcblxuICAgIHRoaXMudmFsdWVzID0gbnVsbDtcblxuICAgIHRoaXMuZ3VpID0gbnVsbDtcblxuICAgIHRoaXMuc3lzdGVtID0gc3lzdGVtO1xuXG4gICAgdGhpcy5pbml0aWFsaXplKCk7XG5cbn07XG5cblNldHRpbmdzLnByb3RvdHlwZSA9IHtcblxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKHMpXG4gICAge1xuXG4gICAgICAgIHZhciB0b2RheSA9IG5ldyBEYXRlKCk7XG5cbiAgICAgICAgdmFyIHZhbHVlc09iamVjdCA9IGZ1bmN0aW9uICgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuZ2xvYmFsTm9pc2UgPSAxMDtcbiAgICAgICAgICAgIHRoaXMudmFjdXVtTm9pc2UgPSA3MDtcbiAgICAgICAgICAgIHRoaXMubW9wTm9pc2UgPSAwO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50VGltZSA9IHRvZGF5LmdldEhvdXJzKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy52YWx1ZXMgPSBuZXcgdmFsdWVzT2JqZWN0KCk7XG4gICAgICAgIGdsb2JhbFNldHRpbmdzID0gdGhpcy52YWx1ZXM7XG5cbiAgICAgICAgdGhpcy5ndWkgPSBuZXcgZGF0LkdVSSgpO1xuXG4gICAgICAgIHZhciBub2lzZUZvbGRlciA9IHRoaXMuZ3VpLmFkZEZvbGRlcignTm9pc2UnKTtcbiAgICAgICAgbm9pc2VGb2xkZXIuYWRkKHRoaXMudmFsdWVzLCAnZ2xvYmFsTm9pc2UnLCAwLCAxMDApO1xuICAgICAgICBub2lzZUZvbGRlci5hZGQodGhpcy52YWx1ZXMsICd2YWN1dW1Ob2lzZScsIDAsIDEwMCk7XG4gICAgICAgIG5vaXNlRm9sZGVyLmFkZCh0aGlzLnZhbHVlcywgJ21vcE5vaXNlJywgMCwgMTAwKTtcblxuICAgICAgICB2YXIgdGltZUZvbGRlciA9IHRoaXMuZ3VpLmFkZEZvbGRlcignVGltZScpO1xuICAgICAgICB0aW1lRm9sZGVyLmFkZCh0aGlzLnZhbHVlcywgJ2N1cnJlbnRUaW1lJywgMSwgMjQpO1xuXG4gICAgfVxuXG59O1xuXG4vL0V4cG9ydCB0aGUgQnJvd3NlcmlmeSBtb2R1bGVcbm1vZHVsZS5leHBvcnRzID0gU2V0dGluZ3M7XG4iLCIvL0JlY2F1c2UgQnJvd3NlcmlmeSBlbmNhcHN1bGF0ZXMgZXZlcnkgbW9kdWxlLCB1c2Ugc3RyaWN0IHdvbid0IGFwcGx5IHRvIHRoZSBnbG9iYWwgc2NvcGUgYW5kIGJyZWFrIGV2ZXJ5dGhpbmdcclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuLyoqXHJcbiAqIFdvcmxkIGNvbnN0cnVjdG9yXHJcbiAqXHJcbiAqIEBjbGFzcyBXb3JsZFxyXG4gKiBAY2xhc3NkZXNjIFRoZSBXb3JsZCBvYmplY3QgaG9sZHMgYWxsIG9iamVjdHMgdGhhdCBhcmUgaW4gdGhlIGRlbW9uc3RyYXRpb24gd29ybGQsIHRoZSBtYXAgZXRjLlxyXG4gKi9cclxudmFyIFdvcmxkID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB7T2JqZWN0fSBjb250YWluZXIgLSBUaGUgY29udGFpbmVyIHRoYXQgaG9sZHMgdGhlIGNhbnZhcyBvYmplY3RcclxuICAgICAqL1xyXG4gICAgdGhpcy5jb250YWluZXIgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtUSFJFRS5TY2VuZX0gc2NlbmUgLSBSZWZlcmVuY2UgdG8gdGhlIHNjZW5lXHJcbiAgICAgKi9cclxuICAgIHRoaXMuc2NlbmUgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYX0gY2FtZXJhIC0gUmVmZXJlbmNlIHRvIHRoZSBjYW1lcmFcclxuICAgICAqL1xyXG4gICAgdGhpcy5jYW1lcmEgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtUSFJFRS5XZWJHTFJlbmRlcmVyfSByZW5kZXJlciAtIFJlZmVyZW5jZSB0byB0aGUgcmVuZGVyZXJcclxuICAgICAqL1xyXG4gICAgdGhpcy5yZW5kZXJlciA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcGVydHkge1RIUkVFLlRyYWNrYmFsbENvbnRyb2xzfSBjb250cm9scyAtIFJlZmVyZW5jZSB0byB0aGUgY29udHJvbHMgb2JqZWN0XHJcbiAgICAgKi9cclxuICAgIHRoaXMuY29udHJvbHMgPSBudWxsO1xyXG5cclxuICAgIC8vSW5pdGlhbGl6ZSBpdHNlbGZcclxuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xyXG5cclxufTtcclxuXHJcbldvcmxkLnByb3RvdHlwZSA9IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgdGhlIFVJIGVsZW1lbnRzIGFuZCBhZGQgdGhlbSB0byB0aGlzIGNvbnRhaW5lclxyXG4gICAgICogQHByb3RlY3RlZFxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIC8vR2V0IHRoZSBjb250YWluZXIgb2JqZWN0IGZvciBsYXRlciB1c2UgdGhyb3VnaCB0aGlzIHNjcmlwdFxyXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhaW5lcicpO1xyXG5cclxuICAgICAgICAvL0luaXRpYWxpemUgdGhlIGNhbWVyYVxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUNhbWVyYSgpO1xyXG5cclxuICAgICAgICAvL0luaXRpYWxpemUgdGhlIG1vdXNlIGNvbnRyb2xzXHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplQ29udHJvbHMoKTtcclxuXHJcbiAgICAgICAgLy9DcmVhdGUgdGhlIHN0YWdlLCBhZGQgYSBsaWdodCBhbmQgYSBmbG9vclxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVN0YWdlKCk7XHJcblxyXG4gICAgICAgIC8vSW5pdGlhbGl6ZSB0aGUgcmVuZGVyZXIgYW5kIGNvbmZpZ3VyZSBpdFxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZVJlbmRlcmVyKCk7XHJcblxyXG4gICAgICAgIC8vQWRkIGFuIGV2ZW50IGxpc3RlbmVyIGZvciB3aGVuIHRoZSB1c2VyIHJlc2l6ZXMgaGlzIHdpbmRvd1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLm9uV2luZG93UmVzaXplLmJpbmQodGhpcyksIGZhbHNlKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZSBhbmQgc2V0dXAgdGhlIGNhbWVyYVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZUNhbWVyYTogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIC8vQ3JlYXRlIGEgbmV3IGNhbWVyYSBvYmplY3RcclxuICAgICAgICB0aGlzLmNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg0NSwgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsIDEsIDEwMDAwKTtcclxuXHJcbiAgICAgICAgLy9Db25maWd1cmUgdGhlIGNhbWVyYVxyXG4gICAgICAgIHRoaXMuY2FtZXJhLnBvc2l0aW9uLnNldCgxMjAsIDE0MCwgMTUwKVxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIGFuZCBzZXR1cCB0aGUgY29udHJvbHNcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVDb250cm9sczogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIC8vQ3JlYXRlIGEgbmV3IGNvbnRyb2xzIG9iamVjdFxyXG4gICAgICAgIHRoaXMuY29udHJvbHMgPSBuZXcgVEhSRUUuVHJhY2tiYWxsQ29udHJvbHModGhpcy5jYW1lcmEsIHRoaXMuY29udGFpbmVyKTtcclxuXHJcbiAgICAgICAgLy9TZXR1cCB0aGUgY29udHJvbHNcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLnJvdGF0ZVNwZWVkID0gMS4wO1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMuem9vbVNwZWVkID0gMS4yO1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMucGFuU3BlZWQgPSAxLjA7XHJcbiAgICAgICAgdGhpcy5jb250cm9scy5ub1pvb20gPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLm5vUGFuID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5jb250cm9scy5zdGF0aWNNb3ZpbmcgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMuZHluYW1pY0RhbXBpbmdGYWN0b3IgPSAwLjM7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgYW5kIHNldHVwIHRoZSBzdGFnZVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZVN0YWdlOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgLy9DcmVhdGUgYSBuZXcgc2NlbmUgYW5kIGFkZCBhbiBhbWJpZW50IGxpZ2h0XHJcbiAgICAgICAgdGhpcy5zY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xyXG5cclxuICAgICAgICAvL0NyZWF0ZSBhIG5ldyBoZW1pbGlnaHRcclxuICAgICAgICB2YXIgaGVtaUxpZ2h0ID0gbmV3IFRIUkVFLkhlbWlzcGhlcmVMaWdodCgweGZmZmZmZiwgMHhmZmZmZmYsIDAuNik7XHJcblxyXG4gICAgICAgIC8vQ29uZmlndXJlIHRoZSBoZW1pbGlnaHRcclxuICAgICAgICBoZW1pTGlnaHQuY29sb3Iuc2V0SFNMKDAuNiwgMSwgMC42KTtcclxuICAgICAgICBoZW1pTGlnaHQuZ3JvdW5kQ29sb3Iuc2V0SFNMKDAuMDk1LCAxLCAwLjc1KTtcclxuICAgICAgICBoZW1pTGlnaHQucG9zaXRpb24uc2V0KDAsIDUwMCwgMCk7XHJcblxyXG4gICAgICAgIC8vQWRkIHRoZSBoZW1pbGlnaHQgdG8gdGhlIHN0YWdlXHJcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoaGVtaUxpZ2h0KTtcclxuXHJcbiAgICAgICAgLy9DcmVhdGUgYSBuZXcgZGlyZWN0aW9uYWwgbGlnaHRcclxuICAgICAgICB2YXIgZGlyTGlnaHQgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZiwgMSk7XHJcblxyXG4gICAgICAgIC8vQ29uZmlndXJlIHRoZSBkaXJlY3Rpb25hbCBsaWdodFxyXG4gICAgICAgIGRpckxpZ2h0LmNvbG9yLnNldEhTTCgwLjEsIDEsIDAuOTUpO1xyXG4gICAgICAgIGRpckxpZ2h0LnBvc2l0aW9uLnNldCgtMSwgMSwgNCk7XHJcbiAgICAgICAgZGlyTGlnaHQucG9zaXRpb24ubXVsdGlwbHlTY2FsYXIoNTApO1xyXG5cclxuICAgICAgICAvL0FkZCB0aGUgbGlnaHQgdG8gdGhlIHNjZW5lXHJcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoZGlyTGlnaHQpO1xyXG5cclxuICAgICAgICAvL0RlZmF1bHQgYXJpYWJsZSBmb3IgdGhlIGxpZ2h0XHJcbiAgICAgICAgdmFyIGQgPSA1MDA7XHJcblxyXG4gICAgICAgIC8vQ29uZmlndXJlIHRoZSBsaWdodFxyXG4gICAgICAgIGRpckxpZ2h0LmNhc3RTaGFkb3cgPSB0cnVlO1xyXG4gICAgICAgIGRpckxpZ2h0LnNoYWRvd01hcFdpZHRoID0gMjA0ODtcclxuICAgICAgICBkaXJMaWdodC5zaGFkb3dNYXBIZWlnaHQgPSAyMDQ4O1xyXG4gICAgICAgIGRpckxpZ2h0LnNoYWRvd0NhbWVyYUxlZnQgPSAtZDtcclxuICAgICAgICBkaXJMaWdodC5zaGFkb3dDYW1lcmFSaWdodCA9IGQ7XHJcbiAgICAgICAgZGlyTGlnaHQuc2hhZG93Q2FtZXJhVG9wID0gZDtcclxuICAgICAgICBkaXJMaWdodC5zaGFkb3dDYW1lcmFCb3R0b20gPSAtZDtcclxuICAgICAgICBkaXJMaWdodC5zaGFkb3dDYW1lcmFGYXIgPSAzNTAwO1xyXG4gICAgICAgIGRpckxpZ2h0LnNoYWRvd0JpYXMgPSAtMC4wMDAxO1xyXG4gICAgICAgIGRpckxpZ2h0LnNoYWRvd0RhcmtuZXNzID0gMC4zNTtcclxuXHJcbiAgICAgICAgLy9EZWZhdWx0IHZhcmlhYmxlcyBmb3IgdGhlIGdyaWRcclxuICAgICAgICB2YXIgZ3JpZFNpemUgPSA1MDA7XHJcbiAgICAgICAgdmFyIGdyaWRTdGVwID0gMjA7XHJcblxyXG4gICAgICAgIC8vQ3JlYXRlIG5ldyBnZW9tZXRyeSBhbmQgbWF0ZXJpYWwgb2JqZWN0cyBmb3IgdGhlIGdyaWRcclxuICAgICAgICB2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuR2VvbWV0cnkoKTtcclxuICAgICAgICB2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoe2NvbG9yOiBcIndoaXRlXCJ9KTtcclxuXHJcbiAgICAgICAgLy9EeW5hbWljYWxseSBjcmVhdGUgdGhlIGdyaWRcclxuICAgICAgICBmb3IodmFyIGkgPSAtZ3JpZFNpemU7IGkgPD0gZ3JpZFNpemU7IGkgKz0gZ3JpZFN0ZXApe1xyXG4gICAgICAgICAgICBnZW9tZXRyeS52ZXJ0aWNlcy5wdXNoKG5ldyBUSFJFRS5WZWN0b3IzKC1ncmlkU2l6ZSwgLTAuMDQsIGkpKTtcclxuICAgICAgICAgICAgZ2VvbWV0cnkudmVydGljZXMucHVzaChuZXcgVEhSRUUuVmVjdG9yMyhncmlkU2l6ZSwgLTAuMDQsIGkpKTtcclxuXHJcbiAgICAgICAgICAgIGdlb21ldHJ5LnZlcnRpY2VzLnB1c2gobmV3IFRIUkVFLlZlY3RvcjMoaSwgLTAuMDQsIC1ncmlkU2l6ZSkpO1xyXG4gICAgICAgICAgICBnZW9tZXRyeS52ZXJ0aWNlcy5wdXNoKG5ldyBUSFJFRS5WZWN0b3IzKGksIC0wLjA0LCBncmlkU2l6ZSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9DcmVhdGUgdGhlIGdyaWQgb2JqZWN0IGFuZCBwb3NpdGlvbiBpdFxyXG4gICAgICAgIHZhciBsaW5lID0gbmV3IFRIUkVFLkxpbmUoZ2VvbWV0cnksIG1hdGVyaWFsLCBUSFJFRS5MaW5lUGllY2VzKTtcclxuICAgICAgICBsaW5lLnBvc2l0aW9uLnNldCgtMTAsIC0xMCwgMTApO1xyXG5cclxuICAgICAgICAvL0FkZCB0aGUgZ3JpZCB0byB0aGUgc2NlbmVcclxuICAgICAgICB0aGlzLnNjZW5lLmFkZChsaW5lKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZSBhbmQgc2V0dXAgdGhlIHJlbmRlcmVyXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplUmVuZGVyZXI6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAvL0NyZWF0ZSBhIG5ldyByZW5kZXJlciBvYmplY3RcclxuICAgICAgICB0aGlzLnJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoe1xyXG4gICAgICAgICAgICBhbnRpYWxpYXM6IHRydWVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy9Db25maWd1cmUgdGhlIHJlbmRlcmVyXHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRDbGVhckNvbG9yKDB4ZjBmMGYwKTtcclxuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xyXG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcclxuICAgICAgICB0aGlzLnJlbmRlcmVyLnNvcnRPYmplY3RzID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zaGFkb3dNYXBFbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnJlbmRlcmVyLnNoYWRvd01hcFR5cGUgPSBUSFJFRS5QQ0ZTaGFkb3dNYXA7XHJcblxyXG4gICAgICAgIC8vQXBwZW5kIHRoZSByZW5kZXJlciB0byB0aGUgSFRNTCBib2R5XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5yZW5kZXJlci5kb21FbGVtZW50KTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRnVuY3Rpb24gdGhhdCBpcyBleGVjdXRlZCBldmVyeSB0aW1lIHRoZSB3aW5kb3cgcmVzaXplc1xyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgb25XaW5kb3dSZXNpemU6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAvL0NoYW5nZSB0aGUgY2FtZXJhJ3MgYXNwZWN0IHJhdGluZyBhbmQgdXBkYXRlIGl0XHJcbiAgICAgICAgdGhpcy5jYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5jYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xyXG5cclxuICAgICAgICAvL0NoYW5nZSB0aGUgc2l6ZSBvZiB0aGUgcmVuZGVyZXIgdG8gdGhlIG5ldyB3aW5kb3cgc2l6ZVxyXG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWxsIHRoZSBmdW5jdGlvbnMgdGhhdCBuZWVkIHRvIGJlIGV4ZWN1dGVkIGV2ZXJ5IHRpbWUgdGhlIHN5c3RlbSB1cGRhdGVzXHJcbiAgICAgKiBAcHJvdGVjdGVkXHJcbiAgICAgKi9cclxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAvL1VwZGF0ZSB0aGUgY29udHJvbHMgdG8gbWF0Y2ggdGhlIHVzZXJzIGludGVyYWN0aW9uXHJcbiAgICAgICAgdGhpcy5jb250cm9scy51cGRhdGUoKTtcclxuXHJcbiAgICAgICAgLy9SZW5kZXIgdGhlIHNjZW5lIGFnYWluXHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5yZW5kZXIodGhpcy5zY2VuZSwgdGhpcy5jYW1lcmEpO1xyXG5cclxuICAgIH1cclxuXHJcbn07XHJcblxyXG4vL0V4cG9ydCB0aGUgQnJvd3NlcmlmeSBtb2R1bGVcclxubW9kdWxlLmV4cG9ydHMgPSBXb3JsZDtcclxuIl19
;