var socket = io();

new Vue({
    el: '#app',
    data: {
        room: 'myRoom',
        user: {},
        liveUsers: {},
        nickName: '',
        messages: [],
        areTyping : [],
        message: {type: '', action: '', user : '', text : '', timestamp : ''}
    },
    created: function() {
        /*socket.on('connect', () => {
            Connected, let's sign-up for to receive messages for this room
            socket.emit('room', this.room);
        });*/
        //server emits 'a user joined message'
        socket.on('user joined', (data) => {
            socket.emit('room', this.room);
            if (this.user.username == undefined) {
                this.user.username = data.newUser.username;
                this.user.id = data.newUser.id;
                this.user = data.newUser;
            } else {
                this.messages.push({ type: 'info', action: '',text:'joined the room' ,user: data.newUser, timestamp: moment().calendar() });
            }
            this.liveUsers = data.users;
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
            socket.emit('chat.message', this.message);
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

        }
    }
});