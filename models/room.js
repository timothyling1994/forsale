const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RoomSchema = new Schema({
	connections: {type:[{userId:String, socketId: String}], required:true},
	roomId: {type:String, required:true},
	isPublic: {type:Boolean, required:true},
	//roomData:{type: Schema,Types.ObjectId, ref: 'RoomData', required: true}
});

RoomSchema.virtual('url').get(function(){
	return '/'+this.roomId;
});

module.exports = mongoose.model('Room',RoomSchema);