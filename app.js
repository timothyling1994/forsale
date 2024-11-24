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
  console.log('a user connected');
});


// Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
