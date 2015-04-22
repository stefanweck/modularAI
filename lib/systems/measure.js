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
