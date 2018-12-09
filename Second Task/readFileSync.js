//fs is a native node module called "file sync"
var fs = require('fs');

console.log("Going to get a file");

var file = fs.readFileSync('readFileSync.js');
console.log("got the file1");
console.log("app continues");

