;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//Because Browserify encapsulates every module, use strict won't apply to the global scope and break everything
'use strict';

//Require necessary modules
var Group = require('../entity/group.js'),
    Entity = require('../entity/entity.js'),
    Execute = require('../tasks/execute.js'),
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
     * @protected
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
        firstRobot.addTask(new Execute());
        firstRobot.addTask(new Execute());
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

        for(var i = 0; i < this.entities.entities.length; i++){

            this.entities.entities[i].run();

        }

        //Update the demonstration world
        this.world.update();

    }

};

//Export the Browserify module
module.exports = System;

},{"../entity/entity.js":2,"../entity/group.js":3,"../tasks/execute.js":5,"../world/world.js":7}],2:[function(require,module,exports){
//Because Browserify encapsulates every module, use strict won't apply to the global scope and break everything
'use strict';

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
     * @property {Array} tasks - An associative array filled with all the tasks to be executed
     */
    this.tasks = [];

    /**
     * @property {Task} currentTask - The task this entity is currently executing
     */
    this.currentTask = null;

};

Entity.prototype = {

    run: function() {
        if(this.currentTask.state !== 'done'){
            return;
        }

        var index = this.tasks.indexOf(this.currentTask);
        if(index >= 0 && index < this.tasks.length - 1){
            this.currentTask = this.tasks[index + 1];
        }

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

    }

};

//Export the Browserify module
module.exports = Entity;

},{}],3:[function(require,module,exports){
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

/**
 * Function to add a new entity to this group
 * @protected
 *
 * @param {Entity} entity - A reference to entity being added
 */
Group.prototype.addEntity = function(entity) {

    //Check if the entity is the correct object
    if(!entity instanceof Entity) {
        return;
    }

    //Add the current entity to the list
    this.entities.push(entity);

};

/**
 * Function to remove an entity from this group
 * @protected
 *
 * @param {Entity} entity - A reference to entity being removed
 */
Group.prototype.removeEntity = function(entity) {

    //Check if the entity exists, if not, we don't have to delete it
    var index = this.entities.indexOf(entity);

    //The element doesn't exist in the list
    if(index === -1) {
        return;
    }

    //Remove the current entity from the group
    this.entities.splice(index, 1);

};

//Export the Browserify module
module.exports = Group;

},{"./entity.js":2}],4:[function(require,module,exports){
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

},{"./core/system.js":1}],5:[function(require,module,exports){
//Because Browserify encapsulates every module, use strict won't apply to the global scope and break everything
'use strict';

//Require necessary modules
var Task = require('./task.js');

/**
 * Execute Task constructor
 *
 * @class Execute
 * @classdesc Execute a given task and return the result
 * Inherits from Task
 */
var Execute = function() {

    /**
     * Inherit the constructor from the Element class
     */
    Task.call(this);

    /**
     * @property {String} name - The name of this task.
     */
    this.name = 'Execute';

};

Execute.prototype = Object.create(Task.prototype, {

    /**
     * Function that is called whenever the system updates
     * @protected
     */
    run: {
        value: function() {

            this.start();
            console.log('ga nu stofzuigen');

            setTimeout(this.finish.bind(this), 5000);

        }
    }

});

//Export the Browserify module
module.exports = Execute;

},{"./task.js":6}],6:[function(require,module,exports){
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

};

Task.prototype = {

    /**
     * Function that is called whenever the system updates
     * This function should be overwritten by tasks
     * @protected
     */
    run: function() {

        //Silence is golden

    },

    start: function() {

        this.state = 'busy';

    },

    finish: function() {

        this.state = 'done';

    }

};

//Export the Browserify module
module.exports = Task;

},{}],7:[function(require,module,exports){
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
        this.scene.add(new THREE.AmbientLight(0x505050));

        //Create a new light
        var light = new THREE.SpotLight(0xffffff, 1.5);

        //Configure the light
        light.position.set( 0, 500, 2000 );
        light.castShadow = true;
        light.shadowCameraNear = 200;
        light.shadowCameraFar = this.camera.far;
        light.shadowCameraFov = 50;
        light.shadowBias = -0.00022;
        light.shadowDarkness = 0.5;
        light.shadowMapWidth = 2048;
        light.shadowMapHeight = 2048;

        //Add the light to the newly created scene
        this.scene.add(light);

        //Create a new plane, we are using this for a floor
        var plane = new THREE.Mesh(
            new THREE.PlaneBufferGeometry( 2000, 2000, 8, 8 ),
            new THREE.MeshBasicMaterial( { color: 0xEDEDED } )
        );

        //Configure the plane
        plane.receiveShadow = true;

        //Add the plane to the newly created scene
        this.scene.add( plane );

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
        var geometry = new THREE.BoxGeometry( 40, 40, 40 );

        //Create the new cube object with the geometry
        var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }));

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

},{}]},{},[4])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6L3hhbXBwL2h0ZG9jcy9tb2R1bGFyQUkvbGliL2NvcmUvc3lzdGVtLmpzIiwiRDoveGFtcHAvaHRkb2NzL21vZHVsYXJBSS9saWIvZW50aXR5L2VudGl0eS5qcyIsIkQ6L3hhbXBwL2h0ZG9jcy9tb2R1bGFyQUkvbGliL2VudGl0eS9ncm91cC5qcyIsIkQ6L3hhbXBwL2h0ZG9jcy9tb2R1bGFyQUkvbGliL2luaXQuanMiLCJEOi94YW1wcC9odGRvY3MvbW9kdWxhckFJL2xpYi90YXNrcy9leGVjdXRlLmpzIiwiRDoveGFtcHAvaHRkb2NzL21vZHVsYXJBSS9saWIvdGFza3MvdGFzay5qcyIsIkQ6L3hhbXBwL2h0ZG9jcy9tb2R1bGFyQUkvbGliL3dvcmxkL3dvcmxkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiLy9CZWNhdXNlIEJyb3dzZXJpZnkgZW5jYXBzdWxhdGVzIGV2ZXJ5IG1vZHVsZSwgdXNlIHN0cmljdCB3b24ndCBhcHBseSB0byB0aGUgZ2xvYmFsIHNjb3BlIGFuZCBicmVhayBldmVyeXRoaW5nXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8vUmVxdWlyZSBuZWNlc3NhcnkgbW9kdWxlc1xyXG52YXIgR3JvdXAgPSByZXF1aXJlKCcuLi9lbnRpdHkvZ3JvdXAuanMnKSxcclxuICAgIEVudGl0eSA9IHJlcXVpcmUoJy4uL2VudGl0eS9lbnRpdHkuanMnKSxcclxuICAgIEV4ZWN1dGUgPSByZXF1aXJlKCcuLi90YXNrcy9leGVjdXRlLmpzJyksXHJcbiAgICBXb3JsZCA9IHJlcXVpcmUoJy4uL3dvcmxkL3dvcmxkLmpzJyk7XHJcblxyXG4vKipcclxuICogU3lzdGVtIENvbnN0cnVjdG9yXHJcbiAqXHJcbiAqIEBjbGFzcyBTeXN0ZW1cclxuICogQGNsYXNzZGVzYyBUaGUgaGVhcnQgb2YgdGhpcyBtb2R1bGFyIEFJISBJbiBoZXJlIHdlIHByb3ZpZGUgYWNjZXNzIHRvXHJcbiAqIGFsbCB0aGUgb3RoZXIgb2JqZWN0cyBhbmQgZnVuY3Rpb24sIGFuZCB3ZSBoYW5kbGUgdGhlIHN0YXJ0dXAgb2YgdGhlIHN5c3RlbVxyXG4gKlxyXG4gKiBAcGFyYW0ge09iamVjdH0gdXNlclNldHRpbmdzIC0gVGhlIHNldHRpbmdzIHRoYXQgdGhlIHVzZXIgcHJvdmlkZXNcclxuICovXHJcbnZhciBTeXN0ZW0gPSBmdW5jdGlvbih1c2VyU2V0dGluZ3MpIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gaXNJbml0aWFsaXplZCAtIFRydWUgd2hlbiB0aGUgc3lzdGVtIGlzIGZ1bGx5IGluaXRpYWxpemVkXHJcbiAgICAgKi9cclxuICAgIHRoaXMuaXNJbml0aWFsaXplZCA9IGZhbHNlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtHcm91cH0gZW50aXRpZXMgLSBBbGwgdGhlIGVudGl0aWVzIGNvbnRyb2xsZWQgYnkgdGhpcyBzeXN0ZW1cclxuICAgICAqL1xyXG4gICAgdGhpcy5lbnRpdGllcyA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcGVydHkge1dvcmxkfSB3b3JsZCAtIFRoZSB3b3JsZCBmb3IgZGVtb25zdHJhdGluZyBwdXJwb3Nlc1xyXG4gICAgICovXHJcbiAgICB0aGlzLndvcmxkID0gbnVsbDtcclxuXHJcbiAgICAvL0xvYWQgYW5kIHRoZW4gaW5pdGlhbGl6ZSBpdHNlbGZcclxuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xyXG5cclxufTtcclxuXHJcblN5c3RlbS5wcm90b3R5cGUgPSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIHRoZSBzeXN0ZW1cclxuICAgICAqIEBwcm90ZWN0ZWRcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIC8vQ2hlY2sgaWYgdGhlIGdhbWUgaXMgYWxyZWFkeSBpbml0aWFsaXplZFxyXG4gICAgICAgIGlmKHRoaXMuaXNJbml0aWFsaXplZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL0NyZWF0ZSBhIG5ldyBncm91cCB0aGF0IHdpbGwgaG9sZCBhbGwgZW50aXRpZXNcclxuICAgICAgICB0aGlzLmVudGl0aWVzID0gbmV3IEdyb3VwKCk7XHJcblxyXG4gICAgICAgIC8vQ3JlYXRlIGEgbmV3IGVudGl0eSBhbmQgYWRkIGl0IHRvIHRoZSBncm91cFxyXG4gICAgICAgIHZhciBmaXJzdFJvYm90ID0gbmV3IEVudGl0eSgnUm9iaW4nKTtcclxuICAgICAgICBmaXJzdFJvYm90LmFkZFRhc2sobmV3IEV4ZWN1dGUoKSk7XHJcbiAgICAgICAgZmlyc3RSb2JvdC5hZGRUYXNrKG5ldyBFeGVjdXRlKCkpO1xyXG4gICAgICAgIHRoaXMuZW50aXRpZXMuYWRkRW50aXR5KGZpcnN0Um9ib3QpO1xyXG5cclxuICAgICAgICAvL0NyZWF0ZSB0aGUgd29ybGQgb2JqZWN0XHJcbiAgICAgICAgdGhpcy53b3JsZCA9IG5ldyBXb3JsZCgpO1xyXG5cclxuICAgICAgICAvL1VwZGF0ZSB0aGUgc3lzdGVtIGZvciB0aGUgZmlyc3QgdGltZVxyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcblxyXG4gICAgICAgIC8vVGhlIHN5c3RlbSBpcyBmdWxseSBpbml0aWFsaXplZFxyXG4gICAgICAgIHRoaXMuaXNJbml0aWFsaXplZCA9IHRydWU7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEFsbCB0aGUgZnVuY3Rpb25zIHRoYXQgbmVlZCB0byBiZSBleGVjdXRlZCBldmVyeSB0aW1lIHRoZSBzeXN0ZW0gdXBkYXRlc1xyXG4gICAgICogQmFzaWNhbGx5IGEgZ2FtZSBsb29wXHJcbiAgICAgKiBAcHJvdGVjdGVkXHJcbiAgICAgKi9cclxuICAgIHVwZGF0ZTogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIC8vUmVxdWVzdCBhIG5ldyBhbmltYXRpb24gZnJhbWUgYW5kIGNhbGwgdGhlIHVwZGF0ZSBmdW5jdGlvbiBhZ2FpblxyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnVwZGF0ZS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMuZW50aXRpZXMuZW50aXRpZXMubGVuZ3RoOyBpKyspe1xyXG5cclxuICAgICAgICAgICAgdGhpcy5lbnRpdGllcy5lbnRpdGllc1tpXS5ydW4oKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL1VwZGF0ZSB0aGUgZGVtb25zdHJhdGlvbiB3b3JsZFxyXG4gICAgICAgIHRoaXMud29ybGQudXBkYXRlKCk7XHJcblxyXG4gICAgfVxyXG5cclxufTtcclxuXHJcbi8vRXhwb3J0IHRoZSBCcm93c2VyaWZ5IG1vZHVsZVxyXG5tb2R1bGUuZXhwb3J0cyA9IFN5c3RlbTtcclxuIiwiLy9CZWNhdXNlIEJyb3dzZXJpZnkgZW5jYXBzdWxhdGVzIGV2ZXJ5IG1vZHVsZSwgdXNlIHN0cmljdCB3b24ndCBhcHBseSB0byB0aGUgZ2xvYmFsIHNjb3BlIGFuZCBicmVhayBldmVyeXRoaW5nXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8qKlxyXG4gKiBFbnRpdHkgY29uc3RydWN0b3JcclxuICpcclxuICogQGNsYXNzIEVudGl0eVxyXG4gKiBAY2xhc3NkZXNjIEEgc2luZ2xlIGVudGl0eSB0aGF0IGhhcyBjZXJ0YWluIGJlaGF2aW91ciB0byBiZSBleGVjdXRlZFxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIFRoZSBuYW1lIG9mIHRoaXMgZW50aXR5XHJcbiAqL1xyXG52YXIgRW50aXR5ID0gZnVuY3Rpb24obmFtZSkge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSBvZiB0aGlzIGVudGl0eVxyXG4gICAgICovXHJcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheX0gdGFza3MgLSBBbiBhc3NvY2lhdGl2ZSBhcnJheSBmaWxsZWQgd2l0aCBhbGwgdGhlIHRhc2tzIHRvIGJlIGV4ZWN1dGVkXHJcbiAgICAgKi9cclxuICAgIHRoaXMudGFza3MgPSBbXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwcm9wZXJ0eSB7VGFza30gY3VycmVudFRhc2sgLSBUaGUgdGFzayB0aGlzIGVudGl0eSBpcyBjdXJyZW50bHkgZXhlY3V0aW5nXHJcbiAgICAgKi9cclxuICAgIHRoaXMuY3VycmVudFRhc2sgPSBudWxsO1xyXG5cclxufTtcclxuXHJcbkVudGl0eS5wcm90b3R5cGUgPSB7XHJcblxyXG4gICAgcnVuOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZih0aGlzLmN1cnJlbnRUYXNrLnN0YXRlICE9PSAnZG9uZScpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLnRhc2tzLmluZGV4T2YodGhpcy5jdXJyZW50VGFzayk7XHJcbiAgICAgICAgaWYoaW5kZXggPj0gMCAmJiBpbmRleCA8IHRoaXMudGFza3MubGVuZ3RoIC0gMSl7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFRhc2sgPSB0aGlzLnRhc2tzW2luZGV4ICsgMV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmN1cnJlbnRUYXNrLnJ1bigpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBhIGNlcnRhaW4gdGFzayBmcm9tIHRoaXMgZW50aXR5XHJcbiAgICAgKiBAcHVibGljXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IC0gVGhlIG51bWJlciBvZiB0aGUgdGFzayB0aGF0IGlzIGdvaW5nIHRvIGJlIHJldHVybmVkXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgdGFzayB0aGF0IHRoaXMgZW50aXR5IGhhcyBhdCB0aGUgc3BlY2lmaWVkIGluZGV4XHJcbiAgICAgKi9cclxuICAgIGdldFRhc2s6IGZ1bmN0aW9uKGluZGV4KSB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnRhc2tzW2luZGV4XTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGEgdGFzayB0byB0aGlzIGVudGl0eVxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0YXNrIC0gVGhlIHRhc2sgdGhhdCBpcyBnZXR0aW5nIGFkZGVkIHRvIHRoaXMgZW50aXR5XHJcbiAgICAgKi9cclxuICAgIGFkZFRhc2s6IGZ1bmN0aW9uKHRhc2spIHtcclxuXHJcbiAgICAgICAgLy9BZGQgdGhlIHRhc2tcclxuICAgICAgICB0aGlzLnRhc2tzLnB1c2godGFzayk7XHJcblxyXG4gICAgICAgIC8vQ2hlY2sgaWYgdGhlIGVudGl0eSBuZWVkcyB0byBzdGFydCB3aXRoIHRoaXMgdGFza1xyXG4gICAgICAgIGlmKHRoaXMuY3VycmVudFRhc2sgPT09IG51bGwpe1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VGFzayA9IHRhc2s7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFRhc2sucnVuKCk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlIGEgdGFzayBmcm9tIHRoaXMgZW50aXR5XHJcbiAgICAgKiBAcHVibGljXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IC0gVGhlIG51bWJlciBvZiB0aGUgdGFzayB0aGF0IGlzIGdvaW5nIHRvIGJlIHJlbW92ZWRcclxuICAgICAqL1xyXG4gICAgcmVtb3ZlVGFzazogZnVuY3Rpb24oaW5kZXgpIHtcclxuXHJcbiAgICAgICAgLy9SZW1vdmUgdGhlIHRhc2tcclxuICAgICAgICB0aGlzLnRhc2suc3BsaWNlKGluZGV4LCAxKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ291bnQgdGhlIG51bWJlciBvZiB0YXNrcyBhbmQgcmV0dXJuIHRoZSBudW1iZXJcclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7TnVtYmVyfVxyXG4gICAgICovXHJcbiAgICB0b3RhbFRhc2tzOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGFza3MubGVuZ3RoKCk7XHJcblxyXG4gICAgfVxyXG5cclxufTtcclxuXHJcbi8vRXhwb3J0IHRoZSBCcm93c2VyaWZ5IG1vZHVsZVxyXG5tb2R1bGUuZXhwb3J0cyA9IEVudGl0eTtcclxuIiwiLy9CZWNhdXNlIEJyb3dzZXJpZnkgZW5jYXBzdWxhdGVzIGV2ZXJ5IG1vZHVsZSwgdXNlIHN0cmljdCB3b24ndCBhcHBseSB0byB0aGUgZ2xvYmFsIHNjb3BlIGFuZCBicmVhayBldmVyeXRoaW5nXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbi8vUmVxdWlyZSBuZWNlc3NhcnkgbW9kdWxlc1xyXG52YXIgRW50aXR5ID0gcmVxdWlyZSgnLi9lbnRpdHkuanMnKTtcclxuXHJcbi8qKlxyXG4gKiBHcm91cCBjb25zdHJ1Y3RvclxyXG4gKlxyXG4gKiBAY2xhc3MgR3JvdXBcclxuICogQGNsYXNzZGVzYyBUaGUgb2JqZWN0IHRoYXQgaG9sZHMgbXVsdGlwbGUgZW50aXRpZXNcclxuICovXHJcbnZhciBHcm91cCA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheX0gZW50aXRpZXMgLSBDb2xsZWN0aW9uIG9mIGFsbCB0aGUgZW50aXRpZXMgaW4gdGhpcyBncm91cFxyXG4gICAgICovXHJcbiAgICB0aGlzLmVudGl0aWVzID0gW107XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEZ1bmN0aW9uIHRvIGFkZCBhIG5ldyBlbnRpdHkgdG8gdGhpcyBncm91cFxyXG4gKiBAcHJvdGVjdGVkXHJcbiAqXHJcbiAqIEBwYXJhbSB7RW50aXR5fSBlbnRpdHkgLSBBIHJlZmVyZW5jZSB0byBlbnRpdHkgYmVpbmcgYWRkZWRcclxuICovXHJcbkdyb3VwLnByb3RvdHlwZS5hZGRFbnRpdHkgPSBmdW5jdGlvbihlbnRpdHkpIHtcclxuXHJcbiAgICAvL0NoZWNrIGlmIHRoZSBlbnRpdHkgaXMgdGhlIGNvcnJlY3Qgb2JqZWN0XHJcbiAgICBpZighZW50aXR5IGluc3RhbmNlb2YgRW50aXR5KSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vQWRkIHRoZSBjdXJyZW50IGVudGl0eSB0byB0aGUgbGlzdFxyXG4gICAgdGhpcy5lbnRpdGllcy5wdXNoKGVudGl0eSk7XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEZ1bmN0aW9uIHRvIHJlbW92ZSBhbiBlbnRpdHkgZnJvbSB0aGlzIGdyb3VwXHJcbiAqIEBwcm90ZWN0ZWRcclxuICpcclxuICogQHBhcmFtIHtFbnRpdHl9IGVudGl0eSAtIEEgcmVmZXJlbmNlIHRvIGVudGl0eSBiZWluZyByZW1vdmVkXHJcbiAqL1xyXG5Hcm91cC5wcm90b3R5cGUucmVtb3ZlRW50aXR5ID0gZnVuY3Rpb24oZW50aXR5KSB7XHJcblxyXG4gICAgLy9DaGVjayBpZiB0aGUgZW50aXR5IGV4aXN0cywgaWYgbm90LCB3ZSBkb24ndCBoYXZlIHRvIGRlbGV0ZSBpdFxyXG4gICAgdmFyIGluZGV4ID0gdGhpcy5lbnRpdGllcy5pbmRleE9mKGVudGl0eSk7XHJcblxyXG4gICAgLy9UaGUgZWxlbWVudCBkb2Vzbid0IGV4aXN0IGluIHRoZSBsaXN0XHJcbiAgICBpZihpbmRleCA9PT0gLTEpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy9SZW1vdmUgdGhlIGN1cnJlbnQgZW50aXR5IGZyb20gdGhlIGdyb3VwXHJcbiAgICB0aGlzLmVudGl0aWVzLnNwbGljZShpbmRleCwgMSk7XHJcblxyXG59O1xyXG5cclxuLy9FeHBvcnQgdGhlIEJyb3dzZXJpZnkgbW9kdWxlXHJcbm1vZHVsZS5leHBvcnRzID0gR3JvdXA7XHJcbiIsIi8vQmVjYXVzZSBCcm93c2VyaWZ5IGVuY2Fwc3VsYXRlcyBldmVyeSBtb2R1bGUsIHVzZSBzdHJpY3Qgd29uJ3QgYXBwbHkgdG8gdGhlIGdsb2JhbCBzY29wZSBhbmQgYnJlYWsgZXZlcnl0aGluZ1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4vL1JlcXVpcmUgbmVjZXNzYXJ5IG1vZHVsZXNcclxudmFyIFN5c3RlbSA9IHJlcXVpcmUoJy4vY29yZS9zeXN0ZW0uanMnKTtcclxuXHJcbi8vVGhlIGluaXRpYWxpemUgTW9kdWxlXHJcbnZhciBJbnRpYWxpemUgPSBmdW5jdGlvbiBpbml0aWFsaXplU3lzdGVtKCkge1xyXG5cclxuICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICAgIC8vRW1wdHkgZm9yIG5vd1xyXG4gICAgfTtcclxuXHJcbiAgICAvL0NyZWF0ZSBhIG5ldyBzeXN0ZW1cclxuICAgIHZhciBzeXN0ZW0gPSBuZXcgU3lzdGVtKG9wdGlvbnMpO1xyXG5cclxufTtcclxuXHJcbi8vIHNoaW0gbGF5ZXIgd2l0aCBzZXRUaW1lb3V0IGZhbGxiYWNrXHJcbndpbmRvdy5yZXF1ZXN0QW5pbUZyYW1lID0gKGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgICB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgICAgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGNhbGxiYWNrLCAxMDAwIC8gNjApO1xyXG4gICAgICAgIH07XHJcbn0pKCk7XHJcblxyXG4vL0luaXRpYWxpemUgd2hlbiBmdWxseSBsb2FkZWRcclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIEludGlhbGl6ZSk7XHJcblxyXG4vL0V4cG9ydCB0aGUgQnJvd3NlcmlmeSBtb2R1bGVcclxubW9kdWxlLmV4cG9ydHMgPSBJbnRpYWxpemU7XHJcbiIsIi8vQmVjYXVzZSBCcm93c2VyaWZ5IGVuY2Fwc3VsYXRlcyBldmVyeSBtb2R1bGUsIHVzZSBzdHJpY3Qgd29uJ3QgYXBwbHkgdG8gdGhlIGdsb2JhbCBzY29wZSBhbmQgYnJlYWsgZXZlcnl0aGluZ1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4vL1JlcXVpcmUgbmVjZXNzYXJ5IG1vZHVsZXNcclxudmFyIFRhc2sgPSByZXF1aXJlKCcuL3Rhc2suanMnKTtcclxuXHJcbi8qKlxyXG4gKiBFeGVjdXRlIFRhc2sgY29uc3RydWN0b3JcclxuICpcclxuICogQGNsYXNzIEV4ZWN1dGVcclxuICogQGNsYXNzZGVzYyBFeGVjdXRlIGEgZ2l2ZW4gdGFzayBhbmQgcmV0dXJuIHRoZSByZXN1bHRcclxuICogSW5oZXJpdHMgZnJvbSBUYXNrXHJcbiAqL1xyXG52YXIgRXhlY3V0ZSA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5oZXJpdCB0aGUgY29uc3RydWN0b3IgZnJvbSB0aGUgRWxlbWVudCBjbGFzc1xyXG4gICAgICovXHJcbiAgICBUYXNrLmNhbGwodGhpcyk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gbmFtZSAtIFRoZSBuYW1lIG9mIHRoaXMgdGFzay5cclxuICAgICAqL1xyXG4gICAgdGhpcy5uYW1lID0gJ0V4ZWN1dGUnO1xyXG5cclxufTtcclxuXHJcbkV4ZWN1dGUucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShUYXNrLnByb3RvdHlwZSwge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgd2hlbmV2ZXIgdGhlIHN5c3RlbSB1cGRhdGVzXHJcbiAgICAgKiBAcHJvdGVjdGVkXHJcbiAgICAgKi9cclxuICAgIHJ1bjoge1xyXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3RhcnQoKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2dhIG51IHN0b2Z6dWlnZW4nKTtcclxuXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQodGhpcy5maW5pc2guYmluZCh0aGlzKSwgNTAwMCk7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0pO1xyXG5cclxuLy9FeHBvcnQgdGhlIEJyb3dzZXJpZnkgbW9kdWxlXHJcbm1vZHVsZS5leHBvcnRzID0gRXhlY3V0ZTtcclxuIiwiLy9CZWNhdXNlIEJyb3dzZXJpZnkgZW5jYXBzdWxhdGVzIGV2ZXJ5IG1vZHVsZSwgdXNlIHN0cmljdCB3b24ndCBhcHBseSB0byB0aGUgZ2xvYmFsIHNjb3BlIGFuZCBicmVhayBldmVyeXRoaW5nXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogVGFzayBjb25zdHJ1Y3RvclxuICpcbiAqIEBjbGFzcyBUYXNrXG4gKiBAY2xhc3NkZXNjIFRoZSBiYXNlIGNsYXNzIGZvciB0YXNrc1xuICovXG52YXIgVGFzayA9IGZ1bmN0aW9uKCkge1xuXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IG5hbWUgLSBUaGUgbmFtZSBvZiB0aGlzIHN0YXR1cyBlZmZlY3QuIFRoaXMgZmllbGQgaXMgYWx3YXlzIHJlcXVpcmVkIVxuICAgICAqL1xuICAgIHRoaXMubmFtZSA9ICdCYXNlIFRhc2snO1xuXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IHN0YXRlIC0gVGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhpcyB0YXNrLiBDYW4gYmUgRG9uZSwgQnVzeSwgUHJvYmxlbSwgUGxhbm5lZFxuICAgICAqL1xuICAgIHRoaXMuc3RhdGUgPSAncGxhbm5lZCc7XG5cbn07XG5cblRhc2sucHJvdG90eXBlID0ge1xuXG4gICAgLyoqXG4gICAgICogRnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgd2hlbmV2ZXIgdGhlIHN5c3RlbSB1cGRhdGVzXG4gICAgICogVGhpcyBmdW5jdGlvbiBzaG91bGQgYmUgb3ZlcndyaXR0ZW4gYnkgdGFza3NcbiAgICAgKiBAcHJvdGVjdGVkXG4gICAgICovXG4gICAgcnVuOiBmdW5jdGlvbigpIHtcblxuICAgICAgICAvL1NpbGVuY2UgaXMgZ29sZGVuXG5cbiAgICB9LFxuXG4gICAgc3RhcnQ6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHRoaXMuc3RhdGUgPSAnYnVzeSc7XG5cbiAgICB9LFxuXG4gICAgZmluaXNoOiBmdW5jdGlvbigpIHtcblxuICAgICAgICB0aGlzLnN0YXRlID0gJ2RvbmUnO1xuXG4gICAgfVxuXG59O1xuXG4vL0V4cG9ydCB0aGUgQnJvd3NlcmlmeSBtb2R1bGVcbm1vZHVsZS5leHBvcnRzID0gVGFzaztcbiIsIi8vQmVjYXVzZSBCcm93c2VyaWZ5IGVuY2Fwc3VsYXRlcyBldmVyeSBtb2R1bGUsIHVzZSBzdHJpY3Qgd29uJ3QgYXBwbHkgdG8gdGhlIGdsb2JhbCBzY29wZSBhbmQgYnJlYWsgZXZlcnl0aGluZ1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG4vL1JlcXVpcmUgbmVjZXNzYXJ5IG1vZHVsZXNcclxuLy8gLS0gTm9uZSB5ZXRcclxuXHJcbi8qKlxyXG4gKiBXb3JsZCBjb25zdHJ1Y3RvclxyXG4gKlxyXG4gKiBAY2xhc3MgV29ybGRcclxuICogQGNsYXNzZGVzYyBUaGUgV29ybGQgb2JqZWN0IGhvbGRzIGFsbCBvYmplY3RzIHRoYXQgYXJlIGluIHRoZSBkZW1vbnN0cmF0aW9uIHdvcmxkLCB0aGUgbWFwIGV0Yy5cclxuICovXHJcbnZhciBXb3JsZCA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtUSFJFRS5TY2VuZX0gc2NlbmUgLSBSZWZlcmVuY2UgdG8gdGhlIHNjZW5lXHJcbiAgICAgKi9cclxuICAgIHRoaXMuc2NlbmUgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYX0gY2FtZXJhIC0gUmVmZXJlbmNlIHRvIHRoZSBjYW1lcmFcclxuICAgICAqL1xyXG4gICAgdGhpcy5jYW1lcmEgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByb3BlcnR5IHtUSFJFRS5XZWJHTFJlbmRlcmVyfSByZW5kZXJlciAtIFJlZmVyZW5jZSB0byB0aGUgcmVuZGVyZXJcclxuICAgICAqL1xyXG4gICAgdGhpcy5yZW5kZXJlciA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcGVydHkge1RIUkVFLlRyYWNrYmFsbENvbnRyb2xzfSBjb250cm9scyAtIFJlZmVyZW5jZSB0byB0aGUgY29udHJvbHMgb2JqZWN0XHJcbiAgICAgKi9cclxuICAgIHRoaXMuY29udHJvbHMgPSBudWxsO1xyXG5cclxuICAgIC8vSW5pdGlhbGl6ZSBpdHNlbGZcclxuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xyXG5cclxufTtcclxuXHJcbldvcmxkLnByb3RvdHlwZSA9IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgdGhlIFVJIGVsZW1lbnRzIGFuZCBhZGQgdGhlbSB0byB0aGlzIGNvbnRhaW5lclxyXG4gICAgICogQHByb3RlY3RlZFxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIC8vSW5pdGlhbGl6ZSB0aGUgY2FtZXJhXHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplQ2FtZXJhKCk7XHJcblxyXG4gICAgICAgIC8vSW5pdGlhbGl6ZSB0aGUgbW91c2UgY29udHJvbHNcclxuICAgICAgICB0aGlzLmluaXRpYWxpemVDb250cm9scygpO1xyXG5cclxuICAgICAgICAvL0NyZWF0ZSB0aGUgc3RhZ2UsIGFkZCBhIGxpZ2h0IGFuZCBhIGZsb29yXHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplU3RhZ2UoKTtcclxuXHJcbiAgICAgICAgLy9Jbml0aWFsaXplIGFsbCBvYmplY3RzIGluIHRoZSB3b3JsZFxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZU9iamVjdHMoKTtcclxuXHJcbiAgICAgICAgLy9Jbml0aWFsaXplIHRoZSByZW5kZXJlciBhbmQgY29uZmlndXJlIGl0XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplUmVuZGVyZXIoKTtcclxuXHJcbiAgICAgICAgLy9BZGQgYW4gZXZlbnQgbGlzdGVuZXIgZm9yIHdoZW4gdGhlIHVzZXIgcmVzaXplcyBoaXMgd2luZG93XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMub25XaW5kb3dSZXNpemUuYmluZCh0aGlzKSwgZmFsc2UpO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIGFuZCBzZXR1cCB0aGUgY2FtZXJhXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplQ2FtZXJhOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgLy9DcmVhdGUgYSBuZXcgY2FtZXJhIG9iamVjdFxyXG4gICAgICAgIHRoaXMuY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDcwLCB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCwgMSwgMTAwMDApO1xyXG5cclxuICAgICAgICAvL0NvbmZpZ3VyZSB0aGUgY2FtZXJhXHJcbiAgICAgICAgdGhpcy5jYW1lcmEucG9zaXRpb24ueiA9IDEwMDA7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgYW5kIHNldHVwIHRoZSBjb250cm9sc1xyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgaW5pdGlhbGl6ZUNvbnRyb2xzOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgLy9DcmVhdGUgYSBuZXcgY29udHJvbHMgb2JqZWN0XHJcbiAgICAgICAgdGhpcy5jb250cm9scyA9IG5ldyBUSFJFRS5UcmFja2JhbGxDb250cm9scyh0aGlzLmNhbWVyYSk7XHJcblxyXG4gICAgICAgIC8vU2V0dXAgdGhlIGNvbnRyb2xzXHJcbiAgICAgICAgdGhpcy5jb250cm9scy5yb3RhdGVTcGVlZCA9IDEuMDtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLnpvb21TcGVlZCA9IDEuMjtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLnBhblNwZWVkID0gMS4wO1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMubm9ab29tID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5jb250cm9scy5ub1BhbiA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuY29udHJvbHMuc3RhdGljTW92aW5nID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xzLmR5bmFtaWNEYW1waW5nRmFjdG9yID0gMC4zO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIGFuZCBzZXR1cCB0aGUgc3RhZ2VcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVTdGFnZTogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIC8vQ3JlYXRlIGEgbmV3IHNjZW5lIGFuZCBhZGQgYW4gYW1iaWVudCBsaWdodFxyXG4gICAgICAgIHRoaXMuc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcclxuICAgICAgICB0aGlzLnNjZW5lLmFkZChuZXcgVEhSRUUuQW1iaWVudExpZ2h0KDB4NTA1MDUwKSk7XHJcblxyXG4gICAgICAgIC8vQ3JlYXRlIGEgbmV3IGxpZ2h0XHJcbiAgICAgICAgdmFyIGxpZ2h0ID0gbmV3IFRIUkVFLlNwb3RMaWdodCgweGZmZmZmZiwgMS41KTtcclxuXHJcbiAgICAgICAgLy9Db25maWd1cmUgdGhlIGxpZ2h0XHJcbiAgICAgICAgbGlnaHQucG9zaXRpb24uc2V0KCAwLCA1MDAsIDIwMDAgKTtcclxuICAgICAgICBsaWdodC5jYXN0U2hhZG93ID0gdHJ1ZTtcclxuICAgICAgICBsaWdodC5zaGFkb3dDYW1lcmFOZWFyID0gMjAwO1xyXG4gICAgICAgIGxpZ2h0LnNoYWRvd0NhbWVyYUZhciA9IHRoaXMuY2FtZXJhLmZhcjtcclxuICAgICAgICBsaWdodC5zaGFkb3dDYW1lcmFGb3YgPSA1MDtcclxuICAgICAgICBsaWdodC5zaGFkb3dCaWFzID0gLTAuMDAwMjI7XHJcbiAgICAgICAgbGlnaHQuc2hhZG93RGFya25lc3MgPSAwLjU7XHJcbiAgICAgICAgbGlnaHQuc2hhZG93TWFwV2lkdGggPSAyMDQ4O1xyXG4gICAgICAgIGxpZ2h0LnNoYWRvd01hcEhlaWdodCA9IDIwNDg7XHJcblxyXG4gICAgICAgIC8vQWRkIHRoZSBsaWdodCB0byB0aGUgbmV3bHkgY3JlYXRlZCBzY2VuZVxyXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGxpZ2h0KTtcclxuXHJcbiAgICAgICAgLy9DcmVhdGUgYSBuZXcgcGxhbmUsIHdlIGFyZSB1c2luZyB0aGlzIGZvciBhIGZsb29yXHJcbiAgICAgICAgdmFyIHBsYW5lID0gbmV3IFRIUkVFLk1lc2goXHJcbiAgICAgICAgICAgIG5ldyBUSFJFRS5QbGFuZUJ1ZmZlckdlb21ldHJ5KCAyMDAwLCAyMDAwLCA4LCA4ICksXHJcbiAgICAgICAgICAgIG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCggeyBjb2xvcjogMHhFREVERUQgfSApXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy9Db25maWd1cmUgdGhlIHBsYW5lXHJcbiAgICAgICAgcGxhbmUucmVjZWl2ZVNoYWRvdyA9IHRydWU7XHJcblxyXG4gICAgICAgIC8vQWRkIHRoZSBwbGFuZSB0byB0aGUgbmV3bHkgY3JlYXRlZCBzY2VuZVxyXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKCBwbGFuZSApO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIGFuZCBzZXR1cCB0aGUgcmVuZGVyZXJcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGluaXRpYWxpemVSZW5kZXJlcjogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIC8vQ3JlYXRlIGEgbmV3IHJlbmRlcmVyIG9iamVjdFxyXG4gICAgICAgIHRoaXMucmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7XHJcbiAgICAgICAgICAgIGFudGlhbGlhczogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvL0NvbmZpZ3VyZSB0aGUgcmVuZGVyZXJcclxuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldENsZWFyQ29sb3IoMHhmMGYwZjApO1xyXG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyZXIuc29ydE9iamVjdHMgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnJlbmRlcmVyLnNoYWRvd01hcEVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2hhZG93TWFwVHlwZSA9IFRIUkVFLlBDRlNoYWRvd01hcDtcclxuXHJcbiAgICAgICAgLy9BcHBlbmQgdGhlIHJlbmRlcmVyIHRvIHRoZSBIVE1MIGJvZHlcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMucmVuZGVyZXIuZG9tRWxlbWVudCk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYWxpemUgYW5kIHNldHVwIHRoZSBvYmplY3RzXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBpbml0aWFsaXplT2JqZWN0czogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIC8vQ3JlYXRlIGEgcmV1c2FibGUgZ2VvbWV0cnkgb2JqZWN0IGZvciBhIGN1YmVcclxuICAgICAgICB2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoIDQwLCA0MCwgNDAgKTtcclxuXHJcbiAgICAgICAgLy9DcmVhdGUgdGhlIG5ldyBjdWJlIG9iamVjdCB3aXRoIHRoZSBnZW9tZXRyeVxyXG4gICAgICAgIHZhciBvYmplY3QgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoeyBjb2xvcjogTWF0aC5yYW5kb20oKSAqIDB4ZmZmZmZmIH0pKTtcclxuXHJcbiAgICAgICAgLy9Qb3NpdGlvbiB0aGUgY3ViZVxyXG4gICAgICAgIG9iamVjdC5wb3NpdGlvbi54ID0gMDtcclxuICAgICAgICBvYmplY3QucG9zaXRpb24ueSA9IDA7XHJcbiAgICAgICAgb2JqZWN0LnBvc2l0aW9uLnogPSAyMDtcclxuXHJcbiAgICAgICAgLy9Db25maWd1cmUgdGhlIGN1YmVcclxuICAgICAgICBvYmplY3QuY2FzdFNoYWRvdyA9IHRydWU7XHJcbiAgICAgICAgb2JqZWN0LnJlY2VpdmVTaGFkb3cgPSB0cnVlO1xyXG5cclxuICAgICAgICAvL0FkZCB0aGUgY3ViZSB0byB0aGUgc2NlbmVcclxuICAgICAgICB0aGlzLnNjZW5lLmFkZChvYmplY3QpO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGdW5jdGlvbiB0aGF0IGlzIGV4ZWN1dGVkIGV2ZXJ5IHRpbWUgdGhlIHdpbmRvdyByZXNpemVzXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBvbldpbmRvd1Jlc2l6ZTogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIC8vQ2hhbmdlIHRoZSBjYW1lcmEncyBhc3BlY3QgcmF0aW5nIGFuZCB1cGRhdGUgaXRcclxuICAgICAgICB0aGlzLmNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcclxuICAgICAgICB0aGlzLmNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XHJcblxyXG4gICAgICAgIC8vQ2hhbmdlIHRoZSBzaXplIG9mIHRoZSByZW5kZXJlciB0byB0aGUgbmV3IHdpbmRvdyBzaXplXHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBbGwgdGhlIGZ1bmN0aW9ucyB0aGF0IG5lZWQgdG8gYmUgZXhlY3V0ZWQgZXZlcnkgdGltZSB0aGUgc3lzdGVtIHVwZGF0ZXNcclxuICAgICAqIEBwcm90ZWN0ZWRcclxuICAgICAqL1xyXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIC8vVXBkYXRlIHRoZSBjb250cm9scyB0byBtYXRjaCB0aGUgdXNlcnMgaW50ZXJhY3Rpb25cclxuICAgICAgICB0aGlzLmNvbnRyb2xzLnVwZGF0ZSgpO1xyXG5cclxuICAgICAgICAvL1JlbmRlciB0aGUgc2NlbmUgYWdhaW5cclxuICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbmRlcih0aGlzLnNjZW5lLCB0aGlzLmNhbWVyYSk7XHJcblxyXG4gICAgfVxyXG5cclxufTtcclxuXHJcbi8vRXhwb3J0IHRoZSBCcm93c2VyaWZ5IG1vZHVsZVxyXG5tb2R1bGUuZXhwb3J0cyA9IFdvcmxkO1xyXG4iXX0=
;