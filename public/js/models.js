// Models and Collections

var User = Backbone.Model.extend({
	name: ''
});

var OnlineUsers = Backbone.Collection.extend({
	model: User,
	removeUser: function(username){
		var u = this.find(function(item){
			// looks at 'name' property of each User model in the collection
			return item.get('name') == username;
			});
		if (u){
			this.remove(u);
		}
	}
});

var ChatMessage = Backbone.Model.extend({
	defaults: {
		sender: "",
		text: "",
		time: (new Date()).getTime()
	},
	getPurified: function(){
		var cleanText = this.get("text").replace(/shit|damn|crap|fuck/, '****');
		this.set('text', cleanText);
		return cleanText;
	},
	initialize: function(model){
		this.getPurified();
	}
});

var ChatCollection = Backbone.Collection.extend({
	model: ChatMessage,
	comparator: function(message){
		return message.get("time");
	}
});

