var assert = require('assert');
var express = require('express');
var chai = require('Chai');
var expect = chai.expect;
// var fs = require("fs");
var app = express.loadQuestions;

const {promisify} = require('util')
const fs = require('fs')
const readFileAsync = promisify(fs.readFile)


//$ = require('jquery'), jsdom = require('jsdom');


//jsdom = require("jsdom");
//const { window } = new jsdom.JSDOM(`...`);
//global.document = new jsdom.JSDOM('...').window.document;

var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

$ = jQuery = require('jquery')(window);

const sinon = require('sinon');



var typeOf = require('typeof--');




/* var contents = fs.readFileSync("data/data.json");
var obj = JSON.parse(contents)

var type = typeOf(obj.quizDescription);

console.log(type); */

//$ = ;
//window.jQuery = $; 
 

var testModule = require('../dev_files/LeadershipTheories-Copy/LeadershipTheories-Copy/js/main.js');
var testModule1 = require('../dev_files/LeadershipTheories-Copy/LeadershipTheories-Copy/js/config-app.js');
// var fileRead = fs.readFileSync("../dev_files/LeadershipTheories-Copy/LeadershipTheories-Copy/data/test.json", {encoding: 'utf8'});
//var contents = require("../dev_files/LeadershipTheories-Copy/LeadershipTheories-Copy/data/test.json");


describe('Json Data Type',function(){
    it('should return the json data type',function(){
        var contents = fs.readFileSync('./dev_files/LeadershipTheories-Copy/LeadershipTheories-Copy/data/Leadership Theories.json');
        var obj = JSON.parse(contents)
        var type = typeOf(obj.quizDescription);
        console.log(type); 
        expect( obj.quizDescription ).to.be.a( 'string' );

        //typeOf(type).should.equals('String');
    })
})

describe('Variable Check', function(){
    describe('VariableCheck1', function(){
        it('should return the name of varible',function(){
            assert.equal(testModule1.IME_MEDIA_ID ,"HIM4670_LeadershipTheories");
        });

    });

});



describe('checkAjax', function(){
  
    it('should tell us whether the ajax call is successful or not',function(){
        // console.log(testModule1.DATA_PATH)
        //console.log(testModule.getQuestionType("test"));
        // app.get(testModule.loadQuestions, function(req, res) {
        //console.log(testModule.loadQuestions());

        console.log(testModule.loadQuestions());

        //console.log(r);

        //     console.log(req.params.route);
        // });

        

       // var callback = sinon.fake();
        //testModule.loadQuestions("./dev_files/LeadershipTheories-Copy/LeadershipTheories-Copy/data/Leadership Theories.json", callback);

       // console.log(testModule.loadQuestions("./dev_files/LeadershipTheories-Copy/LeadershipTheories-Copy/data/Leadership Theories.json", callback))
    
        // This is part of the FakeXMLHttpRequest API
        // server.requests[0].respond(
        //     200,
        //     { "Content-Type": "application/json" },
        //     JSON.stringify([{ id: 1, text: "Provide examples", done: true }])
        // );
    
        //assert(callback.calledOnce);

       

        
        // abc = document;
        //assert.equal(testModule.loadQuestions ,"HIM4670_LeadershipTheories");
    });

});

/*
describe('check Json read',function(){

    it('should return the content present in json',function(){

        readFileAsync('./dev_files/LeadershipTheories-Copy/LeadershipTheories-Copy/data/Leadership Theories.json', {encoding: 'utf8'})
        .then(contents => {
            const obj = JSON.parse(contents)
           // console.log(obj)
        })
        .catch(error => {
            throw error
        })
    })
})
*/
describe('Return Function Test', function(){
    it('Should be able to return the return type of the tested function',function(){
        // console.log(testModule1.DATA_PATH)
        //console.log(testModule.getQuestionType("test"));

       

        //var _getData  = testModule.loadQuestions();
        //console.log(_getData)
        var _getType = testModule.getQuestionType();
        console.log(_getType)

        testModule.getQuestionType.equal("undefined");
        // abc = document;
        //assert.equal(testModule.loadQuestions ,"HIM4670_LeadershipTheories");
    });

});

//var sinon = require("sinon");

var spy = sinon.spy();
var arg1
var obj
spy.called;
spy.callCount;
spy.calledWith(arg1);
spy.threw();
spy.returned(obj);

it('spy test', function(){
    var spy = sinon.spy(jQuery, 'ajax');
    $.getJSON('http://devmedia.capella.edu/CourseMedia/ansrsource/CapellaSourceFiles/Leadership%20Theories/data/Leadership%20Theories.json');
    spy.restore();
    sinon.assert.calledOnce(spy);
})






describe('Jquery Function Test', function(){
    it('Should be able to run Jquery Function Test',function(){
        var div = document.createElement('div');
        testModule.initUI ({
            root: div,
            background: 'green'
        });
        expect($('.btnSubmitQuiz').hide()).to.exist;;
    });

});

// describe('Jquery reset Function Test', function(){
//     it('Should be able to run Jquery Function Test',function(){
//         var div = document.createElement('div');
//         testModule.reset ({
//             root: div,
            
//         });
//         //console.log(cl('reset').typeOf);
//         expect($(".questionsContainer")).to.be.empty;
//     });

// });

// console.log(testModule);

// describe('initUI', function() {
  
//     // create some jsdom magic to allow jQuery to work
//     var doc = jsdom.jsdom(html),
//         window = doc.parentWindow,
//         $ = global.jQuery = require('jquery')(window);
    
//     it('does stuff', function() {
//       testModule.initUI();
//       console.log($('div.resourcesContainerParent').length);
//     });
//   });