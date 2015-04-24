(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"../entity/group.js":5,"../factories/robotfactory.js":6,"../world/settings.js":14,"../world/world.js":15}],3:[function(require,module,exports){
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

},{"../entity/entity.js":4,"../tasks/mop.js":11,"../tasks/vacuum.js":13}],7:[function(require,module,exports){
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

        var audioLevel = 0;

        //If the current task is vacuuming, make a lot of noise!
        switch(this.entity.systems['task'].currentTask.name){

            case('Vacuum'):

                audioLevel += globalSettings.vacuumNoise;
                break;

            case('Mop'):

                audioLevel += globalSettings.mopNoise;
                break;

            default:

                audioLevel += globalSettings.globalNoise;
                break

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
    Idle = require('../tasks/idle.js'),
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

            if(this.tasks[i].isLoud && !(globalSettings.currentTime >= 9 && globalSettings.currentTime <= 21)){
                if(globalSettings.globalNoise < this.tasks[i].measurements.audio[0]){
                    continue;
                }
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

        //If there aren't any possible tasks to pick from, get the Idle task
        if(tasks.length === 0){
            return new Idle();
        }

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

},{"../core/event.js":1,"../core/utils.js":3,"../tasks/idle.js":10}],10:[function(require,module,exports){
//Because Browserify encapsulates every module, use strict won't apply to the global scope and break everything
'use strict';

//Require necessary modules
var Task = require('./task.js');

/**
 * Idle Task constructor
 *
 * @class Idle
 * @classdesc Execute a given task and return the result
 * Inherits from Task
 */
var Idle = function(entity) {

    /**
     * Inherit the constructor from the Element class
     */
    Task.call(this, entity);

    /**
     * @property {String} name - The name of this task.
     */
    this.name = 'Idle';

};

Idle.prototype = Object.create(Task.prototype, {

    /**
     * Function that is called whenever the system updates
     * @protected
     */
    run: {
        value: function() {

            //Start the task
            this.start();

            //Execute the task
            console.log('I\'m idling now');

            //Let the idle automatically finish in 3 seconds
            setTimeout(this.finish.bind(this), 3000);

        }
    }

});

//Export the Browserify module
module.exports = Idle;

},{"./task.js":12}],11:[function(require,module,exports){
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

},{"./task.js":12}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{"../core/utils.js":3,"./task.js":12}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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

},{}]},{},[7]);