var ChatMessagesView = Backbone.View.extend({
	tagName: "div", // default
	collection: ChatCollection,
	render: function(){
		var rendered = this.template({messages: this.collection.toJSON()});
		this.$el.html(rendered);
		return this;
	},
	initialize: function(options){
		this.vent = options.vent;
		var source = $("#chat-messages-template").html();
		this.template = Handlebars.compile(source);
		// chat container listens to changes in collection
		this.listenTo(this.collection, 'add', this.render);
	}
});

var ChatFormView = Backbone.View.extend({
	tagName: "div", //default
	render: function(){
		// set html of element to the compiled template
		this.$el.html(this.template);
		// always return this from render function
		return this;
	},
	initialize: function(options){
		this.vent = options.vent;
		// get the html template from the DOM
		var source = $("#chat-form-template").html();
		// run the html through Handlebars
		this.template = Handlebars.compile(source);
	},
	events: {
		'click .form-submit': 'sendChat',
		'keypress': 'onKeypress'
	},
	sendChat: function(e){
		e.preventDefault();
		var message = this.$('input').val();
		this.vent.trigger("chat", {text: message});
		this.$('input').val("");
	},
	onKeypress: function(e){
		if (e.which == 13 || event.keyCode == 13){
			this.sendChat();
		}
	}
});

var LoginView = Backbone.View.extend({
	initialize: function(options){
		this.vent = options.vent;
	},
	events: {
		'click button': 'onSubmit'
	},
	onSubmit: function() {
		username = $("#login input").val();
		this.vent.trigger('login', {username: username});
	}
});

var OnlineUsersView = Backbone.View.extend({
	collection: User,
	initialize: function(options){
		this.vent = options.vent;
		var source = $("#online-users-template").html();
		this.template = Handlebars.compile(source);
		this.listenTo(this.collection, "add", this.render);
		this.listenTo(this.collection, "remove", this.render);
		this.listenTo(this.collection, "reset", this.render);
	},
	render: function(options){
		var rendered = this.template({users: this.collection.toJSON()});
		console.log(this.collection.toJSON());
		this.$el.html(rendered);
		return this;
	}
});
