var socket = io();

new Vue({
    el: '#app',
    data: {
        hide: false,
        hide1: true,
        room: 'myRoom',
        user: {},
        liveUsers: {},
        nickName: '',
        messages: [],
        areTyping : [],
        message: {type: '', action: '', user : '', text : '', timestamp : ''}
    },
    created: function() {
        //server emits 'a user joined message'
        socket.on('user joined', (data) => {
            if (this.user.username == undefined) {
                this.room = 'room'+Math.floor(Math.random() * 2) + 1;
                socket.emit('room', {room: this.room, user:data.newUser});
                this.user.username = data.newUser.username;
                this.user.id = data.newUser.id;
                this.user = data.newUser;
            } else {
                this.messages.push({ type: 'info', action: '',text:'joined the room' ,user: data.newUser, timestamp: moment().calendar() });
            }
            this.liveUsers = data.users;
        });
        socket.on('room joined', (users) => {
            // console.log(data);
            this.liveUsers = users;
        });
        // socket.on('user joined room', (data) => {
        //     this.messages.push({ type: 'info', action: '', user: data.newUser, timestamp: '' });
        // });

        //when someone leaves the chat room
        socket.on('user left', (data) => {
            // console.log(data);
            this.liveUsers = data.users;
            this.messages.push({ type: 'info', action: '',text:'left the room' ,user: data.deletedUser, timestamp: moment().calendar() });
            console.log(this.messages);
            console.log(this.messages);
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
        send : function() {
            this.message.type = "chat";
            this.message.user = this.user.username;
            this.message.timestamp = moment().calendar();
            socket.emit('chat.message', {message: this.message, room: this.room});
            this.message = {type: '', user: '',timestamp: '',text: ''};
        },

        setName : function(){
            this.user.username = this.nickName;
            this.liveUsers[this.user.id].username = this.user.username;
            socket.emit('nickname changed', this.user);
            this.nickName='';
        },

        userIsTyping : function(username) {

        },
        usersAreTyping : function() {

        },
        stoppedTyping : function() {

        },
        changeClass : function() {
            this.hide = true;
            this.hide1 = false;
            this.setName();
        }
    }
});