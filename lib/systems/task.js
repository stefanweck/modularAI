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
