const { v4: uuidv4 } = require('uuid');
var Room = require('../models/room');

exports.createPrivateRoom = async function (req, res, next){
	try {
		// Generate UUID once - collisions are astronomically rare with UUID v4
		// If a collision occurs (extremely unlikely), the unique index will catch it
		let generatedId = uuidv4().toLowerCase();
		let maxRetries = 5; // Safety limit for retries
		let retries = 0;


		while (retries < maxRetries) {
			try {
				const room = await new Room({
					connections: [
						{userId: req.body.userId, isAdmin: true},
						null,
						null,
						null,
						null,
						null
					],
					roomId: generatedId,
					isPublic: false,
					//roomData: roomDataId,
				}).save();

				console.log("Room:" + generatedId + " saved.");
				return res.json({
					createdRoom: true,
					roomId: generatedId
				});
			} catch (err) {
				// Check if it's a duplicate key error (MongoDB error code 11000)
				if (err.code === 11000 && err.keyPattern && err.keyPattern.roomId) {
					// Collision occurred - generate new ID and retry
					console.log('UUID collision detected, generating new ID...');
					generatedId = uuidv4().toLowerCase();
					retries++;
				} else {
					// Some other error occurred
					console.error('Error saving room:', err);
					return res.status(500).json({
						createdRoom: false,
						message: 'Failed to create room'
					});
				}
			}
		}

		// If we've exhausted retries (should never happen in practice)
		return res.status(500).json({
			createdRoom: false,
			message: 'Failed to generate unique room ID after multiple attempts'
		});
	} catch (err) {
		console.error('Unexpected error:', err);
		return res.status(500).json({
			createdRoom: false,
			message: 'Unexpected error occurred'
		});
	}
};