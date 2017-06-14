var express = require('express');
var app = express();

var fs = require("fs")

var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {

  socket.on('userconnect', function (data) {
    console.log(data);
    io.emit('userconnect', { user: data.user });
  });

  socket.on('clientsend', function (data) {
    console.log(data);
    io.emit('serversend', { user: data.user, message: data.message });
  });

  socket.on('clientedit', function (data) {
    console.log(data);
    io.emit('serveredit', { user: data.user });
  });

  socket.on('clientsendimage', function (data) {
    // console.log(data);
    fs.writeFile(data.name, data.data, (err) => {
      if (err) throw err;
      console.log('The file %s has been saved!', data.name);
    });
    io.emit('serversendimage', { user: data.user, name: data.name, data: data.data });
  });

});
