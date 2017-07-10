var express = require('express');
var app = express();
var server = require('http').Server(app);

var port = 8200;

var io = require('socket.io')(server);

server.listen(port, function(){
    console.log('application started on port: '+port);
});

//static files
app.use(express.static(__dirname));

//routes
app.get('/',function(req, res){
    res.sendFile(__dirname+'/index.hmtl');
});

app.get('/online',function(req, res){
    res.send(io.sockets.adapter.rooms);
});


//socket connection

io.on('connection', function(socket){
    console.log('connected with '+socket.id);

    //emit is an event that tells all clients including the one that connected
    //broadcast tells all the clients excluding the one that connected
    io.emit('user joined', socket.id);

    //receiving client's message
    socket.on('chat.message', function(message){
        //since a client sends message to server, server needs to broadcast this message
        io.emit('chat.message', message);
    });

    socket.on('disconnect', function() {
        console.log('user left '+socket.id);
        socket.broadcast.emit('user left', socket.id);
    });
});