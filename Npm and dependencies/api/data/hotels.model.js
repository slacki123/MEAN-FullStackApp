//Data Structure! :D
var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
	name : {
		type : String,
		required : true
	},
	rating : {
		type : Number,
		min : 0,
		max : 5,
		required : true
	},
	review : {
		type : String,		
		required : true
	},
	createdOn : {
		type : Date,
		"default" : Date.now
	}
});

var roomSchema = new mongoose.Schema({
	type : String,
	number : Number,
	description : String,
	photos : [String],
	price : Number
});


var hotelSchema = new mongoose.Schema({
	name : {
		type : String,
		required : true
	},
	stars : {
		type: Number,
		min : 0,
		max : 5,
		"default" : 0	
	},
	services : [String],
	description : String,
	photos : [String],
	currency : String,
	reviews : [reviewSchema],
	rooms : [roomSchema],
	location : {
		addresss : String,
		//coords are longitude, latitude like (x,y)
		coordinates : {
			type : [Number],
			index : '2dsphere'
		}
	}
});

//the below can only work after schema has been defined
mongoose.model('Hotel', hotelSchema); //"Hotel" maps to "hotel"