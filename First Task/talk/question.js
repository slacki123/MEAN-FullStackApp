var answer = "Now that's a good question!";

//this is the first way to define a method within a class

module.exports.ask = function(question) {
	console.log(question);
	return answer;
};