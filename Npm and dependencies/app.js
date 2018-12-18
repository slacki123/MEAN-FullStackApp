var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

var routes = require('./api/routes');

app.set('port', 3000);

//nodemon test
//adding nodemon and then running it, will restart our application everytime we make any changes in the code

//below is express middleware
// app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
	console.log(req.method, req.url);
	next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended : false}));

app.use('/api', routes);

// the app.use method is getting the home page statically
// app.get('/', function(req, res) {
// 	console.log("GET homepage");
// 	res.status(200).sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// app.get('/json', function(req, res) {
// 	console.log("GET json");
// 	res.status(200).json( {"jsonData" : true} );
// });

// app.get('/file', function(req, res) {
// 	console.log("GET file");
// 	res.status(200).sendFile(path.join(__dirname, 'app.js'));
// });

var server = app.listen(app.get('port'), function() {
	var port = server.address().port;
	console.log('magic happens on port ' + port);
});



