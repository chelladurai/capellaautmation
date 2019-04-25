var quizData;

function getQuestionDataByAnswerGUID(answerGUID) {
	var returnVal;
	$.each(quizData.questionGroups, function(i,questionGroup)  {
		$.each(questionGroup.questions, function(j,question) {
			$.each(question.answers, function(k,answer) {
				var targetAnswerGUID = answer.answerGUID;
				if(targetAnswerGUID === answerGUID) {
					returnVal = question;
					return false;
				}
			}); //end for each answer
		}); //end for each question
	}); //end for each question group

	//if fill in the blank correct answers, use that as fallback
	if(returnVal === undefined) {
		//console.log('checking correctAnswers');
		$.each(quizData.questionGroups, function(i,questionGroup)  {
			$.each(questionGroup.questions, function(j,question) {
				$.each(question.correctAnswers, function(k,answer) {
					var targetAnswerGUID = answer.answerGUID;
					if(targetAnswerGUID === answerGUID) {
						returnVal = question;
						return false;
					}
				}); //end for each answer
			}); //end for each question
		}); //end for each question group
	}
	//if adding a new answer, it won't yet be part of the question data. So instead use its question GUID
	if(returnVal === undefined) {
		var questionGUID = getQuestionGUIDByAnswerGUID(answerGUID);
		//will return undefined if question is also DOM-only and not data (newly created)
		returnVal = getQuestionDataByQuestionGUID(questionGUID);
		if(returnVal === undefined) {
			returnVal = getQuestionDataFromDOMByQuestionGUID(questionGUID);
		}
	}

	return returnVal;
}

//For DOM-only (newly created) elements
function getQuestionGUIDByAnswerGUID(answerGUID) {
	var returnVal;
	if(answerGUID) {
		return answerGUID.substr(0,answerGUID.lastIndexOf("_")).replace('answer','question');
	}
	else {
		return false;
	}
}

function getQuestionDataByQuestionGUID(questionGUID) {
	var returnVal;
	$.each(quizData.questionGroups, function(i,questionGroup)  {
		$.each(questionGroup.questions, function(j,question) {
			var targetQuestionGUID = question.questionGUID;
			if(targetQuestionGUID === questionGUID) {
				returnVal = question;
				return false;
			}
		}); //end for each question
	}); //end for each question group

	//if undefined than question may only exist on the DOM, need to build it's data object from the DOM
	if(returnVal === undefined) {
		returnVal = getQuestionDataFromDOMByQuestionGUID(questionGUID);
	}

	return returnVal;
}

function getQuestionGroupDataByQuestionGUID(questionGUID) {
	var returnVal;
	$.each(quizData.questionGroups, function(i,questionGroup)  {
		$.each(questionGroup.questions, function(j,question) {
			var targetQuestionGUID = question.questionGUID;
			if(targetQuestionGUID === questionGUID) {
				returnVal = questionGroup;
				return false;
			}
		}); //end for each question
	}); //end for each question group

	//if undefined than question may only exist on the DOM, need to build it's data object from the DOM
	if(returnVal === undefined) {
		returnVal = getQuestionGroupDataFromDOMByQuestionGUID(questionGUID);
	}

	return returnVal;
}

function getQuestionGroupDataByQuestionGroupGUID(questionGroupGUID) {
	var returnVal;
	$.each(quizData.questionGroups, function(i,questionGroup)  {
		var targetQuestionGroupGUID = questionGroup.questionGroupGUID;
		if(targetQuestionGroupGUID === questionGroupGUID) {
			returnVal = questionGroup;
			return false;
		}
	}); //end for each question group

	return returnVal;
}

//Do DOM-only function for question group, just like below here for question. Build data objects from DOM
function getQuestionGroupDataFromDOMByQuestionGroupGUID(questionGroupGUID) {
	var questionGroupDOM = ('#'+questionGroupGUID);
	var newQuestionGroupData = {
		"questionGroupGUID":questionGroupGUID,
		"questionGroupText":$(questionGroupDOM).find('.questionGroupTextTools').find('input:first').val(),
		"randomizeQuestions":$(questionGroupDOM).find('.checkboxGroupRandomizeQuestions').find('input:first').is(':checked') ? true : false
	}
	return newQuestionGroupData;
}


function getAnswerDataFromDOMByAnswerGUID(answerGUID) {
	//for now just pushing the question data, not the answers, may need to add that later
	var answerDOM = $('#'+answerGUID);
	var answerData = {
			"answerGUID":answerGUID,
 			"answerText":$(answerDOM).find('.answerTextTools').find('input:first').val(),
 			"isCorrect":$(answerDOM).find('.answerIsCorrect').find('input:first').is(':checked') ? true : false,
 			"points":$(answerDOM).find('.answerPointsTools').find('input:first').val(),
 			"feedback":$(answerDOM).find('.answerFeedbackTools').find('input:first').val()
		}
	return answerData;
}


