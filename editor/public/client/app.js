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

        // Taken from 
        // http://stackoverflow.com/questions/3954438/remove-item-from-array-by-value
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
    }
});

