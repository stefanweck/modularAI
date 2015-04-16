//Because Browserify encapsulates every module, use strict won't apply to the global scope and break everything
'use strict';

/**
 * Task System constructor
 *
 * @class TaskSystem
 * @classdesc A system that manages all things task related
 */
var TaskSystem = function() {

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

        //The entity is done with his current task, so he has to pick another one
        var index = this.tasks.indexOf(this.currentTask);

        //Try and grab the next task in the task list
        if(index >= 0 && index < this.tasks.length - 1){
            this.currentTask = this.tasks[index + 1];
        }

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

    }

};

//Export the Browserify module
module.exports = TaskSystem;
