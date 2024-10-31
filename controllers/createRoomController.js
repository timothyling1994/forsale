const { v4: uuidv4 } = require('uuid');
var Room = require('../models/room');

exports.createPrivateRoom = async function (req, res, next){

	console.log("does this reach");
	let isUnique = false;
	let generatedId="";

	while(!isUnique)
	{
		generatedId = uuidv4().toLowerCase();
		console.log(generatedId);

		await new Promise((resolve,reject)=>{
			Room.find({roomId:generatedId}).exec().then(async docs => {
			    if (docs.length > 0) {
			      console.log('Documents found:', docs);
			    }
			    else {
			      	console.log('No documents found');
			      	try {
			      		const room = await new Room({
							connections:[{userId: req.body.userId, socketId:req.body.socketId}],
							roomId:generatedId,
							isPublic:false,
							//roomData: roomDataId,
						}).save();
						console.log("Room:" + generatedId + " saved.");
						isUnique = true;
						return res.json({
							createdRoom: true,
							roomId:generatedId
						});
			      	}
			      	catch (err) {
			      		console.error('Error saving room:', err);
			      	}
			    }
			  })
			  .catch(err => {
			    console.error('Error occurred:', err);
			});
		});
	}
};