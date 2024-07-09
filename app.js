const express = require('express');
const app = express();
const port = 3000;

var createRoomRouter = require('./routes/createRoom');

// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static('public'));

// Basic route
app.use('/createRoom',createRoomRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
