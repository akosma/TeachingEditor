Ext.define('ToDoListApp.view.TaskList', {
    extend: 'Ext.dataview.List',
    requires: [
        'ToDoListApp.store.TaskStore'
    ],

    config: {
        displayField: 'title',
        id: 'taskList',
        store: Ext.create('ToDoListApp.store.TaskStore'),
        itemTpl: '<div class="task completed_{completed}">{title}</div>',
        onItemDisclosure: true,
        emptyText: '<p align="center" class="instructions">No tasks here yet.<br/>Tap the "+" button to create one.</p>',
        grouped: true,

        items: [{
            xtype: 'toolbar',
            title: 'To Do List',
            docked: 'top',
            ui: 'light',
            items: [{
                xtype: 'spacer'
            }, {
                xtype: 'button',
                ui: 'plain',
                iconCls: 'add',
                iconMask: true,
                text: '',
                action: 'createTask'
            }]
        }]
    }
});

