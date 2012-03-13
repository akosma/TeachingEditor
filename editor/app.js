var express = require('express');
var routes = require('./routes');

var app = module.exports = express.createServer();
var io = require('socket.io').listen(app);

// Configuration

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express['static'](__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
    app.use(express.errorHandler()); 
});

// Routes

app.get('/', routes.start); // redirects the user to the app
app.get('/app/projects', routes.projects); // list of available projects
app.get('/app/project', routes.project); // list of files of a particular project
app.get('/app/file', routes.file); // request a particular file
app.post('/app/file', routes.updatefile); // update the contents of a particular file
app.get('/app/ip', routes.ipaddress); // return the current IP address for sharing
app.get('/app/local', routes.islocalrequest); // true if the app is accessed from localhost
app.get('/app/zip', routes.zipproject); // zips a project for download

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

io.sockets.on('connection', function (socket) {
    socket.on('open project', function(data) {
        socket.broadcast.emit('open project', data);
    });
    socket.on('open file', function(data) {
        socket.broadcast.emit('open file', data);
    });
    socket.on('file selected', function(data) {
        socket.broadcast.emit('file selected', data);
    });
    socket.on('file updated', function(data) {
        socket.broadcast.emit('file updated', data);
    });
    socket.on('new student', function(data) {
        socket.broadcast.emit('new student', data);
    });
    socket.on('pause sharing', function(data) {
        socket.broadcast.emit('pause sharing', data);
    });
    socket.on('resume sharing', function(data) {
        socket.broadcast.emit('resume sharing', data);
    });
    socket.on('open url', function(data) {
        socket.broadcast.emit('open url', data);
    });
    socket.on('initialize student', function(data) {
        socket.broadcast.emit('initialize student', data);
    });
});

