var MyTaskListApp = function () {

    var tasks = [];
    var currentTaskIndex = -1;

    var TASKS_KEY = "tasks";

    var loadTasks = function loadTasks() {
        if (localStorage) {
            var storedTasks = localStorage[TASKS_KEY];
            if (!storedTasks) {
                localStorage[TASKS_KEY] = JSON.stringify(tasks);
            }
            else {
                tasks = JSON.parse(storedTasks);
            }
        }
    };

    var displayTasks = function displayTasks() {

        var createTapHandler = function (index) {
            return function () {
                MyTaskListApp.setCurrentTask(index);
                $.mobile.changePage("form.html");
            };
        };


        var list = $("#taskList");
        var index = 0;
        var count = 0;
        list.empty();

        for (index = 0, count = tasks.length; index < count; ++index) {
            var task = tasks[index];
            var newLi = $("<li>");
            newLi.on("tap", createTapHandler(index));
            newLi.append(task.title);
            list.append(newLi);
        }

        list.listview('refresh');
    };

    var syncStorage = function syncStorage() {
        localStorage[TASKS_KEY] = JSON.stringify(tasks);
    };

    var fillForm = function fillForm() {
        var task = tasks[currentTaskIndex];
        $("#taskName").val(task.title);
        $("#taskDescription").val(task.description);

        var flip = $("#taskCompleted");
        var value = (task.done) ? 1 : 0;
        flip[0].selectedIndex = value;
        flip.slider("refresh");
    };

    var updateTask = function() {
        var task = tasks[currentTaskIndex];
        task.title = $("#taskName").val();
        task.description = $("#taskDescription").val();
        task.done = ($("#taskCompleted").val() === "yes");
    };

    var removeCurrentTask = function removeCurrentTask() {
        tasks.splice(currentTaskIndex, 1);
    };

    return {
        init: function () {
            loadTasks();
        },

        displayTask: function() {
            fillForm();
        },

        saveTask: function() {
            updateTask();
            syncStorage();
            $.mobile.changePage("index.html", { reverse: true });
        },

        setCurrentTask: function (index) {
            currentTaskIndex = index;
        },

        refreshTasks: function () {
            displayTasks();
        },

        addTask: function(task) {
            console.log("adding a task");
            currentTaskIndex = tasks.length;
            tasks.push(task);
            syncStorage();
        },

        removeTask: function(task) {
            console.log("removing a task");
            removeCurrentTask();
            syncStorage();
            $.mobile.changePage("index.html", { reverse: true });
        },

        getTasks: function() {
            console.log("returning all tasks");
            return tasks;
        }
    };

}();


MyTaskListApp.Task = function () {
    this.done = false;
    this.title = "New task";
    this.description = "Empty description";
    this.dueDate = new Date();
};



$("#indexPage").live("pageinit", function () {
    MyTaskListApp.init();

    $("#addTaskButton").on("click", function () {
        var newTask = new MyTaskListApp.Task();
        MyTaskListApp.addTask(newTask);
    });
});

$("#indexPage").live("pageshow", function () {
    MyTaskListApp.refreshTasks();
});

$("#formPage").live("pageinit", function () {
    $("#saveButton").on("tap", function() {
        MyTaskListApp.saveTask();
    });
});

$("#formPage").live("pagebeforeshow", function () {
    MyTaskListApp.displayTask();
});

$("#deletePage").live("pageinit", function () {
    $("#confirmButton").on("tap", function() {
        MyTaskListApp.removeTask();
    });
});


