const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// folder public untuk frontend
const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
  console.log('User terhubung');

  socket.on('join', ({ username, room }) => {
    socket.join(room);
    socket.emit('pesan', {
      username: 'Admin',
      text: 'Selamat datang di room ' + room,
      createdAt: Date.now()
    });
  });

  socket.on('kirimPesan', (pesan, callback) => {
    io.emit('pesan', {
      username: 'User',
      text: pesan,
      createdAt: Date.now()
    });
    callback();
  });

  socket.on('kirimLokasi', (coords, callback) => {
    io.emit('locationMessage', {
      username: 'User',
      url: `https://google.com/maps?q=${coords.latitude},${coords.longitude}`,
      createdAt: Date.now()
    });
    callback();
  });
});

server.listen(3000, () => {
  console.log('Server berjalan di port 3000');
});
