var mongoose = require('mongoose');
var dburl = 'mongodb://localhost:27017/meanhotels';

mongoose.connect(dburl);

mongoose.connection.on('connected', function() {
	console.log('Mongoose connected to ' + dburl);
});

mongoose.connection.on('disconnected', function() {
	console.log('Mongoose disconnected');
});

mongoose.connection.on('error', function(err) {
	console.log('Mongoose connection error: ' + err);
});

//Unix based stuff below which doesn't work for windows
process.on('SIGINT', function() {
	mongoose.connection.close(function() {
		console.log('Mongoose disconnected through app termination (SIGINT)')
		process.exit(0);
	});
});

process.once('SIGUSR2', function () {
	mongoose.connection.close(function() {
		console.log('Mongoose disconnected through app termination (SIGUSR2)');
		process.kill(process.pid, 'SIGUSR2');
	});
});

//Bringing in schemas and models
require('./hotels.model.js');