var express = require('express');
var router = express.Router();
//const passport = require('passport');

let joinPrivateRoomController = require('../controllers/joinPrivateRoomController');

router.post('/',joinPrivateRoomController.joinPrivateRoom);


module.exports = router; 