var MainController = function(){

	var self = this;

	// create event bus for socket client
	self.appEventBus = _.extend({}, Backbone.Events);
	// create event bus for backbone views
	self.viewsEventBus = _.extend({}, Backbone.Events);

	// create chat client and connect
	self.chatClient = new ChatClient({vent: self.appEventBus});
	self.chatClient.connect();

	// Creating the chat message collection
	self.chatCollection = new ChatCollection();
	// Creating the online users collection
	self.onlineUsers = new OnlineUsers();

	// Creating the chat messages view
	self.messagesView = new ChatMessagesView({
		vent: self.viewsEventBus,
		collection: self.chatCollection,
		el: $(".chat-messages-wrapper")
	});

	// Creating the form view
	self.chatForm = new ChatFormView({
		vent: self.viewsEventBus,
		collection: self.chatCollection,
		el: $(".chat-form-wrapper")
	}).render();

	// Creating the login view
	self.loginView = new LoginView({
		vent: self.viewsEventBus,
		el: $("#login")
	});

	// Creating the online users view
	self.onlineUsersView = new OnlineUsersView({
		vent: self.viewsEventBus,
		collection: self.onlineUsers,
		el: $(".online-users-wrapper")
	}).render();

	self.viewsEventBus.on("login", function(input){
		//chat client login
		self.chatClient.login(input.username);
	});

	// triggered by "send" button on chat form
	self.viewsEventBus.on("chat", function(chat){
		// tell the chatClient to send chat to server
		self.chatClient.chat(chat);
	});

	// triggered by socketclient when new chat broadcasted
	self.appEventBus.on("chat", function(chat){
		// bring this function in from the model...?
		self.chatCollection.add(chat);
		// console.log(chat);
	}.bind(this));

	self.appEventBus.on("loginSuccess", function(data){
		// hide the login form
		$("#login").hide();
	});

	self.appEventBus.on("onlineUsers", function(users){
		var userModels = [];
		for (var i=0; i < users.length; i++) {
			user = new User({name:users[i]});
			userModels.push(user);
		}
		self.onlineUsers.reset(userModels);
	}.bind(this));

	self.appEventBus.on("userLeft", function(username){
		self.onlineUsers.removeUser(username);
	});

	self.appEventBus.on("userJoined", function(username){
		self.onlineUsers.add({name: data.username});
	});

};


$(document).ready(function(){
	var mainController = new MainController();
});

