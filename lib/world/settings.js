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
