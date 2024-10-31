var express = require('express');
var router = express.Router();
//const passport = require('passport');

let createRoomController = require('../controllers/createRoomController');

router.post('/',createRoomController.createPrivateRoom);


module.exports = router; 