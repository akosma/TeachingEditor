Ext.define('TeachingEditor.store.ProjectTreeStore', {
    extend: 'Ext.data.TreeStore',
    requires: [
        'TeachingEditor.model.File'
    ],

    // Required as per Ext.js bug:
    // http://www.sencha.com/forum/showthread.php?154059-4.0.7-TreePanel-Error-when-reloading-the-treeStore
    load: function(options) {
        options = options || {};
        options.params = options.params || {};

        var me = this,
        node = options.node || me.tree.getRootNode(),
        root;

        // If there is not a node it means the user hasnt defined a rootnode yet. In this case lets just
        // create one for them.
        if (!node) {
            node = me.setRootNode({
                expanded: true
            });
        }

        if (me.clearOnLoad) {
            // this is what we changed.  added false
            node.removeAll(false);
        }

        Ext.applyIf(options, {
            node: node
        });
        options.params[me.nodeParam] = node ? node.getId() : 'root';

        if (node) {
            node.set('loading', true);
        }

        return me.callParent([options]);
    },

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            storeId: 'ProjectTreeStore',
            model: 'TeachingEditor.model.File',
            root: {}, // http://www.sencha.com/forum/showthread.php?158113-TreeStore-with-proxy-duplicate-list !!!
            collapsed: false,
            proxy: {
                type: 'ajax',
                url: '/app/project',
                reader: {
                    type: 'json'
                }
            },
            autoLoad: false
        }, cfg)]);
    }
});
