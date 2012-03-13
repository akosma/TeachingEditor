#!/usr/bin/env node

// The inspiration for this script came from
// http://dailyjs.com/2012/03/01/unix-node-arguments/

var spawn = require('child_process').spawn;
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

setTimeout(function () {
    var browser = spawn('open', ['http://localhost:3000/']);
}, 200);

