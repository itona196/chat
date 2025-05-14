const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

let users = new Map(); 

io.on('connection', (socket) => {
  console.log('🔌 Nouveau client connecté :', socket.id);

  socket.on('newUser', (username) => {
    users.set(socket.id, username);
    io.emit('userList', Array.from(users.values()));
    console.log('👤 Utilisateur ajouté :', username);
  });

  socket.on('chatMessage', ({ username, message, time }) => {
    io.emit('chatMessage', { username, message, time });
  });


  socket.on('typing', (username) => {
    socket.broadcast.emit('typing', username);
  });


  socket.on('disconnect', () => {
    const name = users.get(socket.id);
    users.delete(socket.id);
    io.emit('userList', Array.from(users.values()));
    console.log('❌ Déconnecté :', name || socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Serveur en ligne sur le port ${PORT}`);
});
