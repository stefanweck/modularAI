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
