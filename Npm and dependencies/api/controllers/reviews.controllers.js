var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

module.exports.reviewsGetAll = function(req, res) {
	var hotelId = req.params.hotelId;
	console.log("GET hotelId", hotelId);

	Hotel
		.findById(hotelId)
		// .findOne({
		// 	_id : ObjectId(hotelId)
		// },
		.select('reviews') //select is a mongoose query thing
		.exec( 
		function(err, doc) {
			var response = {
				status : 200,
				message : []
			};

			if(err) {
				console.log("Error in finding review")	;
				response.status = 500;
				response.message = err;
			}
			else if (!doc){
				console.log("No reviews for this hotel", id);
				response.status = 404;
				response.message = {
					"message" : "This hotel has no reviews :(" + id
				};
			} else {
				response.message = doc.reviews ? doc.reviews : response.message;
			}
				console.log("Returned doc", response.message);
				res
					.status(response.status)
					.json(response.message)
		});

};

module.exports.reviewsGetOne = function(req, res) {
	var hotelId = req.params.hotelId;
	var reviewId = req.params.reviewId;
	console.log("GET reviewId " +reviewId + " for hotelIdd " + hotelId);

	Hotel
	.findById(hotelId)
	// .findOne({
	// 	_id : ObjectId(hotelId)
	// },
	.select('reviews') //select is a mongoose query thing
	.exec( 
	function(err, hotel) {
		console.log("Returned doc", hotel);
		var review = hotel.reviews.id(reviewId);
		res
			.status(200)
			.json(review)
	});
};

var _addReview = function(req, res, hotel) {
	hotel.reviews.push({
		name : req.body.name,
		rating : parseInt(req.body.rating, 10),
		review : req.body.review
	});

	hotel.save(function(err, hotelUpdated) {
		if (err) {
			res
				.status(500)
				.json(err);
		} else {
			res
				.status(201)
				.json(hotelUpdated.reviews[hotelUpdated.reviews.length - 1]);
		}
	});
};

module.exports.reviewsAddOne = function(req, res) {
	var hotelId = req.params.hotelId;
	console.log("GET hotelId", hotelId);

	Hotel
		.findById(hotelId)
		// .findOne({
		// 	_id : ObjectId(hotelId)
		// },
		.select('reviews') //select is a mongoose query thing
		.exec( 
		function(err, doc) {
			var response = {
				status : 200,
				message : []
			};

			if(err) {
				console.log("Error in finding review")	;
				response.status = 500;
				response.message = err;
			}
			else if (!doc){
				console.log("No reviews for this hotel", id);
				response.status = 404;
				response.message = {
					"message" : "This hotel has no reviews :( " + id
				};
			} 
			if (doc) {
				_addReview(req, res, doc);
			} else {
				console.log("Returned doc", response.message);
				res
					.status(response.status)
					.json(response.message)
			}
		});
};