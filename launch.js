#!/usr/bin/env node

// The inspiration for this script came from
// http://dailyjs.com/2012/03/01/unix-node-arguments/

var spawn = require('child_process').spawn;

// Execute the application
var node  = spawn('node', ['editor/app.js']);

node.stdout.on('data', function (data) {
  console.log('stdout: ' + data);
});

node.stderr.on('data', function (data) {
  console.log('stderr: ' + data);
});

node.on('exit', function (code) {
  console.log('child process exited with code ' + code);
});

var parameter = process.argv[2];

if (parameter === 'fluid') {
    // Open a browser window after a couple of milliseconds
    setTimeout(function () {
        var app = spawn('open', ['/Applications/Teaching\ Editor.app']);
    }, 200);
}
else {
    // Open a browser window after a couple of milliseconds
    setTimeout(function () {
        var browser = spawn('open', ['http://localhost:3000/']);
    }, 200);
}

