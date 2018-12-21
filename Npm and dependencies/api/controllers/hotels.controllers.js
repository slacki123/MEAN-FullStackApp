var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

// var dbconn = require('../data/dbconnection.js');
// var ObjectId = require('mongodb').ObjectId;
// var hotelData = require('../data/hotel-data.json');

var runGeoQuery = function(req,res) {
	var lng = parseFloat(req.query.lng);
	var lat = parseFloat(req.query.lat);

		var point = {
			type : "Point",
			coordinates :[lng, lat]
		};

		var geoOptions = {
			spherical : true,
			maxDistance : 2000,
			num : 5
		};

		//below is unsuported by mongoose after the new update
		// Hotel
		// 	.geoNear(point, geoOptions, function(err, results, stats) {
		// 		console.log('Geo results', results);
		// 		console.log('Geo stats', stats);
		// 		res
		// 			.status(200)
		// 			.json(results)
		// 	});


		//the new geoNear use
		Hotel
			.aggregate(
	        [
	            {
	                '$geoNear': {
	                    'near': point,
	                    'spherical': true,
	                    'distanceField': 'dis',
	                    'maxDistance': 2000,
	                    num : 5
	                }
	            }
	        ],
	        function(err, results,stats) {
	           	console.log('Geo results', results);
				console.log('Geo stats', stats);
				res
					.status(200)
					.json(results)
	        });

};

module.exports.hotelsGetAll = function(req,res) {

	// var db = dbconn.get();
	// var collection = db.collection('hotels');
	
	var offset = 0;
	var count = 5;
	var maxCount = 10;

	// //req.query shows the json version of everything that is in the query url

	if(req.query && req.query.lat && req.query.lng) {
		runGeoQuery(req, res);
		return;
	} 

	if (req.query && req.query.offset) {
		offset = parseInt(req.query.offset, 10);
	}

	if (req.query && req.query.count) {
		count = parseInt(req.query.count, 10);
	}

	if( isNaN(offset) || isNaN(count)){
		res
			.status(400)
			.json({
				"message" : "If supplied in query should be a number and not '" + req.query.count + "'"
			})
		return;
	}

	if (count > maxCount) {
		res
			.status(400)
			.json({
				"message" : "Count limit of " + maxCount + " exceeded"
			})
		return;
	}

	/*below is the mongoose method*/
	Hotel
		.find()
		.skip(offset)
		.limit(count)
		.exec(function(err, hotels){
			if(err){
				console.log("Error: " + err)
				res
					.status(500)
					.json(err);
			}
			else {
			console.log("Found hotels", hotels.length);
			res
				.json(hotels);
			}
		});

	/*below is the native driver method*/
	// collection
	// 	.find()
	// 	.skip(offset)
	// 	.limit(count)
	// 	.toArray(function(err, docs){
	// 		console.log("Found hotels", docs);
	// 		res
	// 			.status(200)
	// 			.json(docs);
	// 	});

	// console.log("db", db);

	// console.log("GET the hotels");
	// console.log(req.query);

	// var returnData = hotelData.slice(offset,offset+count);

	// res
	// 	.status(200)
	// 	.json(returnData);

};

module.exports.hotelsGetOne = function(req,res) {
	// var db = dbconn.get();
	// var collection = db.collection('hotels');

//params does something important
	var hotelId = req.params.hotelId;
	console.log("GET hotelId", hotelId);

	Hotel
		.findById(hotelId)
		// .findOne({
		// 	_id : ObjectId(hotelId)
		// },
		.exec( 
		function(err, doc) {
			var response = {
				status : 200,
				message : doc
			};
			if (err){
				console.log("Error in finding hotel")	
				response.status = 500;
				response.message = err;
			}
			else if (!doc) {
				response.status = 404;
				response.message = {
						"message" : "Hotel ID not found"
					};
			}
				res
					.status(response.status)
					.json(response.message)	
	
		});
};

var _splitArray = function(input) {
	var output;
	if (input && input.length > 0){
		output = input.split(";");
	} else {
		output = [];
	}
	return output;
};

module.exports.hotelsAddOne = function(req, res) {	
	////////commenting out native drivers/////////
	// var db = dbconn.get();
	// var collection = db.collection('hotels');
	// var newHotel; 

	// console.log("POST new hotel");

	// if(req.body && req.body.name && req.body.stars) {
	// 	newHotel = req.body;
	// 	newHotel.stars = parseInt(req.body.stars, 10);


	// 	collection.insertOne(newHotel, function(err, response) {
	// 		console.log(response);
	// 		console.log(response.ops);
	// 		res
	// 			.status(201)
	// 			.json(response.ops);
	// 		});
	// } 

	Hotel
		.create({
			name : req.body.name,
			description : req.body.description,
			stars : parseInt(req.body.stars, 10),
			services : _splitArray(req.body.services),
			photos : _splitArray(req.body.photos),
			currency : req.body.currency,
			location : {
				address: req.body.address,
				coordinates : [
					parseFloat(req.body.lng), 
					parseFloat(req.body.lat)
				]
			}

		}, function(err, hotel){
			if(err) {
				console.log("Error creating hotel");
				res
					.status(400)
					.json(err);
			} else {
				console.log("Hotel created", hotel);
				res
					.status(201)
					.json(hotel);
			}
		});

};

module.exports.hotelsUpdateOne = function(req, res) {
	var hotelId = req.params.hotelId;
	console.log("GET hotelId", hotelId);

	Hotel
		.findById(hotelId)
		.select("-reviews -rooms")
		.exec( 
		function(err, doc) {
			var response = {
				status : 200,
				message : doc
			};
			if (err){
				console.log("Error in finding hotel")	
				response.status = 500;
				response.message = err;
			}
			else if (!doc) {
				response.status = 404;
				response.message = {
						"message" : "Hotel ID not found"
					};
			}

			if (response.status !==200){
				res
					.status(response.status)
					.json(response.message)	
			} else {
				doc.name = req.body.name
				doc.description = req.body.description;
				doc.stars = parseInt(req.body.stars, 10);
				doc.services = _splitArray(req.body.services);
				doc.photos = _splitArray(req.body.photos);
				doc.currency = req.body.currency;
				doc.location = {
					address: req.body.address,
					coordinates : [
						parseFloat(req.body.lng), 
						parseFloat(req.body.lat)
					]
				};
				doc.save(function(err, hotelUpdated) {
					if (err) {
						res
							.status(500)
							.json(err)
					} else {
						res
							.status(201)
							.json(hotelUpdated); //hotelUpdated are the JSON entries that you put in to update
					}
				})
			}
	
		});
};

module.exports.hotelsDeleteOne = function(req, res) {
	var hotelId = req.params.hotelId;

	Hotel
		.findByIdAndRemove(hotelId)
		.exec(function(err, hotel){
			if(err){
				res
					.status(404)
					.json(err);
			} else {
				console.log("Hotel deleted, id: ", hotelId);
				res
					.status(204)
					.json();
			}
		});
}
