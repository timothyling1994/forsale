const { v4: uuidv4 } = require('uuid');
var Room = require('../models/room');

exports.createPrivateRoom = function (){


	return async function(req,res,next)
	{
		console.log("reach122");
		let isUnique = false;
		let generatedId="";

		console.log("reach12");

		while(!isUnique)
		{
			generatedId = uniqid().toLowerCase();
			console.log(generatedId);

			await new Promise((resolve,reject)=>{
				Room.find({roomId:generatedId}).exec(function(err,result){
					if(err){return next(err);}
					if(result.length === 0)
					{
						isUnique = true;
						resolve(true);
					}
				});
			});
		}

		const room = new Room({
					connections:[{userId: req.body.userId, socketId:req.body.socketId}],
					roomId:generatedId,
					isPublic:false,
					//roomData: roomDataId,
					
				}).save(err=>{
					if(err){
						return next(err);
					} 
		
				return res.json({
					createdRoom: true,
					roomId:generatedId,
				});

		
		});
		

	}

};