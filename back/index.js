const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

io.on('connection', (sock) => {
  sock.emit('welcome', 'Bienvenue sur le chat !');

  sock.on('chatMessage', (data) => {
    io.emit('chatMessage', data);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serveur en ligne sur le port ${PORT}`);
});
