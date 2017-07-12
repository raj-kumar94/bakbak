var socket = io();
new Vue({
    el: '#app',
    data: {
        user: {},
        liveUsers: {},
        nickName: '',
        messages: [],
        areTyping: [],
        message: { type: '', action: '', user: '', text: '', timestamp: '', msg: '' }
    },
    created: function() {
        //server emits 'a user joined message'
        socket.on('user joined', (data) => {
            if (this.user.username == undefined) {
                this.user.username = data.newUser.username;
                this.user.id = data.newUser.id;
                this.user = data.newUser;
            } else {
                this.messages.push({ type: 'joined', action: '', user: data.newUser, timestamp: '' });
            }
            this.liveUsers = data.users;
        });

        //when someone leaves the chat room
        socket.on('user left', (users) => {
            this.liveUsers = users.users;
            this.messages.push({ type: 'left', action: '', user: users.leftUser, timestamp: '' });
        });

        //catch a broadcasted message and update messages array
        socket.on('chat.message', (chatMessage) => {
            this.messages.push(chatMessage);
        });

        socket.on('nickname changed', (users) => {
            this.liveUsers = users;
        });
    },

    methods: {
        send: function() {
            this.message.type = "chat";
            this.message.user = this.user.username;
            this.message.timestamp = "few moment ago";
            socket.emit('chat.message', this.message);
            this.message = { type: '', user: '', timestamp: '', text: '' };
        },

        setName: function() {
            this.user.username = this.nickName;
            this.liveUsers[this.user.id].username = this.nickName;
            socket.emit('nickname changed', this.user);
        },

        userIsTyping: function(username) {

        },
        usersAreTyping: function() {

        },
        stoppedTyping: function() {

        }
    }
});
