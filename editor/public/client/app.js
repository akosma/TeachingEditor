Ext.Loader.setConfig({
    enabled: true
});

Ext.application({
    models: [
        'Project',
        'File'
    ],
    stores: [
        'ProjectStore',
        'ProjectTreeStore'
    ],
    controllers: [
        'EditorController'
    ],
    views: [
        'OpenProjectDialog'
    ],
    autoCreateViewport: true,
    name: 'TeachingEditor',

    launch: function() {

        // Taken from
        // http://stackoverflow.com/questions/280634/endswith-in-javascript        
        String.prototype.endsWith = function(suffix) {
            return this.indexOf(suffix, this.length - suffix.length) !== -1;
        };

        Array.prototype.remove = function() {
            var what, a = arguments, l = a.length, ax;
            while(l && this.length) {
                what = a[l -= 1];
                while((ax = this.indexOf(what)) != -1) {
                    this.splice(ax, 1);
                }
            }
            return this;
        };

        var editorTabPanel = Ext.getCmp('editorTabPanel');
        var tabs = editorTabPanel.items;

        var map = Ext.create('Ext.util.KeyMap', Ext.getBody(), [{
            key: Ext.EventObject.LEFT,
            shift: false,
            alt: true,
            ctrl: true,
            fn: function() {
                var length = tabs.getCount();
                if (length > 0) {
                    var currentTab = editorTabPanel.getActiveTab();
                    var currentIndex = tabs.indexOf(currentTab);
                    var nextIndex = currentIndex - 1;
                    if (nextIndex >= 0) {
                        var nextTab = tabs.getAt(nextIndex);
                        editorTabPanel.setActiveTab(nextTab);
                    }
                }
            }
        }, {
            key: Ext.EventObject.RIGHT,
            shift: false,
            alt: true,
            ctrl: true,
            fn: function() {
                var length = tabs.getCount();
                if (length > 0) {
                    var currentTab = editorTabPanel.getActiveTab();
                    var currentIndex = tabs.indexOf(currentTab);
                    var nextIndex = currentIndex + 1;
                    if (nextIndex < length) {
                        var nextTab = tabs.getAt(nextIndex);
                        editorTabPanel.setActiveTab(nextTab);
                    }
                }
            }
        }]);
    }
});

