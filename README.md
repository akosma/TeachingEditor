Teaching Editor
===============

This project provides an online editor that automatically reloads the
contents of an iPhone-sized frame.

It is built with the following libraries:

- [Ace][1]
- [Ext.js][2]
- [Node.js][3]
- [Express][4]
- [Jade][5]

Requirements
------------

Use [Homebrew][6] to install the required libraries and utilities:

- node
- parallel

Also, install [npm][9] and install [Express][4] and [Socket.IO][11] with
it. You can just type `npm install` at the `editor` folder to have all
the libraries installed automatically.

Then, download and install the required JavaScript libraries in
subfolders of the `editor/public/libs` folder:

- [Ace][1] in the `ace` folder
- [Ext.js 4.0][2] in the `extjs` folder
- [jQuery Mobile 1.0.1][7] in the `jqm` folder
- [Sencha Touch 2.0][8] in the `sencha` folder

How to Use
----------

- `cd editor`
- `./launch.sh` (this script requires GNU parallel to work)

Alternatively, for the OS X platform, you can use the  `./mac.sh` script
to do the same, which opens an app "TeachingEditor" created with
[Fluid][10].


[1]:http://ace.ajax.org/
[2]:http://www.sencha.com/products/extjs/
[3]:http://nodejs.org/
[4]:http://expressjs.com/
[5]:http://jade-lang.com/
[6]:http://mxcl.github.com/homebrew/
[7]:http://jquerymobile.com/
[8]:http://www.sencha.com/products/touch
[9]:http://npmjs.org/
[10]:http://fluidapp.com/
[11]:http://socket.io/

