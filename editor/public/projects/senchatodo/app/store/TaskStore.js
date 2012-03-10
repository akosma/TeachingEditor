Ext.define('ToDoListApp.store.TaskStore', {
    extend: 'Ext.data.Store',
    requires: [
        'ToDoListApp.model.Task'
    ],

    config: {
        model: 'ToDoListApp.model.Task',
        sorters: [{
            property: "dueDate",
            direction: "ASC"
        }],
        autoLoad: true,
        autoSync: true,
        singleton: true,
        storeId: 'TaskStore',
        proxy: {
            type: 'localstorage',
            id: "senchatasks"
        },
        grouper: function(record) {
            if (record && record.get("dueDate")) {
                return record.get("dueDate").toDateString();
            }
        }
    }
});

