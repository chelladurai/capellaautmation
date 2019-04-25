// const func = require('../config-app');
var person = require("./test/appTest")
var assert = require('assert');

// var ben = new person('Ben Franklin')
//  var george = new person('George Washington')
var DATA_PATH = "data/Leadership Theories.json"

// george.on('speak',function(said){

//   console.log(`${this.name}`);

// })

// // ben.on('speak', function(said){
// //
// //   console.log(`${this.name}: ${said}`);
// //
// // })

// // ben.emit('speak', "You may delay, but time will not.")
// george.emit('speak', "It is far better to be alone, than to be in bad company")


function loadQuestions() {
	//TODO: import for testing. Restore this with a fixed JSON URL for production.
	$.ajax({
        //url: DATA_PATH+fileName,
        url: DATA_PATH,
        dataType: "json"
   })
   .fail(function(data, textStatus, error){
       cl('questions.json did not load, status: '+textStatus+' , error: '+ error);
   })
   .success(function(data) {
    	cl('questions.json loaded');
    	quizData = data;
    	cl(quizData);
    	onQuestionLoadComplete();
   });
  }

console.log(String(loadQuestions.success));