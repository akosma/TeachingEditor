Ext.define('TeachingEditor.model.File', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'text', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'root', type: 'boolean' },
        { name: 'leaf', type: 'boolean' }
    ]
});

