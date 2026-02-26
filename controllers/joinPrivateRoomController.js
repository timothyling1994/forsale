const { v4: uuidv4 } = require('uuid');
var Room = require('../models/room');

exports.joinPrivateRoom = async function (req, res, next){
	console.log("does this reach");
    console.log(req.body.roomId);
    console.log(req.body.userId);
    console.log(req.body.playerPosition);

    await new Promise((resolve, reject) => {
        Room.findOne({ roomId: req.body.roomId }).exec().then(async room => {
            if (room) {
                console.log('Document found:', room);

                if (req.body.playerPosition < 0 || req.body.playerPosition > 5) {
                    return res.status(400).json({
                        roomUpdated: false,
                        message: "Invalid player position"
                    });
                }

                if (room.connections[req.body.playerPosition] !== null) {
                    return res.status(400).json({
                        roomUpdated: false,
                        message: "Position already taken"
                    });
                }

                room.connections[req.body.playerPosition] = { 
                    userId: req.body.userId, 
                    socketId: req.body.socketId,
                    isAdmin: req.body.isAdmin 
                };
                await room.save();
                console.log(room);
                resolve();
            }
        });
    });
};
