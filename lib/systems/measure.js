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
