const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
<<<<<<< HEAD
const mongoose = require('mongoose');
const Message = require('./models/Message'); // Importer le modèle des messages
=======
>>>>>>> f5c80b0f1468ad24cffa279820b498ad1c3cdeb6

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

<<<<<<< HEAD
// Connexion à MongoDB
mongoose.connect('mongodb://localhost/chat', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('📡 Connexion à MongoDB réussie'))
  .catch((err) => console.log('❌ Erreur de connexion à MongoDB', err));

let users = new Map();
=======
let users = new Map(); 
>>>>>>> f5c80b0f1468ad24cffa279820b498ad1c3cdeb6

io.on('connection', (socket) => {
  console.log('🔌 Nouveau client connecté :', socket.id);

  socket.on('newUser', (username) => {
    users.set(socket.id, username);
    io.emit('userList', Array.from(users.values()));
    console.log('👤 Utilisateur ajouté :', username);
<<<<<<< HEAD

    // Charger les messages enregistrés et les envoyer au client
    Message.find()
      .sort({ time: 1 })  // Trier les messages par ordre chronologique
      .then((messages) => {
        socket.emit('loadMessages', messages);
      })
      .catch((err) => console.log('❌ Erreur lors du chargement des messages:', err));
  });

  socket.on('chatMessage', ({ username, message }) => {
    const newMessage = new Message({ username, message });

    // Sauvegarder le message dans la base de données
    newMessage.save()
      .then(() => {
        io.emit('chatMessage', { username, message, time: newMessage.time });
      })
      .catch((err) => {
        console.log('❌ Erreur lors de la sauvegarde du message:', err);
      });
  });

=======
  });

  socket.on('chatMessage', ({ username, message, time }) => {
    io.emit('chatMessage', { username, message, time });
  });


>>>>>>> f5c80b0f1468ad24cffa279820b498ad1c3cdeb6
  socket.on('typing', (username) => {
    socket.broadcast.emit('typing', username);
  });

<<<<<<< HEAD
=======

>>>>>>> f5c80b0f1468ad24cffa279820b498ad1c3cdeb6
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
