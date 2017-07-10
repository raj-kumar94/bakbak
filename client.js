var socket = io();

new Vue({
    el: '#app',
    data: {
        temp:'',
        liveUsers: [],
        nickName: "",
        nickNames: [],
        messages: [],
        areTyping : [],
        message: {
            "type": "",
            "action": "",
            "user" : "",
            "text" : "",
            "timestamp" : ""
        }
    },
    created: function(){
        //server emits 'a user joined message'
        //update the liveUsers array
        socket.on('user joined', (socket_id)=>{
            //get list of active users
            axios.get('/online')
            .then( (resp) => {
                for(var key in resp.data) {
                    //don't add online live user's list if its already there
                    if(this.liveUsers.indexOf(key) <= -1){
                         this.temp = {username: key, id: key};
                        this.liveUsers.push(this.temp);
                        //this.nickNames[key] = key
                    }
                }
                console.log(this.liveUsers);
            });

        });

        //when someone leaves the chat room
        socket.on('user left', (socket_id) => {
            var user_index = this.liveUsers.indexOf(socket_id);
            if(user_index>-1){
                this.liveUsers.splice(user_index,1);
            }
        });

        //catch a broadcasted message and update messages array
        socket.on('chat.message', (chatMessage) => {
            this.messages.push(chatMessage);
        });

    },
    
    methods: {
        send : function() {
            this.message.type = "chat";
            this.message.user = socket.id;
            this.message.timestamp = "few moment ago";
            socket.emit('chat.message', this.message);
            //now clear the field
            this.message.type = "";
            this.message.user = "";
            this.message.timestamp = "";
            this.message.text = "";

        },

        setName : function(){
             this.temp.username = this.nickName;
        },

        userIsTyping : function(username) {

        },
        usersAreTyping : function() {

        },
        stoppedTyping : function() {

        }
    }
});