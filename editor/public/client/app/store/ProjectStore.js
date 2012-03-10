Ext.define('TeachingEditor.store.ProjectStore', {
    extend: 'Ext.data.Store',
    requires: [
        'TeachingEditor.model.Project'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            storeId: 'ProjectStore',
            model: 'TeachingEditor.model.Project',
            sorters: ['name'],
            proxy: {
                type: 'ajax',
                url: '/app/projects',
                reader: {
                    type: 'json',
                    root: 'projects'
                }
            },
            autoLoad: true
        }, cfg)]);
    }
});

