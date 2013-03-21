
/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  socket = require('./routes/socket.js'),
  http = require('http');

//var privateKey  = fs.readFileSync('sslcert/server.key').toString();
//var certificate = fs.readFileSync('sslcert/server.crt').toString();

//var credentials = {key: privateKey, cert: certificate};

var app = module.exports = express();
var server = http.createServer(app);

// Hook Socket.io into Express
var io = require('socket.io').listen(server);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);


// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Socket.io Communication

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

io.sockets.on('connection', socket);

// Start server

var port = process.env.PORT || 5000;
server.listen(port, function() {
  console.log("Listening on " + port);
});