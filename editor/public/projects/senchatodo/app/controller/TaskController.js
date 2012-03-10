Ext.define('ToDoListApp.controller.TaskController', {
    extend: 'Ext.app.Controller',

    config:{
        id: 'taskController',
        refs: {
            taskList: '#taskList',
            taskForm: '#taskForm',
            taskFormDeleteFieldset: '#taskFormDeleteFieldset',
            createTaskButton: 'button[action=createTask]',
            cancelButton: 'button[action=cancel]',
            saveButton: 'button[action=saveTask]',
            deleteButton: 'button[action=deleteTask]'
        },

        control: {
            createTaskButton: {
                tap: 'createTask'
            },

            taskList: {
                itemtap: 'showTask',
                disclose: 'changeDoneStatus'
            },

            cancelButton: {
                tap: 'cancel'
            },

            saveButton: {
                tap: 'saveTask'
            },

            deleteButton: {
                tap: 'deleteTask'
            }
        }
    },

    createTask: function (button, e, eOpts) {
        // Create a new task
        var task = Ext.create('ToDoListApp.model.Task', {
            title: "",
            description: "",
            completed: false,
            dueDate: new Date()
        });

        this.getTaskForm().setRecord(task);

        this.showForm();

        // Scroll to the top of the form panel
        this.getTaskForm().getScrollable().getScroller().scrollTo(0, 0);

        // Show the delete button
        this.getTaskFormDeleteFieldset().setHidden(true);
    },

    showTask: function(list, index, target, task, e, eOpts) {

        // To avoid this event from being fired when the 
        // disclosure button is touched...
        if (e.getTarget('.x-list-disclosure')) {
            return;
        }

        // Scroll to the top of the form panel
        this.getTaskForm().getScrollable().getScroller().scrollTo(0, 0);
        this.getTaskForm().setRecord(task);

        // Hide the delete button (this is a new task, after all)
        this.getTaskFormDeleteFieldset().setHidden(false);

        this.showForm();

        // Deselect the item on the list (why doesn't this happen
        // automatically?)
        setTimeout(function () {
            list.deselect(index);
        }, 500);
    },

    saveTask: function(button, e, eOpts) {
        // Update the task with the data from the form
        var store = this.getTaskList().getStore();
        var task = this.getTaskForm().getRecord();
        this.getTaskForm().updateRecord(task);

        // If the task is not part of the store, add it 
        if (null === store.findRecord("id", task.get("id"))) {
            store.add(task);
        }

        this.showList();
    },

    deleteTask: function (button, e, eOpts) {
        // Ask the user if he really wants to do this!
        Ext.Msg.confirm("Delete this task?", "", function (answer) {
            if (answer === "yes") {
                // Remove the task from the store
                var task = this.getTaskForm().getRecord();
                this.getTaskList().getStore().remove(task);

                this.showList();
            }
        }, this);
    },

    cancel: function (button, e, eOpts) {
        this.showList();
    },

    showList: function () {
        // Go to the list, sliding to the left
        Ext.Viewport.getLayout().setAnimation({
            type: 'slide',
            direction: 'right'
        });
        Ext.Viewport.setActiveItem(this.getTaskList());
    },

    showForm: function() {
        // In beta builds of Sencha Touch 2, we have to do this manually:
        // http://www.sencha.com/forum/showthread.php?160114-How-to-make-a-Sliding-animation-with-setActiveItem()-in-Sencha-Touch-2.0.0
        Ext.Viewport.getLayout().setAnimation({
            type: 'slide',
            direction: 'left'
        });
        Ext.Viewport.setActiveItem(this.getTaskForm());
    },

    changeDoneStatus: function (list, task, target, index, e, eOpts) {
        var value = task.get('completed');
        task.set('completed', !value);
    }
});

