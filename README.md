WebWorkWrap
===========

##The problem:##
Webworkers comunicate with the main app via message events. Sometimes this can be annoying if you need certain results from a task done.

##The solution:##
WebWorkWrap will help you by adding a callback function to the task, that will fire whenever the task is finished (this is controlled by you in the worker).

##How to use?##

###I. Prepare the worker:###

1. Include the script:
<script src="WebWorkWrap.js"></script>


2. Place worker code into task init method in worker.js:

    ```
    Task.prototype.init = function() {
        

        // worker body
        // your code goes here
        // to access data, use this.data

        this.complete(this.data);
    

    };
    ```

###II. Use the worker###

1. Create instnace of the worker in your app:
    
    ```
    var myWorker = new WebWorkWrap('workers/worker.js');
    ```

2. Set the options (optional):
    
    ```
    myWorker.setOptions({
        option: 'value'
    });
    ```

3. Do a task:
    
    ```
    myWorker.doTask({
        key: 'value'

    }, function(event, data){
        console.log(event, data)
    });
    ```
