Teaching Editor
===============

This project provides an online editor that automatically reloads the
contents of an iPhone-sized frame. It also provides students with a
read-only mode, allowing them to follow in real time whatever code is
written in the screen of the teacher, and they can also download the
current state of the code at any moment.

It is built exclusively in JavaScript, using the following libraries:

- [Ace][1]
- [Ext.js][2]
- [Node.js][3]
- [Express][4]

Requirements
------------

### Server

Use [Homebrew][6] to install [Node.js][3] in your system. Also, install
[npm][9] and install [Express][4] and [Socket.IO][11] with npm.

The `install.sh` script performs all the required operations to install
external dependencies in your system.

### Client

The client has been tested successfully on several combinations of
operating systems and browsers:

- Cross-platform browsers:
    - Firefox 10
    - Chrome 17 
    - Opera 11
- OS X "Lion"
    - Safari 5.1
- Windows 7
    - Internet Explorer 9
- iOS
    - Mobile Safari for iOS 5.1 on the iPad (in this case, however,
      scrolling is not possible)

Pay attention to the fact that the mobile libraries themselves might not
be compatible with some of these browsers (in particular, Sencha Touch
only works on Webkit-based browsers).

How to Use
----------

- `./install.sh` (this will download the required libraries, only
  required once)
- `./launch.js` (this launches the Node.js app and opens a browser
  window)
- Students can browse to the IP shown in the dialog of the "Project /
  Show Share URL" menu entry.


[1]:http://ace.ajax.org/
[2]:http://www.sencha.com/products/extjs/
[3]:http://nodejs.org/
[4]:http://expressjs.com/
[6]:http://mxcl.github.com/homebrew/
[7]:http://jquerymobile.com/
[8]:http://www.sencha.com/products/touch
[9]:http://npmjs.org/
[11]:http://socket.io/