function getQuestionDataFromDOMByQuestionGUID(questionGUID) {
	//for now just pushing the question data, not the answers, may need to add that later
	var questionDOM = $('#'+questionGUID);
	var questionData = {
			"questionGUID":questionGUID,
 			"questionText":$(questionDOM).find('.questionTextTools').find('input:first').val(),
 			"questionType":$(questionDOM).find('.questionTypeToolsText').find('text').attr('value'),
 			"competency":$(questionDOM).find('.questionCompetencyTools').find('input:first').val(),
 			"randomizeAnswers":$(questionDOM).find('.checkboxGroupRandomizeAnswers').find('input:first').is(':checked')	? true : false
		}
		return questionData;
}

//DEPRICATED
/*
function getQuestionTypeValueByQuestionTypeDOM(questionTypeDOM) {
	var returnVal;
	if( $(questionTypeDOM).hasClass('questionTypeMultipleChoice') ) {
		returnVal = QUESTION_TYPE_MULTIPLE_CHOICE;
	}
	else if( $(questionTypeDOM).hasClass('questionTypeMultipleSelect') ) {
		returnVal = QUESTION_TYPE_MULTIPLE_SELECT;
	}
	else if( $(questionTypeDOM).hasClass('questionTypeFillInTheBlank') ) {
		returnVal = QUESTION_TYPE_FILL_IN_THE_BLANK;
	}
	else if( $(questionTypeDOM).hasClass('questionTypeExpertResponse') ) {
		returnVal = QUESTION_TYPE_EXPERT_RESPONSE;
	}
	return returnVal;
}
*/
function getQuestionTypeByAnswerGUID(answerGUID) {
	var returnVal;
	$.each(quizData.questionGroups, function(i,questionGroup)  {
		$.each(questionGroup.questions, function(j,question) {
			$.each(question.answers, function(k,answer) {
				var targetAnswerGUID = answer.answerGUID;
				if(targetAnswerGUID === answerGUID) {
					returnVal = question.questionType;
					return false;
				}
			}); //end for each answer
		}); //end for each question
	}); //end for each question group
	
	//if undefined than question may only exist on the DOM, need to build it's data object from the DOM
	//if(returnVal === undefined) {
	//	returnVal = getQuestionDataFromDOMByAnswerGUID(answerGUID).questionType;
	//}
	return returnVal;
}

function getQuestionTypeByQuestionGUID(questionGUID) {
	var returnVal;
	$.each(quizData.questionGroups, function(i,questionGroup)  {
		$.each(questionGroup.questions, function(j,question) {
			var targetQuestionGUID = question.questionGUID;
			if(targetQuestionGUID === questionGUID) {
				returnVal = question.questionType;
				return false;
			}
		}); //end for each question
	}); //end for each question group
	
	//if undefined than question may only exist on the DOM, need to build it's data object from the DOM
	if(returnVal === undefined) {
		returnVal = getQuestionDataFromDOMByQuestionGUID(questionGUID).questionType;
	}
	return returnVal;
}

function getAnswerDataByAnswerGUID(answerGUID) {
	var returnVal;
	$.each(quizData.questionGroups, function(i,questionGroup)  {
		$.each(questionGroup.questions, function(j,question) {
			$.each(question.answers, function(k,answer) {
				var targetAnswerGUID = answer.answerGUID;
				if(targetAnswerGUID === answerGUID) {
					returnVal = answer;
					return false;
				}
			}); //end for each answer

			//correctAnswers for fill in the blank
			$.each(question.correctAnswers, function(l,answer) {
				var targetAnswerGUID = answer.answerGUID;
				if(targetAnswerGUID === answerGUID) {
					returnVal = answer;
					return false;
				}
			}); //end for each answer

		}); //end for each question
	}); //end for each question group
	
	//if undefined, new answer, get from DOM
	if(returnVal === undefined) {
		returnVal = getAnswerDataFromDOMByAnswerGUID(answerGUID);	
	}
	
	return returnVal;
}

function getRelatedAnswerGUIDByResourceGUID(resourceGUID) {
	var returnVal = null;
	$.each(quizData.resources, function(i,resource)  {
		if(resourceGUID === resource.resourceGUID) {
			returnVal = resource.relatedAnswerGUID;
		}
	});
	return returnVal;
}

function getCorrectFillInTheBlankAnswersByQuestionGUID(questionGUID) {
	var returnVal;
	$.each(quizData.questionGroups, function(i,questionGroup)  {
		$.each(questionGroup.questions, function(j,question) {
			var targetQuestionGUID = question.questionGUID;
			if(targetQuestionGUID === questionGUID) {
				returnVal = question.correctAnswers;
				return false;
			}
		}); //end for each question
	}); //end for each question group
	return returnVal;
}

