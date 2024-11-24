const { v4: uuidv4 } = require('uuid');
var Room = require('../models/room');

exports.joinPrivateRoom = async function (req, res, next){
	console.log("does this reach");
    console.log(req.body.roomId);
    console.log(req.body.userId);

    await new Promise((resolve,reject)=>{
        Room.find({roomId:req.body.roomId}).exec().then(async docs => {
            if (docs.length > 0) {
                console.log('Documents found:', docs);

                if(docs[0].connections.length > 6) {
                    return res.status(400).json({
                        roomUpdated: false,
                        message: "Room is full"
                    });
                }

                docs[0].connections.push({userId:req.body.userId, socketId:req.body.socketId});
                await docs[0].save();
                resolve();
            }
        });
    });
};
