// requirements / imports
var express = require('express');
var socketio = require('socket.io');
var path = require('path');
var fs = require('fs');
var http = require('http');
// var sockRouter = require('socket.io-router');

// routes
var routes = require('../routes/routes.js');

var app = express();
app.set('views', path.join(__dirname, '../views')); // ??

// this is how you use socket io with express
var server = http.createServer(app);
var io = socketio.listen(server);

// testing, testing... is this thing on?
// app.get("/", function(req, res){
//     res.send("Hello from node!");
// });

// serve public folder
app.use(express.static(path.join(__dirname, '../public')));

// serve index.html for every path
app.use(routes.index);

var port = process.env.PORT || 1234;

server.listen(port, function(){
	console.log('listening on' + port + ' ' + __dirname);
});

// require our chatserver
var ChatServer = require('./chatserver');

// initialize a new chat server
new ChatServer({io: io}).init();