function getIncorrectFillInTheBlankAnswerByQuestionGUID(questionGUID) {
	var returnVal;
	$.each(quizData.questionGroups, function(i,questionGroup)  {
		$.each(questionGroup.questions, function(j,question) {
			var targetQuestionGUID = question.questionGUID;
			if(targetQuestionGUID === questionGUID) {
				returnVal = question.incorrectAnswer[0];
				return false;
			}
		}); //end for each question
	}); //end for each question group

	//if adding a new answer, it won't yet be part of the question data. So instead use its question GUID
//	if(returnVal === undefined) {
//		var questionGUID = getQuestionGUIDByAnswerGUID(answerGUID);
//		//will return undefined if question is also DOM-only and not data (newly created)
//		returnVal = getQuestionDataByQuestionGUID(questionGUID);
//		if(returnVal === undefined) {
//			returnVal = getQuestionDataFromDOMByQuestionGUID(questionGUID);
//		}
//	}



	return returnVal;
}

function getQuestionType(question) {
	var questionType;
	return question.questionType;
}

function getQuestionTypeDisplay(question) {
	//TODO: enum
	var returnVal;
	if(question.questionType === QUESTION_TYPE_MULTIPLE_CHOICE) {
		returnVal = "Multiple Choice";
	}
	else if(question.questionType === QUESTION_TYPE_MULTIPLE_SELECT) {
		returnVal = "Multiple Select";
	}
	else if(question.questionType === QUESTION_TYPE_FILL_IN_THE_BLANK) {
		returnVal = "Fill in the Blank";
	}
	else if(question.questionType === QUESTION_TYPE_EXPERT_RESPONSE) {
		returnVal = "Expert Response";
	}
	return returnVal;
}


function getNumberOfAttemptsByQuestionGUID(questionGUID) {
	var returnVal;
	var questionDOM = $('#'+questionGUID);
	returnVal =  $(questionDOM).attr('number-of-attempts');
	return returnVal;

}

function getAttemptsScoreByQuestionGUID(questionGUID,questionType,numberOfAttempts) {
	var returnVal;
	$.each(quizData.questionGroups, function(i,questionGroup)  {
		$.each(questionGroup.questions, function(j,question) {
			var targetQuestionGUID = question.questionGUID;
			if(targetQuestionGUID === questionGUID) {
				if(questionType === QUESTION_TYPE_MULTIPLE_CHOICE) {
					//find correct answer
					$.each(question.answers, function(k,answer) {
						//only one
						if(answer.isCorrect) {
							//here points is an array of attempt values
							var points = answer.points;
							var runningPoints = 0;

							//if numberOfAttempts is greater than the max, award the -1 attemptCount point value
							var maxNumberOfAttempts = getMaxNumberOfAttemptsByQuestionGUID(questionGUID,questionType);
							if(numberOfAttempts > maxNumberOfAttempts) {
								$.each(points, function(l,attempt) {
									if(attempt.attemptCount === -1) {
										runningPoints = attempt.points;
									}
								});
							}

							//else interate and calculate
							else {
								$.each(points, function(l,attempt) {
									if(attempt.attemptCount == numberOfAttempts) {
										runningPoints = attempt.points;
									}
								});
							}
							returnVal = runningPoints;
						}

					}); //end for each answer

				} //end if multiple choice
				else if(questionType === QUESTION_TYPE_MULTIPLE_SELECT) {
					//here points is an array of attempt values
					var points = question.pointsCorrect;
					var runningPoints = 0;


					//if numberOfAttempts is greater than the max, award the -1 attemptCount point value
					var maxNumberOfAttempts = getMaxNumberOfAttemptsByQuestionGUID(questionGUID,questionType);
					if(numberOfAttempts > maxNumberOfAttempts) {
						$.each(points, function(l,attempt) {
							if(attempt.attemptCount === -1) {
								runningPoints = attempt.points;
							}
						});
					}
					else {
						$.each(points, function(l,attempt) {
							if(attempt.attemptCount == numberOfAttempts) {
								runningPoints = attempt.points;
							}
						});
					}
					returnVal = runningPoints;
				} //end if multiple select

				else if( questionType === QUESTION_TYPE_FILL_IN_THE_BLANK) {
					var runningPoints = 0;
					var correctAnswers = question.correctAnswers;
					$.each(question.correctAnswers, function(k,correctAnswer) {
						//look for primary correct flag, this returns the max possible amount of points
						if(	correctAnswer.isPrimaryCorrect ) {
							var points = correctAnswer.points;
							$.each(points, function(l,attempt) {
								if(attempt.attemptCount == numberOfAttempts) {
									runningPoints = attempt.points;
								}
							});
						}
					});
					returnVal = runningPoints;
				} //end if fill in the blank

				//unhandled
				else {
					console.log('unahndled question type of '+questionType);
				}
			}
		}); //end for each question
	}); //end for each question group
	return parseInt(returnVal);
}


