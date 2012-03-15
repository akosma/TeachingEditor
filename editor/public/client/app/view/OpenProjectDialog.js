Ext.define('TeachingEditor.view.OpenProjectDialog', {
    extend: 'Ext.window.Window',

    height: 250,
    width: 400,
    layout: {
        type: 'border'
    },
    title: 'Open Project',
    modal: true,
    resizable: false,
    refresh: function () {
        var dataview = Ext.getCmp('projectlist');
        dataview.getStore().load();
    },

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                id: 'projectlist',
                xtype: 'dataview',
                tpl: [
                    '<tpl for="."><div style="padding: 10px">{name}</div></tpl>'
                ],
                itemSelector: 'div',
                region: 'center',
                store: 'ProjectStore',
                autoScroll: true,
                singleSelect: true,
                trackOver: true,
                overItemCls: 'projecthighlight',
                selectedItemCls: 'selectedproject'
            }
            ],
            dockedItems: [
                {
                xtype: 'toolbar',
                width: 150,
                region: 'west',
                dock: 'bottom',
                items: [{
                        xtype: 'tbspacer',
                        width: 230
                    },
                    {
                        xtype: 'button',
                        width: 75,
                        text: 'OK',
                        disabled: true,
                        action: 'openSelectedProject',
                        id: 'openSelectedProjectButton'
                    },
                    {
                        xtype: 'button',
                        width: 75,
                        text: 'Cancel',
                        action: 'cancelOpenProject'
                    }]
            }]
        });

        me.callParent(arguments);
    }

});

