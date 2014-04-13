// WWorker

;(function(){

	var worker = this;

	/**
	 * Class for worker that will manage tasks
	 * 
	 */
	function WWorker() {

		this.settings = {};

		this.bind();

	};

	/**
	 * Listens from messages from the app
	 * 
	 */
	WWorker.prototype.bind = function() {
		var that = this;

		worker.addEventListener('message', function(event) {
			var taskId = event.data.wwwTaskId;
			var data = event.data;

			if('settings' in event.data) {

				that.settings = event.data.settings;

			} else {
				var task = new Task(that, taskId, data);
			};

		});
	};

	/**
	 * Sets worker settings
	 * 
	 * @param {Object} settings
	 */
	WWorker.prototype.setSettings = function(settings) {

		this.settings = settigns;

	};

	/**
	 * Completes task and sends it to the app
	 * 
	 * @param  {String} id
	 * @param  {Any} data
	 */
	WWorker.prototype.completeTask = function(id, data) {
		worker.postMessage({
			id: id,
			data: data
		});

	};

	/**
	 * Class for worker task
	 * 
	 * @param {Object} worker
	 * @param {String} id
	 * @param {Any} data
	 */
	function Task(worker, id, data) {
		this.worker = worker;

		this.id = id;

		this.data = data;

		this.init();
	};


	/**
	 * Initialise the task
	 * 
	 */
	Task.prototype.init = function() {
		
		
        // worker body
        // your code goes here
        // to access data, use this.data


		this.complete(this.data);
	

	};

	/**
	 * Completes the task
	 * 
	 * @param  {any} data
	 */
	Task.prototype.complete = function(data) {
		this.worker.completeTask(this.id, data);
	};


	return new WWorker();

})();