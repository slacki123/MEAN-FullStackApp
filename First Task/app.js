require("./instantHello");
var goodbye1 = require("./talk/goodbye");
var talk1 = require("./talk");
var question1 = require("./talk/question");

//var needs () added to the variable name clearly..
//"talk" is the variable name specified above
talk1.intro();
talk1.hello("seb");

var answer1 = question1.ask("What is the meaning of 42?");
console.log(answer1);


goodbye1();

