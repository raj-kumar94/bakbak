var socket = io();

new Vue({
    el: '#app',
    data: {
        room:'myRoom',
        user:{},
        liveUsers: {},
        nickName: '',
        messages: [],
        areTyping : [],
        message: {type: '', action: '', user : '', text : '', timestamp : ''}
    },
    created: function(){

        socket.on('connect', () => {
            // Connected, let's sign-up for to receive messages for this room
            socket.emit('room', this.room);
        });

        //server emits 'a user joined message'
        socket.on('user joined', (data)=>{
            if(this.user.username == undefined){
               this.user = data.newUser; 
            }
            this.liveUsers = data.users;
        });

        //when someone leaves the chat room
        socket.on('user left', (users) => {
            this.liveUsers = users;
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
        },

        userIsTyping : function(username) {

        },
        usersAreTyping : function() {

        },
        stoppedTyping : function() {

        }
    }
});