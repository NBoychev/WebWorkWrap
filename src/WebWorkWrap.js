/*!
 * WebWorkWrap v0.0.1
 * Nikola Boychev
 * MIT license
 * @preserve
 */

;(function() {
	'use strict';

	/**
	 * Class for managing HTML5 Webworkers
	 * 
	 * @param {String} workerpath
	 */
	function WebWorkWrap(workerpath) {
		
		this.workerpath = workerpath;

		this.worker = new Worker(workerpath);

		this.tasks = [];

		this._bind();
	};

	// Shortcuts to improve speed and size
	var proto = WebWorkWrap.prototype;
	var exports = this;
	var originalGlobalValue = exports.WebWorkWrap;

	/**
	 * Listens for messages from the worker
	 * @api private
	 */
	proto._bind = function() {
		var that = this;

		that.worker.addEventListener('message', that._handleMessage.bind(that));
	};

	/**
	 * Handles messages from the worker
	 * 
	 * @param  {Object} event
	 * @api private
	 */
	proto._handleMessage = function(event) {
		var id = event.data.id;
		var data = event.data.data;

		this._fireCallback(id, event, data);
	};

	/**
	 * Fires the callback function of the task
	 * 
	 * @param  {String} id
	 * @param  {Object} event
	 * @param  {Any} data
	 * @api private
	 */
	proto._fireCallback = function(id, event, data) {
		var task = this._getTaskById(id);

		if(task.callback) {
			task.callback(event, data);
		};

		this._removeTask(task);
	};

	/**
	 * Removes task from the collection
	 * 
	 * @param  {Object} task
	 * @api private
	 */
	proto._removeTask = function(task) {
		this.tasks.splice(this.tasks.indexOf(task), 1);
	};

	/**
	 * Creates task and adds it to the collection
	 * 
	 * @param  {Function} callback
	 * @return {Object}
	 * @api private
	 */
	proto._createTask = function(callback) {
		var task = {
			id: this._generateId('wwwTask'),
			callback: callback
		};

		this.tasks.push(task);

		return task;
	};

	/**
	 * Gets task from the collection, by id
	 * 
	 * @param  {String} id
	 * @return {Object}
	 * @api private
	 */
	proto._getTaskById = function(id) {
		for (var i = 0; i < this.tasks.length; i++) {
			if(this.tasks[i].id === id){
				return this.tasks[i];
			};
		};
	};

	/**
	 * Generates random id
	 * 
	 * @param  {String|Number} prefix
	 * @return {String}
	 * @api private
	 */
	proto._generateId = function(prefix) {
		return 'wwwTask' + new Date().getTime() + String.fromCharCode(65 + Math.floor(Math.random() * 26));
	};


	/**
	 * Sets the options of the web worker
	 * 
	 * @param {Object} opts
	 */
	proto.setOptions = function(opts) {
		this.worker.postMessage({
			settings: opts
		});
	};

	/**
	 * Send task to the worker
	 * 
	 * @param  {Object}   taskData
	 * @param  {Function} callback
	 */
	proto.doTask = function(taskData, callback) {
		var task = this._createTask(callback);

		taskData.wwwTaskId = task.id;

		this.worker.postMessage(taskData);
	};

	/**
	 * Stop the worker
	 * 
	 */
	proto.terminate = function() {
		this.worker.terminate();
	};


	/**
	 * Reverts the global {@link WebWorkWrap} to its previous value and returns a reference to this version.
	 *
	 * @return {Function} Non conflicting WebWorkWrap class.
	 */
	WebWorkWrap.noConflict = function noConflict() {
		exports.WebWorkWrap = originalGlobalValue;
		return WebWorkWrap;
	};

	// Expose the class either via AMD, CommonJS or the global object
	if (typeof define === 'function' && define.amd) {
		define(function () {
			return WebWorkWrap;
		});
	}
	else if (typeof module === 'object' && module.exports){
		module.exports = WebWorkWrap;
	}
	else {
		this.WebWorkWrap = WebWorkWrap;
	};

}.call(this));