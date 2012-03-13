Ext.define('TeachingEditor.view.Viewport', {
    extend: 'Ext.container.Viewport',
    renderTo: Ext.getBody(),
    layout: {
        type: 'border'
    },
    items: [{
        xtype: 'tabpanel',
        id: 'editorTabPanel',
        border: false,
        region: 'center'
    },
    {
        xtype: 'toolbar',
        id: 'mainToolbar',
        height: 30,
        enableOverflow: true,
        region: 'north',
        border: false,
        items: [
            {
            xtype: 'button',
            text: 'File',
            menu: {
                xtype: 'menu',
                items: [
                    {
                    xtype: 'menuitem',
                    text: 'Open...',
                    action: 'showOpenProjectDialog',
                    id: 'openProjectMenu'
                },
                {
                    xtype: 'menuitem',
                    text: 'Download Project',
                    action: 'downloadProject',
                    id: 'downloadProjectMenu'
                },
                {
                    xtype: 'menuitem',
                    text: 'Close Project',
                    action: 'closeProject',
                    id: 'closeProjectMenu'
                }
                ]
            }
        },
        {
            xtype: 'button',
            text: 'Editor',
            menu: {
                xtype: 'menu',
                items: [
                    {
                    xtype: 'menuitem',
                    text: 'Font Size',
                    menu: {
                        xtype: 'menu',
                        items: [
                            {
                            xtype: 'menuitem',
                            text: '12',
                            action: 'changeEditorFontSize'
                        },
                        {
                            xtype: 'menuitem',
                            text: '13',
                            action: 'changeEditorFontSize'
                        },
                        {
                            xtype: 'menuitem',
                            text: '14',
                            action: 'changeEditorFontSize'
                        },
                        {
                            xtype: 'menuitem',
                            text: '15',
                            action: 'changeEditorFontSize'
                        },
                        {
                            xtype: 'menuitem',
                            text: '16',
                            action: 'changeEditorFontSize'
                        },
                        {
                            xtype: 'menuitem',
                            text: '20',
                            action: 'changeEditorFontSize'
                        },
                        {
                            xtype: 'menuitem',
                            text: '24',
                            action: 'changeEditorFontSize'
                        }
                        ]
                    }
                },
                {
                    xtype: 'menuitem',
                    text: 'Theme',
                    menu: {
                        xtype: 'menu',
                        items: [
                            {
                            xtype: 'menuitem',
                            text: 'Clouds',
                            action: 'changeEditorTheme'
                        },
                        {
                            xtype: 'menuitem',
                            text: 'Clouds Midnight',
                            action: 'changeEditorTheme'
                        },
                        {
                            xtype: 'menuitem',
                            text: 'Cobalt',
                            action: 'changeEditorTheme'
                        },
                        {
                            xtype: 'menuitem',
                            text: 'Crimson Editor',
                            action: 'changeEditorTheme'
                        },
                        {
                            xtype: 'menuitem',
                            text: 'Dawn',
                            action: 'changeEditorTheme'
                        },
                        {
                            xtype: 'menuitem',
                            text: 'Eclipse',
                            action: 'changeEditorTheme'
                        },
                        {
                            xtype: 'menuitem',
                            text: 'Idle Fingers',
                            action: 'changeEditorTheme'
                        },
                        {
                            xtype: 'menuitem',
                            text: 'Kr Theme',
                            action: 'changeEditorTheme'
                        },
                        {
                            xtype: 'menuitem',
                            text: 'Merbivore',
                            action: 'changeEditorTheme'
                        },
                        {
                            xtype: 'menuitem',
                            text: 'Merbivore Soft',
                            action: 'changeEditorTheme'
                        },
                        {
                            xtype: 'menuitem',
                            text: 'Mono Industrial',
                            action: 'changeEditorTheme'
                        },
                        {
                            xtype: 'menuitem',
                            text: 'Monokai',
                            action: 'changeEditorTheme'
                        },
                        {
                            xtype: 'menuitem',
                            text: 'Pastel on Dark',
                            action: 'changeEditorTheme'
                        },
                        {
                            xtype: 'menuitem',
                            text: 'Solarized Dark',
                            action: 'changeEditorTheme'
                        },
                        {
                            xtype: 'menuitem',
                            text: 'Solarized Light',
                            action: 'changeEditorTheme'
                        },
                        {
                            xtype: 'menuitem',
                            text: 'TextMate',
                            action: 'changeEditorTheme'
                        },
                        {
                            xtype: 'menuitem',
                            text: 'Twilight',
                            action: 'changeEditorTheme'
                        },
                        {
                            xtype: 'menuitem',
                            text: 'Vibrant Ink',
                            action: 'changeEditorTheme'
                        }
                        ]
                    }
                }
                ]
            }
        },
        {
            xtype: 'button',
            text: 'Share',
            action: 'showShareOptions',
            id: 'shareOptionsButton'
        },
        {
            xtype: 'button',
            text: 'About',
            action: 'showAboutBox'
        }
        ]
    },
    {
        xtype: 'treepanel',
        width: 250,
        id: 'projectStructurePanel',
        border: false,
        collapsible: true,
        title: 'Project Structure',
        region: 'west',
        split: true,
        store: 'ProjectTreeStore',
        viewConfig: {
            width: 272
        }
    },
    {
        xtype: 'toolbar',
        height: 25,
        region: 'south',
        border: false,
        id: 'statusBar',
        html: ''
    },
    {
        xtype: 'panel',
        width: 410,
        collapsible: true,
        title: 'Preview',
        layout: 'absolute',
        region: 'east',
        border: false,
        id: 'previewPanel',
        items: [
            {
            xtype: 'panel',
            border: false,
            x: 49,
            y: 158,
            height: 460,
            width: 320,
            html: [
                '<iframe id="mainProjectFrame" src="/projects/default" style="width: 100%; height: 100%; border: 0"></iframe>',
                '<iframe id="downloadFrame" style="width: 0px; height: 0px; border: 0"></iframe>'].join("")
        },
        {
            xtype: 'button',
            x: 284,
            y: 70,
            text: 'Refresh',
            scale: 'large',
            action: 'refreshWebApp'
        }
        ]
    }
    ]

});

