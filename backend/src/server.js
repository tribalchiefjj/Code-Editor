const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());

app.get('/', (req, res) => {
    res.send('Real-Time Collaborative Code Editor Backend');
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('code-edit', (data) => {
        socket.broadcast.emit('code-update', data);
    });

    // Emit cursor position update
  socket.on('cursor-update', (position) => {
    socket.broadcast.emit('cursor-update', position); // Broadcast to other clients
  });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    }); 

 
     
});

server.listen(3001, () => console.log('Server running on http://localhost:3001'));



