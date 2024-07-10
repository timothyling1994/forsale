
const express = require('express');
const app = express();
const port = 3000;
const { createServer } = require('node:http');
const server = createServer(app);
const { Server } = require("socket.io");
const io = new Server( server,{
  connectionStateRecovery: {}
});

var createRoomRouter = require('./routes/createRoom');

// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static('public'));

// Basic route
app.use('/createRoom',createRoomRouter);

io.on('connection', (socket) => {
  console.log('a user connected');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
