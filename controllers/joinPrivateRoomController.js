var Room = require('../models/room');

exports.joinPrivateRoom = async function (req, res, next){
	console.log("______________________");
    console.log(req.body.roomId);
    console.log(req.body.userId);
    console.log(req.body.playerPosition);
    console.log("______________________");


    try {
        const room = await Room.findOne({ roomId: req.body.roomId }).exec();

        if (!room) {
            return res.status(404).json({
                roomUpdated: false,
                message: "Room not found"
            });
        }
        console.log("______________________");
        console.log('Document found:', room);
        console.log("______________________");

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
            isAdmin: req.body.isAdmin 
        };
        await room.save();
        console.log(room);

        return res.json({
            roomUpdated: true,
            connections: room.connections
        });
    } catch (err) {
        console.error('Error joining room:', err);
        return res.status(500).json({
            roomUpdated: false,
            message: "Error joining room"
        });
    }
};
