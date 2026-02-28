require('dotenv').config();
const express = require('express');
const app = express();
const port = 8080;
const { createServer } = require('node:http');
const server = createServer(app);
require("./mongoConfig");


var io = require("socket.io")(server,{
    cors: {
        //origin: "https://collab-drums.netlify.app/",
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// Make io accessible from route controllers via req.app.get('io')
app.set('io', io);

var createRoomRouter = require('./routes/createRoom');
var joinPrivateRoomRouter = require('./routes/joinPrivateRoom');

app.use(function(req,res,next){
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Accept,Origin');
  next();
});

// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static('public'));

// Basic route
app.use('/createRoom',createRoomRouter);
app.use('/joinPrivateRoom',joinPrivateRoomRouter);
//app.use('/playGame',playGameRouter);

io.on('connection', (socket) => {
  console.log('user connected: ' + socket.id);

  socket.on('joinRoom', ({ roomId, userId, playerPosition }) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);

    // Broadcast to everyone in the room (including the sender)
    io.to(roomId).emit('playerJoined', {
      userId,
      playerPosition,
      socketId: socket.id
    });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected: ' + socket.id);

    // socket.rooms is already empty on disconnect, but we can
    // broadcast to all rooms this socket was in. Socket.IO
    // automatically removes the socket from its rooms on disconnect,
    // but the 'disconnecting' event fires before that happens.
  });

  // Use 'disconnecting' to broadcast before the socket leaves its rooms
  socket.on('disconnecting', () => {
    for (const roomId of socket.rooms) {
      // Skip the socket's own room (each socket auto-joins a room matching its id)
      if (roomId === socket.id) continue;

      socket.to(roomId).emit('playerDisconnected', {
        socketId: socket.id
      });
      console.log(`Socket ${socket.id} disconnecting from room ${roomId}`);
    }
  });
});


// Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
