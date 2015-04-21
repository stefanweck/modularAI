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
    Entity = require('../entity/entity.js'),
    Vacuum = require('../tasks/vacuum.js'),
    Mop = require('../tasks/mop.js'),
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
        firstRobot.systems['task'].addTask(new Mop());
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

},{"../entity/entity.js":4,"../entity/group.js":5,"../tasks/mop.js":9,"../tasks/vacuum.js":11,"../world/world.js":12}],3:[function(require,module,exports){
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

},{"../systems/measure.js":7,"../systems/task.js":8}],5:[function(require,module,exports){
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

},{"./core/system.js":2}],7:[function(require,module,exports){
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

        //If the current task is vacuuming, make a lot of noise!
        if(this.entity.systems['task'].currentTask.name === 'Vacuum'){

            this.audioLevels.push(Utils.randomNumber(50, 70));
            return;

        }

        //Little to no noise
        this.audioLevels.push(Utils.randomNumber(0, 10));

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

},{"../core/utils.js":3}],8:[function(require,module,exports){
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

},{"../core/event.js":1,"../core/utils.js":3}],9:[function(require,module,exports){
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
var Mop = function() {

    /**
     * Inherit the constructor from the Element class
     */
    Task.call(this);

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

            //Make sure the task ends in 5 seconds
            setTimeout(this.finish.bind(this), 4000);

        }
    }

});

//Export the Browserify module
module.exports = Mop;

},{"./task.js":10}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
//Because Browserify encapsulates every module, use strict won't apply to the global scope and break everything
'use strict';

//Require necessary modules
var Task = require('./task.js');

/**
 * Vacuum Task constructor
 *
 * @class Vacuum
 * @classdesc Execute a given task and return the result
 * Inherits from Task
 */
var Vacuum = function() {

    /**
     * Inherit the constructor from the Element class
     */
    Task.call(this);

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

            //Make sure the task ends in 5 seconds
            setTimeout(this.finish.bind(this), 3000);

        }
    }

});

