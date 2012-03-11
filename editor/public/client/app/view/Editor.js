Ext.define('TeachingEditor.view.Editor', {
    extend: 'Ext.tab.Tab',
    alias: 'widget.editorpanel',
    closable: false,
    updateStatusBar: function() {
        var editor = this.editor;
        var statusBar = Ext.getCmp('statusBar');
        var cursor = editor.getSession().getSelection().getCursor();
        var column = cursor.column;
        var row = cursor.row;
        var statusTexts = [
            '<span class="statusBar">',
            'Row: ',
            row + 1,
            '</span>',
            '<span class="statusBar">',
            'Column: ',
            column + 1,
            '</span>',
            '<span class="statusBar">',
            'Font size: ',
            this.preferences.fontSize,
            '</span>',
            '<span class="statusBar">',
            'Theme: ',
            this.preferences.theme,
            '</span>'
        ];
        statusBar.update(statusTexts.join(""));
    },
    updatePreferences: function() {
        var editor = this.editor;
        var readonly = this.preferences.readonly;
        editor.setFontSize(this.preferences.fontSize + "px");
        editor.setTheme("ace/theme/" + this.preferences.theme.toLowerCase().replace(/ /g, '_'));
        editor.setReadOnly(readonly);
        this.updateStatusBar();
    },
    loadFileContents: function(callback) {
        var self = this;
        Ext.Ajax.request({
            url: '/app/file',
            params: {
                filename: this.path
            },
            method: 'GET',
            success: function(response) {
                var text = response.responseText;
                self.editor.getSession().setValue(text);
                if (callback) {
                    callback(response);
                }
            }
        });
    },
    constructor: function(obj) {
        this.callParent();

        if (obj.filename && obj.path && obj.preferences) {
            this.filename = obj.filename;
            this.path = obj.path;
            this.preferences = obj.preferences;
            this.id = 'editor' + this.filename.replace(/\./g, '_');
            this.title = obj.filename;
            this.closable = !obj.preferences.readonly;

            this.addListener('afterrender', function (component, opts) {
                var editor = component.editor = ace.edit(this.id);

                // This are the contents of the file loaded
                editor.getSession().setValue("loading '" + component.filename + "'");
                editor.getSession().setUseSoftTabs(true);

                component.updatePreferences();

                component.loadFileContents(function(response) {
                    // This depends on the filename extension, of course
                    if (component.filename.endsWith('js')) {
                        var JavaScriptMode = require("ace/mode/javascript").Mode; 
                        editor.getSession().setMode(new JavaScriptMode());
                    }
                    else if (component.filename.endsWith('html')) {
                        var HtmlMode = require("ace/mode/html").Mode; 
                        editor.getSession().setMode(new HtmlMode());
                    }
                    else if (component.filename.endsWith('css')) {
                        var CssMode = require("ace/mode/css").Mode; 
                        editor.getSession().setMode(new CssMode());
                    }

                    // Update the status bar with the cursor information
                    editor.getSession().selection.on('changeCursor', function () {
                        component.updateStatusBar();
                    });

                    // This makes the file save itself automatically
                    // every time the buffer is modified
                    editor.getSession().on('change', function () {
                        if (editor.saveTimeout) {
                            clearTimeout(editor.saveTimeout);
                        }
                        editor.saveTimeout = setTimeout(function () {
                            editor.saveTimeout = null;
                            Ext.Ajax.request({
                                url: '/app/file',
                                params: {
                                    filename: component.path,
                                    data: editor.getSession().getValue()
                                },
                                method: 'POST',
                                success: function(response){
                                    if (editor.updateTimeout) {
                                        clearTimeout(editor.updateTimeout);
                                    }
                                    editor.updateTimeout = setTimeout(function update() {
                                        editor.updateTimeout = null;
                                        var mainProjectFrame = document.getElementById('mainProjectFrame');
                                        mainProjectFrame.src = mainProjectFrame.src;

                                        // Restore the focus on the editor when
                                        // the iframe is loaded... With jQuery
                                        // Mobile this is required.
                                        mainProjectFrame.onload = function() {
                                            editor.focus();
                                        };

                                        component.fireEvent('editorupdated', component);
                                    }, 200);
                                }
                            });
                        }, 500);
                    });
                }
            );
        });
    }

    return this;
}
});

