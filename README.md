Teaching Editor
===============

This project provides an online editor that automatically reloads the
contents of an iPhone-sized frame.

It is built with the following libraries:

- [Ace][1]
- [Ext.js][2]
- [Node.js][3]
- [Express][4]

Requirements
------------

### Server

Use [Homebrew][6] to install [Node.js][3] in your system. Also, install
[npm][9] and install [Express][4] and [Socket.IO][11] with it. You can
just type `npm install` at the `editor` folder to have all the libraries
installed automatically.

Then, download and install the required JavaScript libraries in
subfolders of the `editor/public/libs` folder:

- [Ace][1] in the `ace` folder
- [Ext.js 4.0][2] in the `extjs` folder
- [jQuery Mobile 1.0.1][7] in the `jqm` folder
- [Sencha Touch 2.0][8] in the `sencha` folder

### Client

The client has been tested successfully with the following browsers:

- Firefox 10
- Chrome 17 
- Safari 5.1
- Opera 11

Pay attention to the fact that the mobile libraries themselves might not
be compatible with some of these browsers (in particular, Sencha Touch
only works on Webkit-based browsers).

How to Use
----------

- `cd editor`
- `./launch.sh` (this script requires GNU parallel to work)
- Open http://localhost:3000/ in your browser
    - Alternatively, students can browse to the IP shown in the dialog
      of the "Share" button on the toolbar.


[1]:http://ace.ajax.org/
[2]:http://www.sencha.com/products/extjs/
[3]:http://nodejs.org/
[4]:http://expressjs.com/
[6]:http://mxcl.github.com/homebrew/
[7]:http://jquerymobile.com/
[8]:http://www.sencha.com/products/touch
[9]:http://npmjs.org/
[11]:http://socket.io/

