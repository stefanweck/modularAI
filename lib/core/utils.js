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
