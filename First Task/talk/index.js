var filename = "index.js";

var hello = function (name) {
	console.log("helo " + name);
};

var intro = function () {
	console.log("I'm a node file called " + filename);
};

//these are the other ways to define methods within a class
module.exports = {
	hello : hello,
	intro : intro
};