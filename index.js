var express = require('express');
var app = express();
var server = require('http').Server(app);

var port = 8200;
var userRoom = '';
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
    res.send(io.sockets.adapter.rooms);
});


//socket connection
io.on('connection', function(socket) {
    var newUser = { username: socket.id, id: socket.id, userRoom:userRoom};
    users[socket.id] = newUser;
    io.emit('user joined', { newUser: newUser, users: users });
    socket.on('room', function(userRoom) {
        userRoom = userRoom;
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
        // socket.broadcast.emit('nickname changed', users);
        socket.in(userRoom).broadcast.emit('nickname changed', users);
    });

    socket.on('disconnect', function() {
        console.log('user left ' + socket.id);
        var leftUser = users[socket.id];
        delete users[socket.id];
        // socket.broadcast.emit('user left', {leftUser: leftUser, users: users});
        socket.in(userRoom).broadcast.emit('user left', {leftUser: leftUser, users: users});
    });
});
