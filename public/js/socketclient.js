// Defines interaction with socket.io

var ChatClient = function(options){
	// redefine this to avoid conflicts
	var self = this;

	// app event bus
	self.vent = options.vent;

	self.hostname = "http://" + window.location.host;

	// connects to the server
	self.connect = function() {
		//connect to the host
		self.socket = io.connect(self.hostname);
		// set listeners to respond to server events
		self.setResponseListeners(self.socket);
	};

	// send login message
	self.login = function(name) {
		// emit sends messages to the server
		self.socket.emit('login', name);
	};
 
	// send chat message
	self.chat = function(chat) {
		self.socket.emit('chat',chat);
	};

	self.setResponseListeners = function(socket){
		// reacts to loginSuccess message from server
		socket.on('loginSuccess', function(username){
			self.vent.trigger('loginSuccess', username);
			self.socket.emit('onlineUsers');
		});

		socket.on('onlineUsers', function(onlineUsers){
			self.vent.trigger('onlineUsers', onlineUsers);
		});

		// receives/reacts to new chat from server
		socket.on('chat', function(data){
			self.vent.trigger('chat', data);
		});

		socket.on('userLeft', function(user){
			self.vent.trigger('userLeft', user);
		});

	};
};

