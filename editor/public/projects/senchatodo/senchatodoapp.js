Ext.Loader.setConfig({
    enabled: true
});

Ext.application({
    models: [
        'Task'
    ],

    controllers: [
        'TaskController'
    ],

    stores: [
        'TaskStore'
    ],

    views: [
        'TaskList',
        'TaskForm'
    ],

    name: 'ToDoListApp',

    launch: function() {
        Ext.Viewport.add([
                         Ext.create('ToDoListApp.view.TaskList'),
                         Ext.create('ToDoListApp.view.TaskForm')
        ]);
    }
});

