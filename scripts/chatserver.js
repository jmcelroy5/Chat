var User = function(args) {
	var self = this;
	// Socket field
	self.socket = args.socket;
	// username field
	self.username = args.username;
};

var Server = function(options){
  // passed from web.js: var io = socketio.listen(server);
  var self = this;
  self.io = options.io;

  // array to keep track of online users
  self.users = [];

  // initialize function (called in web.js)
  self.init = function(){
    // every Socket.io app begins with a connection handler
    self.io.on('connection', function(socket){
      self.handleConnection(socket);
    });
  };

  // waits for login event then handles login flow
  self.handleConnection = function(socket){

    // listens for "login" event from app
    socket.on('login', function(username){
      var newUser = new User({username: username, socket: socket});
      // make a new User
      self.users.push(newUser);
      // notify chat client that user is logged in
      // also send new user model 
      socket.emit('loginSuccess', username);
      // broadcast updated user list to other users
      socket.broadcast.emit('userJoined', username);
      // send welcome message to new user only
      socket.emit('chat', {text: 'Welcome to the chatroom, ' + username + '!'});
      // send notification to all other users
      socket.broadcast.emit('chat', {text: username + ' joined the chatroom.'});
      // prepare to listen to chatClient events
      self.setResponseListeners(newUser);
    });
  };

  self.setResponseListeners = function(user){
    user.socket.on("chat", function(data){
      // send chat to everyone 
      self.io.sockets.emit('chat', {text: data.text, sender: user.username});
    });

    user.socket.on("disconnect", function(){
      // remove user from serverside user list
      self.users.splice(self.users.indexOf(user), 1);
      // tell other clients that a user left
      self.io.sockets.emit('userLeft', user.username);
      // broadcast 'user left' chat
      self.io.sockets.emit('chat', {text: user.username + " has left the chatroom."});
    });

    user.socket.on("onlineUsers", function(){
      var usernames = [];
      for (var i = 0; i < self.users.length; i++) {
        usernames.push(self.users[i].username);
      }
      self.io.sockets.emit('onlineUsers', usernames);
      console.log("online users emitted: " + usernames);
    });

  };

};

module.exports = Server;

