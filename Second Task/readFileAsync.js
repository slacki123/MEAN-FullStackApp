//fs is a native node module called "file sync"
var fs = require('fs');

//Separate function to help with testing. Callbacks can't be unit tested
var onFileLoad = function (err,file) {
	console.log("Got the file2");
}

console.log("Going to get a file");

fs.readFile('readFileSync.js', onFileLoad);

console.log("app continues...");