function getMaxPossibleAttemptsScoreByQuestionGUID(questionGUID,questionType) {
	var returnVal;
	$.each(quizData.questionGroups, function(i,questionGroup)  {
		$.each(questionGroup.questions, function(j,question) {
			var targetQuestionGUID = question.questionGUID;
			if(targetQuestionGUID === questionGUID) {
				if(questionType === QUESTION_TYPE_MULTIPLE_CHOICE) {
					//find correct answer
					$.each(question.answers, function(k,answer) {
						//only one
						if(answer.isCorrect) {
							//here points is an array of attempt values
							var points = answer.points;
							var runningTopPossiblePoints = 0;
							$.each(points, function(l,attempt) {
								if(attempt.points > runningTopPossiblePoints) {
									runningTopPossiblePoints = attempt.points;
								}
							});
							returnVal = runningTopPossiblePoints;
						}

					}); //end for each answer

				} //end if multiple choice
				else if(questionType === QUESTION_TYPE_MULTIPLE_SELECT) {
					//here points is an array of attempt values
					var points = question.pointsCorrect;
					var runningTopPossiblePoints = 0;
					$.each(points, function(l,attempt) {
						if(attempt.points > runningTopPossiblePoints) {
							runningTopPossiblePoints = attempt.points;
						}
					});
					returnVal = runningTopPossiblePoints;
				} //end if multiple select

				else if( questionType === QUESTION_TYPE_FILL_IN_THE_BLANK) {
					var runningTopPossiblePoints = 0;
					var correctAnswers = question.correctAnswers;
					$.each(question.correctAnswers, function(k,correctAnswer) {
						//look for primary correct flag, this returns the max possible amount of points
						if(	correctAnswer.isPrimaryCorrect ) {
							var points = correctAnswer.points;
							$.each(points, function(l,attempt) {
								if(attempt.points > runningTopPossiblePoints) {
									runningTopPossiblePoints = attempt.points;
								}
							});
							returnVal = runningTopPossiblePoints;
						}
					});
				} //end if fill in the blank

				//unhandled
				else {
					console.log('unahndled question type of '+questionType);
				}
			}
		}); //end for each question
	}); //end for each question group
	return parseInt(returnVal);
}

//how many levels of retry are defined before we hit the 'default' value?
function getMaxNumberOfAttemptsByQuestionGUID(questionGUID,questionType) {
	var returnVal;
	$.each(quizData.questionGroups, function(i,questionGroup)  {
		$.each(questionGroup.questions, function(j,question) {
			var targetQuestionGUID = question.questionGUID;
			if(targetQuestionGUID === questionGUID) {
				if(questionType === QUESTION_TYPE_MULTIPLE_CHOICE) {
					//find correct answer
					$.each(question.answers, function(k,answer) {
						//only one
						if(answer.isCorrect) {
							//here points is an array of attempt values
							var points = answer.points;
							var runningTopAttemptCount = 0;
							$.each(points, function(l,attempt) {
								if(attempt.attemptCount > runningTopAttemptCount) {
									runningTopAttemptCount = attempt.attemptCount;
								}
							});
							returnVal = runningTopAttemptCount;
						}

					}); //end for each answer

				} //end if multiple choice
				else if(questionType === QUESTION_TYPE_MULTIPLE_SELECT) {
					//here points is an array of attempt values
					var points = question.pointsCorrect;
					var runningTopAttemptCount = 0;
					$.each(points, function(l,attempt) {
						if(attempt.attemptCount > runningTopAttemptCount) {
							runningTopAttemptCount = attempt.attemptCount;
						}
					});
					returnVal = runningTopAttemptCount;
				} //end if multiple select
			}
		}); //end for each question
	}); //end for each question group
	return returnVal;
}

function getPaginationElementByQuestionGUID(questionGUID) {
	var returnVal;
	var paginationID = $("#"+questionGUID).parents('.pagination-content-page').attr('id');
	$('#pagination-nav').find('.pagination-nav-item').each(
		function(i, paginationItem) {
			if( $(paginationItem).attr('aria-controls') === paginationID ) {
				returnVal = paginationItem;
			}
		}
	);
	return returnVal;
}

function getPaginationElementByQuestionGroupGUID(questionGroupGUID) {
	var returnVal;
	var paginationID = $("#"+questionGroupGUID).parents('.pagination-content-page').attr('id');
	$('#pagination-nav').find('.pagination-nav-item').each(
		function(i, paginationItem) {
			if( $(paginationItem).attr('aria-controls') === paginationID ) {
				returnVal = paginationItem;
			}
		}
	);
	return returnVal;
}

