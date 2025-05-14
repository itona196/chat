const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Message = require('./models/message');

dotenv.config(); // Charge les variables d'environnement depuis .env

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Pour la production, remplace par l'URL de ton front
    methods: ["GET", "POST"]
  }
});

// Connexion à MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('📡 Connexion à MongoDB Atlas réussie'))
.catch((err) => console.error('❌ Erreur MongoDB Atlas :', err));

let users = new Map();

io.on('connection', (socket) => {
  console.log('🔌 Nouveau client connecté :', socket.id);

  socket.on('newUser', (username) => {
    users.set(socket.id, username);
    io.emit('userList', Array.from(users.values()));
    console.log('👤 Utilisateur ajouté :', username);

    Message.find()
      .sort({ time: 1 })
      .then((messages) => socket.emit('loadMessages', messages))
      .catch((err) => console.error('❌ Erreur chargement messages :', err));
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
      .catch((err) => console.error('❌ Erreur sauvegarde message :', err));
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
  console.log(`🚀 Serveur WebSocket en ligne sur le port ${PORT}`);
});
