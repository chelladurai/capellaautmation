(function( quizTranscriptCommon, $, undefined ) {
	
	var userSaveData;
	var currentQuestionGroupGUID;
	var callChainCount;
	
	quizTranscriptCommon.init = function init() {
		cl('initTranscript');
		initVars();
		initUI();
		setCallChainCount();
		IME.init(onIMEInitComplete);
	}	
	
	
	function initVars() {
		IME._mediaID = IME_MEDIA_ID;
		IME._persistenceURL = cmHelpers.getEnvironment();
	}
	
	function initUI() {
		
	}
	
	function setCallChainCount() {
		callChainCount = 2;
	}
	
	function onIMEInitComplete() {
		IME.loadState(onIMELoadComplete);
		loadQuestions();
	}
	
	function onIMELoadComplete(data) {
		cl('on IME Load Complete');
	
		if(data) {
			userSaveData = data;
		}
		else {
			userSaveData = SAVE_DATA_TEMPLATE;
		}
	
		//$.extend(userSaveData,SAVE_DATA_TEMPLATE);
		//extend without overwriting
		for (prop in SAVE_DATA_TEMPLATE) {
		    if(!userSaveData.hasOwnProperty(prop)) {
		        userSaveData[prop] = SAVE_DATA_TEMPLATE[prop];
		    }
		}
		cl(userSaveData);
		onDataLoadComplete();
	
	}
	
	//LOAD
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
	   })
	   /*.always(function(data){
	        if(data == ERROR_NO_USER_GUID) {
	            callback(ERROR_NO_USER_GUID);
	        }
	        else {
	            callback();
	        }
	   });*/
	}
	
	function onQuestionLoadComplete() {
		cl('onQuestionLoadComplete');
		checkForAllDataLoadsComplete();
	}

	
	function onDataLoadComplete() {
		checkForAllDataLoadsComplete();
	}
	
	function checkForAllDataLoadsComplete() {
		callChainCount--;
		if(callChainCount <= 0) {
			onAllDataLoadsComplete();
		}
	}
	
	function onAllDataLoadsComplete() {
		cl('onAllDataLoadsComplete');
		quizAppCommon.migrateData();
		reset();
		render();
		deserialize();
	}
	
	function reset() {
		
	}
	
	function render() {
		buildTitle();
		buildQuestions();
	}
	
	function buildTitle() {
		var headerSection =  $(TRANSCRIPT_SECTION_HEADER_TEMPLATE
							);	
		
	 	if( (quizData.quizTitle != undefined && quizData.quizTitle.length > 0) || (quizData.quizSubtitle != undefined && quizData.quizSubtitle.length > 0) ) {
	 		var quizTitle = $(TRANSCRIPT_TITLE
	 							.replace(PLACEHOLDER_QUIZ_TITLE,quizData.quizTitle)
								.replace(PLACEHOLDER_QUIZ_SUBTITLE,quizData.quizSubtitle)
							);	
	 		$(headerSection).append(quizTitle);
	 	}
	 	
	 	if(quizData.introDescription != undefined && quizData.introDescription.length > 0) {
	 		var quizIntro = $(TRANSCRIPT_INTRO
								.replace(PLACEHOLDER_QUIZ_INTRO_DESCRIPTION,quizData.introDescription)
							);
	 		$(headerSection).append(quizIntro);
	 	}
	 	
	 	if( (quizData.quizInstructionsHeader != undefined && quizData.quizInstructionsHeader.length > 0) ||
	 			(quizData.quizInstructionsDescription != undefined && quizData.quizInstructionsDescription.length > 0) ) {
	 		var quizInstructions = $(TRANSCRIPT_INSTRUCTIONS
	 							.replace(PLACEHOLDER_QUIZ_INSTRUCTIONS_HEADER,quizData.quizInstructionsHeader)
								.replace(PLACEHOLDER_QUIZ_INSTRUCTIONS_DESCRIPTION,quizData.quizInstructionsDescription)
							);	
	 		$(headerSection).append(quizInstructions);
	 	}
	 	
	 	
							
		$(headerSection).append('<hr class="hr-hash" aria-hidden="true" />');					
		$('#parentContainer').append(headerSection);	
	}
	
	function buildQuestions() {
		var transcriptSectionMain = $(TRANSCRIPT_SECTION_MAIN_TEMPLATE);
		
		//for each questionGroup
		$.each(quizData.questionGroups, function(i,questionGroup)  {
			var questionGroupTitle = $(TRANSCRIPT_QUESTION_GROUP_TITLE
										.replace(PLACEHOLDER_QUESTION_GROUP_TITLE,questionGroup.questionGroupTitle)
									 );	
		
			$(transcriptSectionMain).append(questionGroupTitle);						 
			
			var questionGroupDescription = $(TRANSCRIPT_QUESTION_GROUP_DESCRIPTION
										.replace(PLACEHOLDER_QUESTION_GROUP_DESCRIPTION,questionGroup.questionGroupDescription)
									 );	
		
			$(transcriptSectionMain).append(questionGroupDescription);
			
			$(transcriptSectionMain).append('<hr />');
			
			
			//for each question
			$.each(questionGroup.questions, function(j,question)  {
				buildQuestion(j,question,questionGroup,transcriptSectionMain);
			}); //end for each question
			
			//question group feedback
			if(questionGroup.questionGroupFeedback != undefined && questionGroup.questionGroupFeedback.length > 0) {
				var questionGroupFeedback = $(TRANSCRIPT_QUESTION_GROUP_FEEDBACK
					 							.replace(PLACEHOLDER_QUESTION_GROUP_FEEDBACK,questionGroup.questionGroupFeedback)
					 						);
				$(transcriptSectionMain).append(questionGroupFeedback);	 						
			}
				
									 
									 
		});
		if(isQuizCompleteFromSavedData(userSaveData) && quizData.quizCompleteFeedback != undefined && quizData.quizCompleteFeedback.length > 0) {
			
			var quizFeedback = $(TRANSCRIPT_QUIZ_FEEDBACK
									.replace(PLACEHOLDER_QUIZ_FEEDBACK,quizData.quizCompleteFeedback)
								);
			$(transcriptSectionMain).append(quizFeedback);
			$(transcriptSectionMain).append('<hr />');
		}
		
		if(isQuizCompleteFromSavedData(userSaveData) && quizData.showScore) {
			var quizScoreContainer = $(TRANSCRIPT_QUIZ_SCORE
										.replace(PLAHOLDER_QUIZ_SCORE,getTotalQuizPointsFromData())
										.replace(PLACEHOLDER_QUIZ_TOTAL_POSSIBLE_POINTS,getTotalPossibleQuizPointsFromData())
									  );	
			$(transcriptSectionMain).append(quizScoreContainer);
		}
		
		$("#parentContainer").append(transcriptSectionMain);
	};
	
	function buildQuestion(index,question,questionGroup,transcriptSectionMain) {
		var questionText = $(TRANSCRIPT_QUESTION_TEXT
										.replace(PLACEHOLDER_QUESTION_QUESTION_TEXT,question.questionText)
									 );		
		$(transcriptSectionMain).append(questionText);
		
		var questionType = getQuestionType(question);
		if(questionType === QUESTION_TYPE_MULTIPLE_CHOICE) {
			var transcriptAnswersListContainer = $(TRANSCRIPT_ANSWERS_LIST_CONTAINER);

			//populate question list
			$.each(question.answers, function(i,answer)  {
				//TRANSCRIPT_ANSWER_TEXT	
				var answerText = $(TRANSCRIPT_ANSWER_TEXT
									.replace(PLACEHOLDER_ANSWER_DATA_ANSWER_TEXT,answer.answerText)
								 );	
				transcriptAnswersListContainer.append(answerText);
				
				if(isQuestionAnsweredFromData(question.questionGUID,userSaveData) && answer.feedback != undefined && answer.feedback.length > 0) {
	 				var answerFeedback = $(TRANSCRIPT_ANSWER_FEEDBACK
	 										.replace(PLACEHOLDER_ANSWER_FEEDBACK,'<strong>Feedback: </strong>'+answer.feedback)
	 									  );
	 				transcriptAnswersListContainer.append(answerFeedback);
	 			}
				
			});
			$(transcriptSectionMain).append(transcriptAnswersListContainer);
			
			//is question answered? Purely from data, no DOM to inspect
			if( isQuestionAnsweredFromData(question.questionGUID,userSaveData) ) {
				var selectedAnswer
				//if randomized pull letter from stored data
				if(question.randomizeAnswers) {
					selectedAnswer = $(TRANSCRIPT_SELECTED_ANSWER_TEXT
										.replace(PLACEHOLDER_SELECTED_ANSWER,getSelectedAnswerLetterFromDataRandomized(question.questionGUID,userSaveData))
									);
				}
				else {
					selectedAnswer = $(TRANSCRIPT_SELECTED_ANSWER_TEXT
										.replace(PLACEHOLDER_SELECTED_ANSWER,getSelectedAnswerLetterFromData(question.questionGUID,userSaveData))
									);
				}
				
				$(transcriptSectionMain).append(selectedAnswer);
				
				//Likert has no correct answer
				if(getCorrectMultipleChoiceAnswerLetter(question.questionGUID)) {					
					var correctAnswer
					//if randomized pull letter from stored data
					if(question.randomizeAnswers) {
						correctAnswer = $(TRANSCRIPT_ANSWER_CORRECT_TEXT
											.replace(PLACEHOLDER_CORRECT_ANSWER,getCorrectAnswerLetterFromDataRandomized(question.questionGUID,userSaveData))
										);
					}
					else {
						correctAnswer = $(TRANSCRIPT_ANSWER_CORRECT_TEXT
											.replace(PLACEHOLDER_CORRECT_ANSWER,getCorrectMultipleChoiceAnswerLetter(question.questionGUID))
										);
					}
						
					$(transcriptSectionMain).append(correctAnswer);
				}
				
				if(quizData.useAttemptsScore) {
					var numberOfAttempts = getNumberOfAttemptsForQuestion(question.questionGUID,userSaveData);
					var numberOfQuestionAttempts;
					var scoreText;
					if(numberOfAttempts > 1) {
						numberOfQuestionAttempts = $(TRANSCRIPT_NUMBER_OF_QUESTION_ATTEMPTS
											.replace(PLACEHOLDER_NUMBER_OF_ATTEMPTS,numberOfAttempts)
										);
					}
					else {
						numberOfQuestionAttempts = $(TRANSCRIPT_NUMBER_OF_QUESTION_ATTEMPT
											.replace(PLACEHOLDER_NUMBER_OF_ATTEMPTS,numberOfAttempts)
										);
										
					}	
					$(transcriptSectionMain).append(numberOfQuestionAttempts);
					
					
					var attemptsScore = parseInt(getAttemptsScoreByQuestionGUID(question.questionGUID,questionType,numberOfAttempts));
					var possibleScore = parseInt(getMaxPossibleAttemptsScoreByQuestionGUID(question.questionGUID,questionType));
					if(attemptsScore > 1) {
						scoreText = $(TRANSCRIPT_QUESTION_POINTS
											.replace(PLACEHOLDER_QUESTION_POINTS,getAttemptsScoreByQuestionGUID(question.questionGUID,questionType,numberOfAttempts))
											.replace(PLACEHOLDER_TOTAL_QUESTION_POINTS,getMaxPossibleAttemptsScoreByQuestionGUID(question.questionGUID,questionType))
										);
					}
					else {
						scoreText = $(TRANSCRIPT_QUESTION_POINT
											.replace(PLACEHOLDER_QUESTION_POINTS,getAttemptsScoreByQuestionGUID(question.questionGUID,questionType,numberOfAttempts))
											.replace(PLACEHOLDER_TOTAL_QUESTION_POINTS,getMaxPossibleAttemptsScoreByQuestionGUID(question.questionGUID,questionType))
										);
					}
					$(transcriptSectionMain).append(scoreText);
					
				}
				
					
				
				
				//question-level feedback
				if( (question.feedback != undefined && question.feedback.length > 0) ||
					(question.feedbackCorrect != undefined && question.feedbackCorrect.length > 0) ||
					(question.feedbackIncorrect != undefined && question.feedbackIncorrect.length > 0) ) {
						var feedbackText;
						if((question.feedback!= undefined && question.feedback.length > 0)) {
							feedbackText= question.feedback	
						}
						else if((question.feedbackCorrect!= undefined && question.feedbackCorrect.length > 0)) {
							feedbackText= question.feedbackCorrect	
						}
						else if((question.feedbackIncorrect!= undefined && question.feedbackIncorrect.length > 0)) {
							feedbackText= question.feedbackIncorrect	
						}
//						$(transcriptSectionMain).append('<hr class="hr-hash">');
//						$(transcriptSectionMain).append('<h3>Feedback</h3>');
						//var conclusion
					 	var questionFeedback = $(TRANSCRIPT_QUESTION_FEEDBACK
					 		.replace(PLACEHOLDER_QUESTION_FEEDBACK,feedbackText)
					 	);
					 	$(transcriptSectionMain).append(questionFeedback);
				}
				
			}
			else {
				$(transcriptSectionMain).append( $(TRANSCRIPT_QUESTION_NOT_ANSWERED) );	
			}
			
		}
		else if(questionType === QUESTION_TYPE_MULTIPLE_SELECT) {
			var transcriptAnswersListContainer = $(TRANSCRIPT_ANSWERS_LIST_CONTAINER);

			//populate question list
			$.each(question.answers, function(i,answer)  {
				//TRANSCRIPT_ANSWER_TEXT	
				var answerText = $(TRANSCRIPT_ANSWER_TEXT
									.replace(PLACEHOLDER_ANSWER_DATA_ANSWER_TEXT,answer.answerText)
								 );	
				transcriptAnswersListContainer.append(answerText);
				
				if(isQuestionAnsweredFromData(question.questionGUID,userSaveData) && answer.feedback != undefined && answer.feedback.length > 0) {
	 				var answerFeedback = $(TRANSCRIPT_ANSWER_FEEDBACK
	 										.replace(PLACEHOLDER_ANSWER_FEEDBACK,'<strong>Feedback: </strong>'+answer.feedback)
	 									  );
	 				transcriptAnswersListContainer.append(answerFeedback);
	 			}
				
			});
			$(transcriptSectionMain).append(transcriptAnswersListContainer);
			var selectedAnswers;
			var correctAnswers;
			//if randomized pull letter from stored data
			if(question.randomizeAnswers) {
				selectedAnswers = getSelectedAnswerLetterFromDataRandomized(question.questionGUID,userSaveData);
				correctAnswers = getCorrectAnswerLetterFromDataRandomized(question.questionGUID,userSaveData);
			}			
			else {
				selectedAnswers = getSelectedAnswerLetterFromData(question.questionGUID,userSaveData);
				correctAnswers = getCorrectMultipleSelectAnswersLetter(question.questionGUID);
			}
			var selectedAnswer;
			var correctAnswer;
			var selectedAnswersString = selectedAnswers.toString().replace(/,/g,', ').replace(/,(?=[^,]+$)/, ' and ');
			var correctAnswersString = correctAnswers.toString().replace(/,/g,', ').replace(/,(?=[^,]+$)/, ' and ');
			
			
			if(selectedAnswers.length === 0) {
				$(transcriptSectionMain).append( $(TRANSCRIPT_QUESTION_NOT_ANSWERED) );		
			}
			else {
				if(selectedAnswers.length === 1) {
					selectedAnswer = $(TRANSCRIPT_SELECTED_ANSWER_TEXT
										.replace(PLACEHOLDER_SELECTED_ANSWER,selectedAnswersString)
									);		
				}
				else {
					selectedAnswer = $(TRANSCRIPT_SELECTED_ANSWERS_TEXT
										.replace(PLACEHOLDER_SELECTED_ANSWER,selectedAnswersString)
									);	
				}
				
				if(correctAnswers.length === 1) {
					correctAnswer = $(TRANSCRIPT_ANSWER_CORRECT_TEXT
										.replace(PLACEHOLDER_CORRECT_ANSWER,correctAnswersString)
									);		
				}
				
				else {
					correctAnswer = $(TRANSCRIPT_ANSWERS_CORRECT_TEXT
										.replace(PLACEHOLDER_CORRECT_ANSWER,correctAnswersString)
									);
				}
				$(transcriptSectionMain).append(selectedAnswer);
				$(transcriptSectionMain).append(correctAnswer);
				
			}
			if( isQuestionAnsweredFromData(question.questionGUID,userSaveData) ) {
				if( (question.feedback != undefined && question.feedback.length > 0) ||
						(question.feedbackCorrect != undefined && question.feedbackCorrect.length > 0) ||
						(question.feedbackIncorrect != undefined && question.feedbackIncorrect.length > 0) ) {
							var feedbackText;
							if((question.feedback!= undefined && question.feedback.length > 0)) {
								feedbackText= question.feedback	
							}
							else if((question.feedbackCorrect!= undefined && question.feedbackCorrect.length > 0)) {
								feedbackText= question.feedbackCorrect	
							}
							else if((question.feedbackIncorrect!= undefined && question.feedbackIncorrect.length > 0)) {
								feedbackText= question.feedbackIncorrect	
							}
//							$(transcriptSectionMain).append('<hr class="hr-hash">');
//							$(transcriptSectionMain).append('<h3>Feedback</h3>');
							//var conclusion
						 	var questionFeedback = $(TRANSCRIPT_QUESTION_FEEDBACK
						 		.replace(PLACEHOLDER_QUESTION_FEEDBACK,feedbackText)
						 	);
						 	$(transcriptSectionMain).append(questionFeedback);
					}
			}
			
		}
		
		else if(questionType === QUESTION_TYPE_EXPERT_RESPONSE) {
			var selectedAnswer = getSelectedAnswerLetterFromData(question.questionGUID,userSaveData);
						if(selectedAnswer == undefined) {
				$(transcriptSectionMain).append( $(TRANSCRIPT_QUESTION_NOT_ANSWERED) );
			}
			else {
				selectedAnswer = $(TRANSCRIPT_SELECTED_ANSWER_TEXT
										.replace(PLACEHOLDER_SELECTED_ANSWER,selectedAnswer)
									);	
			}
			$(transcriptSectionMain).append(selectedAnswer);
			
			if( (question.feedback != undefined && question.feedback.length > 0) ||
					(question.feedbackCorrect != undefined && question.feedbackCorrect.length > 0) ||
					(question.feedbackIncorrect != undefined && question.feedbackIncorrect.length > 0) ) {
						var feedbackText;
						if((question.feedback!= undefined && question.feedback.length > 0)) {
							feedbackText= question.feedback	
						}
						else if((question.feedbackCorrect!= undefined && question.feedbackCorrect.length > 0)) {
							feedbackText= question.feedbackCorrect	
						}
						else if((question.feedbackIncorrect!= undefined && question.feedbackIncorrect.length > 0)) {
							feedbackText= question.feedbackIncorrect	
						}
//						$(transcriptSectionMain).append('<hr class="hr-hash">');
//						$(transcriptSectionMain).append('<h3>Feedback</h3>');
						//var conclusion
					 	var questionFeedback = $(TRANSCRIPT_QUESTION_FEEDBACK
					 		.replace(PLACEHOLDER_QUESTION_FEEDBACK,feedbackText)
					 	);
					 	$(transcriptSectionMain).append(questionFeedback);
				}
			
			
		}
		
		else if(questionType === QUESTION_TYPE_FILL_IN_THE_BLANK) {
			
		}
		
		$(transcriptSectionMain).append('<hr />');
	}

	
	
	function deserialize() {
		
	}
	
	function getTotalPossibleQuizPointsFromData() {
		var returnVal = 0;
		$.each(quizData.questionGroups, function(i,questionGroup)  {
			returnVal += getTotalPossibleQuestionGroupPointsFromData(questionGroup.questionGroupGUID);
		});
		return returnVal;
	}
	
	function getTotalPossibleQuestionGroupPointsFromData(questionGroupGUID) {
		var runningTotal = 0;
		//for each question, the answer with the highest point value
		$.each(quizData.questionGroups, function(i,questionGroup)  {
			if(questionGroup.questionGroupGUID === questionGroupGUID) {
				$.each(questionGroup.questions, function(j,question) {
					var questionType = question.questionType;
					var questionTotal = 0;
					if (questionType === QUESTION_TYPE_FILL_IN_THE_BLANK) {
						/*if(quizData.useAttemptsScore) {
							questionTotal = getMaxPossibleAttemptsScoreByQuestionGUID(question.questionGUID,questionType);
						}
						else {*/
							runningTotal += getMaxPossiblePointsForFillInTheBlankByAnswerGUID(question.answers[0].answerGUID);
						//}
						runningTotal += questionTotal;
					}
					//only one point value for expert response
					else if( questionType === QUESTION_TYPE_EXPERT_RESPONSE) {
						runningTotal += parseInt(question.answers[0].points);
					}
					else {
						//for multiple choice, only highest value. For multiple select, pointsCorrect value on question
						if(questionType === QUESTION_TYPE_MULTIPLE_SELECT) {
							/*if(quizData.useAttemptsScore) {
								questionTotal = getMaxPossibleAttemptsScoreByQuestionGUID(question.questionGUID,questionType);
							}
							else {*/
								questionTotal = parseInt(question.pointsCorrect);
							//}
						}
						else if(questionType === QUESTION_TYPE_MULTIPLE_CHOICE) {
							/*if(quizData.useAttemptsScore) {
								questionTotal = getMaxPossibleAttemptsScoreByQuestionGUID(question.questionGUID,questionType);
							}
							else {*/
								$.each(question.answers, function(k,answer) {
									if(parseInt(answer.points) > parseInt(questionTotal)) {
										questionTotal = parseInt(answer.points);
									}
								}); //end each answer
							//}
						}
						runningTotal += questionTotal;
					}
				}); //end each question
			} //end for target question group
		}); //end each question group
		return parseInt(runningTotal);
	}
	
	function getTotalQuizPointsFromData() {
		var returnVal = 0;
		$.each(quizData.questionGroups, function(i,questionGroup)  {
			returnVal += getTotalQuestionGroupPointsFromData(questionGroup);
		});
		return returnVal;
	}
	
	function getTotalQuestionGroupPointsFromData(questionGroup) {
		//add up point values from all answered questions
		var runningTotal = 0;
		$.each(questionGroup.questions, function(i,question)  {
			//var questionGUID = $(question).attr('id');
				var questionType = question.questionType;
				//if multiple choice or fill in the blank, do this at the answer level. If multiple select need to look at all answers at once to determine if correct
				if(questionType === QUESTION_TYPE_MULTIPLE_CHOICE || questionType === QUESTION_TYPE_FILL_IN_THE_BLANK || questionType === QUESTION_TYPE_EXPERT_RESPONSE) {
					var selectedAnswer = getSelectedAnswerFromData(question.questionGUID,userSaveData);
					
					if(selectedAnswer != undefined) {
						runningTotal += selectedAnswer.points;	
					}
					/*$.each(question.answers, function(j,answer) {
						//if answer is selected
						var answerGUID = quizAppCommon.getFirstChildFormElement($(answer)).attr('id');
						if( quizAppCommon.isAnswerAnswered(answerGUID) ) {
							runningTotal += getPointsByAnswerGUID(answerGUID);
						}	
					});*/
				}
				else if(questionType === QUESTION_TYPE_MULTIPLE_SELECT) {
					runningTotal += getPointsForMultipleSelectQuestionFromData(question);
				}
	
		});
		return parseInt(runningTotal);
	}
	
	function getPointsForMultipleSelectQuestionFromData(question) {
		var points;
		var tempSelectedAnswers = getSelectedAnswerFromData(question.questionGUID,userSaveData);
		var selectedAnswers  = [];
		//only keep guid so arrays match
		$.each(tempSelectedAnswers, function(i,selectedAnswer) {
			selectedAnswers.push(selectedAnswer.answerGUID);
		});
		//build an array of correct answers
		var correctAnswers = [];
		//var questionData = getQuestionDataByQuestionGUID(questionGUID);
		$.each(question.answers, function(i,answer) {
			if(answer.isCorrect) {
				correctAnswers.push(answer.answerGUID);
			}
		});
	
		var allCorrect = doArraysMatch(correctAnswers,selectedAnswers);
		if(allCorrect) {
			/*if(quizData.useAttemptsScore) {
				//if using attemptsScore feature, score is based on number of attempts
				//incorrect points are not an array
				//cl(answer.points === 0);
				//incorrect
				if( !($.isArray(questionData.pointsCorrect) ) ) {
					points = questionData.pointsCorrect;
				}
				//correct
				else {
					var numberOfAttempts = $("#"+questionGUID).attr('number-of-attempts');
					points = getAttemptsScoreByQuestionGUID(questionGUID,QUESTION_TYPE_MULTIPLE_SELECT,numberOfAttempts);
				}
			}*/
			//else {
				points = question.pointsCorrect;
			//}
		}
		else {
			points = question.pointsIncorrect != undefined ? question.pointsIncorrect : 0;
		}
		return parseInt(points);
	}
	
	
	
	
	
}( window.quizTranscriptCommon = window.quizTranscriptCommon || {}, jQuery ));