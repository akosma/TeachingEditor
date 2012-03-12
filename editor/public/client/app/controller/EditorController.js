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

            'menuitem[action=downloadProject]': {
                click: this.downloadProject
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

            'button[action=showAboutBox]': {
                click: this.showAboutBox
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
                resize: this.editorResize,
                editorupdated: this.editorUpdated
            }
        });
    },

    onLaunch: function(app) {
        var self = this;
        Ext.Ajax.request({
            url: '/app/ip',
            method: 'GET',
            success: function(response){
                var text = response.responseText;
                var array = JSON.parse(text);
                self.ipaddress = array[0];
                self.socket = io.connect('http://' + self.ipaddress);

                Ext.Ajax.request({
                    url: '/app/local',
                    method: 'GET',
                    success: function(response) {
                        var text = response.responseText;
                        var obj = JSON.parse(text);
                        var local = obj.local;
                        self.setPreference('readonly', !local);

                        if (local) {
                            // This happens in the teacher console
                            self.teacher = true;

                            // When a new student connects, tell 
                            self.socket.on('new student', function(data) {
                                if (self.currentProject) {
                                    var editorTabPanel = Ext.getCmp('editorTabPanel');
                                    var items = [];
                                    editorTabPanel.items.each(function (item) {
                                        items.push({
                                            path: item.path,
                                            filename: item.filename
                                        });
                                    });

                                    self.socket.emit('initialize student', { 
                                        projectName: self.currentProject,
                                        files: items
                                    });
                                }
                            });
                        }
                        else {
                            // This happens in the students console
                            self.teacher = false;

                            // set menus as disabled
                            var menuItems = [
                                'openProjectMenu',
                                'closeProjectMenu',
                                'shareOptionsButton'
                            ];
                            for (var index = 0, length = menuItems.length; index < length; ++index) {
                                var itemName = menuItems[index];
                                var item = Ext.getCmp(itemName);
                                item.setDisabled(true);
                            }

                            // Register to receive notifications
                            self.socket.on('open project', function(data) {
                                var projectName = data.projectName;
                                self.openProject(projectName);
                            });
                            self.socket.on('open file', function(data) {
                                var filename = data.filename;
                                var path = data.path;
                                self.openFilename(filename, path);
                            });
                            self.socket.on('file selected', function(data) {
                                var path = data.path;
                                var tab = self.openFiles[path];
                                var editorTabPanel = Ext.getCmp('editorTabPanel');
                                editorTabPanel.setActiveTab(tab);
                            });
                            self.socket.on('file updated', function(data) {
                                console.log(data);
                                var path = data.path;
                                var tab = self.openFiles[path];
                                var position = tab.editor.getSession().getSelection().getCursor();
                                tab.loadFileContents(function () {
                                    tab.editor.gotoLine(position.row + 1);

                                    // Load index.html in the <iframe>
                                    var mainProjectFrame = document.getElementById('mainProjectFrame');
                                    mainProjectFrame.src = mainProjectFrame.src;
                                });
                            });
                            self.socket.on('initialize student', function(data) {
                                if (!self.initialized) {
                                    self.initialized = true;

                                    // Open the project
                                    var projectName = data.projectName;
                                    self.openProject(projectName);

                                    // Restore any open files
                                    var files = data.files;
                                    for (var index = 0, length = files.length; index < length; ++index) {
                                        var obj = files[index];
                                        self.openFilename(obj.filename, obj.path);
                                    }
                                }
                            });

                            // Announce that a new instance is here :)
                            self.initialized = false;
                            self.socket.emit('new student', {});     
                        }
                    }
                });
            }
        });
    },

    loadPreferences: function() {
        var storedPreferences = localStorage[this.PREFERENCES_KEY];
        if (!storedPreferences) {
            storedPreferences = {
                'fontSize': '16',
                'theme': 'Solarized Light'
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
        mainProjectFrame.src = "/projects/default";

        // This is used by the 'downloadProject' action
        this.currentProject = null;
    },

    cancelOpenProject: function(button, e, eOpts) {
        this.openProjectDialog.close();
        this.openProjectDialog = null;
    },

    openSelectedProject: function(button, e, eOpts) {
        var selectedRecord = this.openProjectDialog.selectedRecord;
        var projectName = selectedRecord.get('name');

        this.socket.emit('open project', { projectName: projectName });

        this.openProject(projectName);

        this.openProjectDialog.close();
        this.openProjectDialog = null;
    },

    openProject: function(projectName) {
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

        // Load index.html in the <iframe>
        var mainProjectFrame = document.getElementById('mainProjectFrame');
        mainProjectFrame.src = "/projects/" + projectName;

        // This is used by the 'downloadProject' action
        this.currentProject = projectName;
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
            var filename = record.get('text');
            var path = record.get('description');
            this.openFilename(filename, path);

            if (this.teacher) {
                // Notify all connected students
                this.socket.emit('open file', { 
                    filename: filename, 
                    path: path
                });
            }
        }
    },

    openFilename: function(filename, path) {
        var editorTabPanel = Ext.getCmp('editorTabPanel');
        var tab = this.openFiles[path];

        if (!tab) {
            tab = Ext.create('TeachingEditor.view.Editor', { 
                filename: filename,
                path: path,
                preferences: this.loadPreferences()
            });
            editorTabPanel.add(tab);
            this.openFiles[path] = tab;
        }

        editorTabPanel.setActiveTab(tab);
    },

    treePanelReady: function(view, eOpts) {
        view.expandAll();
    },

    editorActivate: function(component, opts) {
        this.currentEditor = component;
        component.editor.resize();
        component.editor.focus();
        component.updateStatusBar();

        if (this.teacher) {
            // Notify all connected students
            this.socket.emit('file selected', { 
                filename: component.filename, 
                path: component.path
            });
        }
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
        var message = [
            '<pre align="center" style="font-size: 28pt; color: black;">',
            'http://',
            this.ipaddress,
            ':3000/',
            '</pre>'
        ];

        Ext.MessageBox.alert("Follow this sample live!", message.join(""));
    },

    showAboutBox: function(button, e, eOpts) {
        var message = [
            'Teaching Editor 1.0',
            'by Adrian Kosmaczewski',
            '',
            'Copyright © 2012 akosma software',
            'All Rights Reserved'
        ];
        Ext.MessageBox.alert('About this app', message.join("<br>"));
    },

    editorUpdated: function(component) {
        if (this.teacher) {
            // Notify all connected clients
            this.socket.emit('file updated', { 
                filename: component.filename, 
                path: component.path
            });
        }
    },

    downloadProject: function(item, e, eOpts) {
        if (this.currentProject) {
            var downloadFrame = document.getElementById('downloadFrame');
            downloadFrame.src = '/app/zip?projectName=' + this.currentProject;
        }
    }
});

