const { v4: uuidv4 } = require('uuid');

exports.createPrivateRoom = function (req,res,next){

	uuidv4();

	return res.json({
		"response":"WORKS"
	});

};