function getPaginationOptionByQuestionGroupGUID(questionGroupGUID) {
	var returnVal;
	$('#selectPage').find('option').each(
		function(i,option) {
			if( $(option).attr('value').replace('pagination-content-page','') === questionGroupGUID.replace('questionGroup','') ) {
				returnVal = option;
			}
		}
	);
	return returnVal;
}


function getHighestAttemptCountByAnswerGUID(answerGUID) {
	var answerDOM = $("#"+answerGUID);
	var runningVal = -2;
	answerDOM.find('.answerPointsAttemptsContainerTools').find('.answerAttemptTools').each(
		function(i,attempt) {
			if($(attempt).find('.answerAttemptToolsCount').find('input').val() > runningVal) {
				runningVal = $(attempt).find('.answerAttemptToolsCount').find('input').val();
			}
		}
	);
	return Number(runningVal);
}

function getHighestAttemptDOMByAnswerGUID(answerGUID) {
	var answerDOM = $("#"+answerGUID);
	var runningVal = 0;
	var returnVal;
	answerDOM.find('.answerPointsAttemptsContainerTools').find('.answerAttemptTools').each(
		function(i,attempt) {
			if($(attempt).find('.answerAttemptToolsCount').find('input').val() > runningVal) {
				runningVal = $(attempt).find('.answerAttemptToolsCount').find('input').val();
				returnVal = attempt;
			}
		}
	);
	return returnVal;
}

function getFillInTheBlankFeedbackByAnswerGUID(answerGUID) {
	//match current entered answer against acceptible answers
	var feedback = '';
	var questionData = getQuestionDataByAnswerGUID(answerGUID);
	var currentAnswer = $('#'+answerGUID).val();
	$.each(questionData.correctAnswers, function(i,correctAnswer)  {
		if( quizAppCommon.formatStringForTextEntryCorrectnessCheck(currentAnswer) === quizAppCommon.formatStringForTextEntryCorrectnessCheck(correctAnswer.answerText) ) {
			//correct
			feedback = correctAnswer.feedback;
			return false;
		}
		else {
			//incorrect
			feedback = questionData.incorrectAnswer[0].feedback;
			return false;
		}
	}); //end for each correct answer
	return feedback;
}

function getCorrectMultipleChoiceAnswer(questionGUID) {
	var returnVal = false;
	var question = getQuestionDataByQuestionGUID(questionGUID);

	$.each(question.answers, function(k,answer) {
		if(answer.isCorrect) {
			returnVal = answer.answerGUID;
		}
	}); //end for each answer
	return returnVal;
}

function getCorrectMultipleChoiceAnswerData(questionGUID) {
	var returnVal = false;
	var question = getQuestionDataByQuestionGUID(questionGUID);

	$.each(question.answers, function(k,answer) {
		if(answer.isCorrect) {
			returnVal = answer;
		}
	}); //end for each answer
	return returnVal;
}

function getCorrectMultipleChoiceAnswerLetter(questionGUID) {
	var returnVal = false;
	var question = getQuestionDataByQuestionGUID(questionGUID);

	$.each(question.answers, function(k,answer) {
		if(answer.isCorrect) {
			returnVal = getAnswerLetter(answer.answerGUID,k);
		}
	}); //end for each answer
	return returnVal;
}

//returns array of selected answers
function getCorrectMultipleSelectAnswers(questionGUID) {
	//build an array of correct answers
	var correctAnswers = [];
	var questionData = getQuestionDataByQuestionGUID(questionGUID);
	$.each(questionData.answers, function(k,answer) {
		if(answer.isCorrect) {
			correctAnswers.push(answer.answerGUID);
		}
	});

	return correctAnswers;

}

function getCorrectMultipleSelectAnswersLetter(questionGUID) {
	//build an array of correct answers
	var correctAnswers = [];
	var questionData = getQuestionDataByQuestionGUID(questionGUID);
	$.each(questionData.answers, function(k,answer) {
		if(answer.isCorrect) {
			correctAnswers.push(getAnswerLetter(answer.answerGUID,k));
		}
	});

	return correctAnswers;

}

function getAnswerLetter(answerGUID,position) {
	var returnVal = '';
	//use array position if available
	//else get position from DOM
	if(position == undefined) {
		var position;
		var answerDOM = $('#'+answerGUID).parents('.answerContainer:first');
		position = ( $(answerDOM).index() );
	}

	returnVal = String.fromCharCode(97 + position);
	return returnVal;
}

