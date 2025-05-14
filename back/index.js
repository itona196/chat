const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const Message = require('./models/Message'); // Importer le modèle des messages

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// Connexion à MongoDB
mongoose.connect('mongodb://localhost/chat', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('📡 Connexion à MongoDB réussie'))
  .catch((err) => console.log('❌ Erreur de connexion à MongoDB', err));

// ✅ Supprimer le doublon
let users = new Map(); 

io.on('connection', (socket) => {
  console.log('🔌 Nouveau client connecté :', socket.id);

  socket.on('newUser', (username) => {
    users.set(socket.id, username);
    io.emit('userList', Array.from(users.values()));
    console.log('👤 Utilisateur ajouté :', username);

    // Charger les messages existants depuis MongoDB
    Message.find()
      .sort({ time: 1 })
      .then((messages) => {
        socket.emit('loadMessages', messages);
      })
      .catch((err) => {
        console.log('❌ Erreur lors du chargement des messages:', err);
      });
  });

  socket.on('chatMessage', ({ username, message }) => {
    const newMessage = new Message({ username, message });

    newMessage.save()
      .then(() => {
        io.emit('chatMessage', {
          username,
          message,
          time: newMessage.time
        });
      })
      .catch((err) => {
        console.log('❌ Erreur lors de la sauvegarde du message:', err);
      });
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
