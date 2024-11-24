const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MAX_PLAYERS = 6;

const RoomSchema = new Schema({
	connections: {
		type: Array(MAX_PLAYERS).fill({
			type: new Schema({
				userId: { type: String, default: null },
				socketId: { type: String, default: null }
			}, { _id: false }),
			default: null
		}),
		validate: [
			array => array.length <= 6,
			'Connections array cannot exceed 6 items'
		]
	},
	roomId: {type:String, required:true},
	isPublic: {type:Boolean, required:true},
	//roomData:{type: Schema,Types.ObjectId, ref: 'RoomData', required: true}
});

RoomSchema.virtual('url').get(function(){
	return '/'+this.roomId;
});

module.exports = mongoose.model('Room',RoomSchema);