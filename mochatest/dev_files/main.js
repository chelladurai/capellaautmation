(function( quizAppCommon, $, undefined ) {
	var userSaveData;
	var currentQuestionGroupGUID;
	var callChainCount;
	var textSaveTimer;
	
	quizAppCommon.init = function init() {
		initVars();
		initUI();
		setCallChainCount();
		IME.init(onIMEInitComplete);
	}
	
	quizAppCommon.initForPreview = function initForPreview() {
		initVars();
		initUI();
		setCallChainCount();
		//IME.init(onIMEInitCompleteForPreview);
		quizData = JSON.parse(localStorage['quizPreviewData']);
		onDataLoadComplete();
		onQuestionLoadComplete();
	
	}
	
	function initVars() {
		IME._mediaID = IME_MEDIA_ID;
		IME._persistenceURL = cmHelpers.getEnvironment();
		userSaveData = SAVE_DATA_TEMPLATE;
		userSaveData.url = cmHelpers.getPageURL();
		console.log(IME._mediaID)
		console.log(IME._persistenceURL)
		/** any app-specific vars */
		quizApp.initVars();
	}
	
	function initUI() {
	//RESTORE FOR NEW WRAPPER
		$('.resourcesContainerParent').hide();
		$('.quizScoreContainerParent').hide();
		//$('.quizButtonsContainer').hide();
		$('.quizFeedbackContainerParent').hide();
		$('.btnSubmitQuiz').hide();
		$('.btnResetQuiz').hide();
		$('.quizButtonsContainer').hide();
	}
	
	function setCallChainCount() {
		//use to make asynch load calls w/o race conditions
		//load quiz JSON plus load from IME
		//can make this fancier if needed
		callChainCount = 2;
	}
	/*
	function onIMEInitCompleteForPreview() {
		quizData = JSON.parse(localStorage['quizPreviewData']);
		onDataLoadComplete();
		onQuestionLoadComplete();
	}
	*/
	function onIMEInitComplete() {
		cl('onIMEInitComplete');
		IME.loadState(onIMELoadComplete);
		loadQuestions();
	}
	
	function onIMELoadComplete(data) {
		cl('on IME Load Complete');
	
		console.log(data);
	
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
	
		onDataLoadComplete();
	
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
		setBindings();
		//after deserialize, check each question group for completion and set UI
		checkForAllQuestionGroupsComplete();
		quizAppCommon.checkForQuizComplete();
		//check for all answered if not complete
		if(!isQuizComplete()) {
			checkForAllQuestionGroupsAllAnswered();
			checkForQuizAllAnswered();
		}
		if(quizData.useTabs) {
			onSwitchTabs();	
		}
		else {
			onSwitchPage();	
		}
		
		//serialize after render, to support question randomization keeping in synch with the transcript
		//if this leads to a performance issue look into serializing only when transcript link is clicked...but in that case need to pass a callback to not nav to transcript until IME save is done
		//to prevent race condition with transcript render
		quizAppCommon.serialize();
	
	}
	
	quizAppCommon.migrateData = function migrateData() {
		cl('migrate data');
		//competency: question level --> questionGroupLevel
			//not editable so not part of userSaveData
	
		$.each(quizData.questionGroups, function(i,questionGroup)  {
			$.each(questionGroup.questions, function(j,question) {
				if(question.competency != undefined && question.competency.length > 0) {
					//if competency already exists at the questionGroup level, don't override
					if(!(questionGroup.questionGroupCompetency != undefined && questionGroup.questionGroupCompetency.length > 0)) {
						questionGroup.questionGroupCompetency = question.competency;
					}
					//delete competency from all questions
					delete question.competency;
				}
			});
		});
	
		//if showQuizScore undefined default to true for legacy support
		if( quizData.showQuizScore == undefined) {
			quizData.showQuizScore = true;	
		}
		
		if( quizData.quizSubtitle == undefined && quizData.quizDescription != undefined) {
			quizData.quizSubtitle = quizData.quizDescription;	
		}
	}
	
	function reset() {
		cl('reset');
		$(".questionsContainer").empty();
		$(".resourcesContainer").empty();
		//$(".quizScoreContainer").empty();
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

	exports.loadQuestions = loadQuestions
	
	function onQuestionLoadComplete() {
		cl('onQuestionLoadComplete');
		checkForAllDataLoadsComplete();
	}
	
	function render() {
		buildContainers();
		randomizeQuestions();
		if(quizData.maxNumberOfAnswersPerQuestion) {
			truncateAnswers();	
		}
		if(quizData.usePagination) {
			buildPagination();
		}
		if(quizData.showProgress) {
			buildProgress();	
		}
		
		buildScoring();
		buildQuestions();
		buildResources();
		buildFeedback();
		if(quizData.useTabs) {
			buildTabMenu();	
		}
		buildToast();
		buildSubmit();
		//RESTORE FOR NEW WRAPPER
		if(!mediaFeatures.useWrapperForModals) {
			buildModals();
		}
		buildHeader();
		quizApp.render();
		onRenderComplete();
	}
	
	function buildContainers() {
		if(!mediaFeatures.useWrapperForContainers) {
			//$("#mainContent").append(RESOURCES_CONTAINER_PARENT_TEMPLATE);
			if(quizData.useTextRadioButtons) {
				$("#mainContent").prepend(QUESTIONS_CONTAINER_TEXT_RADIO_BUTTONS_PARENT_TEMPLATE);
			}
			else {
				$("#mainContent").prepend(QUESTIONS_CONTAINER_PARENT_TEMPLATE);
			}
			$("#mainContent").append(QUIZ_FEEDBACK_CONTAINER_PARENT_TEMPLATE);
			$("#mainContent").append(QUIZ_SCORE_CONTAINER_PARENT_TEMPLATE);
			$("#mainContent").append(QUIZ_BUTTONS_CONTAINER_TEMPLATE);
			if(quizData.showProgress) {
				$("#mainContent").append(PROGRESS_CONTAINER_TEMPLATE);
			}
		}
		
		buildInstructions();
	}
	
	function buildInstructions() {
		//INSTRUCTIONS
		if( (quizData.quizInstructionsHeader != undefined && quizData.quizInstructionsHeader.length > 0)
			|| (quizData.quizInstructionsDescription != undefined && quizData.quizInstructionsDescription.length > 0) ) {
			
			var quizInstructionsContainer = $(
				 QUIZ_INSTRUCTIONS_CONTAINER
			 );
			 
			 if(quizData.quizInstructionsHeader != undefined && quizData.quizInstructionsHeader.length > 0) {
				var quizInstructionsHeader = $(
					 QUIZ_INSTRUCTIONS_HEADER
					 .replace(PLACEHOLDER_QUIZ_INSTRUCTIONS_HEADER,quizData.quizInstructionsHeader)
				 );
				 quizInstructionsContainer.append(quizInstructionsHeader);
			}
			 
			 if(quizData.quizInstructionsDescription != undefined && quizData.quizInstructionsDescription.length > 0) {
				var quizInstructionsDescription = $(
					 QUIZ_INSTRUCTIONS_DESCRIPTION
					 .replace(PLACEHOLDER_QUIZ_INSTRUCTIONS_DESCRIPTION,quizData.quizInstructionsDescription)
				 );
				 quizInstructionsContainer.append(quizInstructionsDescription);
			}
			
			$("#mainContent").prepend(quizInstructionsContainer);
				
		}
		
	}
	
	function deserialize() {
		cl('deserialize');
		//deserialize fill in the blank questions
		$.each(userSaveData.fillintheblankquestions,
			function(i,fillInTheBlankQuestion) {
				$("#"+fillInTheBlankQuestion.answerguid).val(fillInTheBlankQuestion.answertext);
			}
		);
	
		//deserialize expert response questions
		$.each(userSaveData.expertresponsequestions,
			function(i,expertResponseQuestion) {
				//bookmark
				if(quizData.useBookmarks) {
					if(expertResponseQuestion.bookmarked) {
						//if questionguid with no answer guid (bookmark was toggled, but no answer selected)
						if(expertResponseQuestion.questionguid != undefined) {
							$("#"+expertResponseQuestion.questionguid).find('.bookmark').addClass('selected');	
						}
						//else 'regular'; answer selected
						else {
							$("#"+expertResponseQuestion.answerguid).parents('.questionContainer').find('.bookmark').addClass('selected');
						}
					}
				}
				
				$("#"+expertResponseQuestion.answerguid).val(expertResponseQuestion.answertext);
			}
		);
	
	
		//deserialize multiple choice questions
		$.each(userSaveData.multiplechoicequestions,
			function(i,multipleChoiceQuestion) {
				//bookmark
				if(quizData.useBookmarks) {
					if(multipleChoiceQuestion.bookmarked) {
						//if questionguid with no answer guid (bookmark was toggled, but no answer selected)
						if(multipleChoiceQuestion.questionguid != undefined) {
							$("#"+multipleChoiceQuestion.questionguid).find('.bookmark').addClass('selected');	
						}
						//else 'regular'; answer selected
						else {
							$("#"+multipleChoiceQuestion.answerguid).parents('.questionContainer').find('.bookmark').addClass('selected');
						}
					}
					
				}
				if(multipleChoiceQuestion.answerguid != undefined) {
					$("#"+multipleChoiceQuestion.answerguid).prop('checked',true);
				}
			}
		);
	
		//deserialize multiple select questions
		$.each(userSaveData.multipleselectquestions,
			function(i,multipleSelectQuestion) {
				//bookmark
				if(quizData.useBookmarks) {
					if(multipleSelectQuestion.bookmarked) {
						//if questionguid with no answer guid (bookmark was toggled, but no answer selected)
						if(multipleSelectQuestion.questionguid != undefined) {
							$("#"+multipleSelectQuestion.questionguid).find('.bookmark').addClass('selected');	
						}
						//else 'regular'; answer selected
						else {
							$("#"+multipleSelectQuestion.answerguid).parents('.questionContainer').find('.bookmark').addClass('selected');
						}
					}
				}
				$("#"+multipleSelectQuestion.answerguid).prop('checked',true);
			}
		);
		
		//number of attempts
		if(quizData.useAttemptsScore) {
			$.each(userSaveData.numberofattemptsperquestion,
				function(i,numberOfAttemptsPerQuestion) {
					var numberOfAttempts;
					//if question is answered, decrement attempt count, as it will automatically be incremented later as part of the completion update. (incrementAttemptCountByQuestionGroupGUID)
					if( isQuestionAnsweredFromData(numberOfAttemptsPerQuestion.questionguid,userSaveData) ) {
						numberOfAttempts = 	parseInt(numberOfAttemptsPerQuestion.numberofattempts) - 1;
					}
					else {
						numberOfAttempts = 	parseInt(numberOfAttemptsPerQuestion.numberofattempts)	
					}
					
					$('#'+numberOfAttemptsPerQuestion.questionguid).attr('number-of-attempts',numberOfAttempts);
					$('#'+numberOfAttemptsPerQuestion.questionguid).find('.questionNumberOfAttempts').text(numberOfAttempts);
					$('#'+numberOfAttemptsPerQuestion.questionguid).find('.questionPointValue').text( getQuestionPointValue( $('#'+numberOfAttemptsPerQuestion.questionguid).attr('id') ) );
				}
			);
		}
		
	
		if(quizData.useTimer) {
			if(userSaveData.starttime == undefined) {
				userSaveData.starttime = Date.now();	
			}
		}
		cl(userSaveData);
	
		quizApp.deserialize();
	}
	
	quizAppCommon.serialize = function serialize() {
		cl('serialize common');
		//for attempt scoring store at question level, not answer
		if(quizData.useAttemptsScore) {
			userSaveData.numberofattemptsperquestion = [];
			$('.questionContainer').each(
				function(i,question) {
					var numberOfAttempts = parseInt( $(question).attr('number-of-attempts') );
					if(numberOfAttempts != undefined && numberOfAttempts > 0) {
						var saveObj = {
							'questionguid':$(question).attr('id'),
							'numberofattempts':numberOfAttempts
						};
						userSaveData.numberofattemptsperquestion.push(saveObj);
					}
				}
			);
		};
		
		//push an object. That way we have flexibility to add more data later if needed
		//serialize multiple choice questions
		$('.answer').each(
			function(i, answer) {
				var saveObj;
				var answerGUID =  quizAppCommon.getFirstChildFormElement($(answer)).attr('id');
				var questionType = getQuestionTypeByAnswerGUID(answerGUID);
				var question = getQuestionDataByAnswerGUID(answerGUID);
				var questionDOM = $("#"+question.questionGUID);
				//if(quizData.useAttemptsScore) {
				//	var numberOfAttempts = parseInt( $(questionDOM).attr('number-of-attempts') );
				//}
	
				//fill in the blank
				if (questionType === QUESTION_TYPE_FILL_IN_THE_BLANK) {
	
					//get selected answer
					//remove if length is 0
	
					if(doesFillInTheBlankQuestionExistInSavedData(answerGUID)) {
						removeFillInTheBlankQuestionDataFromSavedData(answerGUID);
					}
					if( quizAppCommon.isAnswerAnswered(answerGUID) ) {
	
						var valueEntered = '';
	
						if ($(answer).children('input').length > 0) {
							valueEntered = $(answer).children('input:first').val();
						} else {
							valueEntered = $(answer).val();
						}
	
						saveObj = {
							'answerguid':answerGUID,
							'answertext':valueEntered
						};
	
						//if(quizData.useAttemptsScore && numberOfAttempts !== 0) {
						//	$.extend( saveObj, { 'numberofattempts':numberOfAttempts } );
						//}
	
						userSaveData.fillintheblankquestions.push(saveObj);
					}
				}
	
				//expert response
				else if (questionType === QUESTION_TYPE_EXPERT_RESPONSE) {
					//get selected answer
					//remove if length is 0
	
					if(doesExpertResponseQuestionExistInSavedData(answerGUID)) {
						removeExpertResponseQuestionDataFromSavedData(answerGUID);
					}
					if( quizAppCommon.isAnswerAnswered(answerGUID) ) {
						saveObj = {
							'answerguid':answerGUID,
							'answertext':$(answer).siblings('textarea:first').val()
						};
						//if(quizData.useAttemptsScore && numberOfAttempts !== 0) {
						//	$.extend( saveObj, { 'numberofattempts':numberOfAttempts } );
						//}
						
						if(quizData.useBookmarks) {
							saveObj.bookmarked = $(questionDOM).find('.bookmark').hasClass('selected') ? true : false;	
						}
						userSaveData.expertresponsequestions.push(saveObj);
					}
				}
	
				//radio/checkbox
				else if (getQuestionTypeByAnswerGUID(answerGUID) === QUESTION_TYPE_MULTIPLE_CHOICE ||
								 getQuestionTypeByAnswerGUID(answerGUID) === QUESTION_TYPE_MULTIPLE_SELECT) {
	
					//get selected answer
					if( quizAppCommon.isAnswerAnswered(answerGUID) )  {
	
						if(questionType === QUESTION_TYPE_MULTIPLE_CHOICE) {
							if(doesMultipleChoiceQuestionExistInSavedData(answerGUID)) {
								removeMultipleChoiceQuestionDataFromSavedData(answerGUID);
							}
							if(question.randomizeAnswers) {
								var questionData = getQuestionDataByAnswerGUID(answerGUID);
								var correctAnswerLetter = getCorrectMultipleChoiceAnswerLetter(questionData.questionGUID)
								var selectedAnswerLetter = getAnswerLetter(answerGUID);
								saveObj = {
									'answerguid':answerGUID,
									'selectedletter':selectedAnswerLetter,
									'correctletter' : correctAnswerLetter
								};
							}
							else {
								saveObj = {
									'answerguid':answerGUID
								};
							}
							
							if(quizData.useBookmarks) {
								saveObj.bookmarked = $(questionDOM).find('.bookmark').hasClass('selected') ? true : false;	
							}
							//if(quizData.useAttemptsScore && numberOfAttempts !== 0) {
							//	$.extend( saveObj, { 'numberofattempts':numberOfAttempts } );
							//}
							userSaveData.multiplechoicequestions.push(saveObj);
	
							//if there's a matching questionguid array element, nuke it now that we have replaced it with an answerguid element
							//ostensibly just for the bookmarks
							$.each(userSaveData.multiplechoicequestions, function(j,multipleChoiceQuestion) {
								if(multipleChoiceQuestion != undefined && multipleChoiceQuestion.questionguid != undefined) {
									if(multipleChoiceQuestion.questionguid === question.questionGUID) {
										userSaveData.multiplechoicequestions.splice(j,1);
									}
								}
							});
						}
	
						else if(questionType === QUESTION_TYPE_MULTIPLE_SELECT) {
							if(doesMultipleSelectQuestionExistInSavedData(answerGUID)) {
								removeMultipleSelectQuestionDataFromSavedData(answerGUID);
							}
							if(question.randomizeAnswers) {
								var questionData = getQuestionDataByAnswerGUID(answerGUID);
								var correctAnswerLetters = getCorrectMultipleSelectAnswersLetter(question.questionGUID);
								var selectedAnswerLetters = getSelectedMultipleSelectAnswersLetter(question.questionGUID);
								saveObj = {
									'answerguid':answerGUID,
									'selectedletters':selectedAnswerLetters,
									'correctanswerletters':correctAnswerLetters								
								};
							}	
							else {
								saveObj = {
									'answerguid':answerGUID
								};
							}
							
							if(quizData.useBookmarks) {
								saveObj.bookmarked = $(questionDOM).find('.bookmark').hasClass('selected') ? true : false;	
							}
							//if(quizData.useAttemptsScore && numberOfAttempts !== 0) {
							//	$.extend( saveObj, { 'numberofattempts':numberOfAttempts } );
							//}
							userSaveData.multipleselectquestions.push(saveObj);
						}
	
	
					} //end if selected answer
					
					//else no selected answer
					else {
						//bookmark can be selected without question being answered, so need to serialize even though there is no selected answer
						//TODO: revist this, a little hacky...
						if(quizData.useBookmarks) {
							if( $(questionDOM).find('.bookmark').hasClass('selected') ) {
								saveObj = {
									'questionguid':question.questionGUID,
									'bookmarked':true
								}
								if(questionType === QUESTION_TYPE_MULTIPLE_CHOICE) {
									//dup check
									var doPush = true;
									//don't push if an element with the questionguid already exists in the save data
									$.each(userSaveData.multiplechoicequestions, function(j,multipleChoiceQuestion) {
										if(multipleChoiceQuestion.questionguid != undefined) {
											if(multipleChoiceQuestion.questionguid === question.questionGUID) {
												doPush = false;													
											}
										}
										//also don't push if an element in the save data has an answerguid from this same question
										//if answer guid is 1_2_3, comparing the 1_2 part...
										if(multipleChoiceQuestion.answerguid != undefined) {
											var targetAnswerID = multipleChoiceQuestion.answerguid.replace('answer','')
											var targetAnswerID2 = targetAnswerID.substring(0,targetAnswerID.lastIndexOf('_'));
											var currentAnswerID = answerGUID.replace('answer','');
											var currentAnswerID2 = currentAnswerID.substring(0,currentAnswerID.lastIndexOf('_'));
											if(targetAnswerID2 === currentAnswerID2) {
												doPush = false;	
											}
										}
									});
									
									if(doPush) {
										userSaveData.multiplechoicequestions.push(saveObj);
									}
								}
								
								if(questionType === QUESTION_TYPE_MULTIPLE_SELECT) {
									//dup check
									var doPush = true;
									//don't push if an element with the questionguid already exists in the save data
									$.each(userSaveData.multipleselectquestions, function(j,multipleSelectQuestion) {
										if(multipleSelectQuestion.questionguid != undefined) {
											if(multipleSelectQuestion.questionguid === question.questionGUID) {
												doPush = false;													
											}
										}
										//also don't push if an element in the save data has an answerguid from this same question
										//if answer guid is 1_2_3, comparing the 1_2 part...
										if(multipleSelectQuestion.answerguid != undefined) {
											var targetAnswerID = multipleSelectQuestion.answerguid.replace('answer','')
											var targetAnswerID2 = targetAnswerID.substring(0,targetAnswerID.lastIndexOf('_'));
											var currentAnswerID = answerGUID.replace('answer','');
											var currentAnswerID2 = currentAnswerID.substring(0,currentAnswerID.lastIndexOf('_'));
											if(targetAnswerID2 === currentAnswerID2) {
												doPush = false;	
											}
										}
									});
									
									if(doPush) {
										userSaveData.multipleselectquestions.push(saveObj);
									}
								}
								
							}
							//else deselected, make sure to remove from save array
							else {
								if(questionType === QUESTION_TYPE_MULTIPLE_CHOICE) {
									$.each(userSaveData.multiplechoicequestions, function(i,multipleChoiceQuestion) {
										if(multipleChoiceQuestion != undefined && multipleChoiceQuestion.questionguid != undefined) {
											if(multipleChoiceQuestion.questionguid === question.questionGUID) {
												userSaveData.multiplechoicequestions.splice(i,1);
											}
										}
									});
								}
								else if(questionType === QUESTION_TYPE_MULTIPLE_SELECT) {
									$.each(userSaveData.multipleselectquestions, function(i,multipleSelectQuestion) {
										if(multipleSelectQuestion != undefined && multipleSelectQuestion.questionguid != undefined) {
											if(multipleSelectQuestion.questionguid === question.questionGUID) {
												userSaveData.multipleselectquestions.splice(i,1);
											}
										}
									});
								}
							}
						}
					}
					
				 } //end if answer is checkbox or radio button
			} //end for each answer
		); //end for each answer
		
		if(quizData.useTimer) {
			userSaveData.lastsavetime = Date.now();	
		}
		
		
		quizApp.serialize();
		cl(userSaveData);
		IME.saveState(userSaveData, onSaveToIMEComplete);
	}
	
	function onSaveToIMEComplete(data) {
		cl('onSaveToIMEComplete');
		//don't do the animation if we're already in the middle of a cycle
		if( !($('.savedToast').is(':visible'))) {
			//fade out after 3 seconds
			$('.savedToast').fadeIn(400).delay(3000).fadeOut(400);
		}
		//placeholder - dynamically update transcript if it's currently open
		//cl(window);
		//cl(window.opener);
		//window.open($(e.currentTarget).attr('href'),'transcriptWindow');
		 /*if(window != undefined && window.opener != undefined && window.opener.quizTranscriptCommon != undefined) {
			//IE 11 fix: doesn't work with callback passed in
			cl('updateTranscript');
			 //window.opener.moduleScenarios.updateLeadershipProfileFromScenario();
		 }*/
		
		
		
		
	}
	
	
	function getQuestionType(question) {
		var questionType;
		return question.questionType;
	
	}
	
	//QUESTIONS
	function randomizeQuestions() {
		//randomize question groups
		if(quizData.randomizeQuestionGroups) {
			var randomizedQuestionGroups = cmHelpers.randomizeArray(quizData.questionGroups);
			quizData.questionGroups = randomizedQuestionGroups;
		}
		
		//for each question group, check for randomize questions
		$.each(quizData.questionGroups, function(i,questionGroup)  {
			if(questionGroup.questions != undefined && questionGroup.questions.length > 0) {
				if(questionGroup.randomizeQuestions === true) {
					var randomizedQuestions = cmHelpers.randomizeArray(questionGroup.questions);
					questionGroup.questions = randomizedQuestions;
				}
				//else use questionOrder value. Assumes questionOrder is always present (it should be from tool)
				else {
				   questionGroup.questions.sort(function(a,b) {
								return parseInt(a.questionOrder) - parseInt(b.questionOrder);
					});
				}
				//for each question, randomize answers
				$.each(questionGroup.questions, function(j,question)  {
					if(question.randomizeAnswers === true) {
						var randomizedAnswers = cmHelpers.randomizeArray(question.answers);
						question.answers = randomizedAnswers;
					}
				})//end for each question
			}//end if questions
		}); //end for each questionGroup
	}
	
	//if maxNumberOfAnswersPerQuestion defined, keep correct answer(s) and trim down to the max number of the rest
	function truncateAnswers() {
		$.each(quizData.questionGroups, function(i,questionGroup)  {
			$.each(questionGroup.questions, function(j,question)  {
				//for now only used for multiple choice questions (per flashcards)
				if(question.questionType === QUESTION_TYPE_MULTIPLE_CHOICE) {
					var truncatedAnswersArray = [];
					//first push the correct answer, if it exists
					var correctAnswer = getCorrectMultipleChoiceAnswerData(question.questionGUID);
					if(correctAnswer != undefined && correctAnswer !== false) {
						truncatedAnswersArray.push(correctAnswer);
					}
					var savedAnswer;
					//now, if we have an incorrect answer in the data, we need to make sure we push that one, otherwise it won't show
					$.each(userSaveData.multiplechoicequestions,
						function(k,multipleChoiceQuestion) {
							//does this answer belong to this question?
							$.each(question.answers, function(l,answer) {
								if(answer.answerGUID === multipleChoiceQuestion.answerguid) {
									//make sure we aren't double-pushing a correct answer
									if(answer.answerGUID !== correctAnswer.answerGUID) {
										savedAnswer = getAnswerDataByAnswerGUID(answer.answerGUID);
										truncatedAnswersArray.push(savedAnswer);	
									}
								}
							});	
						}
					);
					$.each(question.answers, function(k,answer) {
						if(truncatedAnswersArray.length<parseInt(quizData.maxNumberOfAnswersPerQuestion)) {
							if(correctAnswer.answerGUID !== answer.answerGUID &&
									(savedAnswer == undefined || (savedAnswer != undefined && savedAnswer.answerGUID !== answer.answerGUID))
							   ) {
								truncatedAnswersArray.push(answer);	
							}
						}
					});
					//re-randomize array
					var randomizedAnswers = cmHelpers.randomizeArray(truncatedAnswersArray);
					question.answers = randomizedAnswers;
				}
			});
		});
	}
	
	function buildScoring() {
		cl('buildScoring');
		$('.quizScoreContainerParent').append(QUIZ_SCORE_CONTAINER);
	}
	
	function buildPagination() {
		cl('buildPagination');
		//$('#mainContent').prepend(PAGINATION_CONTENT);
		$('.questionsContainerParent').wrap(PAGINATION_CONTAINER).wrap(PAGINATION_CONTENT);
		$('#pagination1').append(PAGINATION_NAV);
		$("#pagination-nav").append(PAGINATION_NAV_LIST_CONTAINER);
	}
	
	//START HERE
	//Progress tracker: how many questions answered vs how many total
	//For Flashcards only CORRECT answers count towards completion (quizData.requireMastery)
	function buildProgress() {
		cl('buildProgress');	
	}
	
	function initPaginationLocal() {
		//called from pagination pattern. TODO namespace patterns
		initPagination();
		//TODO: why doesn't the pagination pattern code handle this?
		if(quizData.questionGroups.length === 1) {
			$("#pagination-nav").hide();
		}
		if(quizData.isFlashcards) {
			$('.pagination').find('.pagination-dropdown').find('.select-dropdown').children('label:first').text('Question');
		}
	}
	
	function buildTabMenu() {
		//var tabMenu
		//append tab class to main container
		$('#mainContent').addClass('tab-menu-collapse');
		var containerGrid = $(TAB_CONTAINER_GRID_TEMPLATE);
		$.each(quizData.questionGroups, function(i,questionGroup)  {
			var tabPanelLinkTemplate;
			if(i===0) {
				tabPanelLinkTemplate = $(TAB_PANEL_LINK_FIRST_TEMPLATE
										.replace(/PLACEHOLDER_TAB_PANEL_GUID/g,(i+1))
										.replace(PLACEHOLDER_TAB_PANEL_TITLE,questionGroup.questionGroupTitle)
										);
				
			}
			else {
				tabPanelLinkTemplate = $(TAB_PANEL_LINK_TEMPLATE
										.replace(/PLACEHOLDER_TAB_PANEL_GUID/g,(i+1))
										.replace(PLACEHOLDER_TAB_PANEL_TITLE,questionGroup.questionGroupTitle)
										);
			}							
			containerGrid.append(tabPanelLinkTemplate);
		});
		$('#mainContent').prepend(containerGrid);
		
		var tabMenuCollapseController = $(TAB_MENU_COLLAPSE_CONTROLLER_TEMPLATE);
		$('#mainContent').prepend(tabMenuCollapseController);
		//$('#mainContent').prepend(TAB_MENU_BACKGROUND_TEMPLATE);
		
		//append styling border
		$('.media-header').append(MEDIA_HEADER_BORDER_TEMPLATE);
		
		initTabMenu();
	}
	
	function buildFeedback() {
		cl('buildFeedback');
		if(quizData.quizCompleteFeedback != undefined) {
			$('.quizFeedbackContainer').html(quizData.quizCompleteFeedback);
		}
		if(quizData.quizCompleteHeader != undefined) {
			$('.quizFeedbackHeader').html(quizData.quizCompleteHeader);
		}
		
	}
	
	function buildHeader() {
		cl('buildHeader');
		//$('.quizTitle').html(quizData.quizTitle);
		//use introTitle and introDescription if present, otherwise fall back to quizTitle and quizDescription
		/*var introTitle  = quizData.introTitle != undefined && quizData.introTitle.length > 0
						 ? quizData.introTitle
						 : quizData.quizTitle;
		var introDescription  = quizData.introDescription != undefined && quizData.introDescription.length > 0
						 ? quizData.introDescription
						 : quizData.quizDescription;
		*/
		var introTitle = quizData.introTitle;
		var introDescription = quizData.introDescription;
		var quizTitle = quizData.quizTitle;
		var quizSubtitle = quizData.quizSubtitle;
		
		if(introTitle != undefined && introTitle.length > 0) {
			$('.modaal-intro-subheading').html(introTitle);
		}
		//allow local wrapper override
		if(typeof document.title === 'undefined' || document.title.length === 0 && quizTitle != undefined && quizTitle.length > 0) {
			document.title = quizTitle;
		}
		if( $('.media-header-title #wcagHeading1') != undefined && quizTitle != undefined && quizTitle.length > 0) {
			$('.media-header-title #wcagHeading1').html(quizTitle)
		}
		if( quizSubtitle != undefined && quizSubtitle.length > 0) {
			$('.media-header-title #wcagHeading1').append('<span class="secondary-text">'+quizSubtitle+'</span>');
		}
		
		$('.modaal-intro-description').empty();
		if(introDescription != undefined && introDescription.length > 0) {
			$('.modaal-intro-description').html(introDescription);
		}
		
		//legacy support: quizTitle and quizDescription defined, but introTitle and introDescription aren't. Fallback
		if( (introDescription == undefined || introDescription.length === 0) && (quizSubtitle != undefined && quizSubtitle.length > 0) ) {
			$('.modaal-intro-description').html(quizSubtitle);
			$('.media-header-title #wcagHeading1').empty();
		}
		if( (introTitle == undefined || introTitle.length === 0) && (quizTitle != undefined && quizTitle.length > 0) ) {
			$('.modaal-intro-subheading').html(quizTitle);
			$('.media-header-title #wcagHeading1').empty();
			$('.media-header-title #wcagHeading1').html(quizTitle);
			if( quizSubtitle != undefined && quizSubtitle.length > 0) {
				$('.media-header-title #wcagHeading1').append('<span class="secondary-text">'+quizSubtitle+'</span>');
			}
		}
	}
	
	function buildToast() {
		$("#mainContent").append(TOAST_TEMPLATE);
	}
	
	function buildSubmit() {
		if(quizData.showSubmitQuiz) {
			$('.btnSubmitQuiz').show();
			$('.quizButtonsContainer').show();
		}
		else {
			$('.btnSubmitQuiz').hide();
			//$('.quizButtonsContainer').hide();
		}
		if(quizData.showResetQuiz) {
			$('.btnResetQuiz').show();
			$('.quizButtonsContainer').show();
		}
		else {
			$('.btnResetQuiz').hide();
			//$('.quizButtonsContainer').hide();
		}
		if( (!quizData.showResetQuiz && !quizData.showSubmitQuiz) ||
			( (!($('.btnResetQuiz').is(':visible'))) && !($('.btnSubmitQuiz').is(':visible'))) ) {
			$('.quizButtonsContainer').hide();	
		}
		
	}
	
	function buildModals() {
		cl('buildModals');
		if(!quizData.hideIntroModal) {
			$("#mainContent").append(MODAL_INTRO);
			//need to add modal footer link button NOW, otherwise there's a race condition with the responsive footer include code
			$('.media-footer-links:first').append(INTRO_MODAL_LINK);
			//now construct the modal (since we've bypassed the constructor in the reponsive footer
			$('.button-modaal-intro').modaal({
				animation:'fade',
				hide_close: true,
				start_open: true,
				custom_class: 'modaal-intro'
			});
		}
		$("#mainContent").append(MODAL_RESET_QUESTION_GROUP);
		$("#mainContent").append(MODAL_RESET_QUIZ);
		if(quizData.showProgress) {
			$("#mainContent").append(MODAL_PROGRESS);	
		}
	
	}
	
	function buildAnswer(answer,answerGroupContainer) {
	
	}
	
	
	quizAppCommon.buildQuestion = function (index,question,questionGroupContainer) {
		// console.log(question);
		// console.log(questionGroupContainer);
	
		//different rendering for different question types
		 var questionType = getQuestionType(question);
	
		 //MULTIPLE CHOICE
		 
	
		 if(questionType === QUESTION_TYPE_MULTIPLE_CHOICE) {
			 var questionContainer = $(
				 QUESTION_CONTAINER_TEMPLATE
				 .replace(PLACEHOLDER_QUESTION_TYPE,questionType)
				 .replace(PLACEHOLDER_QUESTION_QUESTION_GUID,question.questionGUID)
				 );
	
			 //banner
			 /*if(question.banner != undefined && question.banner.length > 0) {
				 var bannerContainer = $(
					 BANNER_TEMPLATE
					 .replace(PLACEHOLDER_BANNER_TEXT,question.banner)
				 );
				 questionContainer.append(bannerContainer);
			 }
			*/
			 //images
			 if(question.images != undefined && question.images.length > 0) {
				 $.each(question.images, function(z,image) {
					 if(image.link != undefined && image.link.length > 0) {
						 var imageContainer = $(
							 IMAGE_CONTAINER_LINK_TEMPLATE
							 .replace(PLACEHOLDER_IMAGE_TITLE,image.title)
							 .replace(PLACEHOLDER_IMAGE_SUBTITLE,image.subtitle)
							 .replace(PLACEHOLDER_IMAGE_URL,image.imageURL)
							 .replace(PLACEHOLDER_IMAGE_ALT_TEXT,image.altText)
							 .replace(PLACEHOLDER_IMAGE_WIDTH,image.settings.width)
							 .replace(PLACEHOLDER_IMAGE_HEIGHT,image.settings.height)
							 .replace(PLACEHOLDER_IMAGE_LINK,image.link)
						 );
					 }
					 
					 else {
						 var imageContainer = $(
							 IMAGE_CONTAINER_TEMPLATE
							 .replace(PLACEHOLDER_IMAGE_TITLE,image.title)
							 .replace(PLACEHOLDER_IMAGE_SUBTITLE,image.subtitle)
							 .replace(PLACEHOLDER_IMAGE_URL,image.imageURL)
							 .replace(PLACEHOLDER_IMAGE_ALT_TEXT,image.altText)
							 .replace(PLACEHOLDER_IMAGE_WIDTH,image.settings.width)
							 .replace(PLACEHOLDER_IMAGE_HEIGHT,image.settings.height)
						 );
					 }
					 questionContainer.append(imageContainer);
				 });
			 }
	
	
			 //video
			 if(question.videos != undefined && question.videos.length > 0) {
				 $.each(question.videos, function(k,video) {
					 //for responsiveness use whichever is smaller: parent container width or data-provided width
					 var videoWidth = $('.questionsContainerParent').width() < video.settings.width ? Math.round( $('.questionsContainerParent').width() ) : video.settings.width;
					 var videoContainer = $(
						 VIDEO_CONTAINER_TEMPLATE
						 .replace(PLACEHOLDER_VIDEO_TITLE,video.title)
						 .replace(PLACEHOLDER_VIDEO_SUBTITLE,video.subtitle)
						 .replace(PLACEHOLDER_VIDEO_URL,video.videoURL)
						 .replace(PLACEHOLDER_POSTER_URL,video.posterURL)
						 .replace(PLACEHOLDER_CAPTION_URL,video.captionURL)
						 .replace(PLACEHOLDER_VIDEO_WIDTH,videoWidth)
						 .replace(PLACEHOLDER_VIDEO_HEIGHT,video.settings.height)
					 );
					 questionContainer.append(videoContainer);
				 });
			 }
	
			 //audio
			 if(question.audios != undefined && question.audios.length > 0) {
				 $.each(question.audios, function(l,audio) {
					 var audioContainer = $(
						 AUDIO_CONTAINER_TEMPLATE
						 .replace(PLACEHOLDER_AUDIO_TITLE,audio.title)
						 .replace(PLACEHOLDER_AUDIO_SUBTITLE,audio.subtitle)
						 .replace(PLACEHOLDER_AUDIO_URL,audio.audioURL)
					 );
					 //transcript
					 var audioTranscriptLink = $(
						 AUDIO_TRANSCRIPT_LINK
					 );
					 audioContainer.append(audioTranscriptLink);
	
					 var audioTranscriptText = $(
						 AUDIO_TRANSCRIPT_TEXT
						 .replace(PLACEHOLDER_VALUE,audio.transcriptText)
					);
					audioContainer.append(audioTranscriptText);
	
	
					 questionContainer.append(audioContainer);
				 });
			 }
	
			 //questionContainer.append(QUESTION_INDICATOR_TEMPLATE);
			 var answersContainer = $(ANSWERS_CONTAINER_TEMPLATE);
			 //bookmark
			 if(quizData.useBookmarks) {
				 var bookmark = BOOKMARK;
				 answersContainer.append(bookmark);
			 }
			 
			 var questionCount = $(
				 QUESTION_COUNT_TEMPLATE
				 .replace(PLACEHOLDER_QUESTION_NUMBER,quizData.countQuestionsAcrossQuiz ?
														 getCurrentQuestionNumberForAllQuestions(question.questionGUID)+1 : 
														 index+1)
				 .replace(PLACEHOLDER_QUESTION_TOTAL_COUNT,quizData.countQuestionsAcrossQuiz ?
															 getTotalNumberOfQuizQuestions() :
															 getQuestionGroupDataByQuestionGUID(question.questionGUID).questions.length)
				 );
			 answersContainer.append(questionCount);
			 var answersContainerFieldset = $('<fieldset></fieldset>');
			 var questionText = $( QUESTION_TEXT_TEMPLATE.replace(PLACEHOLDER_QUESTION_QUESTION_TEXT,
									 question.questionPreText != undefined && question.questionPreText.length > 0 ? 
									 question.questionPreText+question.questionText :
									 question.questionText) );
			 answersContainerFieldset.append(questionText);
			 answersContainerFieldset.append($(QUESTION_MULTIPLE_CHOICE_CHOOSE_TEXT_LABEL_TEMPATE));
			 if(quizData.useAttemptsScore) {
				 var questionNumberOfAttempts = $(QUESTION_NUMBER_OF_ATTEMPTS_TEMPLATE.replace(PLACEHOLDER_QUESTION_NUMBER_OF_ATTEMPTS,0) );
				 answersContainerFieldset.append(questionNumberOfAttempts);
				 var questionPointValue = $(QUESTION_POINT_VALUE_TEMPLATE.replace(PLACEHOLDER_QUESTION_POINT_VALUE,getQuestionPointValue(question.questionGUID) ) );
				 answersContainerFieldset.append(questionPointValue);
			 }
			 var answersContainerRadioGroup = $(ANSWERS_CONTAINER_RADIO_GROUP_TEMPLATE);
	
			 for(var j=0;j<question.answers.length;j++) {
				 var answerContainer = $(ANSWER_CONTAINER_TEMPLATE);
				 var answerData = question.answers[j];
				 var answerLetter = getAnswerLetter(answerData.answerGUID,j);
				 //images
				 if(answerData.images != undefined && answerData.images.length > 0) {
					 $.each(answerData.images, function(z,image) {
						 if(image.link != undefined && image.link.length > 0) {
							 var imageContainer = $(
								 IMAGE_CONTAINER_LINK_TEMPLATE
								 .replace(PLACEHOLDER_IMAGE_TITLE,image.title)
								 .replace(PLACEHOLDER_IMAGE_SUBTITLE,image.subtitle)
								 .replace(PLACEHOLDER_IMAGE_URL,image.imageURL)
								 .replace(PLACEHOLDER_IMAGE_ALT_TEXT,image.altText)
								 .replace(PLACEHOLDER_IMAGE_WIDTH,image.settings.width)
								 .replace(PLACEHOLDER_IMAGE_HEIGHT,image.settings.height)
								 .replace(PLACEHOLDER_IMAGE_LINK,image.link)
							 );
						 }
						 else {
							 var imageContainer = $(
								 IMAGE_CONTAINER_TEMPLATE
								 .replace(PLACEHOLDER_IMAGE_TITLE,image.title)
								 .replace(PLACEHOLDER_IMAGE_SUBTITLE,image.subtitle)
								 .replace(PLACEHOLDER_IMAGE_URL,image.imageURL)
								 .replace(PLACEHOLDER_IMAGE_ALT_TEXT,image.altText)
								 .replace(PLACEHOLDER_IMAGE_WIDTH,image.settings.width)
								 .replace(PLACEHOLDER_IMAGE_HEIGHT,image.settings.height)
							 );
						 }
						 answerContainer.append(imageContainer);
					 });
				 }
	
	
				 //video
				 if(answerData.videos != undefined && answerData.videos.length > 0) {
					 $.each(answerData.videos, function(k,video) {
						 //for responsiveness use whichever is smaller: parent container width or data-provided width
						 var videoWidth = $('.questionsContainerParent').width() < video.settings.width ? Math.round( $('.questionsContainerParent').width() ) : video.settings.width;
						 var videoContainer = $(
							 VIDEO_CONTAINER_TEMPLATE
							 .replace(PLACEHOLDER_VIDEO_TITLE,video.title)
							 .replace(PLACEHOLDER_VIDEO_SUBTITLE,video.subtitle)
							 .replace(PLACEHOLDER_VIDEO_URL,video.videoURL)
							 .replace(PLACEHOLDER_POSTER_URL,video.posterURL)
							 .replace(PLACEHOLDER_CAPTION_URL,video.captionURL)
							 .replace(PLACEHOLDER_VIDEO_WIDTH,videoWidth)
							 .replace(PLACEHOLDER_VIDEO_HEIGHT,video.settings.height)
						 );
						 answerContainer.append(videoContainer);
					 });
				 }
	
				 //audio
				 if(answerData.audios != undefined && answerData.audios.length > 0) {
					 $.each(answerData.audios, function(l,audio) {
						 var audioContainer = $(
							 AUDIO_CONTAINER_TEMPLATE
							 .replace(PLACEHOLDER_AUDIO_TITLE,audio.title)
							 .replace(PLACEHOLDER_AUDIO_SUBTITLE,audio.subtitle)
							 .replace(PLACEHOLDER_AUDIO_URL,audio.audioURL)
						 );
						 //transcript
						 var audioTranscriptLink = $(
							 AUDIO_TRANSCRIPT_LINK
						 );
						 audioContainer.append(audioTranscriptLink);
	
						 var audioTranscriptText = $(
							 AUDIO_TRANSCRIPT_TEXT
							 .replace(PLACEHOLDER_VALUE,audio.transcriptText)
						);
						audioContainer.append(audioTranscriptText);
	
	
						 answerContainer.append(audioContainer);
					 });
				 }
	
				 //need to seperate elements, otherwise we get double-binding from nested <input> element
				 //DEPRECATED
				 //answer
				 /*var answer = $(
					 ANSWER_RADIO_TEMPLATE
					 .replace(/PLACEHOLDER_ANSWER_DATA_ANSWER_GUID/g,answerData.answerGUID)
					 .replace(PLACEHOLDER_QUESTION_QUESTION_GUID,question.questionGUID)
					 .replace(PLACEHOLDER_ANSWER_LETTER,answerLetter)
					 .replace(PLACEHOLDER_ANSWER_DATA_ANSWER_TEXT,answerData.answerText)
					 ).change(onMultipleChoiceAnswerClick);
				 answerContainer.append(answer);*/
				 
				 var answerLabel = $(
					 ANSWER_RADIO_LABEL_TEMPLATE
					 .replace(/PLACEHOLDER_ANSWER_DATA_ANSWER_GUID/g,answerData.answerGUID)
				 );	
				 var answerInput = $(
					 ANSWER_RADIO_INPUT_TEMPLATE
					 .replace(/PLACEHOLDER_ANSWER_DATA_ANSWER_GUID/g,answerData.answerGUID)
					 .replace(PLACEHOLDER_QUESTION_QUESTION_GUID,question.questionGUID)
					 .replace(PLACEHOLDER_ANSWER_LETTER,answerLetter)
					 .replace(PLACEHOLDER_ANSWER_DATA_ANSWER_TEXT,answerData.answerText)
				 ).change(onMultipleChoiceAnswerClick);
				 
				 answerLabel.append(answerInput);
				 answerContainer.append(answerLabel);
				 
				 //feedback
				 if(answerData.feedback != undefined && answerData.feedback.length > 0) {
					 var feedback = $( FEEDBACK_PLACEHOLDER_TEMPLATE.replace(PLACEHOLDER_ANSWER_DATA_FEEDBACK,answerData.feedback) );
					 answerContainer.append(feedback);
				 }
				 answersContainerRadioGroup.append(answerContainer);
			 }
			 answersContainerFieldset.append(answersContainerRadioGroup);
			 answersContainer.append(answersContainerFieldset);
			 
			 
			 
			 
			 questionContainer.append(answersContainer);
			 
			 
			 
			 
	
			 var questionBoilerplateFeedback = $(QUESTION_BOILERPLATE_FEEDBACK_CONTAINER_TEMPLATE);
			 questionContainer.append(questionBoilerplateFeedback);
			if( (question.feedback!= undefined && question.feedback.length > 0) ||
				(question.feedbackCorrect != undefined && question.feedbackCorrect.length > 0) ||
				(question.feedbackIncorrect != undefined && question.feedbackIncorrect.length > 0) ) {
					 var questionFeedback = $(QUESTION_FEEDBACK_TEMPLATE);
					 var questionFeedbackText = $(QUESTION_FEEDBACK_TEXT_CONTAINER_TEMPLATE);
					 questionFeedback.append(questionFeedbackText);
					 questionContainer.append(questionFeedback);
			}
		 } //end if question type multiple choice
	
		 //MULTIPLE SELECT (CHECKBOX)
	
		 else if(questionType === QUESTION_TYPE_MULTIPLE_SELECT) {
			var questionContainer = $(
				 QUESTION_CONTAINER_TEMPLATE
				 .replace(PLACEHOLDER_QUESTION_TYPE,questionType)
				 .replace(PLACEHOLDER_QUESTION_QUESTION_GUID,question.questionGUID)
				 );
	
			 //banner
			 /*if(question.banner != undefined && question.banner.length > 0) {
				 var bannerContainer = $(
					 BANNER_TEMPLATE
					 .replace(PLACEHOLDER_BANNER_TEXT,question.banner)
				 );
				 questionContainer.append(bannerContainer);
			 }
			*/
			 //images
			 if(question.images != undefined && question.images.length > 0) {
				 $.each(question.images, function(z,image) {
					 if(image.link != undefined && image.link.length > 0) {
						 var imageContainer = $(
							 IMAGE_CONTAINER_LINK_TEMPLATE
							 .replace(PLACEHOLDER_IMAGE_TITLE,image.title)
							 .replace(PLACEHOLDER_IMAGE_SUBTITLE,image.subtitle)
							 .replace(PLACEHOLDER_IMAGE_URL,image.imageURL)
							 .replace(PLACEHOLDER_IMAGE_ALT_TEXT,image.altText)
							 .replace(PLACEHOLDER_IMAGE_WIDTH,image.settings.width)
							 .replace(PLACEHOLDER_IMAGE_HEIGHT,image.settings.height)
							 .replace(PLACEHOLDER_IMAGE_LINK,image.link)
						 );
					 }
					 else {
						 var imageContainer = $(
							 IMAGE_CONTAINER_TEMPLATE
							 .replace(PLACEHOLDER_IMAGE_TITLE,image.title)
							 .replace(PLACEHOLDER_IMAGE_SUBTITLE,image.subtitle)
							 .replace(PLACEHOLDER_IMAGE_URL,image.imageURL)
							 .replace(PLACEHOLDER_IMAGE_ALT_TEXT,image.altText)
							 .replace(PLACEHOLDER_IMAGE_WIDTH,image.settings.width)
							 .replace(PLACEHOLDER_IMAGE_HEIGHT,image.settings.height)
						 );
					 }
					 questionContainer.append(imageContainer);
				 });
			 }
	
			 //video
			 if(question.videos != undefined && question.videos.length > 0) {
				 $.each(question.videos, function(k,video) {
					 //for responsiveness use whichever is smaller: parent container width or data-provided width
					 var videoWidth = $('.questionsContainerParent').width() < video.settings.width ? Math.round( $('.questionsContainerParent').width() ) : video.settings.width;
					 var videoContainer = $(
						 VIDEO_CONTAINER_TEMPLATE
						 .replace(PLACEHOLDER_VIDEO_TITLE,video.title)
						 .replace(PLACEHOLDER_VIDEO_SUBTITLE,video.subtitle)
						 .replace(PLACEHOLDER_VIDEO_URL,video.videoURL)
						 .replace(PLACEHOLDER_POSTER_URL,video.posterURL)
						 .replace(PLACEHOLDER_CAPTION_URL,video.captionURL)
						 .replace(PLACEHOLDER_VIDEO_WIDTH,videoWidth)
						 .replace(PLACEHOLDER_VIDEO_HEIGHT,video.settings.height)
					 );
					 questionContainer.append(videoContainer);
				 });
			 }
	
			 //audio
			 if(question.audios != undefined && question.audios.length > 0) {
				 $.each(question.audios, function(l,audio) {
					 var audioContainer = $(
						 AUDIO_CONTAINER_TEMPLATE
						 .replace(PLACEHOLDER_AUDIO_TITLE,audio.title)
						 .replace(PLACEHOLDER_AUDIO_SUBTITLE,audio.subtitle)
						 .replace(PLACEHOLDER_AUDIO_URL,audio.audioURL)
					 );
	
					 //transcript
					 var audioTranscriptLink = $(
						 AUDIO_TRANSCRIPT_LINK
					 );
					 audioContainer.append(audioTranscriptLink);
	
					 var audioTranscriptText = $(
						 AUDIO_TRANSCRIPT_TEXT
						 .replace(PLACEHOLDER_VALUE,audio.transcriptText)
					);
					audioContainer.append(audioTranscriptText);
	
					 questionContainer.append(audioContainer);
				 });
			 }
	
			 //questionContainer.append(QUESTION_INDICATOR_TEMPLATE);
			 var answersContainer = $(ANSWERS_CONTAINER_TEMPLATE);
			 if(quizData.useBookmarks) {
				 var bookmark = BOOKMARK;
				 answersContainer.append(bookmark);
			 }
			 var questionCount = $(
				 QUESTION_COUNT_TEMPLATE
				 .replace(PLACEHOLDER_QUESTION_NUMBER,quizData.countQuestionsAcrossQuiz ?
														 getCurrentQuestionNumberForAllQuestions(question.questionGUID)+1 : 
														 index+1)
				 .replace(PLACEHOLDER_QUESTION_TOTAL_COUNT,quizData.countQuestionsAcrossQuiz ?
															 getTotalNumberOfQuizQuestions() :
															 getQuestionGroupDataByQuestionGUID(question.questionGUID).questions.length)
				 );
			 answersContainer.append(questionCount);
			 var answersContainerFieldset = $('<fieldset></fieldset>');
			 var questionText = $( QUESTION_TEXT_TEMPLATE.replace(PLACEHOLDER_QUESTION_QUESTION_TEXT,
									 question.questionPreText != undefined && question.questionPreText.length > 0 ? 
									 question.questionPreText+question.questionText :
									 question.questionText) );
			 answersContainerFieldset.append(questionText);
			 answersContainerFieldset.append($(QUESTION_MULTIPLE_SELECT_CHOOSE_TEXT_LABEL_TEMPATE));
			 if(quizData.useAttemptsScore) {
				 var questionNumberOfAttempts = $(QUESTION_NUMBER_OF_ATTEMPTS_TEMPLATE.replace(PLACEHOLDER_QUESTION_NUMBER_OF_ATTEMPTS,0) );
				 answersContainerFieldset.append(questionNumberOfAttempts);
				 var questionPointValue = $(QUESTION_POINT_VALUE_TEMPLATE.replace(PLACEHOLDER_QUESTION_POINT_VALUE,getQuestionPointValue(question.questionGUID) ) );
				 answersContainerFieldset.append(questionPointValue);
			 }
			 var answersContainerCheckboxGroup = $(ANSWERS_CONTAINER_CHECKBOX_GROUP_TEMPLATE);
	
			 for(var j=0;j<question.answers.length;j++) {
				 var answerContainer = $(ANSWER_CONTAINER_TEMPLATE);
				 var answerData = question.answers[j];
				 var answerLetter = getAnswerLetter(answerData.answerGUID,j);
				 //images
				 if(answerData.images != undefined && answerData.images.length > 0) {
					 $.each(answerData.images, function(z,image) {
						 if(image.link != undefined && image.link.length > 0) {
							 var imageContainer = $(
								 IMAGE_CONTAINER_LINK_TEMPLATE
								 .replace(PLACEHOLDER_IMAGE_TITLE,image.title)
								 .replace(PLACEHOLDER_IMAGE_SUBTITLE,image.subtitle)
								 .replace(PLACEHOLDER_IMAGE_URL,image.imageURL)
								 .replace(PLACEHOLDER_IMAGE_ALT_TEXT,image.altText)
								 .replace(PLACEHOLDER_IMAGE_WIDTH,image.settings.width)
								 .replace(PLACEHOLDER_IMAGE_HEIGHT,image.settings.height)
								 .replace(PLACEHOLDER_IMAGE_LINK,image.link)
							 );
						 }
						 else {
							 var imageContainer = $(
								 IMAGE_CONTAINER_TEMPLATE
								 .replace(PLACEHOLDER_IMAGE_TITLE,image.title)
								 .replace(PLACEHOLDER_IMAGE_SUBTITLE,image.subtitle)
								 .replace(PLACEHOLDER_IMAGE_URL,image.imageURL)
								 .replace(PLACEHOLDER_IMAGE_ALT_TEXT,image.altText)
								 .replace(PLACEHOLDER_IMAGE_WIDTH,image.settings.width)
								 .replace(PLACEHOLDER_IMAGE_HEIGHT,image.settings.height)
							 );
						 }
						 answerContainer.append(imageContainer);
					 });
				 }
	
	
				 //video
				 if(answerData.videos != undefined && answerData.videos.length > 0) {
					 $.each(answerData.videos, function(k,video) {
						 //for responsiveness use whichever is smaller: parent container width or data-provided width
						 var videoWidth = $('.questionsContainerParent').width() < video.settings.width ? Math.round( $('.questionsContainerParent').width() ) : video.settings.width;
						 var videoContainer = $(
							 VIDEO_CONTAINER_TEMPLATE
							 .replace(PLACEHOLDER_VIDEO_TITLE,video.title)
							 .replace(PLACEHOLDER_VIDEO_SUBTITLE,video.subtitle)
							 .replace(PLACEHOLDER_VIDEO_URL,video.videoURL)
							 .replace(PLACEHOLDER_POSTER_URL,video.posterURL)
							 .replace(PLACEHOLDER_CAPTION_URL,video.captionURL)
							 .replace(PLACEHOLDER_VIDEO_WIDTH,videoWidth)
							 .replace(PLACEHOLDER_VIDEO_HEIGHT,video.settings.height)
						 );
						 answerContainer.append(videoContainer);
					 });
				 }
	
				 //audio
				 if(answerData.audios != undefined && answerData.audios.length > 0) {
					 $.each(answerData.audios, function(l,audio) {
						 var audioContainer = $(
							 AUDIO_CONTAINER_TEMPLATE
							 .replace(PLACEHOLDER_AUDIO_TITLE,audio.title)
							 .replace(PLACEHOLDER_AUDIO_SUBTITLE,audio.subtitle)
							 .replace(PLACEHOLDER_AUDIO_URL,audio.audioURL)
						 );
						 //transcript
						 var audioTranscriptLink = $(
							 AUDIO_TRANSCRIPT_LINK
						 );
						 audioContainer.append(audioTranscriptLink);
	
						 var audioTranscriptText = $(
							 AUDIO_TRANSCRIPT_TEXT
							 .replace(PLACEHOLDER_VALUE,audio.transcriptText)
						);
						audioContainer.append(audioTranscriptText);
	
	
						 answerContainer.append(audioContainer);
					 });
				 }
	
				 //need to seperate elements, otherwise we get double-binding from nested <input> element
				 //DEPRECATED
				 //answer
				 /*var answer = $(
					 ANSWER_CHECKBOX_TEMPLATE
					 .replace(/PLACEHOLDER_ANSWER_DATA_ANSWER_GUID/g,answerData.answerGUID)
					 .replace(PLACEHOLDER_QUESTION_QUESTION_GUID,question.questionGUID)
					 .replace(PLACEHOLDER_ANSWER_LETTER,answerLetter)
					 .replace(PLACEHOLDER_ANSWER_DATA_ANSWER_TEXT,answerData.answerText)
					 ).click(onMultipleSelectAnswerClick);
				 answerContainer.append(answer);*/
				 
				 var answerLabel = $(
					 ANSWER_CHECKBOX_LABEL_TEMPLATE
					 .replace(/PLACEHOLDER_ANSWER_DATA_ANSWER_GUID/g,answerData.answerGUID)
				 );	
				 var answerInput = $(
					 ANSWER_CHECKBOX_INPUT_TEMPLATE
					 .replace(/PLACEHOLDER_ANSWER_DATA_ANSWER_GUID/g,answerData.answerGUID)
					 .replace(PLACEHOLDER_QUESTION_QUESTION_GUID,question.questionGUID)
					 .replace(PLACEHOLDER_ANSWER_LETTER,answerLetter)
					 .replace(PLACEHOLDER_ANSWER_DATA_ANSWER_TEXT,answerData.answerText)
				 ).change(onMultipleSelectAnswerClick);
				 
				 answerLabel.append(answerInput);
				 answerContainer.append(answerLabel);
				 
				 //feedback
				 if(answerData.feedback != undefined && answerData.feedback.length > 0) {
					 var feedback = $( FEEDBACK_PLACEHOLDER_TEMPLATE.replace(PLACEHOLDER_ANSWER_DATA_FEEDBACK,answerData.feedback) );
					 answerContainer.append(feedback);
				 }
	
	
				 answersContainerCheckboxGroup.append(answerContainer);
			 }
	
	
			 answersContainerFieldset.append(answersContainerCheckboxGroup);
			 answersContainer.append(answersContainerFieldset);
			 questionContainer.append(answersContainer);
	
			 var questionBoilerplateFeedback = $(QUESTION_BOILERPLATE_FEEDBACK_CONTAINER_TEMPLATE);
			 questionContainer.append(questionBoilerplateFeedback);
			if( (question.feedback!= undefined && question.feedback.length > 0) ||
				(question.feedbackCorrect != undefined && question.feedbackCorrect.length > 0) ||
				(question.feedbackIncorrect != undefined && question.feedbackIncorrect.length > 0) ) {
					 var questionFeedback = $(QUESTION_FEEDBACK_TEMPLATE);
					 var questionFeedbackText = $(QUESTION_FEEDBACK_TEXT_CONTAINER_TEMPLATE);
					 questionFeedback.append(questionFeedbackText);
					 questionContainer.append(questionFeedback);
			}
	
	
		} //end if question type multiple select
	
		//TEXT ENTRY
	
		else if(questionType === QUESTION_TYPE_FILL_IN_THE_BLANK) {
			var questionContainer = $(
				 QUESTION_CONTAINER_TEMPLATE
				 .replace(PLACEHOLDER_QUESTION_TYPE,questionType)
				 .replace(PLACEHOLDER_QUESTION_QUESTION_GUID,question.questionGUID)
				 );
	
			 //banner
			 /*if(question.banner != undefined && question.banner.length > 0) {
				 var bannerContainer = $(
					 BANNER_TEMPLATE
					 .replace(PLACEHOLDER_BANNER_TEXT,question.banner)
				 );
				 questionContainer.append(bannerContainer);
			 }
			*/
			 //images
			 if(question.images != undefined && question.images.length > 0) {
				 $.each(question.images, function(z,image) {
					 if(image.link != undefined && image.link.length > 0) {
						 var imageContainer = $(
							 IMAGE_CONTAINER_LINK_TEMPLATE
							 .replace(PLACEHOLDER_IMAGE_TITLE,image.title)
							 .replace(PLACEHOLDER_IMAGE_SUBTITLE,image.subtitle)
							 .replace(PLACEHOLDER_IMAGE_URL,image.imageURL)
							 .replace(PLACEHOLDER_IMAGE_ALT_TEXT,image.altText)
							 .replace(PLACEHOLDER_IMAGE_WIDTH,image.settings.width)
							 .replace(PLACEHOLDER_IMAGE_HEIGHT,image.settings.height)
							 .replace(PLACEHOLDER_IMAGE_LINK,image.link)
						 );
					 }
					 else {
						 var imageContainer = $(
							 IMAGE_CONTAINER_TEMPLATE
							 .replace(PLACEHOLDER_IMAGE_TITLE,image.title)
							 .replace(PLACEHOLDER_IMAGE_SUBTITLE,image.subtitle)
							 .replace(PLACEHOLDER_IMAGE_URL,image.imageURL)
							 .replace(PLACEHOLDER_IMAGE_ALT_TEXT,image.altText)
							 .replace(PLACEHOLDER_IMAGE_WIDTH,image.settings.width)
							 .replace(PLACEHOLDER_IMAGE_HEIGHT,image.settings.height)
						 );
					 }
					 questionContainer.append(imageContainer);
				 });
			 }
	
			 //video
			 if(question.videos != undefined && question.videos.length > 0) {
				 $.each(question.videos, function(k,video) {
					 //for responsiveness use whichever is smaller: parent container width or data-provided width
					 var videoWidth = $('.questionsContainerParent').width() < video.settings.width ? Math.round( $('.questionsContainerParent').width() ) : video.settings.width;
					 var videoContainer = $(
						 VIDEO_CONTAINER_TEMPLATE
						 .replace(PLACEHOLDER_VIDEO_TITLE,video.title)
						 .replace(PLACEHOLDER_VIDEO_SUBTITLE,video.subtitle)
						 .replace(PLACEHOLDER_VIDEO_URL,video.videoURL)
						 .replace(PLACEHOLDER_POSTER_URL,video.posterURL)
						 .replace(PLACEHOLDER_CAPTION_URL,video.captionURL)
						 .replace(PLACEHOLDER_VIDEO_WIDTH,videoWidth)
						 .replace(PLACEHOLDER_VIDEO_HEIGHT,video.settings.height)
					 );
					 questionContainer.append(videoContainer);
				 });
			 }
	
			 //audio
			 if(question.audios != undefined && question.audios.length > 0) {
				 $.each(question.audios, function(l,audio) {
					 var audioContainer = $(
						 AUDIO_CONTAINER_TEMPLATE
						 .replace(PLACEHOLDER_AUDIO_TITLE,audio.title)
						 .replace(PLACEHOLDER_AUDIO_SUBTITLE,audio.subtitle)
						 .replace(PLACEHOLDER_AUDIO_URL,audio.audioURL)
					 );
					 //transcript
					 var audioTranscriptLink = $(
						 AUDIO_TRANSCRIPT_LINK
					 );
					 audioContainer.append(audioTranscriptLink);
	
					 var audioTranscriptText = $(
						 AUDIO_TRANSCRIPT_TEXT
						 .replace(PLACEHOLDER_VALUE,audio.transcriptText)
					);
					audioContainer.append(audioTranscriptText);
	
					 questionContainer.append(audioContainer);
				 });
			 }
			//ONLY used for Jay's piece...if other quiz pieces use text entry may need to re-evaluate
			 questionContainer.append(QUESTION_INDICATOR_TEMPLATE);
			 var answersContainer = $(ANSWERS_CONTAINER_TEMPLATE);
			 var questionText = $( QUESTION_TEXT_TEMPLATE.replace(PLACEHOLDER_QUESTION_QUESTION_TEXT,
									 question.questionPreText != undefined && question.questionPreText.length > 0 ? 
									 question.questionPreText+question.questionText :
									 question.questionText) );
			 //always one answer text entry field per question
			 var answerContainer = $(ANSWER_CONTAINER_TEMPLATE);
			 var answerData = question.answers[0];
			 //images
				 if(answerData.images != undefined && answerData.images.length > 0) {
					 $.each(answerData.images, function(z,image) {
						 if(image.link != undefined && image.link.length > 0) {
							 var imageContainer = $(
								 IMAGE_CONTAINER_LINK_TEMPLATE
								 .replace(PLACEHOLDER_IMAGE_TITLE,image.title)
								 .replace(PLACEHOLDER_IMAGE_SUBTITLE,image.subtitle)
								 .replace(PLACEHOLDER_IMAGE_URL,image.imageURL)
								 .replace(PLACEHOLDER_IMAGE_ALT_TEXT,image.altText)
								 .replace(PLACEHOLDER_IMAGE_WIDTH,image.settings.width)
								 .replace(PLACEHOLDER_IMAGE_HEIGHT,image.settings.height)
								 .replace(PLACEHOLDER_IMAGE_LINK,image.link)
							 );
						 }
						 else {
							 var imageContainer = $(
								 IMAGE_CONTAINER_TEMPLATE
								 .replace(PLACEHOLDER_IMAGE_TITLE,image.title)
								 .replace(PLACEHOLDER_IMAGE_SUBTITLE,image.subtitle)
								 .replace(PLACEHOLDER_IMAGE_URL,image.imageURL)
								 .replace(PLACEHOLDER_IMAGE_ALT_TEXT,image.altText)
								 .replace(PLACEHOLDER_IMAGE_WIDTH,image.settings.width)
								 .replace(PLACEHOLDER_IMAGE_HEIGHT,image.settings.height)
							 );
						 }
						 answerContainer.append(imageContainer);
					 });
				 }
	
	
				 //video
				 if(answerData.videos != undefined && answerData.videos.length > 0) {
					 $.each(answerData.videos, function(k,video) {
						 //for responsiveness use whichever is smaller: parent container width or data-provided width
						 var videoWidth = $('.questionsContainerParent').width() < video.settings.width ? Math.round( $('.questionsContainerParent').width() ) : video.settings.width;
						 var videoContainer = $(
							 VIDEO_CONTAINER_TEMPLATE
							 .replace(PLACEHOLDER_VIDEO_TITLE,video.title)
							 .replace(PLACEHOLDER_VIDEO_SUBTITLE,video.subtitle)
							 .replace(PLACEHOLDER_VIDEO_URL,video.videoURL)
							 .replace(PLACEHOLDER_POSTER_URL,video.posterURL)
							 .replace(PLACEHOLDER_CAPTION_URL,video.captionURL)
							 .replace(PLACEHOLDER_VIDEO_WIDTH,videoWidth)
							 .replace(PLACEHOLDER_VIDEO_HEIGHT,video.settings.height)
						 );
						 answerContainer.append(videoContainer);
					 });
				 }
	
				 //audio
				 if(answerData.audios != undefined && answerData.audios.length > 0) {
					 $.each(answerData.audios, function(l,audio) {
						 var audioContainer = $(
							 AUDIO_CONTAINER_TEMPLATE
							 .replace(PLACEHOLDER_AUDIO_TITLE,audio.title)
							 .replace(PLACEHOLDER_AUDIO_SUBTITLE,audio.subtitle)
							 .replace(PLACEHOLDER_AUDIO_URL,audio.audioURL)
						 );
						 //transcript
						 var audioTranscriptLink = $(
							 AUDIO_TRANSCRIPT_LINK
						 );
						 audioContainer.append(audioTranscriptLink);
	
						 var audioTranscriptText = $(
							 AUDIO_TRANSCRIPT_TEXT
							 .replace(PLACEHOLDER_VALUE,audio.transcriptText)
						);
						audioContainer.append(audioTranscriptText);
	
	
						 answerContainer.append(audioContainer);
					 });
				 }
	
	
			 var answer = $(
					 ANSWER_FILL_IN_THE_BLANK_TEMPLATE
					 .replace(/PLACEHOLDER_ANSWER_DATA_ANSWER_GUID/g,answerData.answerGUID)
					 ).on('change keyup', function(e) { quizAppCommon.onTextEntryAnswerChange(e) });
	
			//Placeholder feedback. Will be set dynamically based on entry
			var feedback = $( FEEDBACK_PLACEHOLDER_TEMPLATE );
	
			//answerContainer.append(ANSWER_INDICATOR_TEMPLATE);
	
			answerContainer.append(answer);
			answerContainer.append(feedback);
	
	
			answersContainer.append(answerContainer);
	
			questionContainer.append(questionText);
			if(quizData.useAttemptsScore) {
				 var questionNumberOfAttempts = $(QUESTION_NUMBER_OF_ATTEMPTS_TEMPLATE.replace(PLACEHOLDER_QUESTION_NUMBER_OF_ATTEMPTS,0) );
				 questionContainer.append(questionNumberOfAttempts);
				 var questionPointValue = $(QUESTION_POINT_VALUE_TEMPLATE.replace(PLACEHOLDER_QUESTION_POINT_VALUE,getQuestionPointValue(question.questionGUID) ) );
				 questionContainer.append(questionPointValue);
			 }
			questionContainer.append(answersContainer);
			if( (question.feedbackCorrect != undefined && question.feedbackCorrect.length > 0) ||
				(question.feedbackIncorrect != undefined && question.feedbackIncorrect.length > 0) ) {
					var questionFeedback = $(QUESTION_FEEDBACK_TEMPLATE);
					 var questionFeedbackText = $(QUESTION_FEEDBACK_TEXT_CONTAINER_TEMPLATE);
					 questionFeedback.append(questionFeedbackText);
					 questionContainer.append(questionFeedback);
				}
	
		} //end if question type text entry
	
		//EXPERT RESPONSE
	
		else if(questionType === QUESTION_TYPE_EXPERT_RESPONSE) {
			var questionContainer = $(
				 QUESTION_CONTAINER_TEMPLATE
				 .replace(PLACEHOLDER_QUESTION_TYPE,questionType)
				 .replace(PLACEHOLDER_QUESTION_QUESTION_GUID,question.questionGUID)
				 );
	
			 //banner
			 /*if(question.banner != undefined && question.banner.length > 0) {
				 var bannerContainer = $(
					 BANNER_TEMPLATE
					 .replace(PLACEHOLDER_BANNER_TEXT,question.banner)
				 );
				 questionContainer.append(bannerContainer);
			 }
			*/
			 //images
			 if(question.images != undefined && question.images.length > 0) {
				 $.each(question.images, function(z,image) {
					 if(image.link != undefined && image.link.length > 0) {
						 var imageContainer = $(
							 IMAGE_CONTAINER_LINK_TEMPLATE
							 .replace(PLACEHOLDER_IMAGE_TITLE,image.title)
							 .replace(PLACEHOLDER_IMAGE_SUBTITLE,image.subtitle)
							 .replace(PLACEHOLDER_IMAGE_URL,image.imageURL)
							 .replace(PLACEHOLDER_IMAGE_ALT_TEXT,image.altText)
							 .replace(PLACEHOLDER_IMAGE_WIDTH,image.settings.width)
							 .replace(PLACEHOLDER_IMAGE_HEIGHT,image.settings.height)
							 .replace(PLACEHOLDER_IMAGE_LINK,image.link)
						 );
					 }
					 else {
						 var imageContainer = $(
							 IMAGE_CONTAINER_TEMPLATE
							 .replace(PLACEHOLDER_IMAGE_TITLE,image.title)
							 .replace(PLACEHOLDER_IMAGE_SUBTITLE,image.subtitle)
							 .replace(PLACEHOLDER_IMAGE_URL,image.imageURL)
							 .replace(PLACEHOLDER_IMAGE_ALT_TEXT,image.altText)
							 .replace(PLACEHOLDER_IMAGE_WIDTH,image.settings.width)
							 .replace(PLACEHOLDER_IMAGE_HEIGHT,image.settings.height)
						 );
					 }
					 questionContainer.append(imageContainer);
				 });
			 }
	
			 //video
			 if(question.videos != undefined && question.videos.length > 0) {
				 $.each(question.videos, function(k,video) {
					 //for responsiveness use whichever is smaller: parent container width or data-provided width
					 var videoWidth = $('.questionsContainerParent').width() < video.settings.width ? Math.round( $('.questionsContainerParent').width() ) : video.settings.width;
					 var videoContainer = $(
						 VIDEO_CONTAINER_TEMPLATE
						 .replace(PLACEHOLDER_VIDEO_TITLE,video.title)
						 .replace(PLACEHOLDER_VIDEO_SUBTITLE,video.subtitle)
						 .replace(PLACEHOLDER_VIDEO_URL,video.videoURL)
						 .replace(PLACEHOLDER_POSTER_URL,video.posterURL)
						 .replace(PLACEHOLDER_CAPTION_URL,video.captionURL)
						 .replace(PLACEHOLDER_VIDEO_WIDTH,videoWidth)
						 .replace(PLACEHOLDER_VIDEO_HEIGHT,video.settings.height)
					 );
					 questionContainer.append(videoContainer);
				 });
			 }
	
			 //audio
			 if(question.audios != undefined && question.audios.length > 0) {
				 $.each(question.audios, function(l,audio) {
					 var audioContainer = $(
						 AUDIO_CONTAINER_TEMPLATE
						 .replace(PLACEHOLDER_AUDIO_TITLE,audio.title)
						 .replace(PLACEHOLDER_AUDIO_SUBTITLE,audio.subtitle)
						 .replace(PLACEHOLDER_AUDIO_URL,audio.audioURL)
					 );
					 //transcript
					 var audioTranscriptLink = $(
						 AUDIO_TRANSCRIPT_LINK
					 );
					 audioContainer.append(audioTranscriptLink);
	
					 var audioTranscriptText = $(
						 AUDIO_TRANSCRIPT_TEXT
						 .replace(PLACEHOLDER_VALUE,audio.transcriptText)
					);
					audioContainer.append(audioTranscriptText);
	
					 questionContainer.append(audioContainer);
				 });
			 }
	
			 //questionContainer.append(QUESTION_INDICATOR_TEMPLATE);
			 var answersContainer = $(ANSWERS_CONTAINER_TEMPLATE);
			 if(quizData.useBookmarks) {
				 var bookmark = BOOKMARK;
				 answersContainer.append(bookmark);
			 }
			 var questionCount = $(
				 QUESTION_COUNT_TEMPLATE
				 .replace(PLACEHOLDER_QUESTION_NUMBER,quizData.countQuestionsAcrossQuiz ?
														 getCurrentQuestionNumberForAllQuestions(question.questionGUID)+1 : 
														 index+1)
				 .replace(PLACEHOLDER_QUESTION_TOTAL_COUNT,quizData.countQuestionsAcrossQuiz ?
															 getTotalNumberOfQuizQuestions() :
															 getQuestionGroupDataByQuestionGUID(question.questionGUID).questions.length)
				 );
			 answersContainer.append(questionCount);
			 /*var answersContainerFieldset = $('<fieldset></fieldset>');
			 var questionText = $( QUESTION_TEXT_TEMPLATE.replace(PLACEHOLDER_QUESTION_QUESTION_TEXT,
									 question.questionPreText != undefined && question.questionPreText.length > 0 ? 
									 question.questionPreText+question.questionText :
									 question.questionText) );
			 answersContainerFieldset.append(questionText);*/
			 //answersContainer.append(questionText);
			 //always one answer text entry field per question
			 var answerContainer = $(ANSWER_CONTAINER_TEMPLATE);
			 var answerData = question.answers[0];
			 //images
				 if(answerData.images != undefined && answerData.images.length > 0) {
					 $.each(answerData.images, function(z,image) {
						 if(image.link != undefined && image.link.length > 0) {
						 var imageContainer = $(
								 IMAGE_CONTAINER_LINK_TEMPLATE
								 .replace(PLACEHOLDER_IMAGE_TITLE,image.title)
								 .replace(PLACEHOLDER_IMAGE_SUBTITLE,image.subtitle)
								 .replace(PLACEHOLDER_IMAGE_URL,image.imageURL)
								 .replace(PLACEHOLDER_IMAGE_ALT_TEXT,image.altText)
								 .replace(PLACEHOLDER_IMAGE_WIDTH,image.settings.width)
								 .replace(PLACEHOLDER_IMAGE_HEIGHT,image.settings.height)
								 .replace(PLACEHOLDER_IMAGE_LINK,image.link)
							 );
						 }
						 else {
							 var imageContainer = $(
								 IMAGE_CONTAINER_TEMPLATE
								 .replace(PLACEHOLDER_IMAGE_TITLE,image.title)
								 .replace(PLACEHOLDER_IMAGE_SUBTITLE,image.subtitle)
								 .replace(PLACEHOLDER_IMAGE_URL,image.imageURL)
								 .replace(PLACEHOLDER_IMAGE_ALT_TEXT,image.altText)
								 .replace(PLACEHOLDER_IMAGE_WIDTH,image.settings.width)
								 .replace(PLACEHOLDER_IMAGE_HEIGHT,image.settings.height)
							 );
						 }
						 answerContainer.append(imageContainer);
					 });
				 }
	
	
				 //video
				 if(answerData.videos != undefined && answerData.videos.length > 0) {
					 $.each(answerData.videos, function(k,video) {
						 //for responsiveness use whichever is smaller: parent container width or data-provided width
						 var videoWidth = $('.questionsContainerParent').width() < video.settings.width ? Math.round( $('.questionsContainerParent').width() ) : video.settings.width;
						 var videoContainer = $(
							 VIDEO_CONTAINER_TEMPLATE
							 .replace(PLACEHOLDER_VIDEO_TITLE,video.title)
							 .replace(PLACEHOLDER_VIDEO_SUBTITLE,video.subtitle)
							 .replace(PLACEHOLDER_VIDEO_URL,video.videoURL)
							 .replace(PLACEHOLDER_POSTER_URL,video.posterURL)
							 .replace(PLACEHOLDER_CAPTION_URL,video.captionURL)
							 .replace(PLACEHOLDER_VIDEO_WIDTH,videoWidth)
							 .replace(PLACEHOLDER_VIDEO_HEIGHT,video.settings.height)
						 );
						 answerContainer.append(videoContainer);
					 });
				 }
	
				 //audio
				 if(answerData.audios != undefined && answerData.audios.length > 0) {
					 $.each(answerData.audios, function(l,audio) {
						 var audioContainer = $(
							 AUDIO_CONTAINER_TEMPLATE
							 .replace(PLACEHOLDER_AUDIO_TITLE,audio.title)
							 .replace(PLACEHOLDER_AUDIO_SUBTITLE,audio.subtitle)
							 .replace(PLACEHOLDER_AUDIO_URL,audio.audioURL)
						 );
						 //transcript
						 var audioTranscriptLink = $(
							 AUDIO_TRANSCRIPT_LINK
						 );
						 audioContainer.append(audioTranscriptLink);
	
						 var audioTranscriptText = $(
							 AUDIO_TRANSCRIPT_TEXT
							 .replace(PLACEHOLDER_VALUE,audio.transcriptText)
						);
						audioContainer.append(audioTranscriptText);
	
	
						 answerContainer.append(audioContainer);
					 });
				 }
	
			 var answer = $(
					 ANSWER_EXPERT_RESPONSE_TEMPLATE
					 .replace(/PLACEHOLDER_ANSWER_DATA_ANSWER_GUID/g,answerData.answerGUID)
					 .replace(PLACEHOLDER_QUESTION_QUESTION_TEXT,question.questionText)
					 ).on('change keyup', function(e) { quizAppCommon.onTextEntryAnswerChange(e) });
			answerContainer.append(answer);
	
			//Only question-level feedback for Expert Response
			/*if(answerData.feedback != undefined && answerData.feedback.length > 0) {
				 var feedback = $( FEEDBACK_PLACEHOLDER_TEMPLATE.replace(PLACEHOLDER_ANSWER_DATA_FEEDBACK,answerData.feedback) );
				 answerContainer.append(feedback);
			 }*/
			//answersContainerFieldset.append(answerContainer);
			//answersContainer.append(answersContainerFieldset);
			answersContainer.append(answerContainer);
			
			if(quizData.useAttemptsScore) {
				 var questionPointValue = $(QUESTION_POINT_VALUE_TEMPLATE.replace(PLACEHOLDER_QUESTION_POINT_VALUE,getQuestionPointValue(question.questionGUID) ) );
				 questionContainer.append(questionNumberOfAttempts);
			 }
			questionContainer.append(answersContainer);
			if( (question.feedback != undefined && question.feedback.length > 0) ) {
					var questionFeedback = $(QUESTION_FEEDBACK_TEMPLATE);
					 var questionFeedbackText = $(QUESTION_FEEDBACK_TEXT_CONTAINER_TEMPLATE);
					 questionFeedback.append(questionFeedbackText);
					 questionContainer.append(questionFeedback);
			}
	
		} //end if question type text entry
	
		//if flashcards, append data holder for number of attempts
		if(quizData.useAttemptsScore) {
			$(questionContainer).attr('number-of-attempts',0);
		}
	
	
		questionGroupContainer.append(questionContainer);
	
	}
	
	
	function buildQuestions() {
		cl('buildQuestions');
		if(quizData.usePagination) {
			//cl('adasdasd');
		}
		var questionsContainer = $(QUESTIONS_CONTAINER_TEMPLATE);
		//for each question group
		$.each(quizData.questionGroups, function(i,questionGroup)  {
			if(quizData.useTabs) {
				var tabPanelTemplate = $( TAB_PANEL_TEMPLATE 
											.replace(/PLACEHOLDER_TAB_PANEL_GUID/g,(i+1))
										);	
			}
			
			var questionGroupContainer = $( QUESTION_GROUP_CONTAINER_TEMPLATE.replace(PLACEHOLDER_QUESTION_GROUP_GUID,questionGroup.questionGroupGUID) );
			if(quizData.useTextRadioButtons) {
				questionGroupContainer.removeClass('container');	
			}
			//if tabs, don't double-append
			if(!quizData.useTabs) {
				questionGroupContainer.append( $(QUESTION_GROUP_TITLE_TEMPLATE
													.replace(PLACEHOLDER_QUESTION_GROUP_TITLE,questionGroup.questionGroupTitle)
													.replace(PLACEHOLDER_QUESTION_GROUP_GUID,questionGroup.questionGroupGUID+"Title")
												) );
			}
			//images
			 if(questionGroup.images != undefined && questionGroup.images.length > 0) {
					 $.each(questionGroup.images, function(z,image) {
						 if(image.link != undefined && image.link.length > 0) {
						 var imageContainer = $(
								 IMAGE_CONTAINER_LINK_TEMPLATE
								 .replace(PLACEHOLDER_IMAGE_TITLE,image.title)
								 .replace(PLACEHOLDER_IMAGE_SUBTITLE,image.subtitle)
								 .replace(PLACEHOLDER_IMAGE_URL,image.imageURL)
								 .replace(PLACEHOLDER_IMAGE_ALT_TEXT,image.altText)
								 .replace(PLACEHOLDER_IMAGE_WIDTH,image.settings.width)
								 .replace(PLACEHOLDER_IMAGE_HEIGHT,image.settings.height)
								 .replace(PLACEHOLDER_IMAGE_LINK,image.link)
							 );
						 }
						 else {
							 var imageContainer = $(
								 IMAGE_CONTAINER_TEMPLATE
								 .replace(PLACEHOLDER_IMAGE_TITLE,image.title)
								 .replace(PLACEHOLDER_IMAGE_SUBTITLE,image.subtitle)
								 .replace(PLACEHOLDER_IMAGE_URL,image.imageURL)
								 .replace(PLACEHOLDER_IMAGE_ALT_TEXT,image.altText)
								 .replace(PLACEHOLDER_IMAGE_WIDTH,image.settings.width)
								 .replace(PLACEHOLDER_IMAGE_HEIGHT,image.settings.height)
							 );
						 }
						 questionGroupContainer.append(imageContainer);
					 });
				 }
	
	
				 //video
				 if(questionGroup.videos != undefined && questionGroup.videos.length > 0) {
					 $.each(questionGroup.videos, function(k,video) {
						 //for responsiveness use whichever is smaller: parent container width or data-provided width
						 var videoWidth = $('.questionsContainerParent').width() < video.settings.width ? Math.round( $('.questionsContainerParent').width() ) : video.settings.width;
						 var videoContainer = $(
							 VIDEO_CONTAINER_TEMPLATE
							 .replace(PLACEHOLDER_VIDEO_TITLE,video.title)
							 .replace(PLACEHOLDER_VIDEO_SUBTITLE,video.subtitle)
							 .replace(PLACEHOLDER_VIDEO_URL,video.videoURL)
							 .replace(PLACEHOLDER_POSTER_URL,video.posterURL)
							 .replace(PLACEHOLDER_CAPTION_URL,video.captionURL)
							 .replace(PLACEHOLDER_VIDEO_WIDTH,videoWidth)
							 .replace(PLACEHOLDER_VIDEO_HEIGHT,video.settings.height)
						 );
						 questionGroupContainer.append(videoContainer);
					 });
				 }
	
				 //audio
				 if(questionGroup.audios != undefined && questionGroup.audios.length > 0) {
					 $.each(questionGroup.audios, function(l,audio) {
						 var audioContainer = $(
							 AUDIO_CONTAINER_TEMPLATE
							 .replace(PLACEHOLDER_AUDIO_TITLE,audio.title)
							 .replace(PLACEHOLDER_AUDIO_SUBTITLE,audio.subtitle)
							 .replace(PLACEHOLDER_AUDIO_URL,audio.audioURL)
						 );
						 //transcript
						 var audioTranscriptLink = $(
							 AUDIO_TRANSCRIPT_LINK
						 );
						 audioContainer.append(audioTranscriptLink);
	
						 var audioTranscriptText = $(
							 AUDIO_TRANSCRIPT_TEXT
							 .replace(PLACEHOLDER_VALUE,audio.transcriptText)
						);
						audioContainer.append(audioTranscriptText);
	
	
						 questionGroupContainer.append(audioContainer);
					 });
				 }
			
			
			questionGroupContainer.append( $(QUESTION_GROUP_DESCRIPTION_TEMPLATE.replace(PLACEHOLDER_QUESTION_GROUP_DESCRIPTION,questionGroup.questionGroupDescription) ) );
	
			//for each question
			$.each(questionGroup.questions, function(j,question)  {
				quizAppCommon.buildQuestion(j,question,questionGroupContainer);
			}); //end for each question
	
			if(questionGroup.questionGroupCompetency != undefined && questionGroup.questionGroupCompetency.length > 0) {
				questionGroupContainer.append( $(QUESTION_GROUP_COMPETENCY_TEMPLATE.replace(PLACEHOLDER_QUESTION_GROUP_COMPETENCY,questionGroup.questionGroupCompetency) ) );
			}
	
			//score container
			if(quizData.showGroupScore) {
				var questionGroupScoreContainerParent = $( QUESTION_GROUP_SCORE_CONTAINER_PARENT_TEMPLATE);
				var questionGroupScoreContainer = $( QUESTIONS_GROUP_SCORE_CONTAINER_TEMPLATE );
				questionGroupScoreContainer.append(QUESTION_GROUP_POINTS_TEMPLATE);
				questionGroupScoreContainerParent.append(questionGroupScoreContainer);
				questionGroupContainer.append(questionGroupScoreContainerParent);
			}
			if(!questionGroup.isContentPage && !quizData.hideGroupSubmit && !quizData.isPracticeExam) {
				//Add submit and reset buttons for each question container
				var questionContainerButtonGroup = $(QUESTION_CONTAINER_BUTTON_GROUP_TEMPLATE);
				//if(quizData.showResetQuiz) {
					questionContainerButtonGroup.append( $(QUESTION_CONTAINER_BUTTON_RESET_TEMPLATE) );
				//}
				questionContainerButtonGroup.append( $(QUESTION_CONTAINER_BUTTON_SUBMIT_TEMPLATE) );
				questionGroupContainer.append(questionContainerButtonGroup);
			}
			if(quizData.useTabs) {
				tabPanelTemplate.append(questionGroupContainer);
				questionsContainer.append(tabPanelTemplate);
			}
			else {
				questionsContainer.append(questionGroupContainer);
			}
			
			if(quizData.usePagination) {
				//questionGroupContainer.wrap(PAGINATION_SECTION.replace(PLACEHOLDER_SECTION_ID_COUNT,questionGroup.questionGroupGUID));
				questionGroupContainer.wrap(PAGINATION_SECTION.replace(PLACEHOLDER_SECTION_ID_COUNT,i).replace(PLACEHOLDER_QUESTION_GROUP_GUID,questionGroup.questionGroupGUID));
				$('#paginationNavListContainer').append(PAGINATION_NAV_ITEM.replace(/PLACEHOLDER_SECTION_ID_COUNT/g,i));
			}
			
			//add next tab button. For now tightly coupled to tabs; we always want this for tabs, and only for tabs
			if(quizData.useTabs) {
				var tabSwitcherContainer = $(TAB_SWITCHER_TEMPLATE);
				
				//previous tab
				if( i > 0 ) {
					var previousTabGUID = 'tab'+i;				
					tabSwitcherContainer.append(RETURN_TO_PREVIOUS_TAB_BUTTON_TEMPLATE.replace(PLACEHOLDER_TARGET_TAB_GUID,previousTabGUID));
					questionGroupContainer.append(tabSwitcherContainer);
				}
				
				//next tab
				if( (i+1) !== quizData.questionGroups.length ) {
					var nextTabGUID = 'tab'+(i+2);
					tabSwitcherContainer.append(CONTINUE_TO_NEXT_TAB_BUTTON_TEMPLATE.replace(PLACEHOLDER_TARGET_TAB_GUID,nextTabGUID));
					questionGroupContainer.append(tabSwitcherContainer);
				}
			}
			
			
		}); //end for each question group
	
		if(quizData.usePagination) {
			//$('#paginationNavListContainer').prepend(PAGINATION_NAV_ITEM_PREV);
			//$('#paginationNavListContainer').append(PAGINATION_NAV_ITEM_NEXT);
			initPaginationLocal();
		}
		//onRenderComplete();
	
	}
	
	//callback inits post-render
	function onRenderComplete() {
		//init videos
	
		$('video').each(function () {
			$(this).mediaelementplayer({
				success: function(mediaElement, originalNode, instance) {
					cl('video element initialized');
				},
				alwaysShowControls:true
			});
		});
	
		//init audio
		$('audio').each(function () {
			$(this).mediaelementplayer({
				success: function(mediaElement, originalNode, instance) {
					cl('audio element initialized');
				},
				alwaysShowControls:true
			});
		 });
		if(quizData.showResetQuiz) {
			$('.btnResetQuiz').show();
			$('.quizButtonsContainer').show();
		}
		$('.questionBoilerplateFeedbackContainer').hide();
	
	}
	
	//how many possible points is the question worth, factoring in number of guesses?
	function getQuestionPointValue(questionGUID) {
		var question = getQuestionDataByQuestionGUID(questionGUID);
		var questionType = question.questionType;
		//if not yet on the DOM it's a new question
		//add one to number of attempt to show value of what it WILL be after answering
		var numberOfAttempts = $("#"+questionGUID).attr('number-of-attempts') != undefined ? parseInt( $("#"+questionGUID).attr('number-of-attempts') ) + 1 : 1;
		var value = getAttemptsScoreByQuestionGUID(questionGUID,questionType,numberOfAttempts);
		return value;
	}
	
	function enableSubmitQuestionGroup(questionGroupGUID) {
		$("#"+questionGroupGUID).find('.btnSubmitQuestionGroup').attr('disabled',false);
	}
	
	function disableSubmitQuestionGroup(questionGroupGUID) {
		$("#"+questionGroupGUID).find('.btnSubmitQuestionGroup').attr('disabled',true);
	}
	
	function enableSubmitQuiz(questionGroupGUID) {
		$('.btnSubmitQuiz').attr('disabled',false);
	}
	
	function disableSubmitQuiz(questionGroupGUID) {
		$('.btnSubmitQuiz').attr('disabled',true);
	}
	
	function enableResetQuiz(questionGroupGUID) {
		$('.btnResetQuiz').attr('disabled',false);
	}
	
	function disableResetQuiz(questionGroupGUID) {
		$('.btnResetQuiz').attr('disabled',true);
	}
	
	function highlightUnansweredQuestions() {
		cl('highlightUnansweredQuestions');
		$('.questionContainer').each(
			function(i,question) {
				if(!(isQuestionAnswered(question))) {
					$(question).addClass('questionUnansweredHighlight');
				}
			}
		);
	}
	
	
	//find first child form element
	//TODO: pattern discussion: can the ids live on on a wrapping 'answerContainer', to make id query selection element-agnostic (don't need to query for input, else textarea, etc)
	quizAppCommon.getFirstChildFormElement = function (element) {
		// cl($(element));
		if( $(element).children('input:first').length > 0) {
			return $(element).children('input:first');
		}
		else if( $(element).siblings('textarea:first').length > 0) {
			return $(element).siblings('textarea:first');
		}
		else {
			return $(element);
		}
	}
	
	function isQuestionAnswered(question) {
		var isQuestionAnswered = false;
		questionType = $(question).data('question-type');
		$(question).find('.answersContainer').each(
			function(j,answersContainer) {
				//for each answer
				var questionHasAnswer = false;
				$(answersContainer).find('.answer').each(
					function(k,answer) {
						//var answerGUID = $(answer).children('input:first').attr('id');
						//var answerGUID = $(answer).children('input:first').length > 0 ? $(answer).children('input:first').attr('id') : $(answer).children('textarea:first').attr('id');
						var answerGUID = quizAppCommon.getFirstChildFormElement($(answer)).attr('id');
	
						//textfield
						if( getQuestionTypeByAnswerGUID(answerGUID) === QUESTION_TYPE_FILL_IN_THE_BLANK ||
							getQuestionTypeByAnswerGUID(answerGUID) === QUESTION_TYPE_EXPERT_RESPONSE) {
							if( quizAppCommon.isAnswerAnswered(answerGUID) ) {
								isQuestionAnswered = true;
							}
						}
						//checkbox/radio button
						else if (getQuestionTypeByAnswerGUID(answerGUID) === QUESTION_TYPE_MULTIPLE_CHOICE ||
								 getQuestionTypeByAnswerGUID(answerGUID) === QUESTION_TYPE_MULTIPLE_SELECT) {
							if (quizAppCommon.isAnswerAnswered(answerGUID) ) {
								isQuestionAnswered = true;
							}
						}
					}
				); //end for each answer
			}
		);
	
		return isQuestionAnswered;
	}
	
	function areAllQuestionsForQuestionGroupAnswered(questionGroupGUID) {
		var allQuestionsHaveAnswer = true;
		$('#'+questionGroupGUID).find('.questionContainer').each(
			function(i,question) {
				if(!(isQuestionAnswered(question))) {
					allQuestionsHaveAnswer = false;
					return false;
				}
			}
		);
		return allQuestionsHaveAnswer;
	
	
	//			questionType = $(question).data('question-type');
	//			$(question).find('.answersContainer').each(
	//				function(j,answersContainer) {
	//					//for each answer
	//					var questionHasAnswer = false;
	//					$(answersContainer).find('.answer').each(
	//						function(k,answer) {
	//							//var answerGUID = $(answer).children('input:first').attr('id');
	//							//var answerGUID = $(answer).children('input:first').length > 0 ? $(answer).children('input:first').attr('id') : $(answer).children('textarea:first').attr('id');
	//							var answerGUID = quizAppCommon.getFirstChildFormElement($(answer)).attr('id');
	//
	//							//textfield
	//							if( getQuestionTypeByAnswerGUID(answerGUID) === QUESTION_TYPE_FILL_IN_THE_BLANK ||
	//								getQuestionTypeByAnswerGUID(answerGUID) === QUESTION_TYPE_EXPERT_RESPONSE) {
	//								if( quizAppCommon.isAnswerAnswered(answerGUID) ) {
	//									questionHasAnswer = true;
	//								}
	//							}
	//							//checkbox/radio button
	//							else if (getQuestionTypeByAnswerGUID(answerGUID) === QUESTION_TYPE_MULTIPLE_CHOICE ||
	//							         getQuestionTypeByAnswerGUID(answerGUID) === QUESTION_TYPE_MULTIPLE_SELECT) {
	//								if (quizAppCommon.isAnswerAnswered(answerGUID) ) {
	//									questionHasAnswer = true;
	//								}
	//							}
	//						}
	//					); //end for each answer
	//					if(!questionHasAnswer) {
	//						allQuestionsHaveAnswer = false;
	//						return false;
	//					}
	//				}
	//			);
	
	
	}
	
	quizAppCommon.areAllQuestionsForQuizAnswered = function areAllQuestionsForQuizAnswered() {
		//check for all question groups complete
		var allQuestionGroupsHaveAllAnswers = true;
		$.each(quizData.questionGroups, function(i,questionGroup)  {
			if(!(areAllQuestionsForQuestionGroupAnswered(questionGroup.questionGroupGUID))) {
				allQuestionGroupsHaveAllAnswers = false;
				return false;
			}
		});
		return allQuestionGroupsHaveAllAnswers;
	}
	
	function resetQuestionGroup(questionGroupGUID) {
		cl('resetQuestionGroup');
		if(quizData.usePagination && quizData.isFlashcards) {
			//var paginationOption = getPaginationOptionByQuestionGroupGUID(questionGroupGUID);
			//$(paginationOption).removeClass('pagination-correct').removeClass('pagination-incorrect');
		}
	
		$('#'+questionGroupGUID).removeClass('complete');
	
		$('#'+questionGroupGUID).find('.answersContainer').each(
			function(i) {
				//for each answer
				$(this).find('.answer').each(
					function(j,answer) {
						$(answer).parents('.answerContainer').removeClass('answer-incorrect').removeClass('answer-correct');
						$(answer).parents('.answerContainer').find('.screen-reader-only').remove();
						var answerGUID = quizAppCommon.getFirstChildFormElement($(answer)).attr('id');
						var questionType = getQuestionTypeByAnswerGUID(answerGUID);
						//textfield
						if( questionType === QUESTION_TYPE_FILL_IN_THE_BLANK ) {
							 $(answer).children('input:first').val('');
						}
						else if( questionType === QUESTION_TYPE_EXPERT_RESPONSE ) {
							$(answer).siblings('textarea:first').val('');
						}
						//radio button/checkboxes
						else if (questionType === QUESTION_TYPE_MULTIPLE_CHOICE ||
								 questionType === QUESTION_TYPE_MULTIPLE_SELECT) {
							if( $(answer).children('input:first').is(":checked")) {
								 $(answer).children('input:first').prop('checked',false);
							}
						}
						//$(answer).removeClass('disabled');
						//hide feedback
						$(answer).siblings('.answerFeedback').hide();
						//remove from data
						if(questionType === QUESTION_TYPE_MULTIPLE_CHOICE) {
							removeMultipleChoiceQuestionDataFromSavedData(answerGUID);
						}
						else if(questionType === QUESTION_TYPE_MULTIPLE_SELECT) {
							removeMultipleSelectQuestionDataFromSavedData(answerGUID);
						}
						else if(questionType === QUESTION_TYPE_FILL_IN_THE_BLANK) {
							removeFillInTheBlankQuestionDataFromSavedData(answerGUID);
						}
						else if(questionType === QUESTION_TYPE_EXPERT_RESPONSE) {
							removeExpertResponseQuestionDataFromSavedData(answerGUID);
						}
					} //end for each answer
				);
	
			}
		); //end for each question
		setQuestionGroupNotComplete(questionGroupGUID);
		enableQuestionGroup(questionGroupGUID);
		$('#'+questionGroupGUID).find('.btnSubmitQuestionGroup').attr('disabled',true);
		//hide resources
		hideResourcesForQuestionGroup(questionGroupGUID);
		//hide score
		$('#'+questionGroupGUID).find('.questionGroupScoreContainerParent').hide();
	
		$('#'+questionGroupGUID).find('.questionContainer').removeClass('question-incorrect').removeClass('question-correct');
	
	
		$('#'+questionGroupGUID).find('.questionContainer').find('.questionFeedback').find('.questionFeedbackHeader').html('');
		$('#'+questionGroupGUID).find('.questionContainer').find('.questionFeedback').find('.questionFeedbackText').html('');
		$('#'+questionGroupGUID).find('.questionContainer').find('.questionFeedback').hide();
	
		$('#'+questionGroupGUID).find('.questionGroupCompetency').hide();
	
		$('#'+questionGroupGUID).find('.questionContainer').find('.questionBoilerplateFeedbackContainer').hide();
	
		//$('#'+questionGroupGUID).find('.questionContainer').find('.fa-square').hide();
	
	
		//reset attempts score
		if(quizData.isFlashcards) {
	
			$('#'+questionGroupGUID).find('.questionContainer').each( function(i,questionContainer) {
				if(quizData.useAttemptsScore) {
					//$(questionContainer).find('.questionNumberOfAttempts').text(0)
					//$(questionContainer).attr('number-of-attempts',0);
					$(questionContainer).find('.questionPointValue').text( getQuestionPointValue( $(questionContainer).attr('id') ) );
				}
			});
		}
		
		$('#'+questionGroupGUID).find('.questionGroupFeedback').hide();
		
		
		if(quizData.useBookmarks) {
			$('#'+questionGroupGUID).find('.questionContainer').find('.bookmark').removeClass('selected');	
		}
	
		updateProgress();
		//currentQuestionGroupGUID = null;
		//serialize();
	
		$('.quizScoreContainerParent').hide();
		$('.quizFeedbackContainerParent').hide();
	}
	
	//reset all question groups
	function resetQuiz() {
		cl('resetQuiz');
		var isFlashcards = quizData.isFlashcards;
	
		$.each(quizData.questionGroups, function(i,questionGroup)  {
			resetQuestionGroup(questionGroup.questionGroupGUID);
		});
		resetQuizScore();
		disableSubmitQuiz();
		disableResetQuiz();
		if(quizData.useTimer) {
			delete userSaveData.starttime;
			delete userSaveData.lastsavetime;
		}
		//$('.quizButtonsContainer').hide();
		//serialize();
	}
	
	function resetQuizScore() {
		cl('resetQuizScore');
		$('.totalQuizPoints').text('');
		$('.totalPossibleQuizPoints').text('');
		//$('.quizButtonsContainer').hide();
		$('.quizScoreContainerParent').hide();
		$('.quizFeedbackContainerParent').hide();
	}
	
	function buildResources() {
		//for each resource
		 $.each(quizData.resources, function(i,resource)  {
			 var resourcesContainer = $(RESOURCES_CONTAINER_TEMPLATE);
			 var resourceContainer = $(RESOURCE_CONTAINER_TEMPLATE.replace(PLACEHOLDER_RESOURCE_RESOURCE_GUID,resource.resourceGUID) );
			 var resourceText = $(RESOURCE_TEXT_TEMPLATE.replace(PLACEHOLDER_RESOURCE_RESOURCE_TEXT,resource.resourceText) );
			 //other resource elements go here...
	
			 resourceContainer.append(resourceText);
			 resourcesContainer.append(resourceContainer);
		 });
	}
	
	//Likert scale
	function getTotalCategoryPoints(category,returnPoints,returnPercent) {
		var runningTotal = 0;	
		$('.questionContainer').each(
			function(i,question) {
				var questionGUID = $(question).attr('id');
				var questionType = getQuestionTypeByQuestionGUID(questionGUID);
				var questionData = getQuestionDataByQuestionGUID(questionGUID);
				if(category === questionData.category) {
					
					//if multiple choice or fill in the blank, do this at the answer level. If multiple select need to look at all answers at once to determine if correct
					if(questionType === QUESTION_TYPE_MULTIPLE_CHOICE || questionType === QUESTION_TYPE_FILL_IN_THE_BLANK || questionType === QUESTION_TYPE_EXPERT_RESPONSE) {
						$(question).find('.answer').each(
							function(j,answer) {
							//if answer is selected
							var answerGUID = quizAppCommon.getFirstChildFormElement($(answer)).attr('id');
							if( quizAppCommon.isAnswerAnswered(answerGUID) ) {
								runningTotal += getPointsByAnswerGUID(answerGUID);
								//quizAppCommon.checkForQuestionCorrect(questionGUID,answerGUID);
							}
						});
					}
					else if(questionType === QUESTION_TYPE_MULTIPLE_SELECT) {
						runningTotal += getPointsForMultipleSelectQuestion(questionGUID);
						//quizAppCommon.checkForQuestionCorrect(questionGUID);
					}
				}
				
			}
		);
		if(quizData.usePercentScoring || returnPercent) {
			return Math.round((runningTotal/(getTotalPossibleCategoryPoints(category) ))*100 )+'%';	
		}
		else {
			return parseInt(runningTotal);
		}
	}
	
	function getTotalPossibleCategoryPoints(category) {
		var runningTotal = 0;
		//for each question, the answer with the highest point value
		$('.questionContainer').each(
			function(i,question) {
				var questionTotal = 0;
				var questionGUID = $(question).attr('id');
				var questionType = getQuestionTypeByQuestionGUID(questionGUID);
				var questionData = getQuestionDataByQuestionGUID(questionGUID);
				if(category === questionData.category) {
					if (questionType === QUESTION_TYPE_FILL_IN_THE_BLANK) {
						if(quizData.useAttemptsScore) {
							questionTotal = getMaxPossibleAttemptsScoreByQuestionGUID(questionData.questionGUID,questionType);
						}
						else {
							runningTotal += getMaxPossiblePointsForFillInTheBlankByAnswerGUID(questionData.answers[0].answerGUID);
						}
						runningTotal += questionTotal;
					}
					//only one point value for expert response
					else if( questionType === QUESTION_TYPE_EXPERT_RESPONSE) {
						runningTotal += parseInt(questionData.answers[0].points);
					}
					else {
						//for multiple choice, only highest value. For multiple select, pointsCorrect value on question
						if(questionType === QUESTION_TYPE_MULTIPLE_SELECT) {
							if(quizData.useAttemptsScore) {
								questionTotal = getMaxPossibleAttemptsScoreByQuestionGUID(questionData.questionGUID,questionType);
							}
							else {
								questionTotal = parseInt(questionData.pointsCorrect);
							}
						}
						else if(questionType === QUESTION_TYPE_MULTIPLE_CHOICE) {
							if(quizData.useAttemptsScore) {
								questionTotal = getMaxPossibleAttemptsScoreByQuestionGUID(questionData.questionGUID,questionType);
							}
							else {
								$.each(questionData.answers, function(k,answer) {
									if(parseInt(answer.points) > parseInt(questionTotal)) {
										questionTotal = parseInt(answer.points);
									}
								}); //end each answer
							}
						}
						runningTotal += questionTotal;
					}
				}
			}); //end each question
		return parseInt(runningTotal);
	}
	
	function getTotalParentCategoryPoints(parentCategory,returnPoints,returnPercent) {
		var runningTotal = 0;	
		var categoryPossible = 0;
		$('.questionContainer').each(
			function(i,question) {
				var questionGUID = $(question).attr('id');
				var questionType = getQuestionTypeByQuestionGUID(questionGUID);
				var questionData = getQuestionDataByQuestionGUID(questionGUID);
				var questionParentCategory = questionData.parentCategory;
				if(parentCategory.replace(' ','').toLowerCase() === questionParentCategory.replace(' ','').toLowerCase()) {
					//if multiple choice or fill in the blank, do this at the answer level. If multiple select need to look at all answers at once to determine if correct
					if(questionType === QUESTION_TYPE_MULTIPLE_CHOICE || questionType === QUESTION_TYPE_FILL_IN_THE_BLANK || questionType === QUESTION_TYPE_EXPERT_RESPONSE) {
						$(question).find('.answer').each(
							function(j,answer) {
							//if answer is selected
							var answerGUID = quizAppCommon.getFirstChildFormElement($(answer)).attr('id');
							if( quizAppCommon.isAnswerAnswered(answerGUID) ) {
								runningTotal += getPointsByAnswerGUID(answerGUID);
							}
						});
					}
					else if(questionType === QUESTION_TYPE_MULTIPLE_SELECT) {
						runningTotal += getPointsForMultipleSelectQuestion(questionGUID);
					}
				}
			});
			if(quizData.usePercentScoring || returnPercent) {
				return Math.round((runningTotal/(getTotalPossibleParentCategoryPoints(parentCategory) ))*100 )+'%';	
			}
			else {
				return parseInt(runningTotal);		
			}
	}
	
	
	function getTotalPossibleParentCategoryPoints(parentCategory) {
		var runningTotal = 0;
		//for each question, the answer with the highest point value
		$('.questionContainer').each(
			function(i,question) {
				var questionTotal = 0;
				var questionGUID = $(question).attr('id');
				var questionType = getQuestionTypeByQuestionGUID(questionGUID);
				var questionData = getQuestionDataByQuestionGUID(questionGUID);
				var questionParentCategory = questionData.parentCategory;
				if(parentCategory.replace(' ','').toLowerCase() === questionParentCategory.replace(' ','').toLowerCase()) {
					if (questionType === QUESTION_TYPE_FILL_IN_THE_BLANK) {
						if(quizData.useAttemptsScore) {
							questionTotal = getMaxPossibleAttemptsScoreByQuestionGUID(questionData.questionGUID,questionType);
						}
						else {
							runningTotal += getMaxPossiblePointsForFillInTheBlankByAnswerGUID(questionData.answers[0].answerGUID);
						}
						runningTotal += questionTotal;
					}
					//only one point value for expert response
					else if( questionType === QUESTION_TYPE_EXPERT_RESPONSE) {
						runningTotal += parseInt(questionData.answers[0].points);
					}
					else {
						//for multiple choice, only highest value. For multiple select, pointsCorrect value on question
						if(questionType === QUESTION_TYPE_MULTIPLE_SELECT) {
							if(quizData.useAttemptsScore) {
								questionTotal = getMaxPossibleAttemptsScoreByQuestionGUID(questionData.questionGUID,questionType);
							}
							else {
								questionTotal = parseInt(questionData.pointsCorrect);
							}
						}
						else if(questionType === QUESTION_TYPE_MULTIPLE_CHOICE) {
							if(quizData.useAttemptsScore) {
								questionTotal = getMaxPossibleAttemptsScoreByQuestionGUID(questionData.questionGUID,questionType);
							}
							else {
								$.each(questionData.answers, function(k,answer) {
									if(parseInt(answer.points) > parseInt(questionTotal)) {
										questionTotal = parseInt(answer.points);
									}
								}); //end each answer
							}
						}
						runningTotal += questionTotal;
					}
				}
			}); //end each question
		return parseInt(runningTotal);
	}
	
	function getTotalQuestionGroupPoints(questionGroupGUID) {
		//add up point values from all answered questions
		var runningTotal = 0;
		$('#'+questionGroupGUID).find('.questionContainer').each(
			function(i,question) {
				var questionGUID = $(question).attr('id');
				var questionType = getQuestionTypeByQuestionGUID(questionGUID);
	
				//if multiple choice or fill in the blank, do this at the answer level. If multiple select need to look at all answers at once to determine if correct
				if(questionType === QUESTION_TYPE_MULTIPLE_CHOICE || questionType === QUESTION_TYPE_FILL_IN_THE_BLANK || questionType === QUESTION_TYPE_EXPERT_RESPONSE) {
					$(question).find('.answer').each(
						function(j,answer) {
						//if answer is selected
						var answerGUID = quizAppCommon.getFirstChildFormElement($(answer)).attr('id');
						if( quizAppCommon.isAnswerAnswered(answerGUID) ) {
							runningTotal += getPointsByAnswerGUID(answerGUID);
							quizAppCommon.checkForQuestionCorrect(questionGUID,answerGUID);
						}
					});
				}
				else if(questionType === QUESTION_TYPE_MULTIPLE_SELECT) {
					runningTotal += getPointsForMultipleSelectQuestion(questionGUID);
					quizAppCommon.checkForQuestionCorrect(questionGUID);
				}
	
	
			}
		);
		return parseInt(runningTotal);
	}
	
	//1 || > 1
	function getPointsLabelByPoints(points) {
		var returnVal;
		if(points != undefined) {
			if(points === 1) {
				returnVal = "point"
			}
			else {
				returnVal = "points";
			}
		}
		return returnVal;
	}
	
	function getPointsByAnswerGUID(answerGUID) {
		var returnVal;
		var questionType = getQuestionTypeByAnswerGUID(answerGUID);
	
		var question = getQuestionDataByAnswerGUID(answerGUID);
		//fill in the blank
		if (questionType === QUESTION_TYPE_FILL_IN_THE_BLANK) {
			returnVal = getFillInTheBlankPointsByAnswerGUID(answerGUID);
		}
		//expert response
		else if (questionType === QUESTION_TYPE_EXPERT_RESPONSE) {
			returnVal = getExpertResponsePointsByAnswerGUID(answerGUID);
		}
		//multiple choice / select
		else if(questionType === QUESTION_TYPE_MULTIPLE_CHOICE) {
			$.each(question.answers, function(k,answer) {
				var targetAnswerGUID = answer.answerGUID;
				if(targetAnswerGUID === answerGUID) {
					if(quizData.useAttemptsScore) {
						//if using attemptsScore feature, score is based on number of attempts
						//incorrect points are not an array
						//cl(answer.points === 0);
						//incorrect
						if( !($.isArray(answer.points) ) ) {
							returnVal = answer.points;
						}
						//correct
						else {
							var numberOfAttempts = $("#"+question.questionGUID).attr('number-of-attempts');
							var points = getAttemptsScoreByQuestionGUID(question.questionGUID,questionType,numberOfAttempts);
							returnVal = points;
						}
	
						//returnVal = getMaxPossibleAttemptsScoreByQuestionGUID(question.questionGUID,questionType);
					}
					else {
						returnVal = answer.points;
					}
				}
			}); //end for each answer
		} //end if multiple choice / select
	
	
		else {
			console.log('unhandled question of type '+questionType);
		}
		return parseInt(returnVal);
	}
	
	function getPointsForMultipleSelectQuestion(questionGUID) {
		var points;
		var selectedAnswers = [];
		$('#'+questionGUID).find('.answer').each(
			function(i,answer) {
				if( $(answer).children('input:first').prop('checked') ) {
					selectedAnswers.push( quizAppCommon.getFirstChildFormElement($(answer)).attr('id') );
				}
			}
		);
	
		//build an array of correct answers
		var correctAnswers = [];
		var questionData = getQuestionDataByQuestionGUID(questionGUID);
		$.each(questionData.answers, function(k,answer) {
			if(answer.isCorrect) {
				correctAnswers.push(answer.answerGUID);
			}
		});
	
	
		var allCorrect = doArraysMatch(correctAnswers,selectedAnswers);
		if(allCorrect) {
			if(quizData.useAttemptsScore) {
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
			}
			else {
				points = questionData.pointsCorrect;
			}
		}
		else {
			points = questionData.pointsIncorrect != undefined ? questionData.pointsIncorrect : 0;
		}
		return parseInt(points);
	}
	
	function isMultipleSelectAnswerCorrect(questionGUID) {
		var returnVal = false;
		var selectedAnswers = [];
		$('#'+questionGUID).find('.answer').each(
			function(i,answer) {
				if( $(answer).children('input:first').prop('checked') ) {
					selectedAnswers.push( quizAppCommon.getFirstChildFormElement($(answer)).attr('id') );
				}
			}
		);
	
		//build an array of correct answers
		var correctAnswers = [];
		var questionData = getQuestionDataByQuestionGUID(questionGUID);
		$.each(questionData.answers, function(k,answer) {
			if(answer.isCorrect) {
				correctAnswers.push(answer.answerGUID);
			}
		});
	
	
		var allCorrect = doArraysMatch(correctAnswers,selectedAnswers);
		if(allCorrect) {
			returnVal = true;
		}
		else {
			returnVal = false;
		}
	
		return returnVal;
	
	}
	
	//returns array of correct answers
	function getSelectedMultipleSelectAnswers(questionGUID) {
		//build an array of selected answers
		var selectedAnswers = [];
		$('#'+questionGUID).find('.answer').each(
			function(i,answer) {
				if( $(answer).children('input:first').prop('checked') ) {
					selectedAnswers.push( quizAppCommon.getFirstChildFormElement($(answer)).attr('id') );
				}
			}
		);
		return selectedAnswers;
	}
	
	function getSelectedMultipleSelectAnswersLetter(questionGUID) {
		//build an array of selected answers
		var selectedAnswers = [];
		$('#'+questionGUID).find('.answer').each(
			function(i,answer) {
				if( $(answer).children('input:first').prop('checked') ) {
					selectedAnswers.push( getAnswerLetter(quizAppCommon.getFirstChildFormElement($(answer)).attr('id'),i) );
				}
			}
		);
		return selectedAnswers;
	}
	
	function getCorrectMultipleSelectAnswersText(questionGUID) {
		//build an array of correct answers
		var correctAnswers = [];
		var questionData = getQuestionDataByQuestionGUID(questionGUID);
		$.each(questionData.answers, function(k,answer) {
			if(answer.isCorrect) {
				correctAnswers.push(answer.answerText);
			}
		});
		return correctAnswers;
	}
	
	function getCorrectMultipleSelectAnswersData(questionGUID) {
		//build an array of correct answers
		var correctAnswers = [];
		var questionData = getQuestionDataByQuestionGUID(questionGUID);
		$.each(questionData.answers, function(k,answer) {
			if(answer.isCorrect) {
				correctAnswers.push(answer);
			}
		});
		return correctAnswers;
	
	
	}
	
	
	function getTotalPossibleQuestionGroupPoints(questionGroupGUID) {
		var runningTotal = 0;
		//for each question, the answer with the highest point value
		$.each(quizData.questionGroups, function(i,questionGroup)  {
			if(questionGroup.questionGroupGUID === questionGroupGUID) {
				$.each(questionGroup.questions, function(j,question) {
					var questionType = question.questionType;
					var questionTotal = 0;
					if (questionType === QUESTION_TYPE_FILL_IN_THE_BLANK) {
						if(quizData.useAttemptsScore) {
							questionTotal = getMaxPossibleAttemptsScoreByQuestionGUID(question.questionGUID,questionType);
						}
						else {
							runningTotal += getMaxPossiblePointsForFillInTheBlankByAnswerGUID(question.answers[0].answerGUID);
						}
						runningTotal += questionTotal;
					}
					//only one point value for expert response
					else if( questionType === QUESTION_TYPE_EXPERT_RESPONSE) {
						runningTotal += parseInt(question.answers[0].points);
					}
					else {
						//for multiple choice, only highest value. For multiple select, pointsCorrect value on question
						if(questionType === QUESTION_TYPE_MULTIPLE_SELECT) {
							if(quizData.useAttemptsScore) {
								questionTotal = getMaxPossibleAttemptsScoreByQuestionGUID(question.questionGUID,questionType);
							}
							else {
								questionTotal = parseInt(question.pointsCorrect);
							}
						}
						else if(questionType === QUESTION_TYPE_MULTIPLE_CHOICE) {
							if(quizData.useAttemptsScore) {
								questionTotal = getMaxPossibleAttemptsScoreByQuestionGUID(question.questionGUID,questionType);
							}
							else {
								$.each(question.answers, function(k,answer) {
									if(parseInt(answer.points) > parseInt(questionTotal)) {
										questionTotal = parseInt(answer.points);
									}
								}); //end each answer
							}
						}
						runningTotal += questionTotal;
					}
				}); //end each question
			} //end for target question group
		}); //end each question group
		return parseInt(runningTotal);
	}
	
	
	function setQuizScore() {
		cl('setQuizScore');
		if(quizData.categoryScoring) {
			//remove total overall score
			$('.quizScoreContainer').empty();
			
			//build unique category array
			var categoriesArray = [];
			var parentCategoriesArray = [];
			$.each(quizData.questionGroups, function(i,questionGroup)  {
				$.each( questionGroup.questions, function(j,question) {
					if(question.category != undefined && question.category.length > 0) {
						categoriesArray.push(
							{
								"category":question.category,
								"categoryOrder":question.categoryOrder != undefined ? question.categoryOrder : 1,
								"parentCategory":question.parentCategory != undefined ? question.parentCategory : "",
								"parentCategoryOrder":question.parentCategoryOrder != undefined ? question.parentCategoryOrder : 1
							}
						);
					}
					if(question.parentCategory != undefined && question.parentCategory.length > 0) {
						parentCategoriesArray.push(
							{
								"parentCategory":question.parentCategory != undefined ? question.parentCategory : "",
								"parentCategoryOrder":question.parentCategoryOrder != undefined ? question.parentCategoryOrder : 1
							}
						);
					}
				});
			});
			
			//TODO: migrate up to helpers
			var uniqueCategoriesArray = [];
			$.each(categoriesArray, function(index, category) {
				var categories = $.grep(uniqueCategoriesArray, function (e) {
					return category.category === e.category;
				});
				if (categories.length === 0) {
				  uniqueCategoriesArray.push(category);
				}
			});
			uniqueCategoriesArray.sort(function(a,b) {
				return parseInt(a.categoryOrder) - parseInt(b.categoryOrder);
			});
			
			cl(uniqueCategoriesArray);
			var uniqueParentCategoriesArray = [];
			$.each(parentCategoriesArray, function(index, parentCategory) {
				var parentCategories = $.grep(uniqueParentCategoriesArray, function (e) {
					return parentCategory.parentCategory === e.parentCategory;
				});
				if (parentCategories.length === 0) {
				  uniqueParentCategoriesArray.push(parentCategory);
				}
			});
			uniqueParentCategoriesArray.sort(function(a,b) {
				return parseInt(a.parentCategoryOrder) - parseInt(b.parentCategoryOrder);
			});
			//cl(uniqueParentCategoriesArray);
			var categoryScoreHeader = $(
			CATEGORY_SCORE_HEADER
				.replace(PLACEHOLDER_CATEGORY_SCORE_HEADER,quizData.categoryScoreHeader)
				.replace(PLACEHOLDER_CATEGORY_SCORE_EXPLANATION,quizData.categoryScoreExplanation)
			);
			$('.quizScoreContainer').append(categoryScoreHeader);
			
			cl(uniqueParentCategoriesArray);
			//render categories under parent categories
			if(quizData.useParentCategories) {
				$.each(uniqueParentCategoriesArray, function(i,parentCategory) {
					if(quizData.useBarScoring) {
						var questionCount = " ("+getTotalParentCategoryPoints(parentCategory.parentCategory,true) +
									"\xa0out\xa0of\xa0" + getTotalPossibleParentCategoryPoints(parentCategory.parentCategory) + ")";
						
						var categoryScoreBarParentContainer = $(
							CATEGORY_SCORE_BAR_CONTAINER_PARENT_TEMPLATE
							.replace(/SCORE_BAR_CONTAINER_GUID/g,parentCategory.parentCategory.replace(/ /g,''))
							.replace(/PLACEHOLDER_SCORE_BAR_LABEL/g,parentCategory.parentCategory)
							.replace(PLACEHOLDER_SCORE_BAR_QUESTION_COUNT,questionCount)
							.replace(PLACEHOLDER_SCORE_BAR_VALUE,getTotalParentCategoryPoints(parentCategory.parentCategory))
							.replace(PLACEHOLDER_WIDTH,getTotalParentCategoryPoints(parentCategory.parentCategory,false,true))
							);
							$('.quizScoreContainer').append(categoryScoreBarParentContainer);
					}
					else {
					var categoryScoreContainerParent = $(
						 CATEGORY_SCORE_CONTAINER_PARENT_TEMPLATE	
						 .replace(PLACEHOLDER_CATEGORY_PARENT_NAME,parentCategory.parentCategory.replace(/ /g,''))
						 .replace(PLACEHOLDER_CATEGORY_SCORE_PARENT_LABEL,parentCategory.parentCategory)
						 .replace(PLACEHOLDER_CATEGORY_SCORE_PARENT_VALUE,getTotalParentCategoryPoints(parentCategory.parentCategory))
						 );
						$('.quizScoreContainer').append(categoryScoreContainerParent);
					}
				});
				$.each(uniqueCategoriesArray, function(i,category) {
					if(quizData.useBarScoring) {
						$('.categoryScoreBarContainerParent').each(
							function(i,categoryScoreBarContainerParent) {
								if(category.parentCategory.replace(/ /g,'').toLowerCase() === $(categoryScoreBarContainerParent).attr('id').replace('categoryScoreBarParent','').toLowerCase()) {
									var questionCount = " ("+getTotalCategoryPoints(category.category,true) +
									"\xa0out\xa0of\xa0" + getTotalPossibleCategoryPoints(category.category) + ")";
									var categoryScoreBarContainer = $(
										CATEGORY_SCORE_BAR_CONTAINER_TEMPLATE
										.replace(/SCORE_BAR_CONTAINER_GUID/g,category.category.replace(/ /g,''))
										.replace(PLACEHOLDER_SCORE_BAR_LABEL,category.category)
										.replace(PLACEHOLDER_SCORE_BAR_QUESTION_COUNT,questionCount)
										.replace(PLACEHOLDER_SCORE_BAR_VALUE,getTotalCategoryPoints(category.category))
										.replace(PLACEHOLDER_WIDTH,getTotalCategoryPoints(category.category,false,true))
										);
										$(categoryScoreBarContainer).addClass('scoreBarLeftMargin');
									$(categoryScoreBarContainerParent).append(categoryScoreBarContainer);
								}
								
							}
						);
							
					}
					else {
						$('.categoryScoreContainerParent').each(
							function(i,categoryScoreContainerParent) {
								if(category.parentCategory.replace(' ','').toLowerCase() === $(categoryScoreContainerParent).attr('id').replace('categoryScoreParent','').toLowerCase()) {
										var categoryScoreContainer = $(
											 CATEGORY_SCORE_CONTAINER_TEMPLATE	
											 .replace(PLACEHOLDER_CATEGORY_NAME,category.category.replace(/ /g,''))
											 .replace(PLACEHOLDER_CATEGORY_SCORE_LABEL,category.category)
											 .replace(PLACEHOLDER_CATEGORY_SCORE_VALUE,getTotalCategoryPoints(category.category))
											 );
										$(categoryScoreContainerParent).append(categoryScoreContainer);
								}
									
							}
						);
					}
				});
				
			}
			
			//else just render the categories individually
			else {
				$.each(uniqueCategoriesArray, function(i,category) {
					if(quizData.useBarScoring) {
						var questionCount = " ("+getTotalCategoryPoints(category.category,true) +
									"\xa0out\xa0of\xa0" + getTotalPossibleCategoryPoints(category.category) + ")";
						
						var categoryScoreBarContainer = $(
							CATEGORY_SCORE_BAR_CONTAINER_TEMPLATE
							.replace(/SCORE_BAR_CONTAINER_GUID/g,category.category.replace(/ /g,''))
							.replace(PLACEHOLDER_SCORE_BAR_LABEL,category.category)
							.replace(PLACEHOLDER_SCORE_BAR_QUESTION_COUNT,questionCount)
							.replace(PLACEHOLDER_SCORE_BAR_VALUE,getTotalCategoryPoints(category.category))
							.replace(PLACEHOLDER_WIDTH,getTotalCategoryPoints(category.category,false,true))
							);
						$('.quizScoreContainer').append(categoryScoreBarContainer);
					}
					else {
						var questionCount = " ("+getTotalCategoryPoints(category.category,true) +
									"\xa0out\xa0of\xa0" + getTotalPossibleCategoryPoints(category.category) + ")";
						
						var categoryScoreContainer = $(
							 CATEGORY_SCORE_CONTAINER_TEMPLATE	
							 .replace(PLACEHOLDER_CATEGORY_NAME,category.category.replace(/ /g,''))
							 .replace(PLACEHOLDER_CATEGORY_SCORE_LABEL,category.category)
							 .replace(PLACEHOLDER_CATEGORY_SCORE_VALUE,questionCount)
							 );
						$('.quizScoreContainer').append(categoryScoreContainer);
					}
				});
			}
			//set score for each category
			/*$('.categoryScoreContainer').each( 
				function(i,categoryScoreContainer) {
					var category = $(categoryScoreContainer).attr('id').replace('categoryScore','');
					cl(category);
					
				}
			);*/
			
			
			/*
			var categoryScoreHeader = $(
				CATEGORY_SCORE_HEADER
				.replace(PLACEHOLDER_CATEGORY_SCORE_EXPLANATION,quizData.categoryScoreExplanation)
				);
			$('.quizScoreContainer').append(categoryScoreHeader);
			//for each questionGroup
			$.each(quizData.questionGroups, function(i,questionGroup)  {
				var categoryScoreContainer = $(
					 CATEGORY_SCORE_CONTAINER_TEMPLATE	
					 .replace(PLACEHOLDER_QUESTION_GROUP_GUID,questionGroup.questionGroupGUID)
					 .replace(PLACEHOLDER_CATEGORY_SCORE_LABEL,questionGroup.questionGroupTitle)
					 .replace(PLACEHOLDER_CATEGORY_SCORE_VALUE,getTotalQuestionGroupPoints(questionGroup.questionGroupGUID))
					 );
				$('.quizScoreContainer').append(categoryScoreContainer);
			});*/
		}
		//show normal total quiz score
		else {
			$('.totalQuizPoints').text(getTotalQuizPoints());
			$('.totalPossibleQuizPoints').text(getTotalPossibleQuizPoints());
		}
		//showScore is global; showQuizScore / showGroupScore more granular
		if(quizData.showQuizScore) {
			$('.quizScoreContainerParent').show();
		}
		if(quizData.showGroupScore) {
				$('.questionGroupScoreContainerParent').show();
		}
		if(!quizData.showScore) {
			$('.quizScoreContainerParent').hide();
			$('.questionGroupScoreContainerParent').hide();
		}
		if(quizData.quizCompleteFeedback != undefined && quizData.quizCompleteFeedback.length > 0) {
			$('.quizFeedbackContainerParent').show();
		}
	}
	
	function getTotalQuizPoints() {
		var returnVal = 0;
		$.each(quizData.questionGroups, function(i,questionGroup)  {
			returnVal += getTotalQuestionGroupPoints(questionGroup.questionGroupGUID);
		});
		return returnVal;
	}
	
	function getTotalPossibleQuizPoints() {
		var returnVal = 0;
		$.each(quizData.questionGroups, function(i,questionGroup)  {
			returnVal += getTotalPossibleQuestionGroupPoints(questionGroup.questionGroupGUID);
		});
		return returnVal;
	}
	
	// multiple-choice / multiple-select: checked. Text entry: length > 0
	quizAppCommon.isAnswerAnswered = function (answerGUID) {
		var questionType = getQuestionTypeByAnswerGUID(answerGUID);
		var answer = $('#'+answerGUID);
		if(questionType === QUESTION_TYPE_MULTIPLE_CHOICE ||
				questionType === QUESTION_TYPE_MULTIPLE_SELECT) {
				if( $(answer).prop('checked') === true) {
					return true;
				}
			} //end for multiple choice / multiple select
	
			else if(questionType === QUESTION_TYPE_FILL_IN_THE_BLANK ||
					questionType === QUESTION_TYPE_EXPERT_RESPONSE) {
	
				if( $(answer).val().length > 0) {
					return true;
				}
			}
		return false;
	}
	
	//HELPERS
	
	quizAppCommon.checkForQuestionCorrect = function (questionGUID,answerGUID) {
		//cl('checkForQuestionCorrect');
		//no answer for multiple select, make param optional
		if( typeof answerGUID === 'undefined') {
			answerGUID = 0;
		}
	
		var isQuestionCorrect;
		var questionType = getQuestionTypeByQuestionGUID(questionGUID);
		var question = getQuestionDataByQuestionGUID(questionGUID);
		//fill in the blank
		if (questionType === QUESTION_TYPE_FILL_IN_THE_BLANK) {
			isQuestionCorrect = isFillInTheBlankAnswerCorrectByAnswerGUID(answerGUID);
			if (isQuestionCorrect) {
				showFillInTheBlankCorrectAnswer(questionGUID, answerGUID);
			}
			else {
				showFillInTheBlankIncorrectAnswer(questionGUID, answerGUID);
			}
			//$('#'+questionGUID).find('.questionFeedback').find('.questionFeedbackHeader').html(QUESTION_FEEDBACK_CORRECT_ANSWER_TEXT);
			//$('#'+questionGUID).find('.questionFeedback').find('.questionFeedbackText').html(getCorrectFillInTheBlankFeedbackText(questionGUID));
	
	
		}
		//expert response is always 'correct', assume no need for correct/incorrect for this one as we aren't evaluating
		else if (questionType === QUESTION_TYPE_EXPERT_RESPONSE) {
			isQuestionCorrect = true;
			$('#'+questionGUID).find('.questionFeedback').find('.questionFeedbackHeader').html(QUESTION_FEEDBACK_CORRECT_ANSWER_TEXT);
	
			var points = getPointsByAnswerGUID(answerGUID);
			var pointsLabel = getPointsLabelByPoints(points);
	
			//feedback, only question-level
			var feedbackText;
			if(getQuestionDataByQuestionGUID(questionGUID).feedback != undefined && getQuestionDataByQuestionGUID(questionGUID).feedback != "") {
				feedbackText = '<span class="questionFeedback">'+getQuestionDataByQuestionGUID(questionGUID).feedback+
				(points != undefined && quizData.showScore ? '<span class="questionPoints"> ' +points+' ' + pointsLabel + '</span>': '')+
				'</span>';
				$('#'+questionGUID).find('.questionFeedback').find('.questionFeedbackText').html(feedbackText);
			}
		}
		//multiple choice / select
		else if(questionType === QUESTION_TYPE_MULTIPLE_CHOICE) {
			isQuestionCorrect = isMultipleChoiceAnswerCorrect(answerGUID);
			if(isQuestionCorrect) {
				$('#'+questionGUID).find('.questionFeedback').find('.questionFeedbackHeader').html(QUESTION_FEEDBACK_CORRECT_ANSWER_TEXT);
				showMultipleChoiceCorrectAnswer(questionGUID, answerGUID);
			}
			else {
				$('#'+questionGUID).find('.questionFeedback').find('.questionFeedbackHeader').html(QUESTION_FEEDBACK_CORRECT_ANSWER_TEXT);
				showMultipleChoiceIncorrectAnswer(questionGUID, answerGUID);
			}
	
		}
		else if(questionType === QUESTION_TYPE_MULTIPLE_SELECT) {
			showMultipleSelectAnswers(questionGUID);
		}
		else {
			cl('unhandled question type of '+questionType);
		}
	
		//$('#'+questionGUID).find('.questionFeedback').find('.questionFeedbackHeader').html(QUESTION_FEEDBACK_CORRECT_ANSWER_TEXT);
		quizAppCommon.showQuestionFeedback(questionGUID);
	
		//attempts score
		if(quizData.useAttemptsScore && quizData.usePagination) {
			var paginationItem = getPaginationElementByQuestionGUID(questionGUID);
	
			if(isQuestionCorrect) {
				$(paginationItem).addClass('correct').removeClass('incorrect');
			}
			else {
				$(paginationItem).addClass('incorrect').removeClass('correct');
				//decrement value
				$("#"+questionGUID).find('.questionPointValue').text( getQuestionPointValue(questionGUID) );
				//TODO: auto-advance to next question?
	
			}
		}
	
	}
	
	function isMultipleChoiceAnswerCorrect(answerGUID) {
		var returnVal = false;
		var question = getQuestionDataByAnswerGUID(answerGUID);
	
		$.each(question.answers, function(k,answer) {
			var targetAnswerGUID = answer.answerGUID;
			if(targetAnswerGUID === answerGUID && answer.isCorrect) {
				returnVal = true;
			}
		}); //end for each answer
		return returnVal;
	}
	
	function getCorrectMultipleChoiceAnswerText(questionGUID) {
		var returnVal = false;
		var question = getQuestionDataByQuestionGUID(questionGUID);
	
		$.each(question.answers, function(k,answer) {
			if(answer.isCorrect) {
				returnVal = answer.answerText;
			}
		}); //end for each answer
		return returnVal;
	}
	
	function getCorrectMultipleChoiceFeedbackText(questionGUID) {
		var returnVal = false;
		var question = getQuestionDataByQuestionGUID(questionGUID);
	
		$.each(question.answers, function(k,answer) {
			if(answer.isCorrect) {
				returnVal = answer.feedback;
			}
		}); //end for each answer
		return returnVal;
	}
	
	function getFillInTheBlankPointsByAnswerGUID(answerGUID) {
		//match current entered answer against acceptible answers
		var points = 0;
		var question = getQuestionDataByAnswerGUID(answerGUID);
		var currentAnswer = $('#'+answerGUID).val();
		points = question.incorrectAnswer[0].points;
		$.each(question.correctAnswers, function(i,correctAnswer)  {
			//correct
			if( quizAppCommon.formatStringForTextEntryCorrectnessCheck(currentAnswer) === quizAppCommon.formatStringForTextEntryCorrectnessCheck(correctAnswer.answerText) ) {
				if(quizData.useAttemptsScore) {
					var numberOfAttempts = $("#"+question.questionGUID).attr('number-of-attempts');
					points = getAttemptsScoreByQuestionGUID(question.questionGUID,QUESTION_TYPE_FILL_IN_THE_BLANK,numberOfAttempts);
				}
	
				else {
					points = correctAnswer.points;
				}
				return false;
			}
		}); //end for each correct answer
		return parseInt(points);
	}
	
	//TODO: combine with above?
	function isFillInTheBlankAnswerCorrectByAnswerGUID(answerGUID) {
		var returnVal = false;
		var questionData = getQuestionDataByAnswerGUID(answerGUID);
		//answerGUID may not be the 'root' placeholder answer, which ends in _0. Interrogate DOM to get to that.
		//var currentQuestionDOM = $('#'+questionData.questionGUID);
		var currentAnswer =  $('#'+questionData.questionGUID).find('.answerContainer').find('input:first').val();
		//var currentAnswer = $('#'+answerGUID).val();
		$.each(questionData.correctAnswers, function(i,correctAnswer)  {
				if( quizAppCommon.formatStringForTextEntryCorrectnessCheck(currentAnswer) === quizAppCommon.formatStringForTextEntryCorrectnessCheck(correctAnswer.answerText) ) {
					//correct
					if(correctAnswer.isPrimaryCorrect) {
						returnVal = true;
					}
				}
		}); //end for each correct answer
		return returnVal;
	}
	
	function getCorrectFillInTheBlankAnswerByQuestionGUID(questionGUID) {
		var returnVal = false;
		var questionData = getQuestionDataByQuestionGUID(questionGUID);
		$.each(questionData.correctAnswers, function(i,correctAnswer)  {
				//correct
				if(correctAnswer.isPrimaryCorrect) {
					returnVal = correctAnswer;
				}
		}); //end for each correct answer
		return returnVal;
	}
	
	function getCorrectFillInTheBlankAnswerText(questionGUID) {
		var returnVal = false;
		var questionData = getQuestionDataByQuestionGUID(questionGUID);
		$.each(questionData.correctAnswers, function(i,correctAnswer)  {
				//correct
				if(correctAnswer.isPrimaryCorrect) {
					returnVal = correctAnswer.answerText;
				}
		}); //end for each correct answer
		return returnVal;
	}
	
	function getCorrectFillInTheBlankFeedbackText(questionGUID) {
		var returnVal = false;
		var questionData = getQuestionDataByQuestionGUID(questionGUID);
		$.each(questionData.correctAnswers, function(i,correctAnswer)  {
				//correct
				if(correctAnswer.isPrimaryCorrect) {
					returnVal = correctAnswer.feedback;
				}
		}); //end for each correct answer
		return returnVal;
	}
	
	function getExpertResponsePointsByAnswerGUID(answerGUID) {
		//match current entered answer against acceptible answers
		var points = 0;
		var answer = getAnswerDataByAnswerGUID(answerGUID);
		points = answer.points;
		//var questionData = getQuestionDataByAnswerGUID(answerGUID);
		/*var currentAnswer = $('#'+answerGUID).val();
		points = questionData.incorrectAnswer[0].points;
		$.each(questionData.correctAnswers, function(i,correctAnswer)  {
			if( quizAppCommon.formatStringForTextEntryCorrectnessCheck(currentAnswer) === quizAppCommon.formatStringForTextEntryCorrectnessCheck(correctAnswer.answerText) ) {
				//correct
				points = correctAnswer.points;
				return false;
			}
		}); //end for each correct answer*/
		return points;
	}
	
	quizAppCommon.formatStringForTextEntryCorrectnessCheck = function formatStringForTextEntryCorrectnessCheck(str) {
		var returnVal;
		//remove spaces, hypens, capitalization
		returnVal = str.replace(/\s/g, '').replace(/-/g, '').toLowerCase();
		return returnVal;
	}
	
	
	
	//SERIALIZE HELPERS
	
	function doesMultipleChoiceQuestionExistInSavedData(guid) {
		var returnVal = false;
		$.each(userSaveData.multiplechoicequestions, function(i,multipleChoiceQuestion) {
			if(multipleChoiceQuestion.answerguid === guid) {
				returnVal = true;
				return false;
			}
		});
		return returnVal;
	}
	
	function removeMultipleChoiceQuestionDataFromSavedData(guid) {
		var indexToRemove;
		$.each(userSaveData.multiplechoicequestions, function(i,multipleChoiceQuestion) {
			//first digit of answerID == questionID
			if(multipleChoiceQuestion.answerguid === guid) {
				indexToRemove = i;
				return false;
			}
		});
		userSaveData.multiplechoicequestions.splice(indexToRemove,1);
	}
	
	
	function doesMultipleSelectQuestionExistInSavedData(guid) {
		var returnVal = false;
		$.each(userSaveData.multipleselectquestions, function(i,multipleSelectQuestion) {
			if(multipleSelectQuestion.answerguid === guid) {
				returnVal = true;
				return false;
			}
		});
		return returnVal;
	}
	
	function removeMultipleSelectQuestionDataFromSavedData(guid) {
		var indexToRemove;
		$.each(userSaveData.multipleselectquestions, function(i,multipleSelectQuestion) {
			//first digit of answerID == questionID
			if(multipleSelectQuestion.answerguid === guid) {
				indexToRemove = i;
				return false;
			}
		});
		userSaveData.multipleselectquestions.splice(indexToRemove,1);
	}
	
	function doesFillInTheBlankQuestionExistInSavedData(guid) {
		var returnVal = false;
		$.each(userSaveData.fillintheblankquestions, function(i,fillInTheBlankQuestion) {
			if(fillInTheBlankQuestion.answerguid === guid) {
				returnVal = true;
				return false;
			}
		});
		return returnVal;
	}
	
	function removeFillInTheBlankQuestionDataFromSavedData(guid) {
		var indexToRemove;
		$.each(userSaveData.fillintheblankquestions, function(i,fillInTheBlankQuestion) {
			//first digit of answerID == questionID
			if(fillInTheBlankQuestion.answerguid === guid) {
				indexToRemove = i;
				return false;
			}
		});
		userSaveData.fillintheblankquestions.splice(indexToRemove,1);
	}
	
	function doesExpertResponseQuestionExistInSavedData(guid) {
		var returnVal = false;
		$.each(userSaveData.expertresponsequestions, function(i,expertResponseQuestion) {
			if(expertResponseQuestion.answerguid === guid) {
				returnVal = true;
				return false;
			}
		});
		return returnVal;
	}
	
	function removeExpertResponseQuestionDataFromSavedData(guid) {
		var indexToRemove;
		$.each(userSaveData.expertresponsequestions, function(i,expertResponseQuestion) {
			//first digit of answerID == questionID
			if(expertResponseQuestion.answerguid === guid) {
				indexToRemove = i;
				return false;
			}
		});
		userSaveData.expertresponsequestions.splice(indexToRemove,1);
	}
	
	
	function hideResourcesForQuestionGroup(questionGroupGUID) {
		//hide all resources for the answer group (called on reset)
		$('#'+questionGroupGUID).find('.answersContainer').each(
			function(i, answersContainer) {
				//for each answer
				$(this).find('.answer').each(
					function(j,answer) {
						var targetAnswerGUID = 	$(this).children().first().attr('id');
						//find and show any matching resources
						//for each resource
						$('.resourceContainer').each(
							function(k, resource) {
								var resourceGUID = $(this).attr('id');
								//get relatedQuestionGUID from data
								var relatedAnswerGUID = getRelatedAnswerGUIDByResourceGUID(resourceGUID);
								if(targetAnswerGUID === relatedAnswerGUID) {
									$(this).hide().addClass('hidden');
								}
							}
						);
					//end for each answer
					}
				);
			//end for each question
			}
		);
	}
	
	quizAppCommon.checkForQuizComplete = function checkForQuizComplete() {
		cl('checkForQuizComplete');
		if(isQuizComplete()) {
			disableSubmitQuiz();
			enableResetQuiz();
			if( $('.btnResetQuiz').is(':visible') || $('.btnSubmitQuiz').is(':visible') ) {
				$('.quizButtonsContainer').show();
			}
			setQuizScore();
			if(quizData.useGradebook && typeof courseroomServices != 'undefined') {
				updateGradebook();
			}
			if(quizData.useBarScoring) { 
				scrollToElement(".quizFeedbackContainerParent");
			}
		}
	}
	
	//TODO: send grade?
	function updateGradebook() {
		cl('updateGradebook');
		var score = 1;
		if( quizData.sendScoreToGradebook ) {
			score = Math.floor( getTotalQuizPoints() / getTotalPossibleQuizPoints() ) * 100;
		}
	
		courseroomServices.callCourseroomService(courseroomServices.SERVICE_UPDATE_COLUMN_GRADE,
													onUpdateColumnGradeComplete,
													{ 'score': score},
													true
												);
	}
	
	function onUpdateColumnGradeComplete(data) {
		//onServiceCallComplete(data);
	}
	
	function isQuizComplete() {
		var isQuizComplete = true;
		$('.questionGroupContainer').each(
			function(i,questionGroup) {
				//if flashcard, one question per group, and we need to make sure that question is correct
				if(quizData.isFlashcards) {
					if( !($(questionGroup).hasClass('complete')) ) {
						isQuizComplete = false;
						return false;
					}
	
					//else complete, but is the question correct?
					else {
						var paginationElement = getPaginationElementByQuestionGroupGUID( $(questionGroup).attr('id'));
						if( !($(paginationElement).hasClass('correct') ) ) {
							isQuizComplete = false;
							return false;
						}
					}
				}
	
				else {
					if( !($(questionGroup).hasClass('complete')) ) {
						isQuizComplete = false;
						return false;
					}
				}
			}
		);
	
		//if using passPercentage, we need to be above that to mark the quiz as complete
		if(isQuizComplete && quizData.usePassPercentage) {
			if(!quizData.passPercentage) {
				cl('passPercentage not defined in data');
				isQuizComplete = false;
			}
			else {
				var scorePercentage = getScorePercentage();
				//If complete but below pass percentage, then what?
				if(scorePercentage < quizData.passPercentage) {
					isQuizComplete = false;
					alert('Quiz complete, but below pass percentage');
				}
			}
		}
	
		cl('isQuizComplete: '+isQuizComplete);
		return isQuizComplete;
	}
	
	function getScorePercentage() {
		return Math.floor( getTotalQuizPoints() / getTotalPossibleQuizPoints() ) * 100;
	}
	
	function checkForAllQuestionGroupsComplete() {
		$('.questionGroupContainer').each(
			function(i,questionGroupContainer) {
				var questionGroupGUID = $(questionGroupContainer).attr('id');
				//checkForQuestionGroupComplete(questionGroupGUID);
			}
		);
	
	}
	
	//check for QG complete, set UI
	//'allAnswered' is not the same as 'complete'. Complete is done AND submitted, locked-down.
	
	//ALL ANSWERED (not submitted)
	
	function checkForAllQuestionGroupsAllAnswered() {
		$.each(quizData.questionGroups, function(i,questionGroup)  {
			//first make sure the question group isn't already completed, if so don't call
			if(!($('#'+questionGroup.questionGroupGUID).hasClass('complete'))) {
				checkForQuestionGroupAllAnswered(questionGroup.questionGroupGUID);
			}
		});
	}
	
	function checkForQuestionGroupAllAnswered(questionGroupGUID) {
		if(areAllQuestionsForQuestionGroupAnswered(questionGroupGUID) ) {
			onAllQuestionsForQuestionGroupAnswered(questionGroupGUID);
		}
		else {
			onAllQuestionsForQuestionGroupNotAnswered(questionGroupGUID);
		}
	}
	
	function checkForQuizAllAnswered() {
		
		if(quizAppCommon.areAllQuestionsForQuizAnswered()) {
			onAllQuestionsForQuizAnswered();
		}
		else {
			onAllQuestionsForQuizNotAnswered();
		}
		quizApp.checkForQuizAllAnswered();
	}
	
	function onAllQuestionsForQuestionGroupAnswered(questionGroupGUID) {
		enableSubmitQuestionGroup(questionGroupGUID);
	}
	
	function onAllQuestionsForQuestionGroupNotAnswered(questionGroupGUID) {
		disableSubmitQuestionGroup(questionGroupGUID);
	}
	
	function onAllQuestionsForQuizAnswered() {
		enableSubmitQuiz();
	}
	
	function onAllQuestionsForQuizNotAnswered() {
		disableSubmitQuiz();
		//$('.quizButtonsContainer').hide();
		$(".quizScoreContainerParent").hide();
		$(".quizFeedbackContainerParent").hide();
	}
	
	
	//COMPLETE (submitted)
	
	function checkForAllQuestionGroupsComplete() {
		$('.questionGroupContainer').each(
			function(i,questionGroupContainer) {
				var questionGroupGUID = $(questionGroupContainer).attr('id');
				checkForQuestionGroupComplete(questionGroupGUID);
			}
		);
	
	}
	
	function checkForQuestionGroupComplete(questionGroupGUID) {
		if(areAllQuestionsForQuestionGroupAnswered(questionGroupGUID) ) {
			onQuestionGroupComplete(questionGroupGUID);
		}
		else {
			onQuestionGroupNotComplete(questionGroupGUID);
		}
	}
	
	function incrementAttemptCountByQuestionGroupGUID(questionGroupGUID) {
			$('#'+questionGroupGUID).find('.questionContainer').each(
				function(i,question) {
					var questionGUID = $(question).attr('id');
					var newNumberOfAttempts = parseInt( $("#"+questionGUID).attr('number-of-attempts') ) + 1;
					$("#"+questionGUID).find('.questionNumberOfAttempts').text(newNumberOfAttempts)
					$("#"+questionGUID).attr('number-of-attempts',newNumberOfAttempts);
				}
			);
	}
	
	function onQuestionGroupComplete(questionGroupGUID) {
		// console.log('onQuestionGroupComplete ' + questionGroupGUID);
		if(quizData.useAttemptsScore) {
			//increment attempt count
			incrementAttemptCountByQuestionGroupGUID(questionGroupGUID);
		}
		setQuestionGroupComplete(questionGroupGUID);
		disableQuestionGroup(questionGroupGUID);
		showQuestionGroupResources(questionGroupGUID);
		quizAppCommon.showQuestionGroupFeedback(questionGroupGUID);
		hideQuestionGroupCompetency(questionGroupGUID);
		//showQuestionGroupCompetency(questionGroupGUID);
		setQuestionGroupScore(questionGroupGUID);
	}
	
	function onQuestionGroupNotComplete(questionGroupGUID) {
		setQuestionGroupNotComplete(questionGroupGUID);
		enableQuestionGroup(questionGroupGUID);
		hideQuestionGroupResources(questionGroupGUID);
		hideQuestionGroupFeedback(questionGroupGUID);
		hideQuestionGroupCompetency(questionGroupGUID);
		resetQuestionGroupScore(questionGroupGUID);
	}
	
	function setQuestionGroupComplete(questionGroupGUID) {
		$('#'+questionGroupGUID).addClass('complete');
	}
	
	function setQuestionGroupNotComplete(questionGroupGUID) {
		$('#'+questionGroupGUID).removeClass('complete');
	}
	
	function disableQuestionGroup(questionGroupGUID) {
		$('#'+questionGroupGUID).find('.btnResetQuestionGroup').attr('disabled',false);
	
		//disable all answers in question group
		$('#'+questionGroupGUID).find('.answersContainer').each(
			function(i) {
				//for each answer
				$(this).find('.answer').each(
					function(j,answer) {
						var answerGUID = quizAppCommon.getFirstChildFormElement($(answer)).attr('id');
						var questionType = getQuestionTypeByAnswerGUID(answerGUID);
						//textfield
						if( questionType === QUESTION_TYPE_FILL_IN_THE_BLANK ||
							questionType === QUESTION_TYPE_EXPERT_RESPONSE) {
							 quizAppCommon.getFirstChildFormElement($(answer)).attr('disabled',true).addClass('disabled');
						}
	
						//radio button/checkbox
						else if (questionType === QUESTION_TYPE_MULTIPLE_CHOICE ||
								 questionType === QUESTION_TYPE_MULTIPLE_SELECT) {
							$(answer).addClass('disabled');
						}
					}
				);
			//end for each question
			}
		);
	
		//disableSubmitQuestionGroup(questionGroupGUID);
	}
	
	function enableQuestionGroup(questionGroupGUID) {
		$('#'+questionGroupGUID).find('.btnResetQuestionGroup').attr('disabled','disabled');
	
		//enable all answers in question group
		$('#'+questionGroupGUID).find('.answersContainer').each(
			function(i) {
				//for each answer
				$(this).find('.answer').each(
					function(j,answer) {
						var answerGUID = quizAppCommon.getFirstChildFormElement($(answer)).attr('id');
						var questionType = getQuestionTypeByAnswerGUID(answerGUID);
						//textfield
						if( questionType === QUESTION_TYPE_FILL_IN_THE_BLANK  ||
							questionType === QUESTION_TYPE_EXPERT_RESPONSE) {
							 quizAppCommon.getFirstChildFormElement($(answer)).attr('disabled',false).removeClass('disabled');
						}
	
						//radio button/checkbox
						else if (questionType === QUESTION_TYPE_MULTIPLE_CHOICE ||
								 questionType === QUESTION_TYPE_MULTIPLE_SELECT) {
							$(answer).removeClass('disabled');
						}
					}
				);
			//end for each question
			}
		);
		//enableSubmitQuestionGroup(questionGroupGUID);
	}
	
	
	function showQuestionGroupResources(questionGroupGUID) {
		//show individual resources by answer
		$('#'+questionGroupGUID).find('.answersContainer').each(
			function(i, answersContainer) {
				//for each answer
				$(this).find('.answer').each(
					function(j,answer) {
						var targetAnswerGUID = 	quizAppCommon.getFirstChildFormElement($(answer)).attr('id');
						if( quizAppCommon.isAnswerAnswered(targetAnswerGUID) ) {
							//find and show any matching resources
							//for each resource
							$('.resourceContainer').each(
								function(k, resource) {
									var resourceGUID = $(this).attr('id');
									//get relatedQuestionGUID from data
									var relatedAnswerGUID = getRelatedAnswerGUIDByResourceGUID(resourceGUID);
									if(targetAnswerGUID === relatedAnswerGUID) {
										$(this).show().removeClass('hidden');
									}
								}
							);
						}
					}
				); //end for each answer
	
			}
		); //end for each question
		$('.resourcesContainerParent').show();
	}
	
	function hideQuestionGroupResources(questionGroupGUID) {
		//show individual resources by answer
		$('#'+questionGroupGUID).find('.answersContainer').each(
			function(i, answersContainer) {
				//for each answer
				$(this).find('.answer').each(
					function(j,answer) {
						var targetAnswerGUID = 	quizAppCommon.getFirstChildFormElement($(answer)).attr('id');
						if( quizAppCommon.isAnswerAnswered(targetAnswerGUID) ) {
							//find and show any matching resources
							//for each resource
							$('.resourceContainer').each(
								function(k, resource) {
									var resourceGUID = $(this).attr('id');
									//get relatedQuestionGUID from data
									var relatedAnswerGUID = getRelatedAnswerGUIDByResourceGUID(resourceGUID);
									if(targetAnswerGUID === relatedAnswerGUID) {
										$(this).show().addClass('hidden');
									}
								}
							);
						}
					}
				); //end for each answer
	
			}
		); //end for each question
		$('.resourcesContainerParent').show();
	}
	
	quizAppCommon.showQuestionFeedback = function (questionGUID) {
		//$('#'+questionGUID).find('.questionFeedback').find('.questionFeedbackHeader').html(QUESTION_FEEDBACK_CORRECT_ANSWER_TEXT);
		if(!quizData.hideFeedback) {
			$('#'+questionGUID).find('.questionFeedback, .questionIndicator').show();
		}
	}
	
	quizAppCommon.showQuestionGroupFeedback = function showQuestionGroupFeedback(questionGroupGUID) {
		
		var questionGroupData = getQuestionGroupDataByQuestionGroupGUID(questionGroupGUID);
		if(questionGroupData.questionGroupFeedback != undefined && questionGroupData.questionGroupFeedback.length > 0) {
			var questionGroupFeedback = $(
				QUESTION_GROUP_FEEDBACK_CONTAINER_TEMPLATE
				.replace(QUESTION_GROUP_FEEDBACK_TEXT_PLACEHOLDER,questionGroupData.questionGroupFeedback)
			);	
			
			$('#'+questionGroupGUID).find('.questionContainerButtonGroup').before(questionGroupFeedback);	
		}
		
		
		$('#'+questionGroupGUID).find('.answersContainer').each(
			function(i, answersContainer) {
				//for each answer
				$(this).find('.answer').each(
					function(j,answer) {
						var targetAnswerGUID = 	quizAppCommon.getFirstChildFormElement($(answer)).attr('id');
						var questionType = getQuestionTypeByAnswerGUID(targetAnswerGUID);
						if( quizAppCommon.isAnswerAnswered(targetAnswerGUID) ) {
						//if fill in the blank, set feedback now based on answer
							if(questionType === QUESTION_TYPE_FILL_IN_THE_BLANK) {
								var feedback = getFillInTheBlankFeedbackByAnswerGUID(targetAnswerGUID);
								if(!quizData.hideFeedback) {
									if(!quizData.hideFeedback) {
										$(answer).siblings('.answerFeedback').html(feedback).show();
									}
								}
	
							}
							//else {
								//show feedback
							// $(answer).siblings('.answerFeedback').show();
							//}
						}
					}
				); //end for each answer
			}
		); //end for each question
	
	}
	
	function showMultipleSelectAnswers(questionGUID) {
		isQuestionCorrect = isMultipleSelectAnswerCorrect(questionGUID);
		var correctAnswers = getCorrectMultipleSelectAnswers(questionGUID);
		var selectedAnswers = getSelectedMultipleSelectAnswers(questionGUID);
	
		//for each selected answer, check if it is correct. Put red borders around incorrect, green around correct
		var availableAnswers = [];
		$('#'+questionGUID).find('.answer').each(
			function(z,answer) {
				//if( $(answer).children('input:first').prop('checked') ) {
					availableAnswers.push( quizAppCommon.getFirstChildFormElement($(answer)).attr('id') );
				//}
			}
		);
	
		var incorrectAnswersData = [];
		var correctAnswersData = getCorrectMultipleSelectAnswersData(questionGUID);
	
		$.each(availableAnswers, function(y,availableAnswer) {
			var answerData = getAnswerDataByAnswerGUID(availableAnswer);
			//if available answer is selected
			if( $('#'+availableAnswer).prop('checked') ) {
				//answered correct
				if( $.inArray( availableAnswer, correctAnswers ) !== -1 ) {
					$("#"+availableAnswer).parents('.answerContainer').removeClass('answer-incorrect').addClass('answer-correct').prepend('<span class="screen-reader-only">Correct</span>').find('.answerIndicator').css('visibility','visible');
					//correctAnswers.push(availableAnswer);
				}
				//answer incorrect
				else {
					$("#"+availableAnswer).parents('.answerContainer').removeClass('answer-correct').addClass('answer-incorrect').prepend('<span class="screen-reader-only">Incorrect</span>').find('.answerIndicator').css('visibility','visible');
					incorrectAnswersData.push(getAnswerDataByAnswerGUID(availableAnswer));
				}
			} //end if availableAnswer selected
	
	
			//else availableAnswer is not selected
			else {
				//not selected but correct, show green
				if( $.inArray( availableAnswer, correctAnswers ) !== -1 ) {
					$("#"+availableAnswer).parents('.answerContainer').removeClass('answer-incorrect').addClass('answer-correct').addClass('no-highlight').prepend('<span class="screen-reader-only">Correct</span>').find('.answerIndicator').css('visibility','visible');
					//correctAnswers.push(availableAnswer);
				}
	
			}//end if availableAnswer is not selected
	
		});
	
		var points = getPointsForMultipleSelectQuestion(questionGUID);
		var pointsLabel = getPointsLabelByPoints(points);
	
		if(isQuestionCorrect) {
			$('#'+questionGUID).find('.questionFeedback').find('.questionFeedbackHeader').html(QUESTION_FEEDBACK_CORRECT_ANSWER_TEXT);
			$("#"+questionGUID).removeClass('question-incorrect').addClass('question-correct');
	
			$("#"+questionGUID).find('.questionBoilerplateFeedbackContainer').empty();
			if(correctAnswersData.length > 1) {
				$("#"+questionGUID).find('.questionBoilerplateFeedbackContainer').append( $(QUESTION_MULTIPLE_SELECT_BIOLERPLATE_FEEDBACK_CORRECT_TEMPLATE) );
			}
			else {
				$("#"+questionGUID).find('.questionBoilerplateFeedbackContainer').append( $(QUESTION_MULTIPLE_SELECT_BIOLERPLATE_FEEDBACK_CORRECT_SINGLE_TEMPLATE) );
			}
			if(!quizData.hideFeedback) {
				$("#"+questionGUID).find('.questionBoilerplateFeedbackContainer').show();
			}
			//$("#"+answerGUID).parents('.answerContainer').removeClass('answer-incorrect').addClass('answer-correct');
		}
		else {
			$('#'+questionGUID).find('.questionFeedback').find('.questionFeedbackHeader').html(QUESTION_FEEDBACK_INCORRECT_ANSWER_TEXT);
			$("#"+questionGUID).removeClass('question-correct').addClass('question-incorrect');
	
			var correctAnswersList = "";
			if(correctAnswersData.length > 0) {
				$.each(correctAnswersData, function(i,correctAnswer) {
					if(i === 0) {
						correctAnswersList += getAnswerLetter(correctAnswer.answerGUID);
					}
					else if (i === correctAnswersData.length-1) {
						correctAnswersList += ' and '+getAnswerLetter(correctAnswer.answerGUID);
					}
					else {
						correctAnswersList += ', '+getAnswerLetter(correctAnswer.answerGUID);	
					}
				});
			}
			//IS vs ARE, single vs multiple
			var incorrectBoilerplate = QUESTION_MULTIPLE_SELECT_BIOLERPLATE_FEEDBACK_INCORRECT_MULTIPLE_ANSWERS_MULTIPLE_CORRECT_TEMPLATE;
			//single correct, single incorrect
			if(correctAnswersData.length === 1 && incorrectAnswersData.length === 1) {
				incorrectBoilerplate = QUESTION_MULTIPLE_SELECT_BIOLERPLATE_FEEDBACK_INCORRECT_SINGLE_ANSWER_SINGLE_CORRECT_TEMPLATE;
			}
			//single correct, multiple incorrect
			else if(correctAnswersData.length === 1 && incorrectAnswersData.length > 1) {
				incorrectBoilerplate = QUESTION_MULTIPLE_SELECT_BIOLERPLATE_FEEDBACK_INCORRECT_MULTIPLE_ANSWERS_SINGLE_CORRECT_TEMPLATE;
			}
			//multiple correct, single incorrect
			else if(correctAnswersData.length > 1 && incorrectAnswersData.length === 1) {
				incorrectBoilerplate = QUESTION_MULTIPLE_SELECT_BIOLERPLATE_FEEDBACK_INCORRECT_SINGLE_ANSWER_MULTIPLE_CORRECT_TEMPLATE;
			}
			//multiple correct, multiple incorrect
			else if(correctAnswersData.length > 1 && incorrectAnswersData.length > 1) {
				incorrectBoilerplate = QUESTION_MULTIPLE_SELECT_BIOLERPLATE_FEEDBACK_INCORRECT_MULTIPLE_ANSWERS_MULTIPLE_CORRECT_TEMPLATE;
			}
	
			$("#"+questionGUID).find('.questionBoilerplateFeedbackContainer').empty();
			$("#"+questionGUID).find('.questionBoilerplateFeedbackContainer').append(
				$(incorrectBoilerplate
				.replace(PLACEHOLDER_QUESTION_CORRECT_ANSWER,correctAnswersList)
				)
			);
			if(!quizData.hideFeedback) {
				$("#"+questionGUID).find('.questionBoilerplateFeedbackContainer').show();
			}
			//$("#"+answerGUID).parents('.answerContainer').removeClass('answer-correct').addClass('answer-incorrect');
			//if incorrect, still need to show correct answers
		}
	
			/*if(correctAnswers.length <= 1)  {
				$('#'+questionGUID).find('.questionFeedback').find('.questionFeedbackHeader').html(QUESTION_FEEDBACK_CORRECT_ANSWER_TEXT);
			}
			else {
				$('#'+questionGUID).find('.questionFeedback').find('.questionFeedbackHeader').html(QUESTION_FEEDBACK_CORRECT_ANSWERS_TEXT);
			}
			*/
		var feedbackString = "";
		if(isQuestionCorrect) {
			var feedbackCorrectText;
			if(getQuestionDataByQuestionGUID(questionGUID).feedback != undefined && getQuestionDataByQuestionGUID(questionGUID).feedback != "") {
				feedbackCorrectText = getQuestionDataByQuestionGUID(questionGUID).feedback;	
			}
			else if(getQuestionDataByQuestionGUID(questionGUID).feedbackCorrect != undefined && getQuestionDataByQuestionGUID(questionGUID).feedbackCorrect != "") {
				feedbackCorrectText = getQuestionDataByQuestionGUID(questionGUID).feedbackCorrect;	
			}
			
			if(feedbackCorrectText != undefined && feedbackCorrectText.length > 0) {
				feedbackString += '<span class="questionCorrectFeedback">'+feedbackCorrectText+
				(points != undefined && quizData.showScore ? '<span class="questionPoints"> ' +points+' ' + pointsLabel + '</span>': '')+
				'</span>';
			}
	
		}
		else {
			var feedbackIncorrectText;
			if(getQuestionDataByQuestionGUID(questionGUID).feedback != undefined && getQuestionDataByQuestionGUID(questionGUID).feedback != "") {
				feedbackIncorrectText = getQuestionDataByQuestionGUID(questionGUID).feedback;	
			}
			else if(getQuestionDataByQuestionGUID(questionGUID).feedbackIncorrect != undefined && getQuestionDataByQuestionGUID(questionGUID).feedbackIncorrect != "") {
				feedbackIncorrectText = getQuestionDataByQuestionGUID(questionGUID).feedbackIncorrect;	
			}
			
			if(feedbackIncorrectText != undefined && feedbackIncorrectText.length > 0) {
				feedbackString += '<span class="questionIncorrectFeedback">'+feedbackIncorrectText+
				(points != undefined && quizData.showScore ? '<span class="questionPoints"> ' +points+' ' + pointsLabel + '</span>': '')+
				'</span>';
			}
		}
	
		/*$.each(correctAnswersData, function(i,correctAnswer) {
			feedbackString += '<span class="answerLetter">'+getAnswerLetter(correctAnswer.answerGUID)+') </span><span class="correctText">Correct. </span>'+correctAnswer.feedback+'<br/>';
		});
		$.each(incorrectAnswersData, function(i,incorrectAnswer) {
			feedbackString += '<span class="answerLetter">'+getAnswerLetter(incorrectAnswer.answerGUID)+') </span><span class="incorrectText">Incorrect. </span>'+incorrectAnswer.feedback+'<br/>';
		});
		*/
		$('#'+questionGUID).find('.questionFeedback').find('.questionFeedbackText').html(feedbackString);
	
		//$('#'+questionGUID).find('.questionFeedback').find('.questionFeedbackText').html(correctAnswersText.toString());
		if(!quizData.hideFeedback) {
			$('#'+questionGUID).find('.answerFeedback').show();
		}
	
		//SHOW ANSWER FEEDBACK
		$.each(correctAnswersData, function(i,correctAnswer) {
			//show feedback for all questions
			//$('#'+correctAnswer.answerGUID).parents('.answersContainer').find('.answerFeedback').show();
			//$('#'+correctAnswer.answerGUID).parents('.answerContainer').find('.answerFeedback').show();
		});
	
		/*$.each(incorrectAnswersData, function(i,incorrectAnswer) {
			$('#'+incorrectAnswer.answerGUID).parents('.answerContainer').find('.answerFeedback').show();
		});
		*/
	}
	
	function showMultipleChoiceCorrectAnswer(questionGUID,answerGUID) {
		$("#"+questionGUID).removeClass('question-incorrect').addClass('question-correct');
		$("#"+answerGUID).parents('.answerContainer').removeClass('answer-incorrect').addClass('answer-correct').prepend('<span class="screen-reader-only">Correct</span>').find('.answerIndicator').css('visibility','visible');
		var feedbackText = "";
		var points = getPointsByAnswerGUID(answerGUID);
		var pointsLabel = getPointsLabelByPoints(points);
	
		$("#"+questionGUID).find('.questionBoilerplateFeedbackContainer').empty();
		$("#"+questionGUID).find('.questionBoilerplateFeedbackContainer').append( $(QUESTION_MULTIPLE_CHOICE_BIOLERPLATE_FEEDBACK_CORRECT_TEMPLATE) );
		if(!quizData.hideFeedback) {
			$("#"+questionGUID).find('.questionBoilerplateFeedbackContainer').show();
		}
		//default to just question-level feedback, if present. Otherwise fallback to feedbackCorrect
		var feedbackCorrectText;
		if(getQuestionDataByQuestionGUID(questionGUID).feedback != undefined && getQuestionDataByQuestionGUID(questionGUID).feedback != "") {
			feedbackCorrectText = getQuestionDataByQuestionGUID(questionGUID).feedback;	
		}
		else if(getQuestionDataByQuestionGUID(questionGUID).feedbackCorrect != undefined && getQuestionDataByQuestionGUID(questionGUID).feedbackCorrect != "") {
			feedbackCorrectText = getQuestionDataByQuestionGUID(questionGUID).feedbackCorrect;	
		}
		if(feedbackCorrectText != undefined && feedbackCorrectText.length > 0) {
			var feedbackText = '<span class="questionCorrectFeedback">'+feedbackCorrectText+
			(points != undefined && quizData.showScore ? '<span class="questionPoints"> ' +points+' ' + pointsLabel + '</span>': '')+
			'</span>';
			$('#'+questionGUID).find('.questionFeedback').find('.questionFeedbackText').html(feedbackText);
		}
	
		//if(getAnswerDataByAnswerGUID(answerGUID).feedback != undefined && getAnswerDataByAnswerGUID(answerGUID).feedback != "") {
		//	feedbackText +=	'<span class="answerLetter">'+getAnswerLetter(answerGUID)+') </span><span class="correctText">Correct. </span>'+getAnswerDataByAnswerGUID(answerGUID).feedback+
		//	(points != undefined && points > 0 ? '<span class="questionPoints"> ' +points+' ' + pointsLabel + '</span>': '')
		//}
	
	
		//SHOW ANSWER FEEDBACK
		if(!quizData.hideFeedback) {
			$('#'+questionGUID).find('.answerFeedback').show();
		}
		//$('#'+answerGUID).parents('.answerContainer').find('.answerFeedback').show();
		
		//if flashcard, update pagination
		if(quizData.isFlashcards) {
			updatePaginationStatus(getQuestionGroupDataByQuestionGUID(questionGUID).questionGroupGUID,true);	
		}
	}
	
	function showMultipleChoiceIncorrectAnswer(questionGUID,answerGUID) {
		$("#"+questionGUID).removeClass('question-correct').addClass('question-incorrect');
		$("#"+answerGUID).parents('.answerContainer').removeClass('answer-correct').addClass('answer-incorrect').prepend('<span class="screen-reader-only">Incorrect</span>').find('.answerIndicator').css('visibility','visible');
		//if answer is incorrect, we still highlight the correct one
		var correctAnswerGUID = getCorrectMultipleChoiceAnswer(questionGUID);
		//some interactions do not have a correct answer (Likert scale)
		if(correctAnswerGUID && !quizData.isFlashcards) {
			$("#"+correctAnswerGUID).parents('.answerContainer').removeClass('answer-incorrect').addClass('answer-correct').addClass('no-highlight').prepend('<span class="screen-reader-only">Correct</span>').find('.answerIndicator').css('visibility','visible');
			var correctAnswerPoints = getPointsByAnswerGUID(correctAnswerGUID);
			var correctAnswerPointsLabel = getPointsLabelByPoints(correctAnswerPoints);
			var points = getPointsByAnswerGUID(answerGUID);
			var pointsLabel = getPointsLabelByPoints(points);
		}
		$("#"+questionGUID).find('.questionBoilerplateFeedbackContainer').empty();
		if(!quizData.isFlashcards) {
			$("#"+questionGUID).find('.questionBoilerplateFeedbackContainer').append(
				$(QUESTION_MULTIPLE_CHOICE_BIOLERPLATE_FEEDBACK_INCORRECT_TEMPLATE
				.replace(PLACEHOLDER_QUESTION_CORRECT_ANSWER,getAnswerLetter(correctAnswerGUID))
				)
			);
		}
		if(!quizData.hideFeedback) {
			$("#"+questionGUID).find('.questionBoilerplateFeedbackContainer').show();
		}
		//QUESTION FEEDBACK
		//default to just question-level feedback, if present. Otherwise fallback to feedbackCorrect
		var feedbackIncorrectText;
		if(getQuestionDataByQuestionGUID(questionGUID).feedback != undefined && getQuestionDataByQuestionGUID(questionGUID).feedback != "") {
			feedbackIncorrectText = getQuestionDataByQuestionGUID(questionGUID).feedback;	
		}
		else if(getQuestionDataByQuestionGUID(questionGUID).feedbackIncorrect != undefined && getQuestionDataByQuestionGUID(questionGUID).feedbackIncorrect != "") {
			feedbackIncorrectText = getQuestionDataByQuestionGUID(questionGUID).feedbackIncorrect;	
		}
		if(feedbackIncorrectText != undefined && feedbackIncorrectText.length > 0) {
			var feedbackText = '<span class="questionCorrectFeedback">'+feedbackIncorrectText+
			(points != undefined && quizData.showScore ? '<span class="questionPoints"> ' +points+' ' + pointsLabel + '</span>': '')+
			'</span>';
			$('#'+questionGUID).find('.questionFeedback').find('.questionFeedbackText').html(feedbackText);
		}
		/*if(getAnswerDataByAnswerGUID(answerGUID).feedback != undefined && getAnswerDataByAnswerGUID(answerGUID).feedback != "") {
			feedbackText += '<span class="answerLetter">'+getAnswerLetter(correctAnswerGUID)+') </span><span class="correctText">Correct. </span>'+getCorrectMultipleChoiceFeedbackText(questionGUID)+
			(correctAnswerPoints != undefined && correctAnswerPoints > 0 ? '<span class="questionPoints"> ' +correctAnswerPoints+' ' + correctAnswerPointsLabel + '</span>': '')+
			'<br/><span class="answerLetter">'+getAnswerLetter(answerGUID)+') </span><span class="incorrectText">Incorrect. </span>'+getAnswerDataByAnswerGUID(answerGUID).feedback+
			(points != undefined && points > 0 ? '<span class="questionPoints"> ' +points+' ' + pointsLabel + '</span>': '');
		}*/
		
	
		//SHOW ANSWER FEEDBACK
		if(!quizData.hideFeedback) {
			//if flashcards only show feedback for the incorrect selected option
			if(quizData.isFlashcards) {
				$('#'+questionGUID).find('.answer').each(
					function(i,answer) {
						if($(answer).find('input').attr('id') === answerGUID) {
							$(answer).siblings('.answerFeedback').show();	
						}
					}
				);
			}
			else {
				$('#'+questionGUID).find('.answerFeedback').show();
			}
		}
		//$('#'+answerGUID).parents('.answerContainer').find('.answerFeedback').show();
		//$('#'+correctAnswerGUID).parents('.answerContainer').find('.answerFeedback').show();
		
		//if flashcard, update pagination
		if(quizData.isFlashcards) {
			updatePaginationStatus(getQuestionGroupDataByQuestionGUID(questionGUID).questionGroupGUID,false);	
		}
	}
	
	function updatePaginationStatus(questionGroupGUID,isCorrect) {
		//get associated pagination element by questionGroupGUID/pageID
		/*var paginationOption = getPaginationOptionByQuestionGroupGUID(questionGroupGUID);
		if(isCorrect) {
			$('.select-dropdown-wrapper').removeClass('pagination-incorrect').addClass('pagination-correct');
			$(paginationOption).removeClass('pagination-incorrect').addClass('pagination-correct');	
		}
		else {
			$('.select-dropdown-wrapper').removeClass('pagination-correct').addClass('pagination-incorrect');
			$(paginationOption).removeClass('pagination-correct').addClass('pagination-incorrect');	
		}*/
		
	}
	
	function showFillInTheBlankCorrectAnswer (questionGUID, answerGUID) {
		var feedbackText = "";
		$("#"+questionGUID).removeClass('question-incorrect').addClass('question-correct').parents('.questionGroupContainer').addClass('complete');
		$("#"+answerGUID).parents('.answerContainer').removeClass('answer-incorrect').addClass('answer-correct').prepend('<span class="screen-reader-only">Correct</span>').find('.answerIndicator').css('visibility','visible');
		if(getQuestionDataByQuestionGUID(questionGUID).feedbackCorrect != undefined && getQuestionDataByQuestionGUID(questionGUID).feedbackCorrect != "") {
			feedbackText += '<span class="questionCorrectFeedback">'+getQuestionDataByQuestionGUID(questionGUID).feedbackCorrect+'</span>';
		}
		if(getCorrectFillInTheBlankAnswerByQuestionGUID(questionGUID).feedback != undefined && getCorrectFillInTheBlankAnswerByQuestionGUID(questionGUID).feedback != "") {
			feedbackText += '<span class="correctText">Correct. </span>'+getCorrectFillInTheBlankAnswerByQuestionGUID(questionGUID).feedback;
		}
		$('#'+questionGUID).find('.questionFeedback').find('.questionFeedbackText').html(feedbackText);
		$('#' + answerGUID).addClass('disabled').attr('disabled','disabled');
	}
	
	function showFillInTheBlankIncorrectAnswer (questionGUID, answerGUID) {
		var feedbackText = "";
		$("#"+questionGUID).removeClass('question-correct').addClass('question-incorrect').parents('.questionGroupContainer').removeClass('complete');;
		$("#"+answerGUID).parents('.answerContainer').removeClass('answer-correct').addClass('answer-incorrect').prepend('<span class="screen-reader-only">Incorrect</span>').find('.answerIndicator').css('visibility','visible');
		if(getQuestionDataByQuestionGUID(questionGUID).feedbackIncorrect != undefined && getQuestionDataByQuestionGUID(questionGUID).feedbackIncorrect != "") {
			feedbackText += '<span class="questionIncorrectFeedback">'+getQuestionDataByQuestionGUID(questionGUID).feedbackIncorrect+'</span>';
		}
		if(getIncorrectFillInTheBlankAnswerByQuestionGUID(questionGUID).feedback != undefined && getIncorrectFillInTheBlankAnswerByQuestionGUID(questionGUID).feedback != "") {
			feedbackText += '<span class="correctText">Correct. </span>'+getCorrectFillInTheBlankAnswerByQuestionGUID(questionGUID).feedback+'<br/><span class="incorrectText">Incorrect. </span>'+getIncorrectFillInTheBlankAnswerByQuestionGUID(questionGUID).feedback;
		}
	
		$('#'+questionGUID).find('.questionFeedback').find('.questionFeedbackText').html(feedbackText);
	}
	
	function hideQuestionGroupCompetency(questionGroupGUID) {
		$('#'+questionGroupGUID).find('.questionGroupCompetency').hide();
	}
	
	function showQuestionGroupCompetency(questionGroupGUID) {
		$('#'+questionGroupGUID).find('.questionGroupCompetency').show();
	}
	
	function hideQuestionGroupFeedback(questionGroupGUID) {
		$('#'+questionGroupGUID).find('.answersContainer').each(
			function(i, answersContainer) {
				//for each answer
				$(this).find('.answer').each(
					function(j,answer) {
						var targetAnswerGUID = 	quizAppCommon.getFirstChildFormElement($(answer)).attr('id');
						if( quizAppCommon.isAnswerAnswered(targetAnswerGUID) ) {
							//show feedback
							$(answer).siblings('.answerFeedback').hide();
						}
					}
				);
			}
		); //end for each answer
	
		$('#'+questionGroupGUID).find('.questionContainer').find('.fa-square').css('visibility','hidden');
		//$('#'+questionGroupGUID).find('.questionContainer').find('.fa-square').hide();
		$('#'+questionGroupGUID).find('.questionContainer').find('.questionFeedback').hide();
		$('#'+questionGroupGUID).find('.questionContainer').find('.questionBoilerplateFeedbackContainer').hide();
	
	
	}
	
	function setQuestionGroupScore(questionGroupGUID) {
		//cl('setQuestionGroupScore');
		$('#'+questionGroupGUID).find('.totalQuestionGroupPoints').text(getTotalQuestionGroupPoints(questionGroupGUID));
		$('#'+questionGroupGUID).find('.totalPossibleQuestionGroupPoints').text(getTotalPossibleQuestionGroupPoints(questionGroupGUID));
		if(quizData.showGroupScore) {
			$('#'+questionGroupGUID).find('.questionGroupScoreContainerParent').show();
		}
		else {
			$('#'+questionGroupGUID).find('.questionGroupScoreContainerParent').hide();
		}
	}
	
	function resetQuestionGroupScore(questionGroupGUID) {
		$('#'+questionGroupGUID).find('.totalQuestionGroupPoints').text('');
		$('#'+questionGroupGUID).find('.totalPossibleQuestionGroupPoints').text('');
		$('#'+questionGroupGUID).find('.questionGroupScoreContainerParent').hide();
	}
	
	function getCurrentPage() {
		var returnVal;
		$('.pagination-content-page').each(
			function(i,page) {
				if( $(page).hasClass('pagination-content-page-is-active') ) {
					returnVal = $(page);
					return false;
				}
			}
		);
		
		//if no pages selected, pagination is hidden, default to first
		if(returnVal == undefined) {
			returnVal = $('.pagination-content-page')[0];
		}
		
		/*$('.pagination-nav-item').each(
			function(i,page) {
				if( $(page).hasClass('button-is-active') ) {
					var target = $(page).attr('aria-controls');
					returnVal = $("#"+target);
					return false;
				}
			}
		);*/
		return returnVal;
	}
	
	//changing pages using the progress menu
	
	function switchPageFromProgressMenu(targetPageNumber) {
		//TODO: make 'pagination-content-page' an enum which lives at the pattern level
		//TODO: all of this with an event. App dispatches 'changePage(targetPageNum)', pagination captures and handles
		$('.pagination-content-page').each(
			function(i,page) {
				//remove current active page
				if( $(page).hasClass('pagination-content-page-is-active') ) {
					$(page).removeClass('pagination-content-page-is-active').hide();;
					return false;
				}			
			}
		);
		
		//set new active page
		$('.pagination-content-page').each(
			function(i,page) {
				var currentPageNumber = parseInt($(page).attr('id').replace('pagination-content-page',''));
				if(currentPageNumber === targetPageNumber) {
					$(page).addClass('pagination-content-page-is-active').show();
					return false;
				}
			}
		);
		//manually update select
		$('#selectPage').val('pagination-content-page'+targetPageNumber);
		
		//manually update nav arrows
		if(targetPageNumber === 1) {
			$('.pagination-nav-prev').addClass('pagination-nav-is-disabled');	
		}
		else {
			$('.pagination-nav-prev').removeClass('pagination-nav-is-disabled');	
		}
		
		//TODO: should live in pagination code
		var totalNumberOfPages = getTotalNumberOfPages();
		if(targetPageNumber === totalNumberOfPages) {
			$('.pagination-nav-next').addClass('pagination-nav-is-disabled');	
		}
		else {
			$('.pagination-nav-next').removeClass('pagination-nav-is-disabled');	
		}
	}
	
	function getTotalNumberOfPages() {
		return parseInt($('.questionsContainer').children('.pagination-content-page').last().attr('id').replace('pagination-content-page',''));
	}
	
	
	
	function getCurrentTab() {
		var returnVal;
		$('.container-grid').children('.tab').each(
			function(i,tab) {
				if( $(tab).hasClass('tab-is-selected') ) {
					var target = $(tab).attr('aria-controls');
					returnVal = $('#'+target);
					return false;
				}
			}
		);
		return returnVal;
	}
	
	//EVENTS
	$(document).on('evtShowPage', function() {
		onSwitchPage();
	});	
	
	function onSwitchPage() {
		var currentPage = getCurrentPage();
		if(currentPage != undefined) {
			onChangePageOrTab(currentPage)
		}
		if(quizData.showProgress) {
			updateProgress();	
		}
	}
	
	$(document).on('evtSwitchTabs', function() {
		onSwitchTabs();
	});
	
	function onSwitchTabs() {
		var currentTab = getCurrentTab();
		if(currentTab != undefined) {
			onChangePageOrTab(currentTab)
		}
	}
	
	function onChangePageOrTab(currentPage) {
		//get association data
		var questionGroupGUID = $(currentPage).find('.questionGroupContainer:first').attr('id');
		var questionGroupData = getQuestionGroupDataByQuestionGroupGUID(questionGroupGUID);
		//if content page, hide conclusion text
		if(questionGroupData.isContentPage) {
			$('.quizFeedbackContainerParent').hide();
			$('.quizScoreContainerParent').hide();
			$('.quizFeedbackContainerParent').hide();
		}
		else {
			if(isQuizComplete()) {
				if(quizData.showQuizScore) {
					$('.quizScoreContainerParent').show();
				}
				if(quizData.showGroupScore) {
						$('.questionGroupScoreContainerParent').show();
				}
				if(!quizData.showScore) {
					$('.quizScoreContainerParent').hide();
					$('.questionGroupScoreContainerParent').hide();
				}
				if(quizData.quizCompleteFeedback != undefined && quizData.quizCompleteFeedback.length > 0) {
					$('.quizFeedbackContainerParent').show();
				}	
			}
		}
	}
	
	quizAppCommon.onSubmitQuestionGroupClick = function (e) {
		e.preventDefault();
		if( $(e.currentTarget).hasClass('btn-disabled') ) {
			return false;
		}
		onQuestionGroupComplete( $(e.currentTarget).closest('.questionGroupContainer').attr('id') );
		disableSubmitQuestionGroup( $(e.currentTarget).closest('.questionGroupContainer').attr('id') );
		//progress
		if(quizData.showProgress) {
			updateProgress();	
		}
		quizAppCommon.checkForQuizComplete();
		quizAppCommon.serialize();
		//scrollToElement(".questionsContainer");
		//if using questionGroupFeedback, scroll to that
		var questionGroupData = getQuestionGroupDataByQuestionGroupGUID($(e.currentTarget).closest('.questionGroupContainer').attr('id'));
		if(questionGroupData.questionGroupFeedback != undefined && questionGroupData.questionGroupFeedback.length > 0) {
			scrollToElement( $(e.currentTarget).closest('.questionGroupContainer').find('.questionGroupFeedback:first') );	
		}
		//else scroll to the first question
		else {
			scrollToElement( $(e.currentTarget).closest('.questionGroupContainer').find('.questionContainer:first') );
		}
	}
	
	function updateProgress() {
		var completionPercentage = getCompletionPercentage();
		$('.progressValue').text(completionPercentage);
		updateProgressModal();
	}
	
	function updateProgressModal() {
		//clear modal
		$("#modalProgress").find('.modalProgressDataContainer').empty();
		if(quizData.requireMastery) {
			//cl(userSaveData);
			$.each(quizData.questionGroups, function(i,questionGroup)  {
				$.each(questionGroup.questions, function(j,question) {
					var isQuestionCorrect;
					var questionType = getQuestionTypeByQuestionGUID(question.questionGUID);
					var questionDOM = $('#'+question.questionGUID);
					var selectedAnswers = getSelectedAnswersByQuestionGUID(question.questionGUID);
					//var question = getQuestionDataByQuestionGUID(question.questionGUID);
					//isQuestionAnswered(questionDOM);
					var answerGUID;
					var status = STATUS_INCOMPLETE;
					var isBookmarkSelected = false;
					var bookmark;
					if (questionType === QUESTION_TYPE_FILL_IN_THE_BLANK) {
						if(selectedAnswers == undefined) {
							status = STATUS_INCOMPLETE;	
						}
						else {
							isQuestionCorrect = isFillInTheBlankAnswerCorrectByAnswerGUID(selectedAnswers);
							if(isQuestionCorrect) {
								status = STATUS_CORRECT;	
							}
							else {
								STATUS_INCORRECT;	
							}
						}
					}
					else if (questionType === QUESTION_TYPE_EXPERT_RESPONSE) {
						if(isQuestionAnswered(questionDOM)) {
							status = STATUS_CORRECT;
						}
						else {
							status = STATUS_INCOMPLETE;	
						}
					}
					else if(questionType === QUESTION_TYPE_MULTIPLE_CHOICE) {
						if(selectedAnswers == undefined) {
							status = STATUS_INCOMPLETE;	
						}
						else {
							isQuestionCorrect = isMultipleChoiceAnswerCorrect(selectedAnswers);
							if(isQuestionCorrect) {
								status = STATUS_CORRECT;	
							}
							else {
								status = STATUS_INCORRECT;	
							}
						}
						
					}
					else if(questionType === QUESTION_TYPE_MULTIPLE_SELECT) {
						if(selectedAnswers == undefined) {
							status = STATUS_INCOMPLETE;	
						}
						else {
							isQuestionCorrect = isMultipleSelectAnswerCorrect(questionGUID);	
							if(isQuestionCorrect) {
								status = STATUS_CORRECT;	
							}
							else {
								STATUS_INCORRECT;	
							}
						}
					}
					
					if(isQuestionCorrect) {
							
					}
					var questionNumber = $(questionDOM).find('.questionCount:first').text();
					var currentPageNumber = getCurrentPage().attr('id').replace('pagination-content-page','');
					var pageNumber = getPageNumberByQuestionGUID(question.questionGUID);
					
					var progressIcon;
					if(status === STATUS_CORRECT) {
						progressIcon = MODAL_PROGRESS_STATUS_ICON_CORRECT;	
					}
					else if(status === STATUS_INCORRECT) {
						progressIcon = MODAL_PROGRESS_STATUS_ICON_INCORRECT;	
					}
					else {
						progressIcon = MODAL_PROGRESS_STATUS_ICON_INCOMPLETE;	
					}
					
					var modalProgressQuestionLink = $(
						MODAL_PROGRESS_QUESTION_LINK
						.replace(PLACEHOLDER_QUESTION_NUMBER,pageNumber)
					);
					
					
					var modalProgressDataItemContainer;
					
					//add selected class to current page
					if(currentPageNumber == questionNumber) {
						modalProgressDataItemContainer = $(MODAL_PROGRESS_DATA_ITEM_CONTAINER_ACTIVE);
					}
					else {
						modalProgressDataItemContainer = $(MODAL_PROGRESS_DATA_ITEM_CONTAINER);	
					}
					
					if(quizData.useBookmarks) {
						//check to see if selected
						isBookmarkSelected = $(questionDOM).find('.bookmark').hasClass('selected');
						bookmark = $(
							PROGRESS_BOOKMARK
						);
						if(isBookmarkSelected) {
							$(bookmark).addClass('selected');	
						}
						modalProgressDataItemContainer.append(bookmark);
					
					}
						
					modalProgressDataItemContainer.append(progressIcon);
					modalProgressDataItemContainer.append(modalProgressQuestionLink);
					$("#modalProgress").find('.modalProgressDataContainer').append(modalProgressDataItemContainer);
					
				});
			});
		}
		//addEventListener binding to work with modaal
		//TODO: better
		var linkList = document.querySelectorAll('.modalProgressDataItemContainer');
		$.each(linkList, function(i,link) {
			link.addEventListener('click', function(e) {
				onModalProgressDataItemContainerClick($(e.currentTarget).find('.modalProgressQuestionLink').text());
			});
		});
		
		/*
		var bookmarkLinkList = document.querySelectorAll('.progressBookmark');
		$.each(bookmarkLinkList, function(i,link) {
			link.addEventListener('click', function(e) {
				e.preventDefault();
				onBookmarkClick(e);
			});
		});*/
		
		
		//$('.bookmark').on('click', function(e) {
		//	onBookmarkClick(e);
		//});
	}
	
	function onModalProgressDataItemContainerClick(questionNumber) {
		//Using only for flashcards for now, meaning question number == page number. Won't be the case if used outside of Flashcards; will then
		//need to get page number as a function of question number
		$('.btnShowProgress').modaal('close');
		switchPageFromProgressMenu(parseInt(questionNumber));
	}
	
	function getCompletionPercentage() {
		if(quizData.requireMastery) {
			//cl(userSaveData);
			var totalNumberOfQuestions = getTotalNumberOfQuestions();
			var totalNumberOfCorrectQuestions = 0;
			//how many questions are correct out of how many total?
			$.each(quizData.questionGroups, function(i,questionGroup)  {
				$.each(questionGroup.questions, function(j,question) {
					var isQuestionCorrect;
					var questionType = getQuestionTypeByQuestionGUID(question.questionGUID);
					var questionDOM = $('#'+question.questionGUID);
					var selectedAnswers = getSelectedAnswersByQuestionGUID(question.questionGUID);
					//var question = getQuestionDataByQuestionGUID(question.questionGUID);
					//isQuestionAnswered(questionDOM);
					var answerGUID;
					
					if (questionType === QUESTION_TYPE_FILL_IN_THE_BLANK) {
						isQuestionCorrect = isFillInTheBlankAnswerCorrectByAnswerGUID(selectedAnswers);
					}
					else if (questionType === QUESTION_TYPE_EXPERT_RESPONSE) {
						isQuestionCorrect = true;	
					}
					else if(questionType === QUESTION_TYPE_MULTIPLE_CHOICE) {
						isQuestionCorrect = isMultipleChoiceAnswerCorrect(selectedAnswers);
					}
					else if(questionType === QUESTION_TYPE_MULTIPLE_SELECT) {
						isQuestionCorrect = isMultipleSelectAnswerCorrect(questionGUID);	
					}
					
					if(isQuestionCorrect) {
						totalNumberOfCorrectQuestions++;	
					}
					
				});
			});
			var completionPercentage = Math.floor((totalNumberOfCorrectQuestions/totalNumberOfQuestions) * 100);
			return completionPercentage;
		}
	}
	
	function onBookmarkClick(e) {
		var bookmark = $(e.currentTarget);
		if( $(bookmark).hasClass('selected') ) {
			 $(bookmark).removeClass('selected');
		}
		else {
			$(bookmark).addClass('selected');	
		}
		quizAppCommon.serialize();
		updateProgress();
	}
	
	function onSubmitQuizClick(e) {
		e.preventDefault();
		$.each(quizData.questionGroups, function(i,questionGroup)  {
			//if group is not already complete
			if(!($('#'+questionGroup.questionGroupGUID).hasClass('complete'))) {
				onQuestionGroupComplete(questionGroup.questionGroupGUID);
				disableSubmitQuestionGroup( questionGroup.questionGroupGUID );
			}
		});
		
		//$('.btnResetQuiz').attr('disabled',false);
		disableSubmitQuiz();
		quizAppCommon.checkForQuizComplete();
		quizAppCommon.serialize();
	}
	
	function onHighlightUnansweredQuestionsClick(e) {
		highlightUnansweredQuestions();
	}
	
	
	function onResetQuestionGroupClick(e) {
		currentQuestionGroupGUID = $(e.currentTarget).closest('.questionGroupContainer').attr('id');
	}
	
	function onShowProgressClick(e) {
	
	}
	
	function onResetQuizClick(e) {
		//resetQuiz();
	}
	
	function onConfirmResetQuestionGroupClick(e) {
		resetQuestionGroup(currentQuestionGroupGUID);
		currentQuestionGroupGUID = null;
		quizAppCommon.serialize();
	}
	
	function onConfirmResetQuizClick(e) {
		resetQuiz();
		currentQuestionGroupGUID = null;
		quizAppCommon.serialize();
	}
	
	//shared functionality between multiple choice and multiple select
	function onAnswerClick(e) {
		cl('onAnswerClick');
		//set manually to prevent double event binding
	//	event.preventDefault();
		if($(e.currentTarget).hasClass('disabled')) {
			return false;
		}
	
	//	if( $(e.currentTarget).children('input:first').prop('checked') === false ) {
	//		 $(e.currentTarget).children('input:first').prop('checked',true);
	//	}
	//	else {
	//		 $(e.currentTarget).children('input:first').prop('checked',false);
	//	}
	
		var questionGroupGUID = $(e.currentTarget).closest('.questionGroupContainer').attr('id');
	
		//remove unanswered highlight, if applicable
		if( isQuestionAnswered( $(e.currentTarget).closest('.questionContainer') ) ) {
			$(e.currentTarget).closest('.questionContainer').removeClass('questionUnansweredHighlight');
		}
	
		checkForQuestionGroupAllAnswered(questionGroupGUID);
		checkForQuizAllAnswered();
		
		if(quizData.isPracticeExam) {
			//quizAppCommon.serialize();	
		}
	}
	quizAppCommon.onTextEntryAnswerChange = function onTextEntryAnswerChange(e) {
		if(textSaveTimer) {
			clearTimeout(textSaveTimer);
		}
		textSaveTimer = setTimeout(onTextEntryAnswerChangeCallback.bind(null,e),50);
		var questionGroupGUID = $(e.currentTarget).closest('.questionGroupContainer').attr('id');
	
	}
	
	function onTextEntryAnswerChangeCallback(e) {
		var questionGroupGUID = $(e.currentTarget).closest('.questionGroupContainer').attr('id');
		//remove unanswered highlight, if applicable
		if( isQuestionAnswered( $(e.currentTarget).closest('.questionContainer') ) ) {
			$(e.currentTarget).closest('.questionContainer').removeClass('questionUnansweredHighlight');
		}
		checkForQuestionGroupAllAnswered(questionGroupGUID);
		checkForQuizAllAnswered();
	}
	
	function onMultipleChoiceAnswerClick(e) {
		onAnswerClick(e);
	}
	
	function onMultipleSelectAnswerClick(e) {
		onAnswerClick(e);
	}
	
	function setBindings() {
		cl('set bindings');
		
		//if we need a handle for the transcript link onClick
		/*var transcriptLink = $('.media-footer-container').find('a[href="transcript.asp"]');
		$(transcriptLink).on('click', function(e) {
			e.preventDefault();
			quizAppCommon.serialize();	
		});
		*/
		
		$('.bookmark').on('click', function(e) {
			onBookmarkClick(e);
		});
		
		//transcript links. default behavior: open closest child transcript
		$('.view-transcript').each(function(i,transcriptLink) {
			transcriptLink.addEventListener('click', function(e) {
				e.preventDefault();
				if($(this).hasClass('open')) {
					$(this).siblings('.transcript:first').slideUp(300);
					$(this).removeClass('open');
					$(this).text('Show Transcript').append('<span class="caret"></span>');
					//console.log('already open');
				} else {
					$(this).siblings('.transcript:first').slideDown(300);
					$(this).addClass('open');
					$(this).text('Hide Transcript').append('<span class="caret caret-reversed"></span>');
				}
			});
		});
	
		$('.btnSubmitQuestionGroup').on('click', function(e) {
			quizAppCommon.onSubmitQuestionGroupClick(e);
		});
	
		$('.btnSubmitQuiz').on('click', function(e) {
			onSubmitQuizClick(e);
		});
	
		$('.btnHighlightUnansweredQuestions').on('click', function(e) {
			onHighlightUnansweredQuestionsClick(e);
		});
	
		$('.btnResetQuestionGroup').modaal({
						 after_close: onAfterModalClose,
						 animation:'fade',
						 hide_close: true
					});
	
		$('.btnResetQuestionGroup').on('click', function(e) {
			onResetQuestionGroupClick(e);
		});
		
		$('.btnShowProgress').modaal({
				animation:'fade',
				hide_close: true,
				start_open: false,
				after_close: onAfterShowProgressModalClose,
				custom_class: 'modaal-progress'
					});
	
		$('.btnShowProgress').on('click', function(e) {
			onShowProgressClick(e);
		});
		
		
	
		$('.btnResetQuiz').modaal({
						after_close: onAfterModalClose,
						animation:'fade',
						hide_close: true
					});
	
		$('.btnResetQuiz').on('click', function(e) {
			onResetQuizClick(e);
		});
	
		//addEventListener binding to work with modaal
		document.querySelector('.btnConfirmResetQuestionGroup').addEventListener('click', function(e) {
			onConfirmResetQuestionGroupClick(e);
		});
	
		document.querySelector('.btnConfirmResetQuiz').addEventListener('click', function(e) {
			onConfirmResetQuizClick(e);
		});
		
		/*$(document).on('evtPaginationShowPage', function() {
			onShowPage();	
		});
		*/
		
	
		quizApp.setBindings();
	
	}
	
	//function onShowPage() {
	//	scrollToElement(".questionsContainer");	
	//}
	
	function onFileUpload(files) {
		//only one file, please
		if(files == undefined || files.length === 0) {
			alert('no files selected');
		}
		else if( files.length > 1 ) {
			alert('please only select one file to load');
		}
		else {
			var fileName = files[0].name;
	//			var reader = new FileReader();
	//			reader.onload = function(e) {
	//				cl( $(e).result );
	//			}
	//			reader.readAsDataURL(files[0]);
			loadQuestions(fileName);
	
		}
	}
	
	function onAfterShowProgressModalClose() {
		cl('onAfterShowProgressModalClose');
		//update needs to be called after page switch and modal close, else elements won't be removed
		updateProgress();
		scrollToElement("#mainContent");
	}
	
	
	function onAfterModalClose() {
	}
	}( "str1", "str2" ));
	