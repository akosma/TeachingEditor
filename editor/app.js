var express = require('express');
var routes = require('./routes');

var app = module.exports = express.createServer();

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

app.get('/app', routes.app); // used by the <iframe> in the client app
app.get('/app/projects', routes.projects); // list of available projects
app.get('/app/project', routes.project); // list of files of a particular project
app.get('/app/file', routes.file); // request a particular file
app.post('/app/file', routes.updatefile); // update the contents of a particular file
app.get('/app/ip', routes.ipaddress); // return the current IP address for sharing

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

