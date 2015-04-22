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
     * Function to generate a random number between two values
     * @public
     *
     * @param {Number} from - The minimum number
     * @param {Number} to - The maximum number
     * @param {Number} steps - The steps in which the random numbers will go
     *
     * @return {Number} A random number between the two supplied values
     */
    randomNumberSteps: function(from, to, steps) {

        return from + (steps * Math.floor(Math.random() * (to - from) / steps) );

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
        //Create a reusable geometry object for a cube
        var geometry = new THREE.BoxGeometry(20, 20, 20);

        //Create the new cube object with the geometry
        this.mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff}));

        //Position the cube
        this.mesh.position.x = 0;
        this.mesh.position.y = 0;
        this.mesh.position.z = 0;

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

    finishedTask: function(){

        var averageAudio = this.systems['measure'].calculateAverageAudio();

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
     */
    calculateAverageAudio: function() {

        var averageAudio = Utils.averageArray(this.audioLevels);

        //Empty the array again
        this.audioLevels = [];

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

    pickTask: function (tasks) {

        //Let just assume the first task is the last task, doesn't really matter as long as we have a value to check against
        var oldestTask = tasks[0];

        for(var i = 0; i < tasks.length; i++) {

            //If a task has never been executed before, just start with that one
            if(tasks[i].lastFinished === null){
                return tasks[i];
            }

            if(tasks[i].lastFinished < oldestTask.lastFinished){
                oldestTask = tasks[i];
            }

        }

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

            var newPosition = {
                x: Utils.randomNumberSteps(-100, 100, 20),
                z: Utils.randomNumberSteps(-100, 100, 20)
            };

            var distance = {
                x: Math.abs(newPosition.x - this.entity.mesh.position.x),
                z: Math.abs(newPosition.z - this.entity.mesh.position.z)
            };

            var totalDistance = distance.x + distance.z;
            var time = totalDistance / 35;

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

        dirLight.castShadow = true;

        dirLight.shadowMapWidth = 2048;
        dirLight.shadowMapHeight = 2048;

        var d = 500;

        dirLight.shadowCameraLeft = -d;
        dirLight.shadowCameraRight = d;
        dirLight.shadowCameraTop = d;
        dirLight.shadowCameraBottom = -d;

        dirLight.shadowCameraFar = 3500;
        dirLight.shadowBias = -0.0001;
        dirLight.shadowDarkness = 0.35;

        var gridSize = 500;
        var gridStep = 20;

        var geometry = new THREE.Geometry();
        var material = new THREE.LineBasicMaterial({color: "white"});

        for(var i = -gridSize; i <= gridSize; i += gridStep){
            geometry.vertices.push(new THREE.Vector3(-gridSize, -0.04, i));
            geometry.vertices.push(new THREE.Vector3(gridSize, -0.04, i));

            geometry.vertices.push(new THREE.Vector3(i, -0.04, -gridSize));
            geometry.vertices.push(new THREE.Vector3(i, -0.04, gridSize));
        }

        var line = new THREE.Line(geometry, material, THREE.LinePieces);
        line.position.set(-10, -10, 10);
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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6L3hhbXBwL2h0ZG9jcy9tb2R1bGFyQUkvbGliL2NvcmUvZXZlbnQuanMiLCJEOi94YW1wcC9odGRvY3MvbW9kdWxhckFJL2xpYi9jb3JlL3N5c3RlbS5qcyIsIkQ6L3hhbXBwL2h0ZG9jcy9tb2R1bGFyQUkvbGliL2NvcmUvdXRpbHMuanMiLCJEOi94YW1wcC9odGRvY3MvbW9kdWxhckFJL2xpYi9lbnRpdHkvZW50aXR5LmpzIiwiRDoveGFtcHAvaHRkb2NzL21vZHVsYXJBSS9saWIvZW50aXR5L2dyb3VwLmpzIiwiRDoveGFtcHAvaHRkb2NzL21vZHVsYXJBSS9saWIvZmFjdG9yaWVzL3JvYm90ZmFjdG9yeS5qcyIsIkQ6L3hhbXBwL2h0ZG9jcy9tb2R1bGFyQUkvbGliL2luaXQuanMiLCJEOi94YW1wcC9odGRvY3MvbW9kdWxhckFJL2xpYi9zeXN0ZW1zL21lYXN1cmUuanMiLCJEOi94YW1wcC9odGRvY3MvbW9kdWxhckFJL2xpYi9zeXN0ZW1zL3Rhc2suanMiLCJEOi94YW1wcC9odGRvY3MvbW9kdWxhckFJL2xpYi90YXNrcy9tb3AuanMiLCJEOi94YW1wcC9odGRvY3MvbW9kdWxhckFJL2xpYi90YXNrcy90YXNrLmpzIiwiRDoveGFtcHAvaHRkb2NzL21vZHVsYXJBSS9saWIvdGFza3MvdmFjdXVtLmpzIiwiRDoveGFtcHAvaHRkb2NzL21vZHVsYXJBSS9saWIvd29ybGQvd29ybGQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIi8vQmVjYXVzZSBCcm93c2VyaWZ5IGVuY2Fwc3VsYXRlcyBldmVyeSBtb2R1bGUsIHVzZSBzdHJpY3Qgd29uJ3QgYXBwbHkgdG8gdGhlIGdsb2JhbCBzY29wZSBhbmQgYnJlYWsgZXZlcnl0aGluZ1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4vKipcclxuICogRXZlbnQgY29uc3RydWN0b3JcclxuICpcclxuICogSW5zcGlyZWQgYnkgdGhlIGdyZWF0IHR1dG9yaWFsIGF0OlxyXG4gKiBodHRwczovL2NvcmNvcmFuLmlvLzIwMTMvMDYvMDEvYnVpbGRpbmctYS1taW5pbWFsLWphdmFzY3JpcHQtZXZlbnQtc3lzdGVtL1xyXG4gKlxyXG4gKiBAY2xhc3MgRXZlbnRcclxuICogQGNsYXNzZGVzYyBBbiBvYmplY3QgdGhhdCBjYW4gYW5ub3VuY2UgYW5kIGxpc3RlbiBmb3IgZXZlbnRzXHJcbiAqXHJcbiAqL1xyXG52YXIgRXZlbnQgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBldmVudHMgLSBBbiBhc3NvY2lhdGl2ZSBhcnJheSB3aXRoIGFsbCB0aGUgY3VycmVudCBldmVudHNcclxuICAgICAqL1xyXG4gICAgdGhpcy5ldmVudHMgPSB7fTtcclxuXHJcbn07XHJcblxyXG5FdmVudC5wcm90b3R5cGUgPSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGdW5jdGlvbiB0aGF0IGhhbmRsZXMga2V5ZG93biBldmVudHNcclxuICAgICAqIEBwcm90ZWN0ZWRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIFRoZSB0eXBlIG9mIGV2ZW50IHRoYXQgY2FuIGJlIHRyaWdnZXJlZFxyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgZnVuY3Rpb24gdGhhdCBoYXMgdG8gYmUgcGVyZm9ybWVkIGFzIGEgY2FsbGJhY2tcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0IC0gVGhlIG9iamVjdCB0aGF0IHNob3VsZCBiZSBhY2Nlc3NpYmxlIHdoZW4gdGhlIGV2ZW50IGlzIGNhbGxlZFxyXG4gICAgICovXHJcbiAgICBvbjogZnVuY3Rpb24odHlwZSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcclxuXHJcbiAgICAgICAgLy9JZiB0aGlzLmV2ZW50cyBkb2Vzbid0IGhhdmUgdGhlIGV2ZW50IHByb3BlcnR5LCBjcmVhdGUgYW4gZW1wdHkgYXJyYXlcclxuICAgICAgICBpZighdGhpcy5ldmVudHMuaGFzT3duUHJvcGVydHkodHlwZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5ldmVudHNbdHlwZV0gPSBbXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vSW5zZXJ0IHRoZSBjYWxsYmFjayBpbnRvIHRoZSBjdXJyZW50IGV2ZW50XHJcbiAgICAgICAgdGhpcy5ldmVudHNbdHlwZV0ucHVzaChbY2FsbGJhY2ssIGNvbnRleHRdKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgd2hlbiBhbiBldmVudCBpcyB0cmlnZ2VyZWRcclxuICAgICAqIEBwcm90ZWN0ZWRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIFRoZSB0eXBlIG9mIGV2ZW50IHRoYXQgaXMgdHJpZ2dlcmVkXHJcbiAgICAgKi9cclxuICAgIHRyaWdnZXI6IGZ1bmN0aW9uKHR5cGUpIHtcclxuXHJcbiAgICAgICAgLy9CZWNhdXNlIHdlIGRvbid0IGtub3cgaG93IG1hbnkgYXJndW1lbnRzIGFyZSBiZWluZyBzZW5kIHRvXHJcbiAgICAgICAgLy90aGUgY2FsbGJhY2tzLCBsZXQncyBnZXQgdGhlbSBhbGwgZXhjZXB0IHRoZSBmaXJzdCBvbmUgKCB0aGUgdGFpbCApXHJcbiAgICAgICAgdmFyIHRhaWwgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xyXG5cclxuICAgICAgICAvL0dldCBhbGwgdGhlIGNhbGxiYWNrcyBmb3IgdGhlIGN1cnJlbnQgZXZlbnRcclxuICAgICAgICB2YXIgY2FsbGJhY2tzID0gdGhpcy5ldmVudHNbdHlwZV07XHJcblxyXG4gICAgICAgIC8vQ2hlY2sgaWYgdGhlcmUgYXJlIGNhbGxiYWNrcyBkZWZpbmVkIGZvciB0aGlzIGtleSwgaWYgbm90LCBzdG9wIVxyXG4gICAgICAgIGlmKGNhbGxiYWNrcyAhPT0gdW5kZWZpbmVkKSB7XHJcblxyXG4gICAgICAgICAgICAvL0xvb3AgdGhyb3VnaCB0aGUgY2FsbGJhY2tzIGFuZCBydW4gZWFjaCBjYWxsYmFja1xyXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9HZXQgdGhlIGN1cnJlbnQgY2FsbGJhY2sgZnVuY3Rpb25cclxuICAgICAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IGNhbGxiYWNrc1tpXVswXTtcclxuICAgICAgICAgICAgICAgIHZhciBjb250ZXh0O1xyXG5cclxuICAgICAgICAgICAgICAgIC8vR2V0IHRoZSBjdXJyZW50IGNvbnRleHQgb2JqZWN0LCBpZiBpdCBleGlzdHNcclxuICAgICAgICAgICAgICAgIGlmKGNhbGxiYWNrc1tpXVsxXSA9PT0gdW5kZWZpbmVkKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vSWYgdGhlIGNvbnRleHQgaXMgbm90IGRlZmluZWQsIHRoZSBzY29wZSBpcyBnb2luZyB0byBiZSB0aGlzICggRXZlbnQgb2JqZWN0IClcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0ID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy9HZXQgdGhlIGNvbnRleHQgb2JqZWN0XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dCA9IGNhbGxiYWNrc1tpXVsxXTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy9SdW4gdGhlIGN1cnJlbnQgY2FsbGJhY2sgYW5kIHNlbmQgdGhlIHRhaWwgYWxvbmcgd2l0aCBpdFxyXG4gICAgICAgICAgICAgICAgLy9UaGUgYXBwbHkoKSBtZXRob2QgY2FsbHMgYSBmdW5jdGlvbiB3aXRoIGEgZ2l2ZW4gdGhpcyB2YWx1ZSBhbmQgYXJndW1lbnRzIHByb3ZpZGVkIGFzIGFuIGFycmF5XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5hcHBseShjb250ZXh0LCB0YWlsKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn07XHJcblxyXG4vL0V4cG9ydCB0aGUgQnJvd3NlcmlmeSBtb2R1bGVcclxubW9kdWxlLmV4cG9ydHMgPSBFdmVudDtcclxuIiwiLy9CZWNhdXNlIEJyb3dzZXJpZnkgZW5jYXBzdWxhdGVzIGV2ZXJ5IG1vZHVsZSwgdXNlIHN0cmljdCB3b24ndCBhcHBseSB0byB0aGUgZ2xvYmFsIHNjb3BlIGFuZCBicmVhayBldmVyeXRoaW5nXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8vUmVxdWlyZSBuZWNlc3NhcnkgbW9kdWxlc1xyXG52YXIgR3JvdXAgPSByZXF1aXJlKCcuLi9lbnRpdHkvZ3JvdXAuanMnKSxcclxuICAgIFJvYm90RmFjdG9yeSA9IHJlcXVpcmUoJy4uL2ZhY3Rvcmllcy9yb2JvdGZhY3RvcnkuanMnKSxcclxuICAgIFdvcmxkID0gcmVxdWlyZSgnLi4vd29ybGQvd29ybGQuanMnKTtcclxuXHJcbi8qKlxyXG4gKiBTeXN0ZW0gQ29uc3RydWN0b3JcclxuICpcclxuICogQGNsYXNzIFN5c3RlbVxyXG4gKiBAY2xhc3NkZXNjIFRoZSBoZWFydCBvZiB0aGlzIG1vZHVsYXIgQUkhIEluIGhlcmUgd2UgcHJvdmlkZSBhY2Nlc3MgdG9cclxuICogYWxsIHRoZSBvdGhlciBvYmplY3RzIGFuZCBmdW5jdGlvbiwgYW5kIHdlIGhhbmRsZSB0aGUgc3RhcnR1cCBvZiB0aGUgc3lzdGVtXHJcbiAqXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSB1c2VyU2V0dGluZ3MgLSBUaGUgc2V0dGluZ3MgdGhhdCB0aGUgdXNlciBwcm92aWRlc1xyXG4gKi9cclxudmFyIFN5c3RlbSA9IGZ1bmN0aW9uKHVzZXJTZXR0aW5ncykge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtCb29sZWFufSBpc0luaXRpYWxpemVkIC0gVHJ1ZSB3aGVuIHRoZSBzeXN0ZW0gaXMgZnVsbHkgaW5pdGlhbGl6ZWRcclxuICAgICAqL1xyXG4gICAgdGhpcy5pc0luaXRpYWxpemVkID0gZmFsc2U7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcGVydHkge0dyb3VwfSBlbnRpdGllcyAtIEFsbCB0aGUgZW50aXRpZXMgY29udHJvbGxlZCBieSB0aGlzIHN5c3RlbVxyXG4gICAgICovXHJcbiAgICB0aGlzLmVudGl0aWVzID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wZXJ0eSB7V29ybGR9IHdvcmxkIC0gVGhlIHdvcmxkIGZvciBkZW1vbnN0cmF0aW5nIHB1cnBvc2VzXHJcbiAgICAgKi9cclxuICAgIHRoaXMud29ybGQgPSBudWxsO1xyXG5cclxuICAgIC8vTG9hZCBhbmQgdGhlbiBpbml0aWFsaXplIGl0c2VsZlxyXG4gICAgdGhpcy5pbml0aWFsaXplKCk7XHJcblxyXG59O1xyXG5cclxuU3lzdGVtLnByb3RvdHlwZSA9IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgdGhlIHN5c3RlbVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIC8vQ2hlY2sgaWYgdGhlIGdhbWUgaXMgYWxyZWFkeSBpbml0aWFsaXplZFxyXG4gICAgICAgIGlmKHRoaXMuaXNJbml0aWFsaXplZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL0NyZWF0ZSBhIG5ldyBncm91cCB0aGF0IHdpbGwgaG9sZCBhbGwgZW50aXRpZXNcclxuICAgICAgICB0aGlzLmVudGl0aWVzID0gbmV3IEdyb3VwKCk7XHJcblxyXG4gICAgICAgIC8vQ3JlYXRlIHRoZSB3b3JsZCBvYmplY3RcclxuICAgICAgICB0aGlzLndvcmxkID0gbmV3IFdvcmxkKCk7XHJcblxyXG4gICAgICAgIC8vQ3JlYXRlIGEgbmV3IGVudGl0eSBhbmQgYWRkIGl0IHRvIHRoZSBncm91cFxyXG4gICAgICAgIHZhciBmaXJzdFJvYm90ID0gUm9ib3RGYWN0b3J5LmRlZmF1bHRSb2JvdCgpO1xyXG5cclxuICAgICAgICAvL0FkZCB0aGUgZW50aXR5IHRvIHRoZSBncm91cCBvZiBhbGwgZW50aXRpZXNcclxuICAgICAgICB0aGlzLmVudGl0aWVzLmFkZEVudGl0eShmaXJzdFJvYm90KTtcclxuXHJcbiAgICAgICAgLy9BZGQgdGhlIGN1YmUgdG8gdGhlIHNjZW5lXHJcbiAgICAgICAgdGhpcy53b3JsZC5zY2VuZS5hZGQoZmlyc3RSb2JvdC5tZXNoKTtcclxuXHJcbiAgICAgICAgLy9VcGRhdGUgdGhlIHN5c3RlbSBmb3IgdGhlIGZpcnN0IHRpbWVcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG5cclxuICAgICAgICAvL1RoZSBzeXN0ZW0gaXMgZnVsbHkgaW5pdGlhbGl6ZWRcclxuICAgICAgICB0aGlzLmlzSW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBbGwgdGhlIGZ1bmN0aW9ucyB0aGF0IG5lZWQgdG8gYmUgZXhlY3V0ZWQgZXZlcnkgdGltZSB0aGUgc3lzdGVtIHVwZGF0ZXNcclxuICAgICAqIEJhc2ljYWxseSBhIGdhbWUgbG9vcFxyXG4gICAgICogQHByb3RlY3RlZFxyXG4gICAgICovXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAvL1JlcXVlc3QgYSBuZXcgYW5pbWF0aW9uIGZyYW1lIGFuZCBjYWxsIHRoZSB1cGRhdGUgZnVuY3Rpb24gYWdhaW5cclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy51cGRhdGUuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIC8vR2V0IGFsbCBlbnRpdGllcyBpbiB0aGUgc3lzdGVtXHJcbiAgICAgICAgdmFyIGVudGl0aWVzID0gdGhpcy5lbnRpdGllcy5nZXRFbnRpdGllcygpO1xyXG5cclxuICAgICAgICAvL0xvb3AgdGhyb3VnaCBhbGwgdGhlIGVudGl0aWVzXHJcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGVudGl0aWVzLmxlbmd0aDsgaSsrKXtcclxuXHJcbiAgICAgICAgICAgIC8vRXhlY3V0ZSB0aGUgcnVuIGNvbW1hbmQgZm9yIGVhY2ggZW50aXR5IHNvIGl0IHdpbGwgc3RhcnQgYWN0aW5nXHJcbiAgICAgICAgICAgIGVudGl0aWVzW2ldLnJ1bigpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vVXBkYXRlIHRoZSBkZW1vbnN0cmF0aW9uIHdvcmxkXHJcbiAgICAgICAgdGhpcy53b3JsZC51cGRhdGUoKTtcclxuXHJcbiAgICB9XHJcblxyXG59O1xyXG5cclxuLy9FeHBvcnQgdGhlIEJyb3dzZXJpZnkgbW9kdWxlXHJcbm1vZHVsZS5leHBvcnRzID0gU3lzdGVtO1xyXG4iLCIvL0JlY2F1c2UgQnJvd3NlcmlmeSBlbmNhcHN1bGF0ZXMgZXZlcnkgbW9kdWxlLCB1c2Ugc3RyaWN0IHdvbid0IGFwcGx5IHRvIHRoZSBnbG9iYWwgc2NvcGUgYW5kIGJyZWFrIGV2ZXJ5dGhpbmdcclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuLyoqXHJcbiAqIFN0YXRpYyBVdGlsaXRpZXMgQ2xhc3NcclxuICpcclxuICogQGNsYXNzIFV0aWxzXHJcbiAqIEBjbGFzc2Rlc2MgSW4gdGhpcyBjbGFzcyBhcmUgdGhlIGZ1bmN0aW9ucyBzdG9yZWQgdGhhdCBhcmUgYmVpbmdcclxuICogdXNlZCBpbiBvdGhlciBmdW5jdGlvbnNcclxuICovXHJcbnZhciBVdGlscyA9IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEZ1bmN0aW9uIHRvIGdlbmVyYXRlIGEgcmFuZG9tIG51bWJlciBiZXR3ZWVuIHR3byB2YWx1ZXNcclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZnJvbSAtIFRoZSBtaW5pbXVtIG51bWJlclxyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHRvIC0gVGhlIG1heGltdW0gbnVtYmVyXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBBIHJhbmRvbSBudW1iZXIgYmV0d2VlbiB0aGUgdHdvIHN1cHBsaWVkIHZhbHVlc1xyXG4gICAgICovXHJcbiAgICByYW5kb21OdW1iZXI6IGZ1bmN0aW9uKGZyb20sIHRvKSB7XHJcblxyXG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAodG8gLSBmcm9tICsgMSkgKyBmcm9tKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRnVuY3Rpb24gdG8gZ2VuZXJhdGUgYSByYW5kb20gbnVtYmVyIGJldHdlZW4gdHdvIHZhbHVlc1xyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBmcm9tIC0gVGhlIG1pbmltdW0gbnVtYmVyXHJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdG8gLSBUaGUgbWF4aW11bSBudW1iZXJcclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzdGVwcyAtIFRoZSBzdGVwcyBpbiB3aGljaCB0aGUgcmFuZG9tIG51bWJlcnMgd2lsbCBnb1xyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4ge051bWJlcn0gQSByYW5kb20gbnVtYmVyIGJldHdlZW4gdGhlIHR3byBzdXBwbGllZCB2YWx1ZXNcclxuICAgICAqL1xyXG4gICAgcmFuZG9tTnVtYmVyU3RlcHM6IGZ1bmN0aW9uKGZyb20sIHRvLCBzdGVwcykge1xyXG5cclxuICAgICAgICByZXR1cm4gZnJvbSArIChzdGVwcyAqIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICh0byAtIGZyb20pIC8gc3RlcHMpICk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIENhbGN1bGF0ZSB0aGUgYXZlcmFnZSBmcm9tIGFsbCB2YWx1ZXMgaW4gYW4gYXJyYXlcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSAtIFRoZSBhcnJheSBiZWluZyB1c2VkIGZvciBhdmVyYWdlIGNhbGN1bGF0aW9uc1xyXG4gICAgICogQHJldHVybnMge051bWJlcn1cclxuICAgICAqL1xyXG4gICAgYXZlcmFnZUFycmF5OiBmdW5jdGlvbihhcnJheSkge1xyXG5cclxuICAgICAgICB2YXIgc3VtID0gMDtcclxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICBzdW0gKz0gcGFyc2VJbnQoYXJyYXlbaV0sIDEwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdW0gLyBhcnJheS5sZW5ndGg7XHJcblxyXG4gICAgfVxyXG5cclxufTtcclxuXHJcbi8vRXhwb3J0IHRoZSBCcm93c2VyaWZ5IG1vZHVsZVxyXG5tb2R1bGUuZXhwb3J0cyA9IFV0aWxzO1xyXG4iLCIvL0JlY2F1c2UgQnJvd3NlcmlmeSBlbmNhcHN1bGF0ZXMgZXZlcnkgbW9kdWxlLCB1c2Ugc3RyaWN0IHdvbid0IGFwcGx5IHRvIHRoZSBnbG9iYWwgc2NvcGUgYW5kIGJyZWFrIGV2ZXJ5dGhpbmdcclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIFRhc2tTeXN0ZW0gPSByZXF1aXJlKCcuLi9zeXN0ZW1zL3Rhc2suanMnKSxcclxuICAgIE1lYXN1cmVTeXN0ZW0gPSByZXF1aXJlKCcuLi9zeXN0ZW1zL21lYXN1cmUuanMnKTtcclxuXHJcbi8qKlxyXG4gKiBFbnRpdHkgY29uc3RydWN0b3JcclxuICpcclxuICogQGNsYXNzIEVudGl0eVxyXG4gKiBAY2xhc3NkZXNjIEEgc2luZ2xlIGVudGl0eSB0aGF0IGhhcyBjZXJ0YWluIGJlaGF2aW91ciB0byBiZSBleGVjdXRlZFxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIFRoZSBuYW1lIG9mIHRoaXMgZW50aXR5XHJcbiAqL1xyXG52YXIgRW50aXR5ID0gZnVuY3Rpb24obmFtZSkge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSBvZiB0aGlzIGVudGl0eVxyXG4gICAgICovXHJcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheX0gc3lzdGVtcyAtIEFuIGFzc29jaWF0aXZlIGFycmF5IGZpbGxlZCB3aXRoIGFsbCB0aGUgc3lzdGVtcyB0aGF0IG5lZWQgdG8gYmUgY2FsbGVkIGV2ZXJ5IHN0ZXBcclxuICAgICAqL1xyXG4gICAgdGhpcy5zeXN0ZW1zID0ge307XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcGVydHkge1RIUkVFLk1lc2h9IG1lc2ggLSBUaGUgM0QgbW9kZWwgbWVzaFxyXG4gICAgICovXHJcbiAgICB0aGlzLm1lc2ggPSBudWxsO1xyXG5cclxuICAgIC8vSW5pdGlhbGl6ZSBpdHNlbGZcclxuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xyXG5cclxufTtcclxuXHJcbkVudGl0eS5wcm90b3R5cGUgPSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIHRoZSBlbnRpdHksIGNyZWF0ZSBuZXcgb2JqZWN0cyBhbmQgYXBwbHkgc2V0dGluZ3NcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAvL0FkZCBzeXN0ZW1zXHJcbiAgICAgICAgdGhpcy5zeXN0ZW1zWyd0YXNrJ10gPSBuZXcgVGFza1N5c3RlbSgpO1xyXG4gICAgICAgIHRoaXMuc3lzdGVtc1snbWVhc3VyZSddID0gbmV3IE1lYXN1cmVTeXN0ZW0odGhpcyk7XHJcblxyXG4gICAgICAgIC8vQ29uZmlndXJlIHN5c3RlbXNcclxuICAgICAgICB0aGlzLnN5c3RlbXNbJ3Rhc2snXS5ldmVudHMub24oJ2ZpbmlzaGVkJywgdGhpcy5maW5pc2hlZFRhc2suYmluZCh0aGlzKSwgdGhpcyk7XHJcblxyXG4gICAgICAgIC8vQ3JlYXRlIHRoZSBUaHJlZS5qcyBzaGFwZSBmb3IgdGhlIGRlbW9uc3RyYXRpb24gd29ybGRcclxuICAgICAgICAvL0NyZWF0ZSBhIHJldXNhYmxlIGdlb21ldHJ5IG9iamVjdCBmb3IgYSBjdWJlXHJcbiAgICAgICAgdmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KDIwLCAyMCwgMjApO1xyXG5cclxuICAgICAgICAvL0NyZWF0ZSB0aGUgbmV3IGN1YmUgb2JqZWN0IHdpdGggdGhlIGdlb21ldHJ5XHJcbiAgICAgICAgdGhpcy5tZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHsgY29sb3I6IE1hdGgucmFuZG9tKCkgKiAweGZmZmZmZn0pKTtcclxuXHJcbiAgICAgICAgLy9Qb3NpdGlvbiB0aGUgY3ViZVxyXG4gICAgICAgIHRoaXMubWVzaC5wb3NpdGlvbi54ID0gMDtcclxuICAgICAgICB0aGlzLm1lc2gucG9zaXRpb24ueSA9IDA7XHJcbiAgICAgICAgdGhpcy5tZXNoLnBvc2l0aW9uLnogPSAwO1xyXG5cclxuICAgICAgICAvL0NvbmZpZ3VyZSB0aGUgY3ViZVxyXG4gICAgICAgIHRoaXMubWVzaC5jYXN0U2hhZG93ID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLm1lc2gucmVjZWl2ZVNoYWRvdyA9IHRydWU7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEV4ZWN1dGUgYWxsIHRoZSBzeXN0ZW1zIG9uIHRoaXMgZW50aXR5IGV2ZXJ5IHN0ZXAgb2YgdGhlIGxvb3BcclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqL1xyXG4gICAgcnVuOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgZm9yKHZhciBzeXN0ZW0gaW4gdGhpcy5zeXN0ZW1zKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN5c3RlbXMuaGFzT3duUHJvcGVydHkoc3lzdGVtKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zeXN0ZW1zW3N5c3RlbV0ucnVuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBmaW5pc2hlZFRhc2s6IGZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICAgIHZhciBhdmVyYWdlQXVkaW8gPSB0aGlzLnN5c3RlbXNbJ21lYXN1cmUnXS5jYWxjdWxhdGVBdmVyYWdlQXVkaW8oKTtcclxuXHJcbiAgICAgICAgdGhpcy5zeXN0ZW1zWyd0YXNrJ10uY3VycmVudFRhc2subWVhc3VyZW1lbnRzLmF1ZGlvLnB1c2goYXZlcmFnZUF1ZGlvKTtcclxuXHJcbiAgICB9XHJcblxyXG59O1xyXG5cclxuLy9FeHBvcnQgdGhlIEJyb3dzZXJpZnkgbW9kdWxlXHJcbm1vZHVsZS5leHBvcnRzID0gRW50aXR5O1xyXG4iLCIvL0JlY2F1c2UgQnJvd3NlcmlmeSBlbmNhcHN1bGF0ZXMgZXZlcnkgbW9kdWxlLCB1c2Ugc3RyaWN0IHdvbid0IGFwcGx5IHRvIHRoZSBnbG9iYWwgc2NvcGUgYW5kIGJyZWFrIGV2ZXJ5dGhpbmdcclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy9SZXF1aXJlIG5lY2Vzc2FyeSBtb2R1bGVzXHJcbnZhciBFbnRpdHkgPSByZXF1aXJlKCcuL2VudGl0eS5qcycpO1xyXG5cclxuLyoqXHJcbiAqIEdyb3VwIGNvbnN0cnVjdG9yXHJcbiAqXHJcbiAqIEBjbGFzcyBHcm91cFxyXG4gKiBAY2xhc3NkZXNjIFRoZSBvYmplY3QgdGhhdCBob2xkcyBtdWx0aXBsZSBlbnRpdGllc1xyXG4gKi9cclxudmFyIEdyb3VwID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5fSBlbnRpdGllcyAtIENvbGxlY3Rpb24gb2YgYWxsIHRoZSBlbnRpdGllcyBpbiB0aGlzIGdyb3VwXHJcbiAgICAgKi9cclxuICAgIHRoaXMuZW50aXRpZXMgPSBbXTtcclxuXHJcbn07XHJcblxyXG5Hcm91cC5wcm90b3R5cGUgPSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGdW5jdGlvbiB0byBhZGQgYSBuZXcgZW50aXR5IHRvIHRoaXMgZ3JvdXBcclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0VudGl0eX0gZW50aXR5IC0gQSByZWZlcmVuY2UgdG8gZW50aXR5IGJlaW5nIGFkZGVkXHJcbiAgICAgKi9cclxuICAgIGFkZEVudGl0eTogZnVuY3Rpb24oZW50aXR5KSB7XHJcblxyXG4gICAgICAgIC8vQ2hlY2sgaWYgdGhlIGVudGl0eSBpcyB0aGUgY29ycmVjdCBvYmplY3RcclxuICAgICAgICBpZighZW50aXR5IGluc3RhbmNlb2YgRW50aXR5KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vQWRkIHRoZSBjdXJyZW50IGVudGl0eSB0byB0aGUgbGlzdFxyXG4gICAgICAgIHRoaXMuZW50aXRpZXMucHVzaChlbnRpdHkpO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGdW5jdGlvbiB0byByZW1vdmUgYW4gZW50aXR5IGZyb20gdGhpcyBncm91cFxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7RW50aXR5fSBlbnRpdHkgLSBBIHJlZmVyZW5jZSB0byBlbnRpdHkgYmVpbmcgcmVtb3ZlZFxyXG4gICAgICovXHJcbiAgICByZW1vdmVFbnRpdHk6IGZ1bmN0aW9uKGVudGl0eSkge1xyXG5cclxuICAgICAgICAvL0NoZWNrIGlmIHRoZSBlbnRpdHkgZXhpc3RzLCBpZiBub3QsIHdlIGRvbid0IGhhdmUgdG8gZGVsZXRlIGl0XHJcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5lbnRpdGllcy5pbmRleE9mKGVudGl0eSk7XHJcblxyXG4gICAgICAgIC8vVGhlIGVsZW1lbnQgZG9lc24ndCBleGlzdCBpbiB0aGUgbGlzdFxyXG4gICAgICAgIGlmKGluZGV4ID09PSAtMSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL1JlbW92ZSB0aGUgY3VycmVudCBlbnRpdHkgZnJvbSB0aGUgZ3JvdXBcclxuICAgICAgICB0aGlzLmVudGl0aWVzLnNwbGljZShpbmRleCwgMSk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBhbGwgZW50aXRpZXMgc3RvcmVkIGluIHRoaXMgZ3JvdXBcclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IC0gQWxsIGVudGl0aWVzIHN0b3JlZCBpbiB0aGlzIGdyb3VwXHJcbiAgICAgKi9cclxuICAgIGdldEVudGl0aWVzOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZW50aXRpZXM7XHJcblxyXG4gICAgfVxyXG5cclxufTtcclxuXHJcbi8vRXhwb3J0IHRoZSBCcm93c2VyaWZ5IG1vZHVsZVxyXG5tb2R1bGUuZXhwb3J0cyA9IEdyb3VwO1xyXG4iLCIvL0JlY2F1c2UgQnJvd3NlcmlmeSBlbmNhcHN1bGF0ZXMgZXZlcnkgbW9kdWxlLCB1c2Ugc3RyaWN0IHdvbid0IGFwcGx5IHRvIHRoZSBnbG9iYWwgc2NvcGUgYW5kIGJyZWFrIGV2ZXJ5dGhpbmdcclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy9SZXF1aXJlIG5lY2Vzc2FyeSBtb2R1bGVzXHJcbnZhciBFbnRpdHkgPSByZXF1aXJlKCcuLi9lbnRpdHkvZW50aXR5LmpzJyksXHJcbiAgICBWYWN1dW0gPSByZXF1aXJlKCcuLi90YXNrcy92YWN1dW0uanMnKSxcclxuICAgIE1vcCA9IHJlcXVpcmUoJy4uL3Rhc2tzL21vcC5qcycpO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBSb2JvdEZhY3RvcnlcclxuICogQGNsYXNzZGVzYyBBIGZhY3RvcnkgdGhhdCByZXR1cm5zIHByZSBtYWRlIHJvYm90cyB3aXRoXHJcbiAqIGEgc2V0IG9mIHRhc2tzXHJcbiAqL1xyXG52YXIgUm9ib3RGYWN0b3J5ID0ge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgbmV3IGRlZmF1bHQgcm9ib3RcclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHtFbnRpdHl9IEFuIGRlZmF1bHQgcm9ib3Qgd2l0aCBhbGwgYXZhaWxhYmxlIHRhc2tzXHJcbiAgICAgKi9cclxuICAgIGRlZmF1bHRSb2JvdDogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIC8vQ3JlYXRlIHRoZSBuZXcgRW50aXR5IG9iamVjdFxyXG4gICAgICAgIHZhciBlbnRpdHkgPSBuZXcgRW50aXR5KCdEZWZhdWx0Jyk7XHJcblxyXG4gICAgICAgIC8vQWRkIHRoZSBhdmFpbGFibGUgdGFza3NcclxuICAgICAgICBlbnRpdHkuc3lzdGVtc1sndGFzayddLmFkZFRhc2sobmV3IFZhY3V1bShlbnRpdHkpKTtcclxuICAgICAgICBlbnRpdHkuc3lzdGVtc1sndGFzayddLmFkZFRhc2sobmV3IE1vcChlbnRpdHkpKTtcclxuXHJcbiAgICAgICAgLy9SZXR1cm4gdGhlIGVudGl0eVxyXG4gICAgICAgIHJldHVybiBlbnRpdHk7XHJcblxyXG4gICAgfVxyXG5cclxufTtcclxuXHJcbi8vRXhwb3J0IHRoZSBCcm93c2VyaWZ5IG1vZHVsZVxyXG5tb2R1bGUuZXhwb3J0cyA9IFJvYm90RmFjdG9yeTtcclxuIiwiLy9CZWNhdXNlIEJyb3dzZXJpZnkgZW5jYXBzdWxhdGVzIGV2ZXJ5IG1vZHVsZSwgdXNlIHN0cmljdCB3b24ndCBhcHBseSB0byB0aGUgZ2xvYmFsIHNjb3BlIGFuZCBicmVhayBldmVyeXRoaW5nXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8vUmVxdWlyZSBuZWNlc3NhcnkgbW9kdWxlc1xyXG52YXIgU3lzdGVtID0gcmVxdWlyZSgnLi9jb3JlL3N5c3RlbS5qcycpO1xyXG5cclxuLy9UaGUgaW5pdGlhbGl6ZSBNb2R1bGVcclxudmFyIEludGlhbGl6ZSA9IGZ1bmN0aW9uIGluaXRpYWxpemVTeXN0ZW0oKSB7XHJcblxyXG4gICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgLy9FbXB0eSBmb3Igbm93XHJcbiAgICB9O1xyXG5cclxuICAgIC8vQ3JlYXRlIGEgbmV3IHN5c3RlbVxyXG4gICAgdmFyIHN5c3RlbSA9IG5ldyBTeXN0ZW0ob3B0aW9ucyk7XHJcblxyXG59O1xyXG5cclxuLy8gc2hpbSBsYXllciB3aXRoIHNldFRpbWVvdXQgZmFsbGJhY2tcclxud2luZG93LnJlcXVlc3RBbmltRnJhbWUgPSAoZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxyXG4gICAgICAgIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgICB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgICAgZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoY2FsbGJhY2ssIDEwMDAgLyA2MCk7XHJcbiAgICAgICAgfTtcclxufSkoKTtcclxuXHJcbi8vSW5pdGlhbGl6ZSB3aGVuIGZ1bGx5IGxvYWRlZFxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgSW50aWFsaXplKTtcclxuXHJcbi8vRXhwb3J0IHRoZSBCcm93c2VyaWZ5IG1vZHVsZVxyXG5tb2R1bGUuZXhwb3J0cyA9IEludGlhbGl6ZTtcclxuIiwiLy9CZWNhdXNlIEJyb3dzZXJpZnkgZW5jYXBzdWxhdGVzIGV2ZXJ5IG1vZHVsZSwgdXNlIHN0cmljdCB3b24ndCBhcHBseSB0byB0aGUgZ2xvYmFsIHNjb3BlIGFuZCBicmVhayBldmVyeXRoaW5nXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBVdGlscyA9IHJlcXVpcmUoJy4uL2NvcmUvdXRpbHMuanMnKTtcclxuXHJcbi8qKlxyXG4gKiBNZWFzdXJlbWVudCBTeXN0ZW0gY29uc3RydWN0b3JcclxuICpcclxuICogQGNsYXNzIE1lYXN1cmVTeXN0ZW1cclxuICogQGNsYXNzZGVzYyBBIHN5c3RlbSB0aGF0IG1hbmFnZXMgYWxsIHRoaW5ncyBtZWFzdXJlbWVudCByZWxhdGVkXHJcbiAqXHJcbiAqIEBwYXJhbSB7RW50aXR5fSBlbnRpdHkgLSBBIHJlZmVyZW5jZSB0byB0aGUgZW50aXR5IHRoYXQgb3ducyB0aGlzIHN5c3RlbVxyXG4gKi9cclxudmFyIE1lYXN1cmVTeXN0ZW0gPSBmdW5jdGlvbihlbnRpdHkpIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wZXJ0eSB7RW50aXR5fSBlbnRpdHkgLSBBIHJlZmVyZW5jZSB0byB0aGUgZW50aXR5IHRoYXQgb3ducyB0aGlzIHN5c3RlbVxyXG4gICAgICovXHJcbiAgICB0aGlzLmVudGl0eSA9IGVudGl0eTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXl9IGF1ZGlvTGV2ZWxzIC0gQW4gYXJyYXkgd2hpY2ggaG9sZHMgYWxsIHRoZSBhdWRpbyBsZXZlbHMgc3RpbGwgYmVpbmcgbWVhc3VyZWRcclxuICAgICAqL1xyXG4gICAgdGhpcy5hdWRpb0xldmVscyA9IFtdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtPYmplY3R9IHZvbHVtZUNvbnRyb2wgLSBUaGUgVm9sdW1lQ29udHJvbCBzbGlkZXJcclxuICAgICAqL1xyXG4gICAgdGhpcy52b2x1bWVDb250cm9sID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZvbHVtZUNvbnRyb2wnKTtcclxuXHJcbn07XHJcblxyXG5NZWFzdXJlU3lzdGVtLnByb3RvdHlwZSA9IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIHdoZXRoZXIgdGhlIGVudGl0eSBpcyBidXN5IG9yIG5lZWRzIGEgbmV3IHRhc2tcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIHJ1bjogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHRoaXMubWVhc3VyZUF1ZGlvKCk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEZ1bmN0aW9uIHRvIG1lYXN1cmUgYXVkaW8gbGV2ZWxzIGZyb20gdGhlIG5vaXNlL2F1ZGlvIHNlbnNvclxyXG4gICAgICogTm93IGZha2luZyBkYXRhIGZvciBkZW1vbnN0cmF0aW9uIHB1cnBvc2VzXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBtZWFzdXJlQXVkaW86IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgYXVkaW9MZXZlbCA9IDA7XHJcblxyXG4gICAgICAgIC8vSWYgdGhlIGN1cnJlbnQgdGFzayBpcyB2YWN1dW1pbmcsIG1ha2UgYSBsb3Qgb2Ygbm9pc2UhXHJcbiAgICAgICAgaWYodGhpcy5lbnRpdHkuc3lzdGVtc1sndGFzayddLmN1cnJlbnRUYXNrLm5hbWUgPT09ICdWYWN1dW0nKXtcclxuXHJcbiAgICAgICAgICAgIGF1ZGlvTGV2ZWwgPSA3MDtcclxuXHJcbiAgICAgICAgfWVsc2V7XHJcblxyXG4gICAgICAgICAgICAvL0xpdHRsZSB0byBubyBub2lzZVxyXG4gICAgICAgICAgICBhdWRpb0xldmVsID0gMTA7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9QdXNoIHRoZSB2YWx1ZSBpbiB0aGUgYXJyYXlcclxuICAgICAgICB0aGlzLmF1ZGlvTGV2ZWxzLnB1c2goYXVkaW9MZXZlbCk7XHJcblxyXG4gICAgICAgIC8vVXBkYXRlIHRoZSBVSVxyXG4gICAgICAgIHRoaXMudm9sdW1lQ29udHJvbC5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLFwid2lkdGg6XCIrYXVkaW9MZXZlbCtcIiVcIik7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIENhbGN1bGF0ZSB0aGUgYXZlcmFnZSBhdWRpbyBsZXZlbHMgd2l0aCB0aGUgZGF0YSBjb2xsZWN0ZWQgc28gZmFyXHJcbiAgICAgKiBAcHVibGljXHJcbiAgICAgKi9cclxuICAgIGNhbGN1bGF0ZUF2ZXJhZ2VBdWRpbzogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBhdmVyYWdlQXVkaW8gPSBVdGlscy5hdmVyYWdlQXJyYXkodGhpcy5hdWRpb0xldmVscyk7XHJcblxyXG4gICAgICAgIC8vRW1wdHkgdGhlIGFycmF5IGFnYWluXHJcbiAgICAgICAgdGhpcy5hdWRpb0xldmVscyA9IFtdO1xyXG5cclxuICAgICAgICByZXR1cm4gYXZlcmFnZUF1ZGlvO1xyXG5cclxuICAgIH1cclxuXHJcbn07XHJcblxyXG4vL0V4cG9ydCB0aGUgQnJvd3NlcmlmeSBtb2R1bGVcclxubW9kdWxlLmV4cG9ydHMgPSBNZWFzdXJlU3lzdGVtO1xyXG4iLCIvL0JlY2F1c2UgQnJvd3NlcmlmeSBlbmNhcHN1bGF0ZXMgZXZlcnkgbW9kdWxlLCB1c2Ugc3RyaWN0IHdvbid0IGFwcGx5IHRvIHRoZSBnbG9iYWwgc2NvcGUgYW5kIGJyZWFrIGV2ZXJ5dGhpbmdcclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIEV2ZW50ID0gcmVxdWlyZSgnLi4vY29yZS9ldmVudC5qcycpLFxyXG4gICAgVXRpbHMgPSByZXF1aXJlKCcuLi9jb3JlL3V0aWxzLmpzJyk7XHJcblxyXG4vKipcclxuICogVGFzayBTeXN0ZW0gY29uc3RydWN0b3JcclxuICpcclxuICogQGNsYXNzIFRhc2tTeXN0ZW1cclxuICogQGNsYXNzZGVzYyBBIHN5c3RlbSB0aGF0IG1hbmFnZXMgYWxsIHRoaW5ncyB0YXNrIHJlbGF0ZWRcclxuICovXHJcbnZhciBUYXNrU3lzdGVtID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgdGhpcy5ldmVudHMgPSBuZXcgRXZlbnQoKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXl9IHRhc2tzIC0gQW4gYXNzb2NpYXRpdmUgYXJyYXkgZmlsbGVkIHdpdGggYWxsIHRoZSB0YXNrcyB0byBiZSBleGVjdXRlZFxyXG4gICAgICovXHJcbiAgICB0aGlzLnRhc2tzID0gW107XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcGVydHkge1Rhc2t9IGN1cnJlbnRUYXNrIC0gVGhlIHRhc2sgdGhpcyBzeXN0ZW0gaXMgY3VycmVudGx5IGV4ZWN1dGluZ1xyXG4gICAgICovXHJcbiAgICB0aGlzLmN1cnJlbnRUYXNrID0gbnVsbDtcclxuXHJcbn07XHJcblxyXG5UYXNrU3lzdGVtLnByb3RvdHlwZSA9IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIHdoZXRoZXIgdGhlIGVudGl0eSBpcyBidXN5IG9yIG5lZWRzIGEgbmV3IHRhc2tcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIHJ1bjogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIC8vQ2hlY2sgaWYgdGhpcyBlbnRpdHkgaXMgY3VycmVudGx5IGJ1c3kgd2l0aCBoaXMgY3VycmVudCB0YXNrXHJcbiAgICAgICAgaWYodGhpcy5jdXJyZW50VGFzay5zdGF0ZSA9PT0gJ2J1c3knKXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9UaGVyZSBpcyBhIG5ldyB0YXNrLCBzbyB0cmlnZ2VyIHRoYXQgZXZlbnRcclxuICAgICAgICB0aGlzLmV2ZW50cy50cmlnZ2VyKCdmaW5pc2hlZCcpO1xyXG5cclxuICAgICAgICAvL0JlZm9yZSBsb2FkaW5nIG5ldyB0YXNrLCBjaGVjayBhdWRpbyBsZXZlbHMgb24gY3VycmVudCB0YXNrXHJcbiAgICAgICAgLy9JZiB0aGVyZSBhcmUgbW9yZSB0aGFuIDUgYXVkaW8gbGV2ZWxzIHRoZXJlLCBtYWtlIGEgZGVjaXNpb24gaWYgaXQncyBsb3VkXHJcbiAgICAgICAgaWYodGhpcy5jdXJyZW50VGFzay5tZWFzdXJlbWVudHMuYXVkaW8ubGVuZ3RoID49IDUpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBhdmVyYWdlVm9sdW1lID0gVXRpbHMuYXZlcmFnZUFycmF5KHRoaXMuY3VycmVudFRhc2subWVhc3VyZW1lbnRzLmF1ZGlvKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGF2ZXJhZ2VWb2x1bWUgPiA0MCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRUYXNrLmlzTG91ZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50VGFzay5pc0xvdWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vVGhlIGVudGl0eSBpcyBkb25lIHdpdGggaGlzIGN1cnJlbnQgdGFzaywgc28gaGUgaGFzIHRvIHBpY2sgYW5vdGhlciBvbmVcclxuICAgICAgICB2YXIgcG9zc2libGVUYXNrcyA9IHRoaXMuZ2V0UG9zc2libGVUYXNrcygpO1xyXG5cclxuICAgICAgICB0aGlzLmN1cnJlbnRUYXNrID0gdGhpcy5waWNrVGFzayhwb3NzaWJsZVRhc2tzKTtcclxuXHJcbiAgICAgICAgLy9SdW4gdGhlIG5ldyBjdXJyZW50IHRhc2shXHJcbiAgICAgICAgdGhpcy5jdXJyZW50VGFzay5ydW4oKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IGEgY2VydGFpbiB0YXNrIGZyb20gdGhpcyBlbnRpdHlcclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXggLSBUaGUgbnVtYmVyIG9mIHRoZSB0YXNrIHRoYXQgaXMgZ29pbmcgdG8gYmUgcmV0dXJuZWRcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSB0YXNrIHRoYXQgdGhpcyBlbnRpdHkgaGFzIGF0IHRoZSBzcGVjaWZpZWQgaW5kZXhcclxuICAgICAqL1xyXG4gICAgZ2V0VGFzazogZnVuY3Rpb24oaW5kZXgpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGFza3NbaW5kZXhdO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYSB0YXNrIHRvIHRoaXMgZW50aXR5XHJcbiAgICAgKiBAcHVibGljXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHRhc2sgLSBUaGUgdGFzayB0aGF0IGlzIGdldHRpbmcgYWRkZWQgdG8gdGhpcyBlbnRpdHlcclxuICAgICAqL1xyXG4gICAgYWRkVGFzazogZnVuY3Rpb24odGFzaykge1xyXG5cclxuICAgICAgICAvL0FkZCB0aGUgdGFza1xyXG4gICAgICAgIHRoaXMudGFza3MucHVzaCh0YXNrKTtcclxuXHJcbiAgICAgICAgLy9DaGVjayBpZiB0aGUgZW50aXR5IG5lZWRzIHRvIHN0YXJ0IHdpdGggdGhpcyB0YXNrXHJcbiAgICAgICAgaWYodGhpcy5jdXJyZW50VGFzayA9PT0gbnVsbCl7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUYXNrID0gdGFzaztcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VGFzay5ydW4oKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmUgYSB0YXNrIGZyb20gdGhpcyBlbnRpdHlcclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXggLSBUaGUgbnVtYmVyIG9mIHRoZSB0YXNrIHRoYXQgaXMgZ29pbmcgdG8gYmUgcmVtb3ZlZFxyXG4gICAgICovXHJcbiAgICByZW1vdmVUYXNrOiBmdW5jdGlvbihpbmRleCkge1xyXG5cclxuICAgICAgICAvL1JlbW92ZSB0aGUgdGFza1xyXG4gICAgICAgIHRoaXMudGFzay5zcGxpY2UoaW5kZXgsIDEpO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb3VudCB0aGUgbnVtYmVyIG9mIHRhc2tzIGFuZCByZXR1cm4gdGhlIG51bWJlclxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIHtOdW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIHRvdGFsVGFza3M6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy50YXNrcy5sZW5ndGgoKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIGdldFBvc3NpYmxlVGFza3M6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAvL1RoZSBlbnRpdHkgaXMgZG9uZSB3aXRoIGhpcyBjdXJyZW50IHRhc2ssIHNvIGhlIGhhcyB0byBwaWNrIGFub3RoZXIgb25lXHJcbiAgICAgICAgdmFyIHBvc3NpYmxlVGFza3MgPSBbXTtcclxuICAgICAgICB2YXIgdG9kYXkgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIHZhciBob3VycyA9IHRvZGF5LmdldEhvdXJzKCk7XHJcblxyXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLnRhc2tzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICBpZih0aGlzLnRhc2tzW2ldLmlzTG91ZCAmJiBob3VycyA+PSAxMCAmJiBob3VycyA8PSAyMil7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcG9zc2libGVUYXNrcy5wdXNoKHRoaXMudGFza3NbaV0pO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBwb3NzaWJsZVRhc2tzO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgcGlja1Rhc2s6IGZ1bmN0aW9uICh0YXNrcykge1xyXG5cclxuICAgICAgICAvL0xldCBqdXN0IGFzc3VtZSB0aGUgZmlyc3QgdGFzayBpcyB0aGUgbGFzdCB0YXNrLCBkb2Vzbid0IHJlYWxseSBtYXR0ZXIgYXMgbG9uZyBhcyB3ZSBoYXZlIGEgdmFsdWUgdG8gY2hlY2sgYWdhaW5zdFxyXG4gICAgICAgIHZhciBvbGRlc3RUYXNrID0gdGFza3NbMF07XHJcblxyXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0YXNrcy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgLy9JZiBhIHRhc2sgaGFzIG5ldmVyIGJlZW4gZXhlY3V0ZWQgYmVmb3JlLCBqdXN0IHN0YXJ0IHdpdGggdGhhdCBvbmVcclxuICAgICAgICAgICAgaWYodGFza3NbaV0ubGFzdEZpbmlzaGVkID09PSBudWxsKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0YXNrc1tpXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYodGFza3NbaV0ubGFzdEZpbmlzaGVkIDwgb2xkZXN0VGFzay5sYXN0RmluaXNoZWQpe1xyXG4gICAgICAgICAgICAgICAgb2xkZXN0VGFzayA9IHRhc2tzW2ldO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG9sZGVzdFRhc2s7XHJcblxyXG4gICAgfVxyXG5cclxufTtcclxuXHJcbi8vRXhwb3J0IHRoZSBCcm93c2VyaWZ5IG1vZHVsZVxyXG5tb2R1bGUuZXhwb3J0cyA9IFRhc2tTeXN0ZW07XHJcbiIsIi8vQmVjYXVzZSBCcm93c2VyaWZ5IGVuY2Fwc3VsYXRlcyBldmVyeSBtb2R1bGUsIHVzZSBzdHJpY3Qgd29uJ3QgYXBwbHkgdG8gdGhlIGdsb2JhbCBzY29wZSBhbmQgYnJlYWsgZXZlcnl0aGluZ1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4vL1JlcXVpcmUgbmVjZXNzYXJ5IG1vZHVsZXNcclxudmFyIFRhc2sgPSByZXF1aXJlKCcuL3Rhc2suanMnKTtcclxuXHJcbi8qKlxyXG4gKiBNb3BwaW5nIFRhc2sgY29uc3RydWN0b3JcclxuICpcclxuICogQGNsYXNzIE1vcFxyXG4gKiBAY2xhc3NkZXNjIEV4ZWN1dGUgYSBnaXZlbiB0YXNrIGFuZCByZXR1cm4gdGhlIHJlc3VsdFxyXG4gKiBJbmhlcml0cyBmcm9tIFRhc2tcclxuICovXHJcbnZhciBNb3AgPSBmdW5jdGlvbihlbnRpdHkpIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaGVyaXQgdGhlIGNvbnN0cnVjdG9yIGZyb20gdGhlIEVsZW1lbnQgY2xhc3NcclxuICAgICAqL1xyXG4gICAgVGFzay5jYWxsKHRoaXMsIGVudGl0eSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gbmFtZSAtIFRoZSBuYW1lIG9mIHRoaXMgdGFzay5cclxuICAgICAqL1xyXG4gICAgdGhpcy5uYW1lID0gJ01vcCc7XHJcblxyXG59O1xyXG5cclxuTW9wLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVGFzay5wcm90b3R5cGUsIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIHdoZW5ldmVyIHRoZSBzeXN0ZW0gdXBkYXRlc1xyXG4gICAgICogQHByb3RlY3RlZFxyXG4gICAgICovXHJcbiAgICBydW46IHtcclxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAvL1N0YXJ0IHRoZSB0YXNrXHJcbiAgICAgICAgICAgIHRoaXMuc3RhcnQoKTtcclxuXHJcbiAgICAgICAgICAgIC8vRXhlY3V0ZSB0aGUgdGFza1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnSVxcJ20gbW9wcGluZyB0aGUgZmxvb3Igbm93Jyk7XHJcblxyXG4gICAgICAgICAgICBUd2Vlbk1heC50byh0aGlzLmVudGl0eS5tZXNoLnJvdGF0aW9uLCAzLCB7XHJcbiAgICAgICAgICAgICAgICB5IDogdGhpcy5lbnRpdHkubWVzaC5yb3RhdGlvbi55ICsgMTAsXHJcbiAgICAgICAgICAgICAgICBvbkNvbXBsZXRlOiB0aGlzLmZpbmlzaC5iaW5kKHRoaXMpXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59KTtcclxuXHJcbi8vRXhwb3J0IHRoZSBCcm93c2VyaWZ5IG1vZHVsZVxyXG5tb2R1bGUuZXhwb3J0cyA9IE1vcDtcclxuIiwiLy9CZWNhdXNlIEJyb3dzZXJpZnkgZW5jYXBzdWxhdGVzIGV2ZXJ5IG1vZHVsZSwgdXNlIHN0cmljdCB3b24ndCBhcHBseSB0byB0aGUgZ2xvYmFsIHNjb3BlIGFuZCBicmVhayBldmVyeXRoaW5nXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8qKlxyXG4gKiBUYXNrIGNvbnN0cnVjdG9yXHJcbiAqXHJcbiAqIEBjbGFzcyBUYXNrXHJcbiAqIEBjbGFzc2Rlc2MgVGhlIGJhc2UgY2xhc3MgZm9yIHRhc2tzXHJcbiAqXHJcbiAqIEBwYXJhbSB7RW50aXR5fSBlbnRpdHkgLSBBIHJlZmVyZW5jZSB0byB0aGUgZW50aXR5IHRoYXQgaGFzIHRoaXMgdGFza1xyXG4gKi9cclxudmFyIFRhc2sgPSBmdW5jdGlvbihlbnRpdHkpIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBuYW1lIC0gVGhlIG5hbWUgb2YgdGhpcyBzdGF0dXMgZWZmZWN0LiBUaGlzIGZpZWxkIGlzIGFsd2F5cyByZXF1aXJlZCFcclxuICAgICAqL1xyXG4gICAgdGhpcy5uYW1lID0gJ0Jhc2UgVGFzayc7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gc3RhdGUgLSBUaGUgY3VycmVudCBzdGF0ZSBvZiB0aGlzIHRhc2suIENhbiBiZSBEb25lLCBCdXN5LCBQcm9ibGVtLCBQbGFubmVkXHJcbiAgICAgKi9cclxuICAgIHRoaXMuc3RhdGUgPSAncGxhbm5lZCc7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB7Qm9vbGVhbn0gaXNMb3VkIC0gQm9vbGVhbiBpZiB0aGUgdGFzayBpcyBsb3VkIG9yIG5vdFxyXG4gICAgICovXHJcbiAgICB0aGlzLmlzTG91ZCA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gbGFzdEZpbmlzaGVkIC0gVGltZXN0YW1wIG9mIHdoZW4gdGhlIHRhc2sgaXMgZXhlY3V0ZWQgZm9yIHRoZSBsYXN0IHRpbWVcclxuICAgICAqL1xyXG4gICAgdGhpcy5sYXN0RmluaXNoZWQgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtFbnRpdHl9IGVudGl0eSAtIEEgcmVmZXJlbmNlIHRvIHRoZSBlbnRpdHkgdGhhdCBoYXMgdGhpcyB0YXNrXHJcbiAgICAgKi9cclxuICAgIHRoaXMuZW50aXR5ID0gZW50aXR5O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtPYmplY3R9IG1lYXN1cmVtZW50cyAtIE9iamVjdCB3aGljaCBob2xkcyBhbGwgbWVhc3VyZW1lbnRzIGZvciB0aGUgY3VycmVudCB0YXNrXHJcbiAgICAgKi9cclxuICAgIHRoaXMubWVhc3VyZW1lbnRzID0ge1xyXG4gICAgICAgIGF1ZGlvOiBbXVxyXG4gICAgfVxyXG5cclxufTtcclxuXHJcblRhc2sucHJvdG90eXBlID0ge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgd2hlbmV2ZXIgdGhlIHN5c3RlbSB1cGRhdGVzXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHNob3VsZCBiZSBvdmVyd3JpdHRlbiBieSBjdXN0b20gdGFza3NcclxuICAgICAqIEBwcm90ZWN0ZWRcclxuICAgICAqL1xyXG4gICAgcnVuOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgLy9TaWxlbmNlIGlzIGdvbGRlblxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCb290c3RyYXAgYW5kIHN0YXJ0IHRoaXMgdGFza1xyXG4gICAgICogQHByb3RlY3RlZFxyXG4gICAgICovXHJcbiAgICBzdGFydDogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGUgPSAnYnVzeSc7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEZpbmlzaCB0aGlzIHRhc2sgYW5kIHJlcG9ydCByZXN1bHRzXHJcbiAgICAgKiBAcHJvdGVjdGVkXHJcbiAgICAgKi9cclxuICAgIGZpbmlzaDogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIC8vQ2hhbmdlIHRoZSBzdGF0ZSBvZiB0aGUgdGFza1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSAnZG9uZSc7XHJcblxyXG4gICAgICAgIC8vQ3JlYXRlIGEgdGltZXN0YW1wIGZvciB3aGVuIHRoaXMgdGFzayBpcyBmaW5pc2hlZFxyXG4gICAgICAgIHRoaXMubGFzdEZpbmlzaGVkID0gRGF0ZS5ub3coKTtcclxuXHJcbiAgICB9XHJcblxyXG59O1xyXG5cclxuLy9FeHBvcnQgdGhlIEJyb3dzZXJpZnkgbW9kdWxlXHJcbm1vZHVsZS5leHBvcnRzID0gVGFzaztcclxuIiwiLy9CZWNhdXNlIEJyb3dzZXJpZnkgZW5jYXBzdWxhdGVzIGV2ZXJ5IG1vZHVsZSwgdXNlIHN0cmljdCB3b24ndCBhcHBseSB0byB0aGUgZ2xvYmFsIHNjb3BlIGFuZCBicmVhayBldmVyeXRoaW5nXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8vUmVxdWlyZSBuZWNlc3NhcnkgbW9kdWxlc1xyXG52YXIgVGFzayA9IHJlcXVpcmUoJy4vdGFzay5qcycpLFxyXG4gICAgVXRpbHMgPSByZXF1aXJlKCcuLi9jb3JlL3V0aWxzLmpzJyk7XHJcblxyXG4vKipcclxuICogVmFjdXVtIFRhc2sgY29uc3RydWN0b3JcclxuICpcclxuICogQGNsYXNzIFZhY3V1bVxyXG4gKiBAY2xhc3NkZXNjIEV4ZWN1dGUgYSBnaXZlbiB0YXNrIGFuZCByZXR1cm4gdGhlIHJlc3VsdFxyXG4gKiBJbmhlcml0cyBmcm9tIFRhc2tcclxuICovXHJcbnZhciBWYWN1dW0gPSBmdW5jdGlvbihlbnRpdHkpIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaGVyaXQgdGhlIGNvbnN0cnVjdG9yIGZyb20gdGhlIEVsZW1lbnQgY2xhc3NcclxuICAgICAqL1xyXG4gICAgVGFzay5jYWxsKHRoaXMsIGVudGl0eSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gbmFtZSAtIFRoZSBuYW1lIG9mIHRoaXMgdGFzay5cclxuICAgICAqL1xyXG4gICAgdGhpcy5uYW1lID0gJ1ZhY3V1bSc7XHJcblxyXG59O1xyXG5cclxuVmFjdXVtLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVGFzay5wcm90b3R5cGUsIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIHdoZW5ldmVyIHRoZSBzeXN0ZW0gdXBkYXRlc1xyXG4gICAgICogQHByb3RlY3RlZFxyXG4gICAgICovXHJcbiAgICBydW46IHtcclxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAvL1N0YXJ0IHRoZSB0YXNrXHJcbiAgICAgICAgICAgIHRoaXMuc3RhcnQoKTtcclxuXHJcbiAgICAgICAgICAgIC8vRXhlY3V0ZSB0aGUgdGFza1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnSVxcJ20gdmFjdXVtaW5nIG5vdycpO1xyXG5cclxuICAgICAgICAgICAgdmFyIG5ld1Bvc2l0aW9uID0ge1xyXG4gICAgICAgICAgICAgICAgeDogVXRpbHMucmFuZG9tTnVtYmVyU3RlcHMoLTEwMCwgMTAwLCAyMCksXHJcbiAgICAgICAgICAgICAgICB6OiBVdGlscy5yYW5kb21OdW1iZXJTdGVwcygtMTAwLCAxMDAsIDIwKVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdmFyIGRpc3RhbmNlID0ge1xyXG4gICAgICAgICAgICAgICAgeDogTWF0aC5hYnMobmV3UG9zaXRpb24ueCAtIHRoaXMuZW50aXR5Lm1lc2gucG9zaXRpb24ueCksXHJcbiAgICAgICAgICAgICAgICB6OiBNYXRoLmFicyhuZXdQb3NpdGlvbi56IC0gdGhpcy5lbnRpdHkubWVzaC5wb3NpdGlvbi56KVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdmFyIHRvdGFsRGlzdGFuY2UgPSBkaXN0YW5jZS54ICsgZGlzdGFuY2UuejtcclxuICAgICAgICAgICAgdmFyIHRpbWUgPSB0b3RhbERpc3RhbmNlIC8gMzU7XHJcblxyXG4gICAgICAgICAgICBUd2Vlbk1heC50byh0aGlzLmVudGl0eS5tZXNoLnBvc2l0aW9uLCB0aW1lLCB7XHJcbiAgICAgICAgICAgICAgICB4IDogbmV3UG9zaXRpb24ueCxcclxuICAgICAgICAgICAgICAgIHogOiBuZXdQb3NpdGlvbi56LFxyXG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZTogdGhpcy5maW5pc2guYmluZCh0aGlzKVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSk7XHJcblxyXG4vL0V4cG9ydCB0aGUgQnJvd3NlcmlmeSBtb2R1bGVcclxubW9kdWxlLmV4cG9ydHMgPSBWYWN1dW07XHJcbiIsIi8vQmVjYXVzZSBCcm93c2VyaWZ5IGVuY2Fwc3VsYXRlcyBldmVyeSBtb2R1bGUsIHVzZSBzdHJpY3Qgd29uJ3QgYXBwbHkgdG8gdGhlIGdsb2JhbCBzY29wZSBhbmQgYnJlYWsgZXZlcnl0aGluZ1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4vL1JlcXVpcmUgbmVjZXNzYXJ5IG1vZHVsZXNcclxuLy8gLS0gTm9uZSB5ZXRcclxuXHJcbi8qKlxyXG4gKiBXb3JsZCBjb25zdHJ1Y3RvclxyXG4gKlxyXG4gKiBAY2xhc3MgV29ybGRcclxuICogQGNsYXNzZGVzYyBUaGUgV29ybGQgb2JqZWN0IGhvbGRzIGFsbCBvYmplY3RzIHRoYXQgYXJlIGluIHRoZSBkZW1vbnN0cmF0aW9uIHdvcmxkLCB0aGUgbWFwIGV0Yy5cclxuICovXHJcbnZhciBXb3JsZCA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtUSFJFRS5TY2VuZX0gc2NlbmUgLSBSZWZlcmVuY2UgdG8gdGhlIHNjZW5lXHJcbiAgICAgKi9cclxuICAgIHRoaXMuc2NlbmUgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYX0gY2FtZXJhIC0gUmVmZXJlbmNlIHRvIHRoZSBjYW1lcmFcclxuICAgICAqL1xyXG4gICAgdGhpcy5jYW1lcmEgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtUSFJFRS5XZWJHTFJlbmRlcmVyfSByZW5kZXJlciAtIFJlZmVyZW5jZSB0byB0aGUgcmVuZGVyZXJcclxuICAgICAqL1xyXG4gICAgdGhpcy5yZW5kZXJlciA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcGVydHkge1RIUkVFLlRyYWNrYmFsbENvbnRyb2xzfSBjb250cm9scyAtIFJlZmVyZW5jZSB0byB0aGUgY29udHJvbHMgb2JqZWN0XHJcbiAgICAgKi9cclxuICAgIHRoaXMuY29udHJvbHMgPSBudWxsO1xyXG5cclxuICAgIC8vSW5pdGlhbGl6ZSBpdHNlbGZcclxuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xyXG5cclxufTtcclxuXHJcbldvcmxkLnByb3RvdHlwZSA9IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgdGhlIFVJIGVsZW1lbnRzIGFuZCBhZGQgdGhlbSB0byB0aGlzIGNvbnRhaW5lclxyXG4gICAgICogQHByb3RlY3RlZFxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIC8vSW5pdGlhbGl6ZSB0aGUgY2FtZXJhXHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplQ2FtZXJhKCk7XHJcblxyXG4gICAgICAgIC8vSW5pdGlhbGl6ZSB0aGUgbW91c2UgY29udHJvbHNcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVDb250cm9scygpO1xyXG5cclxuICAgICAgICAvL0NyZWF0ZSB0aGUgc3RhZ2UsIGFkZCBhIGxpZ2h0IGFuZCBhIGZsb29yXHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplU3RhZ2UoKTtcclxuXHJcbiAgICAgICAgLy9Jbml0aWFsaXplIHRoZSByZW5kZXJlciBhbmQgY29uZmlndXJlIGl0XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplUmVuZGVyZXIoKTtcclxuXHJcbiAgICAgICAgLy9BZGQgYW4gZXZlbnQgbGlzdGVuZXIgZm9yIHdoZW4gdGhlIHVzZXIgcmVzaXplcyBoaXMgd2luZG93XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMub25XaW5kb3dSZXNpemUuYmluZCh0aGlzKSwgZmFsc2UpO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIGFuZCBzZXR1cCB0aGUgY2FtZXJhXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplQ2FtZXJhOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgLy9DcmVhdGUgYSBuZXcgY2FtZXJhIG9iamVjdFxyXG4gICAgICAgIHRoaXMuY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDQ1LCB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCwgMSwgMTAwMDApO1xyXG5cclxuICAgICAgICAvL0NvbmZpZ3VyZSB0aGUgY2FtZXJhXHJcbiAgICAgICAgdGhpcy5jYW1lcmEucG9zaXRpb24uc2V0KDEyMCwgMTQwLCAxNTApXHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgYW5kIHNldHVwIHRoZSBjb250cm9sc1xyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZUNvbnRyb2xzOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgLy9DcmVhdGUgYSBuZXcgY29udHJvbHMgb2JqZWN0XHJcbiAgICAgICAgdGhpcy5jb250cm9scyA9IG5ldyBUSFJFRS5UcmFja2JhbGxDb250cm9scyh0aGlzLmNhbWVyYSk7XHJcblxyXG4gICAgICAgIC8vU2V0dXAgdGhlIGNvbnRyb2xzXHJcbiAgICAgICAgdGhpcy5jb250cm9scy5yb3RhdGVTcGVlZCA9IDEuMDtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLnpvb21TcGVlZCA9IDEuMjtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLnBhblNwZWVkID0gMS4wO1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMubm9ab29tID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5jb250cm9scy5ub1BhbiA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMuc3RhdGljTW92aW5nID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLmR5bmFtaWNEYW1waW5nRmFjdG9yID0gMC4zO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIGFuZCBzZXR1cCB0aGUgc3RhZ2VcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVTdGFnZTogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIC8vQ3JlYXRlIGEgbmV3IHNjZW5lIGFuZCBhZGQgYW4gYW1iaWVudCBsaWdodFxyXG4gICAgICAgIHRoaXMuc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcclxuXHJcbiAgICAgICAgLy9DcmVhdGUgYSBuZXcgaGVtaWxpZ2h0XHJcbiAgICAgICAgdmFyIGhlbWlMaWdodCA9IG5ldyBUSFJFRS5IZW1pc3BoZXJlTGlnaHQoMHhmZmZmZmYsIDB4ZmZmZmZmLCAwLjYpO1xyXG5cclxuICAgICAgICAvL0NvbmZpZ3VyZSB0aGUgaGVtaWxpZ2h0XHJcbiAgICAgICAgaGVtaUxpZ2h0LmNvbG9yLnNldEhTTCgwLjYsIDEsIDAuNik7XHJcbiAgICAgICAgaGVtaUxpZ2h0Lmdyb3VuZENvbG9yLnNldEhTTCgwLjA5NSwgMSwgMC43NSk7XHJcbiAgICAgICAgaGVtaUxpZ2h0LnBvc2l0aW9uLnNldCgwLCA1MDAsIDApO1xyXG5cclxuICAgICAgICAvL0FkZCB0aGUgaGVtaWxpZ2h0IHRvIHRoZSBzdGFnZVxyXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGhlbWlMaWdodCk7XHJcblxyXG4gICAgICAgIC8vQ3JlYXRlIGEgbmV3IGRpcmVjdGlvbmFsIGxpZ2h0XHJcbiAgICAgICAgdmFyIGRpckxpZ2h0ID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoMHhmZmZmZmYsIDEpO1xyXG5cclxuICAgICAgICAvL0NvbmZpZ3VyZSB0aGUgZGlyZWN0aW9uYWwgbGlnaHRcclxuICAgICAgICBkaXJMaWdodC5jb2xvci5zZXRIU0woMC4xLCAxLCAwLjk1KTtcclxuICAgICAgICBkaXJMaWdodC5wb3NpdGlvbi5zZXQoLTEsIDEsIDQpO1xyXG4gICAgICAgIGRpckxpZ2h0LnBvc2l0aW9uLm11bHRpcGx5U2NhbGFyKDUwKTtcclxuXHJcbiAgICAgICAgLy9BZGQgdGhlIGxpZ2h0IHRvIHRoZSBzY2VuZVxyXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGRpckxpZ2h0KTtcclxuXHJcbiAgICAgICAgZGlyTGlnaHQuY2FzdFNoYWRvdyA9IHRydWU7XHJcblxyXG4gICAgICAgIGRpckxpZ2h0LnNoYWRvd01hcFdpZHRoID0gMjA0ODtcclxuICAgICAgICBkaXJMaWdodC5zaGFkb3dNYXBIZWlnaHQgPSAyMDQ4O1xyXG5cclxuICAgICAgICB2YXIgZCA9IDUwMDtcclxuXHJcbiAgICAgICAgZGlyTGlnaHQuc2hhZG93Q2FtZXJhTGVmdCA9IC1kO1xyXG4gICAgICAgIGRpckxpZ2h0LnNoYWRvd0NhbWVyYVJpZ2h0ID0gZDtcclxuICAgICAgICBkaXJMaWdodC5zaGFkb3dDYW1lcmFUb3AgPSBkO1xyXG4gICAgICAgIGRpckxpZ2h0LnNoYWRvd0NhbWVyYUJvdHRvbSA9IC1kO1xyXG5cclxuICAgICAgICBkaXJMaWdodC5zaGFkb3dDYW1lcmFGYXIgPSAzNTAwO1xyXG4gICAgICAgIGRpckxpZ2h0LnNoYWRvd0JpYXMgPSAtMC4wMDAxO1xyXG4gICAgICAgIGRpckxpZ2h0LnNoYWRvd0RhcmtuZXNzID0gMC4zNTtcclxuXHJcbiAgICAgICAgdmFyIGdyaWRTaXplID0gNTAwO1xyXG4gICAgICAgIHZhciBncmlkU3RlcCA9IDIwO1xyXG5cclxuICAgICAgICB2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuR2VvbWV0cnkoKTtcclxuICAgICAgICB2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoe2NvbG9yOiBcIndoaXRlXCJ9KTtcclxuXHJcbiAgICAgICAgZm9yKHZhciBpID0gLWdyaWRTaXplOyBpIDw9IGdyaWRTaXplOyBpICs9IGdyaWRTdGVwKXtcclxuICAgICAgICAgICAgZ2VvbWV0cnkudmVydGljZXMucHVzaChuZXcgVEhSRUUuVmVjdG9yMygtZ3JpZFNpemUsIC0wLjA0LCBpKSk7XHJcbiAgICAgICAgICAgIGdlb21ldHJ5LnZlcnRpY2VzLnB1c2gobmV3IFRIUkVFLlZlY3RvcjMoZ3JpZFNpemUsIC0wLjA0LCBpKSk7XHJcblxyXG4gICAgICAgICAgICBnZW9tZXRyeS52ZXJ0aWNlcy5wdXNoKG5ldyBUSFJFRS5WZWN0b3IzKGksIC0wLjA0LCAtZ3JpZFNpemUpKTtcclxuICAgICAgICAgICAgZ2VvbWV0cnkudmVydGljZXMucHVzaChuZXcgVEhSRUUuVmVjdG9yMyhpLCAtMC4wNCwgZ3JpZFNpemUpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBsaW5lID0gbmV3IFRIUkVFLkxpbmUoZ2VvbWV0cnksIG1hdGVyaWFsLCBUSFJFRS5MaW5lUGllY2VzKTtcclxuICAgICAgICBsaW5lLnBvc2l0aW9uLnNldCgtMTAsIC0xMCwgMTApO1xyXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGxpbmUpO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIGFuZCBzZXR1cCB0aGUgcmVuZGVyZXJcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVSZW5kZXJlcjogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIC8vQ3JlYXRlIGEgbmV3IHJlbmRlcmVyIG9iamVjdFxyXG4gICAgICAgIHRoaXMucmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7XHJcbiAgICAgICAgICAgIGFudGlhbGlhczogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvL0NvbmZpZ3VyZSB0aGUgcmVuZGVyZXJcclxuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldENsZWFyQ29sb3IoMHhmMGYwZjApO1xyXG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyZXIuc29ydE9iamVjdHMgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnJlbmRlcmVyLnNoYWRvd01hcEVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2hhZG93TWFwVHlwZSA9IFRIUkVFLlBDRlNoYWRvd01hcDtcclxuXHJcbiAgICAgICAgLy9BcHBlbmQgdGhlIHJlbmRlcmVyIHRvIHRoZSBIVE1MIGJvZHlcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMucmVuZGVyZXIuZG9tRWxlbWVudCk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEZ1bmN0aW9uIHRoYXQgaXMgZXhlY3V0ZWQgZXZlcnkgdGltZSB0aGUgd2luZG93IHJlc2l6ZXNcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIG9uV2luZG93UmVzaXplOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgLy9DaGFuZ2UgdGhlIGNhbWVyYSdzIGFzcGVjdCByYXRpbmcgYW5kIHVwZGF0ZSBpdFxyXG4gICAgICAgIHRoaXMuY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcclxuXHJcbiAgICAgICAgLy9DaGFuZ2UgdGhlIHNpemUgb2YgdGhlIHJlbmRlcmVyIHRvIHRoZSBuZXcgd2luZG93IHNpemVcclxuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEFsbCB0aGUgZnVuY3Rpb25zIHRoYXQgbmVlZCB0byBiZSBleGVjdXRlZCBldmVyeSB0aW1lIHRoZSBzeXN0ZW0gdXBkYXRlc1xyXG4gICAgICogQHByb3RlY3RlZFxyXG4gICAgICovXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgLy9VcGRhdGUgdGhlIGNvbnRyb2xzIHRvIG1hdGNoIHRoZSB1c2VycyBpbnRlcmFjdGlvblxyXG4gICAgICAgIHRoaXMuY29udHJvbHMudXBkYXRlKCk7XHJcblxyXG4gICAgICAgIC8vUmVuZGVyIHRoZSBzY2VuZSBhZ2FpblxyXG4gICAgICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUsIHRoaXMuY2FtZXJhKTtcclxuXHJcbiAgICB9XHJcblxyXG59O1xyXG5cclxuLy9FeHBvcnQgdGhlIEJyb3dzZXJpZnkgbW9kdWxlXHJcbm1vZHVsZS5leHBvcnRzID0gV29ybGQ7XHJcbiJdfQ==
;