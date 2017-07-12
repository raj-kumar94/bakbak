var express = require('express');
var app = express();
var server = require('http').Server(app);

var port = 8200;
var users = {},
    messages = [];
var io = require('socket.io')(server);

server.listen(port, function() {
    console.log('application started on port: ' + port);
});

//static files
app.use(express.static(__dirname));

//routes
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.hmtl');
});

app.get('/online', function(req, res) {
    console.log(io.sockets.adapter.rooms);
    res.send(io.sockets.adapter.rooms);
});


//socket connection
io.on('connection', function(socket) {
    var userRoom = 'myRoom';
    var newUser = { username: socket.id, id: socket.id, room:userRoom };
    users[socket.id] = newUser;
    io.emit('user joined', { newUser: newUser, users: users });
    socket.on('room', function(userRoom) {
        
        socket.join(userRoom);
    });

    //receiving client's message
    socket.on('chat.message', function(message) {
        //since a client sends message to server, server needs to broadcast this message
        // io.emit('chat.message', message);
        io.sockets.in(userRoom).emit('chat.message', message);
    });
    //receiving client's message
    socket.on('nickname changed', function(changedUser) {
        //since a client sends message to server, server needs to broadcast this message
        users[changedUser.id].username = changedUser.username;
        socket.in(userRoom).broadcast.emit('nickname changed', users);
    });

    socket.on('disconnect', function() {
        console.log('user left ' + socket.id);
        delete users[socket.id];
        socket.in(userRoom).broadcast.emit('user left', users);
    });
});