//Export the Browserify module
module.exports = Vacuum;

},{"./task.js":10}],12:[function(require,module,exports){
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

        //Initialize all objects in the world
        this.initializeObjects();

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
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);

        //Configure the camera
        this.camera.position.z = 1000;

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
        var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );

        //Configure the hemilight
        hemiLight.color.setHSL( 0.6, 1, 0.6 );
        hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
        hemiLight.position.set( 0, 500, 0 );

        //Add the hemilight to the stage
        this.scene.add( hemiLight );

        //Create a new directional light
        var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );

        //Configure the directional light
        dirLight.color.setHSL( 0.1, 1, 0.95 );
        dirLight.position.set( -1, 1, 4 );
        dirLight.position.multiplyScalar( 50 );

        //Add the light to the scene
        this.scene.add( dirLight );

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

        //Create a new plane, we are using this for a floor
        var plane = new THREE.Mesh(
            new THREE.PlaneBufferGeometry( 1000, 1000, 8, 8 ),
            new THREE.MeshBasicMaterial({color: 0xf0f0f0, overdraw: 0.5})
        );

        //Configure the plane
        plane.receiveShadow = true;

        //Add the plane to the newly created scene
        this.scene.add(plane);

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
     * Initialize and setup the objects
     * @private
     */
    initializeObjects: function() {

        //Create a reusable geometry object for a cube
        var geometry = new THREE.BoxGeometry(40, 40, 40);

        //Create the new cube object with the geometry
        var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff}));

        //Position the cube
        object.position.x = 0;
        object.position.y = 0;
        object.position.z = 20;

        //Configure the cube
        object.castShadow = true;
        object.receiveShadow = true;

        //Add the cube to the scene
        this.scene.add(object);

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

},{}]},{},[6])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6L3hhbXBwL2h0ZG9jcy9tb2R1bGFyQUkvbGliL2NvcmUvZXZlbnQuanMiLCJEOi94YW1wcC9odGRvY3MvbW9kdWxhckFJL2xpYi9jb3JlL3N5c3RlbS5qcyIsIkQ6L3hhbXBwL2h0ZG9jcy9tb2R1bGFyQUkvbGliL2NvcmUvdXRpbHMuanMiLCJEOi94YW1wcC9odGRvY3MvbW9kdWxhckFJL2xpYi9lbnRpdHkvZW50aXR5LmpzIiwiRDoveGFtcHAvaHRkb2NzL21vZHVsYXJBSS9saWIvZW50aXR5L2dyb3VwLmpzIiwiRDoveGFtcHAvaHRkb2NzL21vZHVsYXJBSS9saWIvaW5pdC5qcyIsIkQ6L3hhbXBwL2h0ZG9jcy9tb2R1bGFyQUkvbGliL3N5c3RlbXMvbWVhc3VyZS5qcyIsIkQ6L3hhbXBwL2h0ZG9jcy9tb2R1bGFyQUkvbGliL3N5c3RlbXMvdGFzay5qcyIsIkQ6L3hhbXBwL2h0ZG9jcy9tb2R1bGFyQUkvbGliL3Rhc2tzL21vcC5qcyIsIkQ6L3hhbXBwL2h0ZG9jcy9tb2R1bGFyQUkvbGliL3Rhc2tzL3Rhc2suanMiLCJEOi94YW1wcC9odGRvY3MvbW9kdWxhckFJL2xpYi90YXNrcy92YWN1dW0uanMiLCJEOi94YW1wcC9odGRvY3MvbW9kdWxhckFJL2xpYi93b3JsZC93b3JsZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiLy9CZWNhdXNlIEJyb3dzZXJpZnkgZW5jYXBzdWxhdGVzIGV2ZXJ5IG1vZHVsZSwgdXNlIHN0cmljdCB3b24ndCBhcHBseSB0byB0aGUgZ2xvYmFsIHNjb3BlIGFuZCBicmVhayBldmVyeXRoaW5nXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogRXZlbnQgY29uc3RydWN0b3JcbiAqXG4gKiBJbnNwaXJlZCBieSB0aGUgZ3JlYXQgdHV0b3JpYWwgYXQ6XG4gKiBodHRwczovL2NvcmNvcmFuLmlvLzIwMTMvMDYvMDEvYnVpbGRpbmctYS1taW5pbWFsLWphdmFzY3JpcHQtZXZlbnQtc3lzdGVtL1xuICpcbiAqIEBjbGFzcyBFdmVudFxuICogQGNsYXNzZGVzYyBBbiBvYmplY3QgdGhhdCBjYW4gYW5ub3VuY2UgYW5kIGxpc3RlbiBmb3IgZXZlbnRzXG4gKlxuICovXG52YXIgRXZlbnQgPSBmdW5jdGlvbigpIHtcblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBldmVudHMgLSBBbiBhc3NvY2lhdGl2ZSBhcnJheSB3aXRoIGFsbCB0aGUgY3VycmVudCBldmVudHNcbiAgICAgKi9cbiAgICB0aGlzLmV2ZW50cyA9IHt9O1xuXG59O1xuXG5FdmVudC5wcm90b3R5cGUgPSB7XG5cbiAgICAvKipcbiAgICAgKiBGdW5jdGlvbiB0aGF0IGhhbmRsZXMga2V5ZG93biBldmVudHNcbiAgICAgKiBAcHJvdGVjdGVkXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIFRoZSB0eXBlIG9mIGV2ZW50IHRoYXQgY2FuIGJlIHRyaWdnZXJlZFxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGZ1bmN0aW9uIHRoYXQgaGFzIHRvIGJlIHBlcmZvcm1lZCBhcyBhIGNhbGxiYWNrXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgLSBUaGUgb2JqZWN0IHRoYXQgc2hvdWxkIGJlIGFjY2Vzc2libGUgd2hlbiB0aGUgZXZlbnQgaXMgY2FsbGVkXG4gICAgICovXG4gICAgb246IGZ1bmN0aW9uKHR5cGUsIGNhbGxiYWNrLCBjb250ZXh0KSB7XG5cbiAgICAgICAgLy9JZiB0aGlzLmV2ZW50cyBkb2Vzbid0IGhhdmUgdGhlIGV2ZW50IHByb3BlcnR5LCBjcmVhdGUgYW4gZW1wdHkgYXJyYXlcbiAgICAgICAgaWYoIXRoaXMuZXZlbnRzLmhhc093blByb3BlcnR5KHR5cGUpKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1t0eXBlXSA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9JbnNlcnQgdGhlIGNhbGxiYWNrIGludG8gdGhlIGN1cnJlbnQgZXZlbnRcbiAgICAgICAgdGhpcy5ldmVudHNbdHlwZV0ucHVzaChbY2FsbGJhY2ssIGNvbnRleHRdKTtcblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBGdW5jdGlvbiB0aGF0IGlzIGNhbGxlZCB3aGVuIGFuIGV2ZW50IGlzIHRyaWdnZXJlZFxuICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gVGhlIHR5cGUgb2YgZXZlbnQgdGhhdCBpcyB0cmlnZ2VyZWRcbiAgICAgKi9cbiAgICB0cmlnZ2VyOiBmdW5jdGlvbih0eXBlKSB7XG5cbiAgICAgICAgLy9CZWNhdXNlIHdlIGRvbid0IGtub3cgaG93IG1hbnkgYXJndW1lbnRzIGFyZSBiZWluZyBzZW5kIHRvXG4gICAgICAgIC8vdGhlIGNhbGxiYWNrcywgbGV0J3MgZ2V0IHRoZW0gYWxsIGV4Y2VwdCB0aGUgZmlyc3Qgb25lICggdGhlIHRhaWwgKVxuICAgICAgICB2YXIgdGFpbCA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cbiAgICAgICAgLy9HZXQgYWxsIHRoZSBjYWxsYmFja3MgZm9yIHRoZSBjdXJyZW50IGV2ZW50XG4gICAgICAgIHZhciBjYWxsYmFja3MgPSB0aGlzLmV2ZW50c1t0eXBlXTtcblxuICAgICAgICAvL0NoZWNrIGlmIHRoZXJlIGFyZSBjYWxsYmFja3MgZGVmaW5lZCBmb3IgdGhpcyBrZXksIGlmIG5vdCwgc3RvcCFcbiAgICAgICAgaWYoY2FsbGJhY2tzICE9PSB1bmRlZmluZWQpIHtcblxuICAgICAgICAgICAgLy9Mb29wIHRocm91Z2ggdGhlIGNhbGxiYWNrcyBhbmQgcnVuIGVhY2ggY2FsbGJhY2tcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgICAgICAgIC8vR2V0IHRoZSBjdXJyZW50IGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gY2FsbGJhY2tzW2ldWzBdO1xuICAgICAgICAgICAgICAgIHZhciBjb250ZXh0O1xuXG4gICAgICAgICAgICAgICAgLy9HZXQgdGhlIGN1cnJlbnQgY29udGV4dCBvYmplY3QsIGlmIGl0IGV4aXN0c1xuICAgICAgICAgICAgICAgIGlmKGNhbGxiYWNrc1tpXVsxXSA9PT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy9JZiB0aGUgY29udGV4dCBpcyBub3QgZGVmaW5lZCwgdGhlIHNjb3BlIGlzIGdvaW5nIHRvIGJlIHRoaXMgKCBFdmVudCBvYmplY3QgKVxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0ID0gdGhpcztcblxuICAgICAgICAgICAgICAgIH1lbHNle1xuXG4gICAgICAgICAgICAgICAgICAgIC8vR2V0IHRoZSBjb250ZXh0IG9iamVjdFxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0ID0gY2FsbGJhY2tzW2ldWzFdO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy9SdW4gdGhlIGN1cnJlbnQgY2FsbGJhY2sgYW5kIHNlbmQgdGhlIHRhaWwgYWxvbmcgd2l0aCBpdFxuICAgICAgICAgICAgICAgIC8vVGhlIGFwcGx5KCkgbWV0aG9kIGNhbGxzIGEgZnVuY3Rpb24gd2l0aCBhIGdpdmVuIHRoaXMgdmFsdWUgYW5kIGFyZ3VtZW50cyBwcm92aWRlZCBhcyBhbiBhcnJheVxuICAgICAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KGNvbnRleHQsIHRhaWwpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG59O1xuXG4vL0V4cG9ydCB0aGUgQnJvd3NlcmlmeSBtb2R1bGVcbm1vZHVsZS5leHBvcnRzID0gRXZlbnQ7XG4iLCIvL0JlY2F1c2UgQnJvd3NlcmlmeSBlbmNhcHN1bGF0ZXMgZXZlcnkgbW9kdWxlLCB1c2Ugc3RyaWN0IHdvbid0IGFwcGx5IHRvIHRoZSBnbG9iYWwgc2NvcGUgYW5kIGJyZWFrIGV2ZXJ5dGhpbmdcclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy9SZXF1aXJlIG5lY2Vzc2FyeSBtb2R1bGVzXHJcbnZhciBHcm91cCA9IHJlcXVpcmUoJy4uL2VudGl0eS9ncm91cC5qcycpLFxyXG4gICAgRW50aXR5ID0gcmVxdWlyZSgnLi4vZW50aXR5L2VudGl0eS5qcycpLFxyXG4gICAgVmFjdXVtID0gcmVxdWlyZSgnLi4vdGFza3MvdmFjdXVtLmpzJyksXHJcbiAgICBNb3AgPSByZXF1aXJlKCcuLi90YXNrcy9tb3AuanMnKSxcclxuICAgIFdvcmxkID0gcmVxdWlyZSgnLi4vd29ybGQvd29ybGQuanMnKTtcclxuXHJcbi8qKlxyXG4gKiBTeXN0ZW0gQ29uc3RydWN0b3JcclxuICpcclxuICogQGNsYXNzIFN5c3RlbVxyXG4gKiBAY2xhc3NkZXNjIFRoZSBoZWFydCBvZiB0aGlzIG1vZHVsYXIgQUkhIEluIGhlcmUgd2UgcHJvdmlkZSBhY2Nlc3MgdG9cclxuICogYWxsIHRoZSBvdGhlciBvYmplY3RzIGFuZCBmdW5jdGlvbiwgYW5kIHdlIGhhbmRsZSB0aGUgc3RhcnR1cCBvZiB0aGUgc3lzdGVtXHJcbiAqXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSB1c2VyU2V0dGluZ3MgLSBUaGUgc2V0dGluZ3MgdGhhdCB0aGUgdXNlciBwcm92aWRlc1xyXG4gKi9cclxudmFyIFN5c3RlbSA9IGZ1bmN0aW9uKHVzZXJTZXR0aW5ncykge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtCb29sZWFufSBpc0luaXRpYWxpemVkIC0gVHJ1ZSB3aGVuIHRoZSBzeXN0ZW0gaXMgZnVsbHkgaW5pdGlhbGl6ZWRcclxuICAgICAqL1xyXG4gICAgdGhpcy5pc0luaXRpYWxpemVkID0gZmFsc2U7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcGVydHkge0dyb3VwfSBlbnRpdGllcyAtIEFsbCB0aGUgZW50aXRpZXMgY29udHJvbGxlZCBieSB0aGlzIHN5c3RlbVxyXG4gICAgICovXHJcbiAgICB0aGlzLmVudGl0aWVzID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wZXJ0eSB7V29ybGR9IHdvcmxkIC0gVGhlIHdvcmxkIGZvciBkZW1vbnN0cmF0aW5nIHB1cnBvc2VzXHJcbiAgICAgKi9cclxuICAgIHRoaXMud29ybGQgPSBudWxsO1xyXG5cclxuICAgIC8vTG9hZCBhbmQgdGhlbiBpbml0aWFsaXplIGl0c2VsZlxyXG4gICAgdGhpcy5pbml0aWFsaXplKCk7XHJcblxyXG59O1xyXG5cclxuU3lzdGVtLnByb3RvdHlwZSA9IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgdGhlIHN5c3RlbVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIC8vQ2hlY2sgaWYgdGhlIGdhbWUgaXMgYWxyZWFkeSBpbml0aWFsaXplZFxyXG4gICAgICAgIGlmKHRoaXMuaXNJbml0aWFsaXplZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL0NyZWF0ZSBhIG5ldyBncm91cCB0aGF0IHdpbGwgaG9sZCBhbGwgZW50aXRpZXNcclxuICAgICAgICB0aGlzLmVudGl0aWVzID0gbmV3IEdyb3VwKCk7XHJcblxyXG4gICAgICAgIC8vQ3JlYXRlIGEgbmV3IGVudGl0eSBhbmQgYWRkIGl0IHRvIHRoZSBncm91cFxyXG4gICAgICAgIHZhciBmaXJzdFJvYm90ID0gbmV3IEVudGl0eSgnUm9iaW4nKTtcclxuICAgICAgICBmaXJzdFJvYm90LnN5c3RlbXNbJ3Rhc2snXS5hZGRUYXNrKG5ldyBWYWN1dW0oKSk7XHJcbiAgICAgICAgZmlyc3RSb2JvdC5zeXN0ZW1zWyd0YXNrJ10uYWRkVGFzayhuZXcgTW9wKCkpO1xyXG4gICAgICAgIHRoaXMuZW50aXRpZXMuYWRkRW50aXR5KGZpcnN0Um9ib3QpO1xyXG5cclxuICAgICAgICAvL0NyZWF0ZSB0aGUgd29ybGQgb2JqZWN0XHJcbiAgICAgICAgdGhpcy53b3JsZCA9IG5ldyBXb3JsZCgpO1xyXG5cclxuICAgICAgICAvL1VwZGF0ZSB0aGUgc3lzdGVtIGZvciB0aGUgZmlyc3QgdGltZVxyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcblxyXG4gICAgICAgIC8vVGhlIHN5c3RlbSBpcyBmdWxseSBpbml0aWFsaXplZFxyXG4gICAgICAgIHRoaXMuaXNJbml0aWFsaXplZCA9IHRydWU7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEFsbCB0aGUgZnVuY3Rpb25zIHRoYXQgbmVlZCB0byBiZSBleGVjdXRlZCBldmVyeSB0aW1lIHRoZSBzeXN0ZW0gdXBkYXRlc1xyXG4gICAgICogQmFzaWNhbGx5IGEgZ2FtZSBsb29wXHJcbiAgICAgKiBAcHJvdGVjdGVkXHJcbiAgICAgKi9cclxuICAgIHVwZGF0ZTogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIC8vUmVxdWVzdCBhIG5ldyBhbmltYXRpb24gZnJhbWUgYW5kIGNhbGwgdGhlIHVwZGF0ZSBmdW5jdGlvbiBhZ2FpblxyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnVwZGF0ZS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgLy9HZXQgYWxsIGVudGl0aWVzIGluIHRoZSBzeXN0ZW1cclxuICAgICAgICB2YXIgZW50aXRpZXMgPSB0aGlzLmVudGl0aWVzLmdldEVudGl0aWVzKCk7XHJcblxyXG4gICAgICAgIC8vTG9vcCB0aHJvdWdoIGFsbCB0aGUgZW50aXRpZXNcclxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgZW50aXRpZXMubGVuZ3RoOyBpKyspe1xyXG5cclxuICAgICAgICAgICAgLy9FeGVjdXRlIHRoZSBydW4gY29tbWFuZCBmb3IgZWFjaCBlbnRpdHkgc28gaXQgd2lsbCBzdGFydCBhY3RpbmdcclxuICAgICAgICAgICAgZW50aXRpZXNbaV0ucnVuKCk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9VcGRhdGUgdGhlIGRlbW9uc3RyYXRpb24gd29ybGRcclxuICAgICAgICB0aGlzLndvcmxkLnVwZGF0ZSgpO1xyXG5cclxuICAgIH1cclxuXHJcbn07XHJcblxyXG4vL0V4cG9ydCB0aGUgQnJvd3NlcmlmeSBtb2R1bGVcclxubW9kdWxlLmV4cG9ydHMgPSBTeXN0ZW07XHJcbiIsIi8vQmVjYXVzZSBCcm93c2VyaWZ5IGVuY2Fwc3VsYXRlcyBldmVyeSBtb2R1bGUsIHVzZSBzdHJpY3Qgd29uJ3QgYXBwbHkgdG8gdGhlIGdsb2JhbCBzY29wZSBhbmQgYnJlYWsgZXZlcnl0aGluZ1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4vKipcclxuICogU3RhdGljIFV0aWxpdGllcyBDbGFzc1xyXG4gKlxyXG4gKiBAY2xhc3MgVXRpbHNcclxuICogQGNsYXNzZGVzYyBJbiB0aGlzIGNsYXNzIGFyZSB0aGUgZnVuY3Rpb25zIHN0b3JlZCB0aGF0IGFyZSBiZWluZ1xyXG4gKiB1c2VkIGluIG90aGVyIGZ1bmN0aW9uc1xyXG4gKi9cclxudmFyIFV0aWxzID0ge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRnVuY3Rpb24gdG8gZ2VuZXJhdGUgYSByYW5kb20gbnVtYmVyIGJldHdlZW4gdHdvIHZhbHVlc1xyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBmcm9tIC0gVGhlIG1pbmltdW0gbnVtYmVyXHJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdG8gLSBUaGUgbWF4aW11bSBudW1iZXJcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IEEgcmFuZG9tIG51bWJlciBiZXR3ZWVuIHRoZSB0d28gc3VwcGxpZWQgdmFsdWVzXHJcbiAgICAgKi9cclxuICAgIHJhbmRvbU51bWJlcjogZnVuY3Rpb24oZnJvbSwgdG8pIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICh0byAtIGZyb20gKyAxKSArIGZyb20pO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxjdWxhdGUgdGhlIGF2ZXJhZ2UgZnJvbSBhbGwgdmFsdWVzIGluIGFuIGFycmF5XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgLSBUaGUgYXJyYXkgYmVpbmcgdXNlZCBmb3IgYXZlcmFnZSBjYWxjdWxhdGlvbnNcclxuICAgICAqIEByZXR1cm5zIHtOdW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIGF2ZXJhZ2VBcnJheTogZnVuY3Rpb24oYXJyYXkpIHtcclxuXHJcbiAgICAgICAgdmFyIHN1bSA9IDA7XHJcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgc3VtICs9IHBhcnNlSW50KGFycmF5W2ldLCAxMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3VtIC8gYXJyYXkubGVuZ3RoO1xyXG5cclxuICAgIH1cclxuXHJcbn07XHJcblxyXG4vL0V4cG9ydCB0aGUgQnJvd3NlcmlmeSBtb2R1bGVcclxubW9kdWxlLmV4cG9ydHMgPSBVdGlscztcclxuIiwiLy9CZWNhdXNlIEJyb3dzZXJpZnkgZW5jYXBzdWxhdGVzIGV2ZXJ5IG1vZHVsZSwgdXNlIHN0cmljdCB3b24ndCBhcHBseSB0byB0aGUgZ2xvYmFsIHNjb3BlIGFuZCBicmVhayBldmVyeXRoaW5nXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBUYXNrU3lzdGVtID0gcmVxdWlyZSgnLi4vc3lzdGVtcy90YXNrLmpzJyksXHJcbiAgICBNZWFzdXJlU3lzdGVtID0gcmVxdWlyZSgnLi4vc3lzdGVtcy9tZWFzdXJlLmpzJyk7XHJcblxyXG4vKipcclxuICogRW50aXR5IGNvbnN0cnVjdG9yXHJcbiAqXHJcbiAqIEBjbGFzcyBFbnRpdHlcclxuICogQGNsYXNzZGVzYyBBIHNpbmdsZSBlbnRpdHkgdGhhdCBoYXMgY2VydGFpbiBiZWhhdmlvdXIgdG8gYmUgZXhlY3V0ZWRcclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSBvZiB0aGlzIGVudGl0eVxyXG4gKi9cclxudmFyIEVudGl0eSA9IGZ1bmN0aW9uKG5hbWUpIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBuYW1lIC0gVGhlIG5hbWUgb2YgdGhpcyBlbnRpdHlcclxuICAgICAqL1xyXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXl9IHN5c3RlbXMgLSBBbiBhc3NvY2lhdGl2ZSBhcnJheSBmaWxsZWQgd2l0aCBhbGwgdGhlIHN5c3RlbXMgdGhhdCBuZWVkIHRvIGJlIGNhbGxlZCBldmVyeSBzdGVwXHJcbiAgICAgKi9cclxuICAgIHRoaXMuc3lzdGVtcyA9IHt9O1xyXG5cclxuICAgIC8vSW5pdGlhbGl6ZSBpdHNlbGZcclxuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xyXG5cclxufTtcclxuXHJcbkVudGl0eS5wcm90b3R5cGUgPSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIHRoZSBlbnRpdHksIGNyZWF0ZSBuZXcgb2JqZWN0cyBhbmQgYXBwbHkgc2V0dGluZ3NcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAvL0FkZCBzeXN0ZW1zXHJcbiAgICAgICAgdGhpcy5zeXN0ZW1zWyd0YXNrJ10gPSBuZXcgVGFza1N5c3RlbSgpO1xyXG4gICAgICAgIHRoaXMuc3lzdGVtc1snbWVhc3VyZSddID0gbmV3IE1lYXN1cmVTeXN0ZW0odGhpcyk7XHJcblxyXG4gICAgICAgIC8vQ29uZmlndXJlIHN5c3RlbXNcclxuICAgICAgICB0aGlzLnN5c3RlbXNbJ3Rhc2snXS5ldmVudHMub24oJ2ZpbmlzaGVkJywgdGhpcy5maW5pc2hlZFRhc2suYmluZCh0aGlzKSwgdGhpcyk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEV4ZWN1dGUgYWxsIHRoZSBzeXN0ZW1zIG9uIHRoaXMgZW50aXR5IGV2ZXJ5IHN0ZXAgb2YgdGhlIGxvb3BcclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqL1xyXG4gICAgcnVuOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgZm9yKHZhciBzeXN0ZW0gaW4gdGhpcy5zeXN0ZW1zKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN5c3RlbXMuaGFzT3duUHJvcGVydHkoc3lzdGVtKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zeXN0ZW1zW3N5c3RlbV0ucnVuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBmaW5pc2hlZFRhc2s6IGZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICAgIHZhciBhdmVyYWdlQXVkaW8gPSB0aGlzLnN5c3RlbXNbJ21lYXN1cmUnXS5jYWxjdWxhdGVBdmVyYWdlQXVkaW8oKTtcclxuXHJcbiAgICAgICAgdGhpcy5zeXN0ZW1zWyd0YXNrJ10uY3VycmVudFRhc2subWVhc3VyZW1lbnRzLmF1ZGlvLnB1c2goYXZlcmFnZUF1ZGlvKTtcclxuXHJcbiAgICB9XHJcblxyXG59O1xyXG5cclxuLy9FeHBvcnQgdGhlIEJyb3dzZXJpZnkgbW9kdWxlXHJcbm1vZHVsZS5leHBvcnRzID0gRW50aXR5O1xyXG4iLCIvL0JlY2F1c2UgQnJvd3NlcmlmeSBlbmNhcHN1bGF0ZXMgZXZlcnkgbW9kdWxlLCB1c2Ugc3RyaWN0IHdvbid0IGFwcGx5IHRvIHRoZSBnbG9iYWwgc2NvcGUgYW5kIGJyZWFrIGV2ZXJ5dGhpbmdcclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy9SZXF1aXJlIG5lY2Vzc2FyeSBtb2R1bGVzXHJcbnZhciBFbnRpdHkgPSByZXF1aXJlKCcuL2VudGl0eS5qcycpO1xyXG5cclxuLyoqXHJcbiAqIEdyb3VwIGNvbnN0cnVjdG9yXHJcbiAqXHJcbiAqIEBjbGFzcyBHcm91cFxyXG4gKiBAY2xhc3NkZXNjIFRoZSBvYmplY3QgdGhhdCBob2xkcyBtdWx0aXBsZSBlbnRpdGllc1xyXG4gKi9cclxudmFyIEdyb3VwID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5fSBlbnRpdGllcyAtIENvbGxlY3Rpb24gb2YgYWxsIHRoZSBlbnRpdGllcyBpbiB0aGlzIGdyb3VwXHJcbiAgICAgKi9cclxuICAgIHRoaXMuZW50aXRpZXMgPSBbXTtcclxuXHJcbn07XHJcblxyXG5Hcm91cC5wcm90b3R5cGUgPSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGdW5jdGlvbiB0byBhZGQgYSBuZXcgZW50aXR5IHRvIHRoaXMgZ3JvdXBcclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0VudGl0eX0gZW50aXR5IC0gQSByZWZlcmVuY2UgdG8gZW50aXR5IGJlaW5nIGFkZGVkXHJcbiAgICAgKi9cclxuICAgIGFkZEVudGl0eTogZnVuY3Rpb24oZW50aXR5KSB7XHJcblxyXG4gICAgICAgIC8vQ2hlY2sgaWYgdGhlIGVudGl0eSBpcyB0aGUgY29ycmVjdCBvYmplY3RcclxuICAgICAgICBpZighZW50aXR5IGluc3RhbmNlb2YgRW50aXR5KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vQWRkIHRoZSBjdXJyZW50IGVudGl0eSB0byB0aGUgbGlzdFxyXG4gICAgICAgIHRoaXMuZW50aXRpZXMucHVzaChlbnRpdHkpO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGdW5jdGlvbiB0byByZW1vdmUgYW4gZW50aXR5IGZyb20gdGhpcyBncm91cFxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7RW50aXR5fSBlbnRpdHkgLSBBIHJlZmVyZW5jZSB0byBlbnRpdHkgYmVpbmcgcmVtb3ZlZFxyXG4gICAgICovXHJcbiAgICByZW1vdmVFbnRpdHk6IGZ1bmN0aW9uKGVudGl0eSkge1xyXG5cclxuICAgICAgICAvL0NoZWNrIGlmIHRoZSBlbnRpdHkgZXhpc3RzLCBpZiBub3QsIHdlIGRvbid0IGhhdmUgdG8gZGVsZXRlIGl0XHJcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5lbnRpdGllcy5pbmRleE9mKGVudGl0eSk7XHJcblxyXG4gICAgICAgIC8vVGhlIGVsZW1lbnQgZG9lc24ndCBleGlzdCBpbiB0aGUgbGlzdFxyXG4gICAgICAgIGlmKGluZGV4ID09PSAtMSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL1JlbW92ZSB0aGUgY3VycmVudCBlbnRpdHkgZnJvbSB0aGUgZ3JvdXBcclxuICAgICAgICB0aGlzLmVudGl0aWVzLnNwbGljZShpbmRleCwgMSk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBhbGwgZW50aXRpZXMgc3RvcmVkIGluIHRoaXMgZ3JvdXBcclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IC0gQWxsIGVudGl0aWVzIHN0b3JlZCBpbiB0aGlzIGdyb3VwXHJcbiAgICAgKi9cclxuICAgIGdldEVudGl0aWVzOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZW50aXRpZXM7XHJcblxyXG4gICAgfVxyXG5cclxufTtcclxuXHJcbi8vRXhwb3J0IHRoZSBCcm93c2VyaWZ5IG1vZHVsZVxyXG5tb2R1bGUuZXhwb3J0cyA9IEdyb3VwO1xyXG4iLCIvL0JlY2F1c2UgQnJvd3NlcmlmeSBlbmNhcHN1bGF0ZXMgZXZlcnkgbW9kdWxlLCB1c2Ugc3RyaWN0IHdvbid0IGFwcGx5IHRvIHRoZSBnbG9iYWwgc2NvcGUgYW5kIGJyZWFrIGV2ZXJ5dGhpbmdcclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy9SZXF1aXJlIG5lY2Vzc2FyeSBtb2R1bGVzXHJcbnZhciBTeXN0ZW0gPSByZXF1aXJlKCcuL2NvcmUvc3lzdGVtLmpzJyk7XHJcblxyXG4vL1RoZSBpbml0aWFsaXplIE1vZHVsZVxyXG52YXIgSW50aWFsaXplID0gZnVuY3Rpb24gaW5pdGlhbGl6ZVN5c3RlbSgpIHtcclxuXHJcbiAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgICAvL0VtcHR5IGZvciBub3dcclxuICAgIH07XHJcblxyXG4gICAgLy9DcmVhdGUgYSBuZXcgc3lzdGVtXHJcbiAgICB2YXIgc3lzdGVtID0gbmV3IFN5c3RlbShvcHRpb25zKTtcclxuXHJcbn07XHJcblxyXG4vLyBzaGltIGxheWVyIHdpdGggc2V0VGltZW91dCBmYWxsYmFja1xyXG53aW5kb3cucmVxdWVzdEFuaW1GcmFtZSA9IChmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgICAgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxyXG4gICAgICAgIHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgICBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChjYWxsYmFjaywgMTAwMCAvIDYwKTtcclxuICAgICAgICB9O1xyXG59KSgpO1xyXG5cclxuLy9Jbml0aWFsaXplIHdoZW4gZnVsbHkgbG9hZGVkXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBJbnRpYWxpemUpO1xyXG5cclxuLy9FeHBvcnQgdGhlIEJyb3dzZXJpZnkgbW9kdWxlXHJcbm1vZHVsZS5leHBvcnRzID0gSW50aWFsaXplO1xyXG4iLCIvL0JlY2F1c2UgQnJvd3NlcmlmeSBlbmNhcHN1bGF0ZXMgZXZlcnkgbW9kdWxlLCB1c2Ugc3RyaWN0IHdvbid0IGFwcGx5IHRvIHRoZSBnbG9iYWwgc2NvcGUgYW5kIGJyZWFrIGV2ZXJ5dGhpbmdcclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIFV0aWxzID0gcmVxdWlyZSgnLi4vY29yZS91dGlscy5qcycpO1xyXG5cclxuLyoqXHJcbiAqIE1lYXN1cmVtZW50IFN5c3RlbSBjb25zdHJ1Y3RvclxyXG4gKlxyXG4gKiBAY2xhc3MgTWVhc3VyZVN5c3RlbVxyXG4gKiBAY2xhc3NkZXNjIEEgc3lzdGVtIHRoYXQgbWFuYWdlcyBhbGwgdGhpbmdzIG1lYXN1cmVtZW50IHJlbGF0ZWRcclxuICpcclxuICogQHBhcmFtIHtFbnRpdHl9IGVudGl0eSAtIEEgcmVmZXJlbmNlIHRvIHRoZSBlbnRpdHkgdGhhdCBvd25zIHRoaXMgc3lzdGVtXHJcbiAqL1xyXG52YXIgTWVhc3VyZVN5c3RlbSA9IGZ1bmN0aW9uKGVudGl0eSkge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtFbnRpdHl9IGVudGl0eSAtIEEgcmVmZXJlbmNlIHRvIHRoZSBlbnRpdHkgdGhhdCBvd25zIHRoaXMgc3lzdGVtXHJcbiAgICAgKi9cclxuICAgIHRoaXMuZW50aXR5ID0gZW50aXR5O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheX0gYXVkaW9MZXZlbHMgLSBBbiBhcnJheSB3aGljaCBob2xkcyBhbGwgdGhlIGF1ZGlvIGxldmVscyBzdGlsbCBiZWluZyBtZWFzdXJlZFxyXG4gICAgICovXHJcbiAgICB0aGlzLmF1ZGlvTGV2ZWxzID0gW107XHJcblxyXG59O1xyXG5cclxuTWVhc3VyZVN5c3RlbS5wcm90b3R5cGUgPSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVjayB3aGV0aGVyIHRoZSBlbnRpdHkgaXMgYnVzeSBvciBuZWVkcyBhIG5ldyB0YXNrXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBydW46IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB0aGlzLm1lYXN1cmVBdWRpbygpO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGdW5jdGlvbiB0byBtZWFzdXJlIGF1ZGlvIGxldmVscyBmcm9tIHRoZSBub2lzZS9hdWRpbyBzZW5zb3JcclxuICAgICAqIE5vdyBmYWtpbmcgZGF0YSBmb3IgZGVtb25zdHJhdGlvbiBwdXJwb3Nlc1xyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgbWVhc3VyZUF1ZGlvOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgLy9JZiB0aGUgY3VycmVudCB0YXNrIGlzIHZhY3V1bWluZywgbWFrZSBhIGxvdCBvZiBub2lzZSFcclxuICAgICAgICBpZih0aGlzLmVudGl0eS5zeXN0ZW1zWyd0YXNrJ10uY3VycmVudFRhc2submFtZSA9PT0gJ1ZhY3V1bScpe1xyXG5cclxuICAgICAgICAgICAgdGhpcy5hdWRpb0xldmVscy5wdXNoKFV0aWxzLnJhbmRvbU51bWJlcig1MCwgNzApKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vTGl0dGxlIHRvIG5vIG5vaXNlXHJcbiAgICAgICAgdGhpcy5hdWRpb0xldmVscy5wdXNoKFV0aWxzLnJhbmRvbU51bWJlcigwLCAxMCkpO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxjdWxhdGUgdGhlIGF2ZXJhZ2UgYXVkaW8gbGV2ZWxzIHdpdGggdGhlIGRhdGEgY29sbGVjdGVkIHNvIGZhclxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICovXHJcbiAgICBjYWxjdWxhdGVBdmVyYWdlQXVkaW86IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgYXZlcmFnZUF1ZGlvID0gVXRpbHMuYXZlcmFnZUFycmF5KHRoaXMuYXVkaW9MZXZlbHMpO1xyXG5cclxuICAgICAgICAvL0VtcHR5IHRoZSBhcnJheSBhZ2FpblxyXG4gICAgICAgIHRoaXMuYXVkaW9MZXZlbHMgPSBbXTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGF2ZXJhZ2VBdWRpbztcclxuXHJcbiAgICB9XHJcblxyXG59O1xyXG5cclxuLy9FeHBvcnQgdGhlIEJyb3dzZXJpZnkgbW9kdWxlXHJcbm1vZHVsZS5leHBvcnRzID0gTWVhc3VyZVN5c3RlbTtcclxuIiwiLy9CZWNhdXNlIEJyb3dzZXJpZnkgZW5jYXBzdWxhdGVzIGV2ZXJ5IG1vZHVsZSwgdXNlIHN0cmljdCB3b24ndCBhcHBseSB0byB0aGUgZ2xvYmFsIHNjb3BlIGFuZCBicmVhayBldmVyeXRoaW5nXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBFdmVudCA9IHJlcXVpcmUoJy4uL2NvcmUvZXZlbnQuanMnKSxcclxuICAgIFV0aWxzID0gcmVxdWlyZSgnLi4vY29yZS91dGlscy5qcycpO1xyXG5cclxuLyoqXHJcbiAqIFRhc2sgU3lzdGVtIGNvbnN0cnVjdG9yXHJcbiAqXHJcbiAqIEBjbGFzcyBUYXNrU3lzdGVtXHJcbiAqIEBjbGFzc2Rlc2MgQSBzeXN0ZW0gdGhhdCBtYW5hZ2VzIGFsbCB0aGluZ3MgdGFzayByZWxhdGVkXHJcbiAqL1xyXG52YXIgVGFza1N5c3RlbSA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIHRoaXMuZXZlbnRzID0gbmV3IEV2ZW50KCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5fSB0YXNrcyAtIEFuIGFzc29jaWF0aXZlIGFycmF5IGZpbGxlZCB3aXRoIGFsbCB0aGUgdGFza3MgdG8gYmUgZXhlY3V0ZWRcclxuICAgICAqL1xyXG4gICAgdGhpcy50YXNrcyA9IFtdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtUYXNrfSBjdXJyZW50VGFzayAtIFRoZSB0YXNrIHRoaXMgc3lzdGVtIGlzIGN1cnJlbnRseSBleGVjdXRpbmdcclxuICAgICAqL1xyXG4gICAgdGhpcy5jdXJyZW50VGFzayA9IG51bGw7XHJcblxyXG59O1xyXG5cclxuVGFza1N5c3RlbS5wcm90b3R5cGUgPSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVjayB3aGV0aGVyIHRoZSBlbnRpdHkgaXMgYnVzeSBvciBuZWVkcyBhIG5ldyB0YXNrXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBydW46IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAvL0NoZWNrIGlmIHRoaXMgZW50aXR5IGlzIGN1cnJlbnRseSBidXN5IHdpdGggaGlzIGN1cnJlbnQgdGFza1xyXG4gICAgICAgIGlmKHRoaXMuY3VycmVudFRhc2suc3RhdGUgPT09ICdidXN5Jyl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vVGhlcmUgaXMgYSBuZXcgdGFzaywgc28gdHJpZ2dlciB0aGF0IGV2ZW50XHJcbiAgICAgICAgdGhpcy5ldmVudHMudHJpZ2dlcignZmluaXNoZWQnKTtcclxuXHJcbiAgICAgICAgLy9CZWZvcmUgbG9hZGluZyBuZXcgdGFzaywgY2hlY2sgYXVkaW8gbGV2ZWxzIG9uIGN1cnJlbnQgdGFza1xyXG4gICAgICAgIC8vSWYgdGhlcmUgYXJlIG1vcmUgdGhhbiA1IGF1ZGlvIGxldmVscyB0aGVyZSwgbWFrZSBhIGRlY2lzaW9uIGlmIGl0J3MgbG91ZFxyXG4gICAgICAgIGlmKHRoaXMuY3VycmVudFRhc2subWVhc3VyZW1lbnRzLmF1ZGlvLmxlbmd0aCA+PSA1KSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgYXZlcmFnZVZvbHVtZSA9IFV0aWxzLmF2ZXJhZ2VBcnJheSh0aGlzLmN1cnJlbnRUYXNrLm1lYXN1cmVtZW50cy5hdWRpbyk7XHJcblxyXG4gICAgICAgICAgICBpZihhdmVyYWdlVm9sdW1lID4gNDApe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50VGFzay5pc0xvdWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFRhc2suaXNMb3VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL1RoZSBlbnRpdHkgaXMgZG9uZSB3aXRoIGhpcyBjdXJyZW50IHRhc2ssIHNvIGhlIGhhcyB0byBwaWNrIGFub3RoZXIgb25lXHJcbiAgICAgICAgdmFyIHBvc3NpYmxlVGFza3MgPSB0aGlzLmdldFBvc3NpYmxlVGFza3MoKTtcclxuXHJcbiAgICAgICAgdGhpcy5jdXJyZW50VGFzayA9IHRoaXMucGlja1Rhc2socG9zc2libGVUYXNrcyk7XHJcblxyXG4gICAgICAgIC8vUnVuIHRoZSBuZXcgY3VycmVudCB0YXNrIVxyXG4gICAgICAgIHRoaXMuY3VycmVudFRhc2sucnVuKCk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBhIGNlcnRhaW4gdGFzayBmcm9tIHRoaXMgZW50aXR5XHJcbiAgICAgKiBAcHVibGljXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IC0gVGhlIG51bWJlciBvZiB0aGUgdGFzayB0aGF0IGlzIGdvaW5nIHRvIGJlIHJldHVybmVkXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgdGFzayB0aGF0IHRoaXMgZW50aXR5IGhhcyBhdCB0aGUgc3BlY2lmaWVkIGluZGV4XHJcbiAgICAgKi9cclxuICAgIGdldFRhc2s6IGZ1bmN0aW9uKGluZGV4KSB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnRhc2tzW2luZGV4XTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGEgdGFzayB0byB0aGlzIGVudGl0eVxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0YXNrIC0gVGhlIHRhc2sgdGhhdCBpcyBnZXR0aW5nIGFkZGVkIHRvIHRoaXMgZW50aXR5XHJcbiAgICAgKi9cclxuICAgIGFkZFRhc2s6IGZ1bmN0aW9uKHRhc2spIHtcclxuXHJcbiAgICAgICAgLy9BZGQgdGhlIHRhc2tcclxuICAgICAgICB0aGlzLnRhc2tzLnB1c2godGFzayk7XHJcblxyXG4gICAgICAgIC8vQ2hlY2sgaWYgdGhlIGVudGl0eSBuZWVkcyB0byBzdGFydCB3aXRoIHRoaXMgdGFza1xyXG4gICAgICAgIGlmKHRoaXMuY3VycmVudFRhc2sgPT09IG51bGwpe1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VGFzayA9IHRhc2s7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFRhc2sucnVuKCk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlIGEgdGFzayBmcm9tIHRoaXMgZW50aXR5XHJcbiAgICAgKiBAcHVibGljXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IC0gVGhlIG51bWJlciBvZiB0aGUgdGFzayB0aGF0IGlzIGdvaW5nIHRvIGJlIHJlbW92ZWRcclxuICAgICAqL1xyXG4gICAgcmVtb3ZlVGFzazogZnVuY3Rpb24oaW5kZXgpIHtcclxuXHJcbiAgICAgICAgLy9SZW1vdmUgdGhlIHRhc2tcclxuICAgICAgICB0aGlzLnRhc2suc3BsaWNlKGluZGV4LCAxKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ291bnQgdGhlIG51bWJlciBvZiB0YXNrcyBhbmQgcmV0dXJuIHRoZSBudW1iZXJcclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TnVtYmVyfVxyXG4gICAgICovXHJcbiAgICB0b3RhbFRhc2tzOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGFza3MubGVuZ3RoKCk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBnZXRQb3NzaWJsZVRhc2tzOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgLy9UaGUgZW50aXR5IGlzIGRvbmUgd2l0aCBoaXMgY3VycmVudCB0YXNrLCBzbyBoZSBoYXMgdG8gcGljayBhbm90aGVyIG9uZVxyXG4gICAgICAgIHZhciBwb3NzaWJsZVRhc2tzID0gW107XHJcbiAgICAgICAgdmFyIHRvZGF5ID0gbmV3IERhdGUoKTtcclxuICAgICAgICB2YXIgaG91cnMgPSB0b2RheS5nZXRIb3VycygpO1xyXG5cclxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy50YXNrcy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgaWYodGhpcy50YXNrc1tpXS5pc0xvdWQgJiYgaG91cnMgPj0gMTAgJiYgaG91cnMgPD0gMjIpe1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHBvc3NpYmxlVGFza3MucHVzaCh0aGlzLnRhc2tzW2ldKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcG9zc2libGVUYXNrcztcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIHBpY2tUYXNrOiBmdW5jdGlvbiAodGFza3MpIHtcclxuXHJcbiAgICAgICAgLy9MZXQganVzdCBhc3N1bWUgdGhlIGZpcnN0IHRhc2sgaXMgdGhlIGxhc3QgdGFzaywgZG9lc24ndCByZWFsbHkgbWF0dGVyIGFzIGxvbmcgYXMgd2UgaGF2ZSBhIHZhbHVlIHRvIGNoZWNrIGFnYWluc3RcclxuICAgICAgICB2YXIgb2xkZXN0VGFzayA9IHRhc2tzWzBdO1xyXG5cclxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGFza3MubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIC8vSWYgYSB0YXNrIGhhcyBuZXZlciBiZWVuIGV4ZWN1dGVkIGJlZm9yZSwganVzdCBzdGFydCB3aXRoIHRoYXQgb25lXHJcbiAgICAgICAgICAgIGlmKHRhc2tzW2ldLmxhc3RGaW5pc2hlZCA9PT0gbnVsbCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFza3NbaV07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKHRhc2tzW2ldLmxhc3RGaW5pc2hlZCA8IG9sZGVzdFRhc2subGFzdEZpbmlzaGVkKXtcclxuICAgICAgICAgICAgICAgIG9sZGVzdFRhc2sgPSB0YXNrc1tpXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvbGRlc3RUYXNrO1xyXG5cclxuICAgIH1cclxuXHJcbn07XHJcblxyXG4vL0V4cG9ydCB0aGUgQnJvd3NlcmlmeSBtb2R1bGVcclxubW9kdWxlLmV4cG9ydHMgPSBUYXNrU3lzdGVtO1xyXG4iLCIvL0JlY2F1c2UgQnJvd3NlcmlmeSBlbmNhcHN1bGF0ZXMgZXZlcnkgbW9kdWxlLCB1c2Ugc3RyaWN0IHdvbid0IGFwcGx5IHRvIHRoZSBnbG9iYWwgc2NvcGUgYW5kIGJyZWFrIGV2ZXJ5dGhpbmdcclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy9SZXF1aXJlIG5lY2Vzc2FyeSBtb2R1bGVzXHJcbnZhciBUYXNrID0gcmVxdWlyZSgnLi90YXNrLmpzJyk7XHJcblxyXG4vKipcclxuICogTW9wcGluZyBUYXNrIGNvbnN0cnVjdG9yXHJcbiAqXHJcbiAqIEBjbGFzcyBNb3BcclxuICogQGNsYXNzZGVzYyBFeGVjdXRlIGEgZ2l2ZW4gdGFzayBhbmQgcmV0dXJuIHRoZSByZXN1bHRcclxuICogSW5oZXJpdHMgZnJvbSBUYXNrXHJcbiAqL1xyXG52YXIgTW9wID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbmhlcml0IHRoZSBjb25zdHJ1Y3RvciBmcm9tIHRoZSBFbGVtZW50IGNsYXNzXHJcbiAgICAgKi9cclxuICAgIFRhc2suY2FsbCh0aGlzKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBuYW1lIC0gVGhlIG5hbWUgb2YgdGhpcyB0YXNrLlxyXG4gICAgICovXHJcbiAgICB0aGlzLm5hbWUgPSAnTW9wJztcclxuXHJcbn07XHJcblxyXG5Nb3AucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShUYXNrLnByb3RvdHlwZSwge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgd2hlbmV2ZXIgdGhlIHN5c3RlbSB1cGRhdGVzXHJcbiAgICAgKiBAcHJvdGVjdGVkXHJcbiAgICAgKi9cclxuICAgIHJ1bjoge1xyXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIC8vU3RhcnQgdGhlIHRhc2tcclxuICAgICAgICAgICAgdGhpcy5zdGFydCgpO1xyXG5cclxuICAgICAgICAgICAgLy9FeGVjdXRlIHRoZSB0YXNrXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdJXFwnbSBtb3BwaW5nIHRoZSBmbG9vciBub3cnKTtcclxuXHJcbiAgICAgICAgICAgIC8vTWFrZSBzdXJlIHRoZSB0YXNrIGVuZHMgaW4gNSBzZWNvbmRzXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQodGhpcy5maW5pc2guYmluZCh0aGlzKSwgNDAwMCk7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0pO1xyXG5cclxuLy9FeHBvcnQgdGhlIEJyb3dzZXJpZnkgbW9kdWxlXHJcbm1vZHVsZS5leHBvcnRzID0gTW9wO1xyXG4iLCIvL0JlY2F1c2UgQnJvd3NlcmlmeSBlbmNhcHN1bGF0ZXMgZXZlcnkgbW9kdWxlLCB1c2Ugc3RyaWN0IHdvbid0IGFwcGx5IHRvIHRoZSBnbG9iYWwgc2NvcGUgYW5kIGJyZWFrIGV2ZXJ5dGhpbmdcclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuLyoqXHJcbiAqIFRhc2sgY29uc3RydWN0b3JcclxuICpcclxuICogQGNsYXNzIFRhc2tcclxuICogQGNsYXNzZGVzYyBUaGUgYmFzZSBjbGFzcyBmb3IgdGFza3NcclxuICovXHJcbnZhciBUYXNrID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gbmFtZSAtIFRoZSBuYW1lIG9mIHRoaXMgc3RhdHVzIGVmZmVjdC4gVGhpcyBmaWVsZCBpcyBhbHdheXMgcmVxdWlyZWQhXHJcbiAgICAgKi9cclxuICAgIHRoaXMubmFtZSA9ICdCYXNlIFRhc2snO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IHN0YXRlIC0gVGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhpcyB0YXNrLiBDYW4gYmUgRG9uZSwgQnVzeSwgUHJvYmxlbSwgUGxhbm5lZFxyXG4gICAgICovXHJcbiAgICB0aGlzLnN0YXRlID0gJ3BsYW5uZWQnO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICoge0Jvb2xlYW59IGlzTG91ZCAtIEJvb2xlYW4gaWYgdGhlIHRhc2sgaXMgbG91ZCBvciBub3RcclxuICAgICAqL1xyXG4gICAgdGhpcy5pc0xvdWQgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGxhc3RGaW5pc2hlZCAtIFRpbWVzdGFtcCBvZiB3aGVuIHRoZSB0YXNrIGlzIGV4ZWN1dGVkIGZvciB0aGUgbGFzdCB0aW1lXHJcbiAgICAgKi9cclxuICAgIHRoaXMubGFzdEZpbmlzaGVkID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBtZWFzdXJlbWVudHMgLSBPYmplY3Qgd2hpY2ggaG9sZHMgYWxsIG1lYXN1cmVtZW50cyBmb3IgdGhlIGN1cnJlbnQgdGFza1xyXG4gICAgICovXHJcbiAgICB0aGlzLm1lYXN1cmVtZW50cyA9IHtcclxuICAgICAgICBhdWRpbzogW11cclxuICAgIH1cclxuXHJcbn07XHJcblxyXG5UYXNrLnByb3RvdHlwZSA9IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIHdoZW5ldmVyIHRoZSBzeXN0ZW0gdXBkYXRlc1xyXG4gICAgICogVGhpcyBmdW5jdGlvbiBzaG91bGQgYmUgb3ZlcndyaXR0ZW4gYnkgY3VzdG9tIHRhc2tzXHJcbiAgICAgKiBAcHJvdGVjdGVkXHJcbiAgICAgKi9cclxuICAgIHJ1bjogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIC8vU2lsZW5jZSBpcyBnb2xkZW5cclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQm9vdHN0cmFwIGFuZCBzdGFydCB0aGlzIHRhc2tcclxuICAgICAqIEBwcm90ZWN0ZWRcclxuICAgICAqL1xyXG4gICAgc3RhcnQ6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB0aGlzLnN0YXRlID0gJ2J1c3knO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGaW5pc2ggdGhpcyB0YXNrIGFuZCByZXBvcnQgcmVzdWx0c1xyXG4gICAgICogQHByb3RlY3RlZFxyXG4gICAgICovXHJcbiAgICBmaW5pc2g6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAvL0NoYW5nZSB0aGUgc3RhdGUgb2YgdGhlIHRhc2tcclxuICAgICAgICB0aGlzLnN0YXRlID0gJ2RvbmUnO1xyXG5cclxuICAgICAgICAvL0NyZWF0ZSBhIHRpbWVzdGFtcCBmb3Igd2hlbiB0aGlzIHRhc2sgaXMgZmluaXNoZWRcclxuICAgICAgICB0aGlzLmxhc3RGaW5pc2hlZCA9IERhdGUubm93KCk7XHJcblxyXG4gICAgfVxyXG5cclxufTtcclxuXHJcbi8vRXhwb3J0IHRoZSBCcm93c2VyaWZ5IG1vZHVsZVxyXG5tb2R1bGUuZXhwb3J0cyA9IFRhc2s7XHJcbiIsIi8vQmVjYXVzZSBCcm93c2VyaWZ5IGVuY2Fwc3VsYXRlcyBldmVyeSBtb2R1bGUsIHVzZSBzdHJpY3Qgd29uJ3QgYXBwbHkgdG8gdGhlIGdsb2JhbCBzY29wZSBhbmQgYnJlYWsgZXZlcnl0aGluZ1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4vL1JlcXVpcmUgbmVjZXNzYXJ5IG1vZHVsZXNcclxudmFyIFRhc2sgPSByZXF1aXJlKCcuL3Rhc2suanMnKTtcclxuXHJcbi8qKlxyXG4gKiBWYWN1dW0gVGFzayBjb25zdHJ1Y3RvclxyXG4gKlxyXG4gKiBAY2xhc3MgVmFjdXVtXHJcbiAqIEBjbGFzc2Rlc2MgRXhlY3V0ZSBhIGdpdmVuIHRhc2sgYW5kIHJldHVybiB0aGUgcmVzdWx0XHJcbiAqIEluaGVyaXRzIGZyb20gVGFza1xyXG4gKi9cclxudmFyIFZhY3V1bSA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5oZXJpdCB0aGUgY29uc3RydWN0b3IgZnJvbSB0aGUgRWxlbWVudCBjbGFzc1xyXG4gICAgICovXHJcbiAgICBUYXNrLmNhbGwodGhpcyk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gbmFtZSAtIFRoZSBuYW1lIG9mIHRoaXMgdGFzay5cclxuICAgICAqL1xyXG4gICAgdGhpcy5uYW1lID0gJ1ZhY3V1bSc7XHJcblxyXG59O1xyXG5cclxuVmFjdXVtLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoVGFzay5wcm90b3R5cGUsIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIHdoZW5ldmVyIHRoZSBzeXN0ZW0gdXBkYXRlc1xyXG4gICAgICogQHByb3RlY3RlZFxyXG4gICAgICovXHJcbiAgICBydW46IHtcclxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAvL1N0YXJ0IHRoZSB0YXNrXHJcbiAgICAgICAgICAgIHRoaXMuc3RhcnQoKTtcclxuXHJcbiAgICAgICAgICAgIC8vRXhlY3V0ZSB0aGUgdGFza1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnSVxcJ20gdmFjdXVtaW5nIG5vdycpO1xyXG5cclxuICAgICAgICAgICAgLy9NYWtlIHN1cmUgdGhlIHRhc2sgZW5kcyBpbiA1IHNlY29uZHNcclxuICAgICAgICAgICAgc2V0VGltZW91dCh0aGlzLmZpbmlzaC5iaW5kKHRoaXMpLCAzMDAwKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSk7XHJcblxyXG4vL0V4cG9ydCB0aGUgQnJvd3NlcmlmeSBtb2R1bGVcclxubW9kdWxlLmV4cG9ydHMgPSBWYWN1dW07XHJcbiIsIi8vQmVjYXVzZSBCcm93c2VyaWZ5IGVuY2Fwc3VsYXRlcyBldmVyeSBtb2R1bGUsIHVzZSBzdHJpY3Qgd29uJ3QgYXBwbHkgdG8gdGhlIGdsb2JhbCBzY29wZSBhbmQgYnJlYWsgZXZlcnl0aGluZ1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4vL1JlcXVpcmUgbmVjZXNzYXJ5IG1vZHVsZXNcclxuLy8gLS0gTm9uZSB5ZXRcclxuXHJcbi8qKlxyXG4gKiBXb3JsZCBjb25zdHJ1Y3RvclxyXG4gKlxyXG4gKiBAY2xhc3MgV29ybGRcclxuICogQGNsYXNzZGVzYyBUaGUgV29ybGQgb2JqZWN0IGhvbGRzIGFsbCBvYmplY3RzIHRoYXQgYXJlIGluIHRoZSBkZW1vbnN0cmF0aW9uIHdvcmxkLCB0aGUgbWFwIGV0Yy5cclxuICovXHJcbnZhciBXb3JsZCA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtUSFJFRS5TY2VuZX0gc2NlbmUgLSBSZWZlcmVuY2UgdG8gdGhlIHNjZW5lXHJcbiAgICAgKi9cclxuICAgIHRoaXMuc2NlbmUgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYX0gY2FtZXJhIC0gUmVmZXJlbmNlIHRvIHRoZSBjYW1lcmFcclxuICAgICAqL1xyXG4gICAgdGhpcy5jYW1lcmEgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtUSFJFRS5XZWJHTFJlbmRlcmVyfSByZW5kZXJlciAtIFJlZmVyZW5jZSB0byB0aGUgcmVuZGVyZXJcclxuICAgICAqL1xyXG4gICAgdGhpcy5yZW5kZXJlciA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcGVydHkge1RIUkVFLlRyYWNrYmFsbENvbnRyb2xzfSBjb250cm9scyAtIFJlZmVyZW5jZSB0byB0aGUgY29udHJvbHMgb2JqZWN0XHJcbiAgICAgKi9cclxuICAgIHRoaXMuY29udHJvbHMgPSBudWxsO1xyXG5cclxuICAgIC8vSW5pdGlhbGl6ZSBpdHNlbGZcclxuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xyXG5cclxufTtcclxuXHJcbldvcmxkLnByb3RvdHlwZSA9IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgdGhlIFVJIGVsZW1lbnRzIGFuZCBhZGQgdGhlbSB0byB0aGlzIGNvbnRhaW5lclxyXG4gICAgICogQHByb3RlY3RlZFxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIC8vSW5pdGlhbGl6ZSB0aGUgY2FtZXJhXHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplQ2FtZXJhKCk7XHJcblxyXG4gICAgICAgIC8vSW5pdGlhbGl6ZSB0aGUgbW91c2UgY29udHJvbHNcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVDb250cm9scygpO1xyXG5cclxuICAgICAgICAvL0NyZWF0ZSB0aGUgc3RhZ2UsIGFkZCBhIGxpZ2h0IGFuZCBhIGZsb29yXHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplU3RhZ2UoKTtcclxuXHJcbiAgICAgICAgLy9Jbml0aWFsaXplIGFsbCBvYmplY3RzIGluIHRoZSB3b3JsZFxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZU9iamVjdHMoKTtcclxuXHJcbiAgICAgICAgLy9Jbml0aWFsaXplIHRoZSByZW5kZXJlciBhbmQgY29uZmlndXJlIGl0XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplUmVuZGVyZXIoKTtcclxuXHJcbiAgICAgICAgLy9BZGQgYW4gZXZlbnQgbGlzdGVuZXIgZm9yIHdoZW4gdGhlIHVzZXIgcmVzaXplcyBoaXMgd2luZG93XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMub25XaW5kb3dSZXNpemUuYmluZCh0aGlzKSwgZmFsc2UpO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIGFuZCBzZXR1cCB0aGUgY2FtZXJhXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplQ2FtZXJhOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgLy9DcmVhdGUgYSBuZXcgY2FtZXJhIG9iamVjdFxyXG4gICAgICAgIHRoaXMuY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDcwLCB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCwgMSwgMTAwMDApO1xyXG5cclxuICAgICAgICAvL0NvbmZpZ3VyZSB0aGUgY2FtZXJhXHJcbiAgICAgICAgdGhpcy5jYW1lcmEucG9zaXRpb24ueiA9IDEwMDA7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgYW5kIHNldHVwIHRoZSBjb250cm9sc1xyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZUNvbnRyb2xzOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgLy9DcmVhdGUgYSBuZXcgY29udHJvbHMgb2JqZWN0XHJcbiAgICAgICAgdGhpcy5jb250cm9scyA9IG5ldyBUSFJFRS5UcmFja2JhbGxDb250cm9scyh0aGlzLmNhbWVyYSk7XHJcblxyXG4gICAgICAgIC8vU2V0dXAgdGhlIGNvbnRyb2xzXHJcbiAgICAgICAgdGhpcy5jb250cm9scy5yb3RhdGVTcGVlZCA9IDEuMDtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLnpvb21TcGVlZCA9IDEuMjtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLnBhblNwZWVkID0gMS4wO1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMubm9ab29tID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5jb250cm9scy5ub1BhbiA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMuc3RhdGljTW92aW5nID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLmR5bmFtaWNEYW1waW5nRmFjdG9yID0gMC4zO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIGFuZCBzZXR1cCB0aGUgc3RhZ2VcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVTdGFnZTogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIC8vQ3JlYXRlIGEgbmV3IHNjZW5lIGFuZCBhZGQgYW4gYW1iaWVudCBsaWdodFxyXG4gICAgICAgIHRoaXMuc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcclxuXHJcbiAgICAgICAgLy9DcmVhdGUgYSBuZXcgaGVtaWxpZ2h0XHJcbiAgICAgICAgdmFyIGhlbWlMaWdodCA9IG5ldyBUSFJFRS5IZW1pc3BoZXJlTGlnaHQoIDB4ZmZmZmZmLCAweGZmZmZmZiwgMC42ICk7XHJcblxyXG4gICAgICAgIC8vQ29uZmlndXJlIHRoZSBoZW1pbGlnaHRcclxuICAgICAgICBoZW1pTGlnaHQuY29sb3Iuc2V0SFNMKCAwLjYsIDEsIDAuNiApO1xyXG4gICAgICAgIGhlbWlMaWdodC5ncm91bmRDb2xvci5zZXRIU0woIDAuMDk1LCAxLCAwLjc1ICk7XHJcbiAgICAgICAgaGVtaUxpZ2h0LnBvc2l0aW9uLnNldCggMCwgNTAwLCAwICk7XHJcblxyXG4gICAgICAgIC8vQWRkIHRoZSBoZW1pbGlnaHQgdG8gdGhlIHN0YWdlXHJcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoIGhlbWlMaWdodCApO1xyXG5cclxuICAgICAgICAvL0NyZWF0ZSBhIG5ldyBkaXJlY3Rpb25hbCBsaWdodFxyXG4gICAgICAgIHZhciBkaXJMaWdodCA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KCAweGZmZmZmZiwgMSApO1xyXG5cclxuICAgICAgICAvL0NvbmZpZ3VyZSB0aGUgZGlyZWN0aW9uYWwgbGlnaHRcclxuICAgICAgICBkaXJMaWdodC5jb2xvci5zZXRIU0woIDAuMSwgMSwgMC45NSApO1xyXG4gICAgICAgIGRpckxpZ2h0LnBvc2l0aW9uLnNldCggLTEsIDEsIDQgKTtcclxuICAgICAgICBkaXJMaWdodC5wb3NpdGlvbi5tdWx0aXBseVNjYWxhciggNTAgKTtcclxuXHJcbiAgICAgICAgLy9BZGQgdGhlIGxpZ2h0IHRvIHRoZSBzY2VuZVxyXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKCBkaXJMaWdodCApO1xyXG5cclxuICAgICAgICBkaXJMaWdodC5jYXN0U2hhZG93ID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgZGlyTGlnaHQuc2hhZG93TWFwV2lkdGggPSAyMDQ4O1xyXG4gICAgICAgIGRpckxpZ2h0LnNoYWRvd01hcEhlaWdodCA9IDIwNDg7XHJcblxyXG4gICAgICAgIHZhciBkID0gNTAwO1xyXG5cclxuICAgICAgICBkaXJMaWdodC5zaGFkb3dDYW1lcmFMZWZ0ID0gLWQ7XHJcbiAgICAgICAgZGlyTGlnaHQuc2hhZG93Q2FtZXJhUmlnaHQgPSBkO1xyXG4gICAgICAgIGRpckxpZ2h0LnNoYWRvd0NhbWVyYVRvcCA9IGQ7XHJcbiAgICAgICAgZGlyTGlnaHQuc2hhZG93Q2FtZXJhQm90dG9tID0gLWQ7XHJcblxyXG4gICAgICAgIGRpckxpZ2h0LnNoYWRvd0NhbWVyYUZhciA9IDM1MDA7XHJcbiAgICAgICAgZGlyTGlnaHQuc2hhZG93QmlhcyA9IC0wLjAwMDE7XHJcbiAgICAgICAgZGlyTGlnaHQuc2hhZG93RGFya25lc3MgPSAwLjM1O1xyXG5cclxuICAgICAgICAvL0NyZWF0ZSBhIG5ldyBwbGFuZSwgd2UgYXJlIHVzaW5nIHRoaXMgZm9yIGEgZmxvb3JcclxuICAgICAgICB2YXIgcGxhbmUgPSBuZXcgVEhSRUUuTWVzaChcclxuICAgICAgICAgICAgbmV3IFRIUkVFLlBsYW5lQnVmZmVyR2VvbWV0cnkoIDEwMDAsIDEwMDAsIDgsIDggKSxcclxuICAgICAgICAgICAgbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtjb2xvcjogMHhmMGYwZjAsIG92ZXJkcmF3OiAwLjV9KVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vQ29uZmlndXJlIHRoZSBwbGFuZVxyXG4gICAgICAgIHBsYW5lLnJlY2VpdmVTaGFkb3cgPSB0cnVlO1xyXG5cclxuICAgICAgICAvL0FkZCB0aGUgcGxhbmUgdG8gdGhlIG5ld2x5IGNyZWF0ZWQgc2NlbmVcclxuICAgICAgICB0aGlzLnNjZW5lLmFkZChwbGFuZSk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgYW5kIHNldHVwIHRoZSByZW5kZXJlclxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZVJlbmRlcmVyOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgLy9DcmVhdGUgYSBuZXcgcmVuZGVyZXIgb2JqZWN0XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHtcclxuICAgICAgICAgICAgYW50aWFsaWFzOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vQ29uZmlndXJlIHRoZSByZW5kZXJlclxyXG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0Q2xlYXJDb2xvcigweGYwZjBmMCk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcclxuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zb3J0T2JqZWN0cyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2hhZG93TWFwRW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zaGFkb3dNYXBUeXBlID0gVEhSRUUuUENGU2hhZG93TWFwO1xyXG5cclxuICAgICAgICAvL0FwcGVuZCB0aGUgcmVuZGVyZXIgdG8gdGhlIEhUTUwgYm9keVxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5yZW5kZXJlci5kb21FbGVtZW50KTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhbGl6ZSBhbmQgc2V0dXAgdGhlIG9iamVjdHNcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVPYmplY3RzOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgLy9DcmVhdGUgYSByZXVzYWJsZSBnZW9tZXRyeSBvYmplY3QgZm9yIGEgY3ViZVxyXG4gICAgICAgIHZhciBnZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSg0MCwgNDAsIDQwKTtcclxuXHJcbiAgICAgICAgLy9DcmVhdGUgdGhlIG5ldyBjdWJlIG9iamVjdCB3aXRoIHRoZSBnZW9tZXRyeVxyXG4gICAgICAgIHZhciBvYmplY3QgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoeyBjb2xvcjogTWF0aC5yYW5kb20oKSAqIDB4ZmZmZmZmfSkpO1xyXG5cclxuICAgICAgICAvL1Bvc2l0aW9uIHRoZSBjdWJlXHJcbiAgICAgICAgb2JqZWN0LnBvc2l0aW9uLnggPSAwO1xyXG4gICAgICAgIG9iamVjdC5wb3NpdGlvbi55ID0gMDtcclxuICAgICAgICBvYmplY3QucG9zaXRpb24ueiA9IDIwO1xyXG5cclxuICAgICAgICAvL0NvbmZpZ3VyZSB0aGUgY3ViZVxyXG4gICAgICAgIG9iamVjdC5jYXN0U2hhZG93ID0gdHJ1ZTtcclxuICAgICAgICBvYmplY3QucmVjZWl2ZVNoYWRvdyA9IHRydWU7XHJcblxyXG4gICAgICAgIC8vQWRkIHRoZSBjdWJlIHRvIHRoZSBzY2VuZVxyXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKG9iamVjdCk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEZ1bmN0aW9uIHRoYXQgaXMgZXhlY3V0ZWQgZXZlcnkgdGltZSB0aGUgd2luZG93IHJlc2l6ZXNcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIG9uV2luZG93UmVzaXplOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgLy9DaGFuZ2UgdGhlIGNhbWVyYSdzIGFzcGVjdCByYXRpbmcgYW5kIHVwZGF0ZSBpdFxyXG4gICAgICAgIHRoaXMuY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcclxuXHJcbiAgICAgICAgLy9DaGFuZ2UgdGhlIHNpemUgb2YgdGhlIHJlbmRlcmVyIHRvIHRoZSBuZXcgd2luZG93IHNpemVcclxuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEFsbCB0aGUgZnVuY3Rpb25zIHRoYXQgbmVlZCB0byBiZSBleGVjdXRlZCBldmVyeSB0aW1lIHRoZSBzeXN0ZW0gdXBkYXRlc1xyXG4gICAgICogQHByb3RlY3RlZFxyXG4gICAgICovXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgLy9VcGRhdGUgdGhlIGNvbnRyb2xzIHRvIG1hdGNoIHRoZSB1c2VycyBpbnRlcmFjdGlvblxyXG4gICAgICAgIHRoaXMuY29udHJvbHMudXBkYXRlKCk7XHJcblxyXG4gICAgICAgIC8vUmVuZGVyIHRoZSBzY2VuZSBhZ2FpblxyXG4gICAgICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUsIHRoaXMuY2FtZXJhKTtcclxuXHJcbiAgICB9XHJcblxyXG59O1xyXG5cclxuLy9FeHBvcnQgdGhlIEJyb3dzZXJpZnkgbW9kdWxlXHJcbm1vZHVsZS5leHBvcnRzID0gV29ybGQ7XHJcbiJdfQ==
;