function getMaxPossiblePointsForFillInTheBlankByAnswerGUID(answerGUID) {
	var highestPoints = 0;
	var questionData = getQuestionDataByAnswerGUID(answerGUID);
	$.each(questionData.correctAnswers, function(i,correctAnswer)  {
		if(correctAnswer.points > highestPoints) {
			highestPoints = correctAnswer.points;
		}
	});
	return parseInt(highestPoints);
}

function getAllQuizQuestions() {
	var returnVal = [];
	
	$.each(quizData.questionGroups, function(i,questionGroup) {
		$.each(questionGroup.questions, function(j,question) {
			returnVal.push(question);	
		});
	});
	return returnVal;	
}

function getTotalNumberOfQuizQuestions() {
	var returnVal = 0;
	
	$.each(quizData.questionGroups, function(i,questionGroup) {
		$.each(questionGroup.questions, function(j,question) {
			returnVal++;
		});
	});
	return returnVal;	
}

function getCurrentQuestionNumberForAllQuestions(questionGUID) {
	var returnVal;
	var allQuestions = [];
	
	$.each(quizData.questionGroups, function(i,questionGroup) {
		$.each(questionGroup.questions, function(j,question) {
			allQuestions.push(question);	
		});
	});
		
	$.each(allQuestions, function(i,question) {
		if(questionGUID === question.questionGUID) {
			returnVal = i;
			return false;
			
		}
	});
	return returnVal;
}

//using saved user data, not the DOM, to determine completion. Used in dynamic transcripts
function isQuizCompleteFromSavedData(userSaveData) {
	var areAllQuestionsComplete = true;
	$.each(quizData.questionGroups, function(i,questionGroup) {
		$.each(questionGroup.questions, function(j,question) {
			var isQuestionAnswered= false;
			$.each(question.answers, function(k,answer) {
				//answerGUID must exist in data
				//cl(answer.answerGUID);
				$.each(userSaveData.multiplechoicequestions, function(l,question) {
					if(question.answerguid === answer.answerGUID) {
						isQuestionAnswered = true;
					}
				});
				$.each(userSaveData.multipleselectquestions, function(l,question) {
					if(question.answerguid === answer.answerGUID) {
						isQuestionAnswered = true;
					}
				});
				$.each(userSaveData.expertresponsequestions, function(l,question) {
					if(question.answerguid === answer.answerGUID) {
						isQuestionAnswered = true;
					}
				});
			});
			if(!isQuestionAnswered) {
				areAllQuestionsComplete = false;	
			}
		});
	});
	return areAllQuestionsComplete;
}

