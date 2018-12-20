//driver
var MongoClient = require('mongodb').MongoClient;
var dburl = 'mongodb://localhost:27017';

var _connection = null;

var open = function () {
	//setting the connection
	MongoClient.connect(dburl, function (err, client) {
		var db = client.db('meanhotels');
		
		if(err) {
			console.log("DB connection failed");
			return;
		}
		_connection = db;
		console.log("DB connection open", db);
	});
	
};

var get = function () {
	return _connection;
};

module.exports = {
	open : open,
	get : get
};