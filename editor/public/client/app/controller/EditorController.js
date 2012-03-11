Ext.define('TeachingEditor.controller.EditorController', {
    extend: 'Ext.app.Controller',
    PREFERENCES_KEY: 'PREFERENCES_KEY',

    config:{
        refs: []
    },

    init: function() {
        this.control({
            'menuitem[action=changeEditorFontSize]': {
                click: this.changeEditorFontSize
            },

            'menuitem[action=changeEditorTheme]': {
                click: this.changeEditorTheme
            },

            'menuitem[action=showOpenProjectDialog]': {
                click: this.showOpenProjectDialog
            },

            'menuitem[action=closeProject]': {
                click: this.closeProject
            },

            'button[action=cancelOpenProject]': {
                click: this.cancelOpenProject
            },

            'button[action=openSelectedProject]': {
                click: this.openSelectedProject
            },

            'button[action=showShareOptions]': {
                click: this.showShareOptions
            },

            '#projectlist': {
                itemclick: this.projectListSingleClick,
                itemdblclick: this.projectListDoubleClick
            },

            '#projectStructurePanel': {
                itemclick: this.openFile,
                viewready: this.treePanelReady
            },

            'editorpanel': {
                activate: this.editorActivate,
                beforeclose: this.editorBeforeClose,
                resize: this.editorResize
            }
        });
    },

    loadPreferences: function() {
        var storedPreferences = localStorage[this.PREFERENCES_KEY];
        if (!storedPreferences) {
            storedPreferences = {
                'fontSize': '16',
                'theme': 'TextMate'
            };
            localStorage[this.PREFERENCES_KEY] = JSON.stringify(storedPreferences);
        }
        else {
            storedPreferences = JSON.parse(storedPreferences);
        }
        return storedPreferences;
    },

    savePreferences: function(preferences) {
        localStorage[this.PREFERENCES_KEY] = JSON.stringify(preferences);
    },

    setPreference: function(key, value) {
        var preferences = this.loadPreferences();
        preferences[key] = value;
        this.savePreferences(preferences);
    },

    getPreference: function(key) {
        var preferences = this.loadPreferences();
        return preferences[key];
    },

    changeEditorFontSize: function(item, e, eOpts) {
        if (this.currentEditor) {
            this.setPreference('fontSize', item.text);
            this.currentEditor.preferences = this.loadPreferences();
            this.currentEditor.updatePreferences();
        }
    },

    changeEditorTheme: function(item, e, eOpts) {
        if (this.currentEditor) {
            this.setPreference('theme', item.text);
            this.currentEditor.preferences = this.loadPreferences();
            this.currentEditor.updatePreferences();
        }
    },

    showOpenProjectDialog: function(item, e, eOpts) {
        if (!this.openProjectDialog) {
            this.openProjectDialog = Ext.create('TeachingEditor.view.OpenProjectDialog');
        }
        this.openProjectDialog.show();
        this.openProjectDialog.refresh();
    },

    closeProject: function(item, e, eOpts) {
        var statusBar = Ext.getCmp('statusBar');
        statusBar.update("");

        var editorTabPanel = Ext.getCmp('editorTabPanel');
        editorTabPanel.removeAll();
        this.openFiles = {};

        var treePanel = Ext.getCmp('projectStructurePanel');
        treePanel.getRootNode().removeAll();
        treePanel.setTitle("Project Structure");

        // Load index.html in the <iframe>
        var mainProjectFrame = document.getElementById('mainProjectFrame');
        mainProjectFrame.src = "/app";
    },

    cancelOpenProject: function(button, e, eOpts) {
        this.openProjectDialog.close();
        this.openProjectDialog = null;
    },

    openSelectedProject: function(button, e, eOpts) {
        var selectedRecord = this.openProjectDialog.selectedRecord;
        var projectName = selectedRecord.get('name');

        this.closeProject();

        var projectStore = Ext.data.StoreManager.lookup('ProjectTreeStore');
        var proxy = projectStore.getProxy();
        proxy.extraParams = {
            projectName: projectName
        };

        // Required as per Ext.js bug:
        // http://www.sencha.com/forum/showthread.php?154059-4.0.7-TreePanel-Error-when-reloading-the-treeStore
        projectStore.clearOnLoad = true;
        projectStore.load();

        var treePanel = Ext.getCmp('projectStructurePanel');
        treePanel.setTitle(projectName);

        this.openProjectDialog.close();
        this.openProjectDialog = null;

        // Load index.html in the <iframe>
        var mainProjectFrame = document.getElementById('mainProjectFrame');
        mainProjectFrame.src = "/projects/" + projectName;
    },

    projectListSingleClick: function (view, record, element, index, event, eOpts) {
        if (!this.task) {
            var self = this;
            this.task = new Ext.util.DelayedTask(function() {
                self.openProjectDialog.selectedRecord = record;
                var button = Ext.getCmp('openSelectedProjectButton');
                button.setDisabled(false);
                self.task = null;
            });
            this.task.delay(200);
        }
    },

    projectListDoubleClick: function (view, record, element, index, event, eOpts) {
        if (this.task) {
            this.task.cancel();
            this.task = null;
        }
        this.openProjectDialog.selectedRecord = record;
        this.openSelectedProject();
    },

    openFile: function (view, record, element, index, event, eOpts) {
        if (record.get('leaf')) {

            var editorTabPanel = Ext.getCmp('editorTabPanel');
            var filename = record.get('filename');
            var path = record.get('description');
            var tab = this.openFiles[path];

            if (!tab) {
                tab = Ext.create('TeachingEditor.view.Editor', { 
                    filename: record.get('text'),
                    path: record.get('description'),
                    preferences: this.loadPreferences()
                });
                editorTabPanel.add(tab);
                this.openFiles[path] = tab;
            }

            editorTabPanel.setActiveTab(tab);
        }
    },

    treePanelReady: function(view, eOpts) {
        view.expandAll();
    },

    editorActivate: function(component, opts) {
        this.currentEditor = component;
        component.editor.resize();
        component.editor.focus();
        component.updateStatusBar();
    },

    editorBeforeClose: function(component, opts) {
        if (component === this.currentEditor) {
            this.currentEditor = null;
        }
        delete this.openFiles[component.path];
    },

    editorResize: function(component, opts) {
        if (this.currentEditor) {
            this.currentEditor.editor.resize();
        }
    },

    showShareOptions: function(button, e, eOpts) {
        Ext.Ajax.request({
            url: '/app/ip',
            method: 'GET',
            success: function(response){
                var text = response.responseText;
                var array = JSON.parse(text);
                var ip = array[0];

                var message = [
                    '<pre align="center" style="font-size: 28pt; color: black;">',
                    'http://',
                    ip,
                    ':3000/',
                    '</pre>'
                ];

                Ext.MessageBox.alert("See this sample!", message.join(""));
            }
        });

    }
});

