// Sencha Touch 2
Ext.application({
    name: "FirstApp",
    launch: function () {
        Ext.Viewport.add({
            xtype: 'tabpanel',
            fullscreen: true,
            tabBarPosition: 'bottom',

            items: [
                {
                    title: "Home",
                    iconCls: 'home',
                    scrollable: true,
                    html: [
                        "<h1>Welcome!</h1>",
                        "<p>Here creating our first Sencha Touch app!</p>",
                        "<p>Enjoy!</p>"
                    ].join("")
                },

                {
                    xtype: "formpanel",
                    title: "Contact Us",
                    iconCls: 'user',
                    items: [{
                            xtype: 'fieldset',
                            title: 'Your personal data',
                            instructions: "Please provide your email!",
                            items: [{
                                    xtype: 'textfield',
                                    label: 'Name',
                                    name: 'name'
                                },{
                                    xtype: 'emailfield',
                                    label: "Email",
                                    name: 'email'
                                },{
                                    xtype: 'textareafield',
                                    label: 'Message',
                                    name: 'message'
                                }
                            
                            ]
                        }
                    ]
                
                }, {
                
                    xtype: 'nestedlist',
                    title: 'Blog',
                    iconCls: 'star',
                    displayField: 'title',

                    store: {
                        type: 'tree',
                        fields: ['title', 'link', 'author', 'contentSnippet', 'content', {
                            name: 'leaf',
                            defaultValue: true
                        }],

                        root: {
                            leaf: false
                        },

                        proxy: {
                            type: 'jsonp',
                            url: 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=http://feeds.feedburner.com/SenchaBlog',
                            reader: {
                                type: 'json',
                                rootProperty: 'responseData.feed.entries'
                            } // end of reader definition
                        } // end of the proxy definition
                    }, // end of the store definition

                    detailCard: {
                        xtype: 'panel',
                        scrollable: true,
                        styleHtmlContent: true
                    },

                    listeners: {
                        itemtap: function (nestedList, list, index, element, post) {
                            this.getDetailCard().setHtml(post.get('content'));
                        }
                    }
                }
            
            ]
        });
    }
}); 