function isQuestionAnsweredFromData(questionGUID,userSaveData) {
		var returnVal = false;	
		var question = getQuestionDataByQuestionGUID(questionGUID);
		//check all saved answerGUIDs. Get their cooresponding questionGUID. If there's a match, the question is answered
		var questionType = getQuestionType(question);
		if(questionType === QUESTION_TYPE_MULTIPLE_CHOICE) {
			$.each(userSaveData.multiplechoicequestions, function(i,answer) {
				var testQuestionGUID = getQuestionGUIDByAnswerGUID(answer.answerguid);
				if(testQuestionGUID === questionGUID) {
					returnVal = true;
					return false;
				}
			});
			
		}
		else if(questionType === QUESTION_TYPE_MULTIPLE_SELECT) {
			$.each(userSaveData.multipleselectquestions, function(i,answer) {
				var testQuestionGUID = getQuestionGUIDByAnswerGUID(answer.answerguid);
				if(testQuestionGUID === questionGUID) {
					returnVal = true;
					return false;
				}
			});	
			
		}
		
		else if(questionType === QUESTION_TYPE_EXPERT_RESPONSE) {
			$.each(userSaveData.expertresponsequestions, function(i,answer) {
				var testQuestionGUID = getQuestionGUIDByAnswerGUID(answer.answerguid);
				if(testQuestionGUID === questionGUID) {
					returnVal = true;
					return false;
				}
			});	
			
		}
		
		else if(questionType === QUESTION_TYPE_FILL_IN_THE_BLANK) {
				
			
		}
		return returnVal;
	}
	
	function getSelectedAnswerLetterFromData(questionGUID,userSaveData) {
		var returnVal;	
		var question = getQuestionDataByQuestionGUID(questionGUID);
		var questionType = getQuestionType(question);
		if(questionType === QUESTION_TYPE_MULTIPLE_CHOICE) {
			$.each(userSaveData.multiplechoicequestions, function(i,answer) {
				var testQuestionGUID = getQuestionGUIDByAnswerGUID(answer.answerguid);
				if(testQuestionGUID === questionGUID) {
					var index = parseInt(answer.answerguid.substr(answer.answerguid.lastIndexOf("_") + 1))-1;
					returnVal = getAnswerLetter(answer.answerguid,index);
					return false;
				}
			});
		}
		else if(questionType === QUESTION_TYPE_MULTIPLE_SELECT) {
			returnVal = [];
			$.each(userSaveData.multipleselectquestions, function(i,answer) {
				var testQuestionGUID = getQuestionGUIDByAnswerGUID(answer.answerguid);
				if(testQuestionGUID === questionGUID) {
					var index = parseInt(answer.answerguid.substr(answer.answerguid.lastIndexOf("_") + 1))-1;
					returnVal.push(getAnswerLetter(answer.answerguid,index));
				}
			});
		}
		else if(questionType === QUESTION_TYPE_EXPERT_RESPONSE) {
			$.each(userSaveData.expertresponsequestions, function(i,answer) {
				var testQuestionGUID = getQuestionGUIDByAnswerGUID(answer.answerguid);
				if(testQuestionGUID === questionGUID) {
					returnVal = answer.answertext;
					return false;
				}
			});
		}
		else if(questionType === QUESTION_TYPE_FILL_IN_THE_BLANK) {
				
			
		}
		return returnVal;
	}
	
	//if question is randomized, pull the letter from stored data. Used in transcripts
	function getSelectedAnswerLetterFromDataRandomized(questionGUID,userSaveData) {
		var returnVal;	
		var question = getQuestionDataByQuestionGUID(questionGUID);
		var questionType = getQuestionType(question);
		if(questionType === QUESTION_TYPE_MULTIPLE_CHOICE) {
			$.each(userSaveData.multiplechoicequestions, function(i,answer) {
				var testQuestionGUID = getQuestionGUIDByAnswerGUID(answer.answerguid);
				if(testQuestionGUID === questionGUID) {
					if(answer.selectedletter != undefined && answer.selectedletter.length > 0) {
						returnVal = answer.selectedletter;	
					}
					return false;
				}
			});
		}
		else if(questionType === QUESTION_TYPE_MULTIPLE_SELECT) {
			returnVal = [];
			$.each(userSaveData.multipleselectquestions, function(i,answer) {
				var testQuestionGUID = getQuestionGUIDByAnswerGUID(answer.answerguid);
				if(testQuestionGUID === questionGUID) {
					if(answer.selectedletters != undefined && answer.selectedletters.length > 0) {
						returnVal = answer.selectedletters;	
					}
				}
			});
		}
		else if(questionType === QUESTION_TYPE_EXPERT_RESPONSE) {
			$.each(userSaveData.expertresponsequestions, function(i,answer) {
				var testQuestionGUID = getQuestionGUIDByAnswerGUID(answer.answerguid);
				if(testQuestionGUID === questionGUID) {
					returnVal = answer.answertext;
					return false;
				}
			});
		}
		else if(questionType === QUESTION_TYPE_FILL_IN_THE_BLANK) {
				
			
		}
		return returnVal;
	}
	
	function getCorrectAnswerLetterFromDataRandomized(questionGUID,userSaveData) {
		var returnVal;	
		var question = getQuestionDataByQuestionGUID(questionGUID);
		var questionType = getQuestionType(question);
		if(questionType === QUESTION_TYPE_MULTIPLE_CHOICE) {
			$.each(userSaveData.multiplechoicequestions, function(i,answer) {
				var testQuestionGUID = getQuestionGUIDByAnswerGUID(answer.answerguid);
				if(testQuestionGUID === questionGUID) {
					if(answer.correctletter != undefined && answer.correctletter.length > 0) {
						returnVal = answer.correctletter;	
					}
					return false;
				}
			});
		}
		else if(questionType === QUESTION_TYPE_MULTIPLE_SELECT) {
			returnVal = [];
			$.each(userSaveData.multipleselectquestions, function(i,answer) {
				var testQuestionGUID = getQuestionGUIDByAnswerGUID(answer.answerguid);
				if(testQuestionGUID === questionGUID) {
					if(answer.correctanswerletters != undefined && answer.correctanswerletters.length > 0) {
						returnVal = answer.correctanswerletters;	
					}
				}
			});
		}
		else if(questionType === QUESTION_TYPE_EXPERT_RESPONSE) {
			$.each(userSaveData.expertresponsequestions, function(i,answer) {
				var testQuestionGUID = getQuestionGUIDByAnswerGUID(answer.answerguid);
				if(testQuestionGUID === questionGUID) {
					returnVal = answer.answertext;
					return false;
				}
			});
		}
		else if(questionType === QUESTION_TYPE_FILL_IN_THE_BLANK) {
				
			
		}
		return returnVal;
	}
	
	function getSelectedAnswerFromData(questionGUID,userSaveData) {
		var returnVal;	
		var question = getQuestionDataByQuestionGUID(questionGUID);
		var questionType = getQuestionType(question);
		if(questionType === QUESTION_TYPE_MULTIPLE_CHOICE) {
			$.each(userSaveData.multiplechoicequestions, function(i,answer) {
				var testQuestionGUID = getQuestionGUIDByAnswerGUID(answer.answerguid);
				if(testQuestionGUID === questionGUID) {
					var index = parseInt(answer.answerguid.substr(answer.answerguid.lastIndexOf("_") + 1))-1;
					returnVal = getAnswerDataByAnswerGUID(answer.answerguid);
					return false;
				}
			});
		}
		else if(questionType === QUESTION_TYPE_MULTIPLE_SELECT) {
			returnVal = [];
			$.each(userSaveData.multipleselectquestions, function(i,answer) {
				var testQuestionGUID = getQuestionGUIDByAnswerGUID(answer.answerguid);
				if(testQuestionGUID === questionGUID) {
					var index = parseInt(answer.answerguid.substr(answer.answerguid.lastIndexOf("_") + 1))-1;
					returnVal.push(getAnswerDataByAnswerGUID(answer.answerguid));
				}
			});
		}
		else if(questionType === QUESTION_TYPE_EXPERT_RESPONSE) {
			$.each(userSaveData.expertresponsequestions, function(i,answer) {
				var testQuestionGUID = getQuestionGUIDByAnswerGUID(answer.answerguid);
				if(testQuestionGUID === questionGUID) {
					returnVal = getAnswerDataByAnswerGUID(answer.answerguid);
					return false;
				}
			});
		}
		else if(questionType === QUESTION_TYPE_FILL_IN_THE_BLANK) {
				
			
		}
		return returnVal;
	}
	
	function getNumberOfAttemptsForQuestion(questionGUID,userSaveData) {
		var returnVal;	
		var question = getQuestionDataByQuestionGUID(questionGUID);
		$.each(userSaveData.numberofattemptsperquestion, function(i,numAttemptsObj) {
			if(numAttemptsObj.questionguid != undefined && numAttemptsObj.questionguid.length > 0) {
				if(	numAttemptsObj.questionguid === questionGUID) {
					returnVal = parseInt(numAttemptsObj.numberofattempts);
					return false;
				}
			}
		});
		return returnVal;
	}
	
	function getTotalNumberOfQuestions() {
		var returnVal = 0;
		$.each(quizData.questionGroups, function(i,questionGroup)  {
			$.each(questionGroup.questions, function(j,question) {
				returnVal++;
			});
		});
		return returnVal;
	}
	
	function getSelectedAnswersByQuestionGUID(questionGUID) {
		var returnVal;
		var questionType = getQuestionTypeByQuestionGUID(questionGUID);
		var questionDOM = $('#'+questionGUID);
		//if multiple choice or fill in the blank, do this at the answer level. If multiple select need to look at all answers at once to determine if correct
		if(questionType === QUESTION_TYPE_MULTIPLE_CHOICE || questionType === QUESTION_TYPE_FILL_IN_THE_BLANK || questionType === QUESTION_TYPE_EXPERT_RESPONSE) {
			$(questionDOM).find('.answer').each(
				function(j,answer) {
				//if answer is selected
				var answerGUID = quizAppCommon.getFirstChildFormElement($(answer)).attr('id');
				if( quizAppCommon.isAnswerAnswered(answerGUID) ) {
					returnVal = answerGUID;
				}
			});
		}
		else if(questionType === QUESTION_TYPE_MULTIPLE_SELECT) {
			returnVal = [];
			$(questionDOM).find('.answer').each(
				function(z,answer) {
					//if( $(answer).children('input:first').prop('checked') ) {
						returnVal.push( quizAppCommon.getFirstChildFormElement($(answer)).attr('id') );
					//}
				}
			);	
		}
		return returnVal;
		
	}
	
	//return which page number the question is on
	function getPageNumberByQuestionGUID(questionGUID) {
		var returnVal;
		return $('.questionContainer[id="'+questionGUID+'"]').parents('.pagination-content-page').attr('id').replace('pagination-content-page','');
	}


jQuery.fn.insertAt = function(index, element) {
  var lastIndex = this.children().size();
  if (index < 0) {
    index = Math.max(0, lastIndex + 1 + index);
  }
  this.append(element);
  if (index < lastIndex) {
    this.children().eq(index).before(this.children().last());
  }
  return this;
}


//Scroll to newly added element
//TODO: add scroll back on element delete. Need to calculate first prev element (if question 2 removed, goto 1; if all questions removed, go to prev question, last answer. etc.)
function scrollToElement(elementGUID) {
	 $('body, html').animate({ scrollTop: $(elementGUID).offset().top }, 1000);
}

function doArraysMatch(a1,a2) {
	var returnVal = (a1.length == a2.length) && a1.every(
		function(element, index) {
		    return element === a2[index];
		}
	);
	return returnVal;
}
