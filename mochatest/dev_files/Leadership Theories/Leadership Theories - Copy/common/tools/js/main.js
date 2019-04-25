(function( quizToolCommon, $, undefined ) {
	
	/*
	 call update function in app open in another window. Will need to factor in namespaces
	 if(window != undefined) {
		 if(window.updateFunctionInOtherApp) {
			 window.updateFunctionInOtherApp();
		 }
	 }
	*/
	
	
	window.addEventListener("beforeunload", function (e) {
	   if(isDirty) {
	   	onBeforeUnload(e);
	   }
	});
	
	var currentQuestionGroupGUID;
	var currentQuestionGUID;
	var currentAnswerGUID;
	var exportFilename;
	var textSaveTimer;
	var isDirty = false;
	var confirmValidateData = false;
	
	function onBeforeUnload(e) {
		 var confirmationMessage = 'It looks like you have been editing something. '
	                            + 'Make sure to export your file before leaving the page.';
	
	    (e || window.event).returnValue = confirmationMessage; //Gecko + IE
	    return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.	
	};
	
	
	quizToolCommon.init = function init() {
		quizToolCommon.initVars();
		quizToolCommon.initUI();
		//TODO: import for testing. Restore this with a fixed JSON URL for production.
		//loadData();
		//setCallChainCount();
		//IME.init(onIMEInitComplete);
		if( !Modernizr.adownload ) {
			alert("This application works best with newer versions of Chrome. Support is not guaranteed with other browsers, or older version of Chrome. Please switch to Chrome before continuing. Thanks.");	
		}
	}
	
	quizToolCommon.initVars = function initVars() {
		
	}
	
	quizToolCommon.initUI = function initUI() {
		$("#loader").hide();
		
		$('.accordion-controls').hide();
		$('#accordion1').hide();
		$(".btnSaveQuiz").hide();
		$('#previewQuizButton').hide();
		$(".checkboxGroupUsePagination").hide();
		$(".checkboxGroupIsFlashcards").hide();
		$(".checkboxGroupUseAttemptsScore").hide();
		$(".checkboxGroupUsePassPercentage").hide();
		$(".passPercentageToolsContainer").hide();
		$('.checkboxGroupShowScore').hide();
		$('.checkboxGroupUseGradebook').hide();
		$('.checkboxGroupSendScoreToGradebook').hide();
		$(".quizCompleteFeedbackContainer").hide();
		$('.quizHeaderContainer').hide();
		$(".btnAddQuestionGroup").hide();
		$(".passPercentageToolsContainer").hide();
		
		$('#importQuizButton').off('click').on('click', function() {
	    	$('#file-input').trigger('click');
		});
		
		$('#previewQuizButton').off('click').on('click', function() {
	    	cl('onPreviewQuizButtonClick');
	    	quizToolCommon.renderPreview();
	    	/*
	    	 var w = window.open();
		  	 var html = $("#toNewWindow").html();		
		    $(w.document.body).html(html);
    		*/
	    	
	    	
	    	
		});
		
		$('#createNewQuizButton').modaal({
			type:'inline',
			animation:'fade',
			after_close: onAfterModalClose,
			should_open:false,
			hide_close: true
		});
		
		document.querySelector('.btnConfirmCreateNewQuiz').addEventListener('click', function(e) {
			onConfirmCreateNewQuizClick(e);		
		});
		
		$('#createNewQuizButton').on('click', function(e) {
			if(!$('#createNewQuizButton').data('modaal').options.should_open ) {
				onConfirmCreateNewQuizClick(e);
				$('#createNewQuizButton').data('modaal').options.should_open = true;
			}
		});
	}
	
	quizToolCommon.renderPreview = function renderPreview() {
		var serializedQuiz = JSON.stringify(quizToolCommon.serialize());
		localStorage['quizPreviewData'] = serializedQuiz;
		var appWindow = window.open('/CourseMedia/QuizEngine/templates/quizTemplatePreview/wrapper.asp','appWindow');
		appWindow = null;		
	}
	
	quizToolCommon.onFileUpload = function onFileUpload(files) {
		cl('onFileUpload');
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
			exportFilename = fileName.replace('.json','');
			$("#exportFilename").val(exportFilename);
			$(".btnConfirmExport").attr('disabled',false);
			//loadData(fileName);
			
			var reader = new FileReader();
			reader.readAsText(files[0], 'UTF-8');
			reader.onload = onFileLoad;
			
		}
	}
	
	function onCreateNewQuizClick(e) {
		quizData = NEW_QUIZ_TEMPLATE;
		$("#createNewQuizButton").hide();
		onDataLoadComplete();
	}
	
	function onConfirmCreateNewQuizClick(e) {
		quizData = NEW_QUIZ_TEMPLATE;
		onDataLoadComplete();
	}
	
	function onFileLoad(e) {
		quizData = $.parseJSON(e.currentTarget.result);
    	onDataLoadComplete();
	}
	
	function onPassPercentageChange(e) {
		//range 0 - 100
		 if ( $(e.currentTarget).val() < 0) {
		 	 $(e.currentTarget).val(0);
		 }
    	 if ( $(e.currentTarget).val() > 100) {
    	 	$(e.currentTarget).val(100);
    	 }
	}
	
	function onInputChange(e) {
		if( e.keyCode != undefined && $(e.currentTarget).hasClass('numericOnly') ) {
			if(isEntryNumeric(e.keyCode)) {
				updateCharacterLimit(e.currentTarget);
				setDirty(true);	
			}
			else {
				//TODO: better if can get e.preventDefault working properly
				$(e.currentTarget).val($(e.currentTarget).val().slice(0,-1));
			}
			
		}
		else {
			updateCharacterLimit(e.currentTarget);
			setDirty(true);		
		}
	}
	
	function isEntryNumeric(keyCode) {
		if ( (keyCode > 47 && keyCode < 58)) {
		   return true;
		}
		return false;
	}
	
	function onExportFilenameChange(e) {
		if(textSaveTimer) {
			clearTimeout(textSaveTimer);
		}
		textSaveTimer = setTimeout(onExportFilenameChangeCallback.bind(null,e),50);
	}
	
	function onExportFilenameChangeCallback(e) {
		//prevent special characters
		//var regex = new RegExp("^[a-zA-Z0-9]+$");
		
		/*
		$('input').on('keypress', function (event) {
		    var regex = new RegExp("^[a-zA-Z0-9]+$");
		    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
		    if (!regex.test(key)) {
		       event.preventDefault();
		       return false;
		    }
		});
		*/
		//cl(e.data);
		
		if( $(e.target) != undefined && $(e.target).length > 0 ) {
			exportFilename= $(e.target).val();
			$(".btnConfirmExport").attr('disabled',false);
		}
		else {
			$(".btnConfirmExport").attr('disabled',true);	
		}
	}
	
	function onPassPercentageCheckboxChange(e) {
		if( $(e.currentTarget).is(':checked') ) {
			//$("#passpercentageTools").val(0);
			$(".passPercentageToolsContainer").show();		
		}
		else {
			$(".passPercentageToolsContainer").hide();
			$("#passPercentageTools").val(0);
		}
	}
	
	function onUseGradebookCheckboxChange(e) {
		if( $(e.currentTarget).is(':checked') ) {
			//$(".checkboxGroupSendScoreToGradebook").show();
			//$(".checkboxGroupUsePassPercentage").show();
		}
		else {
			$(".checkboxGroupSendScoreToGradebook").hide();
			$("#sendScoreToGradebookCheckbox").prop('checked',false);
			
			$(".checkboxGroupUsePassPercentage").hide();
			$("#usePassPercentageCheckbox").prop('checked',false);
			$(".passPercentageToolsContainer").hide();
			$("#passPercentageTools").val(0);
		}
	}
	
	function onSendScoreToGradebookCheckboxChange(e) {
		if( $(e.currentTarget).is(':checked') ) {
			$(".checkboxGroupUsePassPercentage").show();
			
		}
		else {
			$(".checkboxGroupUsePassPercentage").hide();
			$("#usePassPercentageCheckbox").prop('checked',false);
			$(".passPercentageToolsContainer").hide();
			$("#passPercentageTools").val(0);
		}
	}
	
	
	quizToolCommon.setBindings = function setBindings() {
		//global input change, to toggle dirty flag
		$(":input").off('keyup').on('keyup', function(e) {
			onInputChange(e);	
		});
		//checkboxes
		$(":input").off('change').on('change', function(e) {
			onInputChange(e);	
		});
		
		document.querySelector("#exportFilename").removeEventListener('input',	onExportFilenameChange);
		document.querySelector("#exportFilename").addEventListener('input',	onExportFilenameChange);
		
		$("#passPercentageTools").off('keyup').on('keyup', function(e) {
			onPassPercentageChange(e);
		});
		
		$("#usePassPercentageCheckbox").off('.change').on('change', function(e) {
			onPassPercentageCheckboxChange(e);	
		});
		
		$("#useGradebookCheckbox").off('change').on('change', function(e) {
			onUseGradebookCheckboxChange(e);	
		});
		
		$("#sendScoreToGradebookCheckbox").off('change').on('change', function(e) {
			onSendScoreToGradebookCheckboxChange(e);	
		});
		
		$(".radioFeedbackType").off('change').on('change', function(e) {
			onRadioFeedbackTypeChange(e);	
		});
		
		
		
		$('.btnSaveQuiz').modaal({
			type:'inline',
			animation:'fade',
			before_open: validateData,
			after_close: onAfterModalSaveQuizClose,
			hide_close: true
		});
		
		//Hidden button, clicked programatically after validation confirmation
		$('.btnExportData').modaal({
			type:'inline',
			animation:'fade',
			after_close: onAfterModalClose,
			hide_close: true
		});
		
		document.querySelector('.btnConfirmExport').removeEventListener('click', onConfirmExportClick);
		document.querySelector('.btnConfirmExport').addEventListener('click', onConfirmExportClick);
		
		document.querySelector('.btnConfirmValidateData').removeEventListener('click', onConfirmValidateDataClick);
		document.querySelector('.btnConfirmValidateData').addEventListener('click', onConfirmValidateDataClick);
		
		
		$('.btnAddQuestionGroup').off('click').on('click', function(e) {
			onAddQuestionGroupClick(e);	
		});
		
		
		document.querySelector('.btnConfirmAddQuestionGroup').removeEventListener('click', onConfirmAddQuestionGroupClick);
		document.querySelector('.btnConfirmAddQuestionGroup').addEventListener('click', onConfirmAddQuestionGroupClick);		
		
		document.querySelector('.btnConfirmAddQuestion').removeEventListener('click', onConfirmAddQuestionClick);
		document.querySelector('.btnConfirmAddQuestion').addEventListener('click', onConfirmAddQuestionClick);
		
		document.querySelector('.btnConfirmAddAnswer').removeEventListener('click', onConfirmAddAnswerClick);
		document.querySelector('.btnConfirmAddAnswer').addEventListener('click', onConfirmAddAnswerClick);		
		
		document.querySelector('.btnConfirmAddCorrectAnswer').removeEventListener('click', onConfirmAddCorrectAnswerClick)
		document.querySelector('.btnConfirmAddCorrectAnswer').addEventListener('click', onConfirmAddCorrectAnswerClick);
		
		
		//Delete
		document.querySelector('.btnConfirmDeleteQuestionGroup').removeEventListener('click', onConfirmDeleteQuestionGroupClick);	
		document.querySelector('.btnConfirmDeleteQuestionGroup').addEventListener('click', onConfirmDeleteQuestionGroupClick);		
		
		document.querySelector('.btnConfirmDeleteQuestion').removeEventListener('click', onConfirmDeleteQuestionClick);
		document.querySelector('.btnConfirmDeleteQuestion').addEventListener('click', onConfirmDeleteQuestionClick);		
		
		document.querySelector('.btnConfirmDeleteAnswer').removeEventListener('click', onConfirmDeleteAnswerClick);
		document.querySelector('.btnConfirmDeleteAnswer').addEventListener('click', onConfirmDeleteAnswerClick);
		
		document.querySelector('.btnConfirmDeleteOnlyAnswer').removeEventListener('click', onConfirmDeleteOnlyAnswerClick);
		document.querySelector('.btnConfirmDeleteOnlyAnswer').addEventListener('click', onConfirmDeleteOnlyAnswerClick);
		
		document.querySelector('.btnConfirmDeleteOnlyQuestion').removeEventListener('click', onConfirmDeleteOnlyQuestionClick);
		document.querySelector('.btnConfirmDeleteOnlyQuestion').addEventListener('click', onConfirmDeleteOnlyQuestionClick);
	}
	
	function onRadioFeedbackTypeChange() {
		setFeedbackType();
	}
	
	function onAfterModalSaveQuizClose() {
		//if user has confirmed they want to continue, show the export dialog
		//for timing this must be fired AFTER the validation dialog has finished closing
		//TODO: research more on dual-modaals
		if(confirmValidateData) {
			$(".btnExportData").click();
			confirmValidateData = false;	
		}
	}
	
	quizToolCommon.serialize = function serialize() {
		cl('serialize');
		
		//for each question group
		var questionGroups = [];
		var feedbackType = $(".radioFeedbackType:checked").attr('id').replace('feedbackType','');
		
		$('.questionGroupContainer').each(
			function(i,questionGroupContainer) {
				var questionGroupData = {
					"questionGroupGUID":$(questionGroupContainer).attr('id'),
					"questionGroupTitle":$(questionGroupContainer).find('.questionGroupTitleTools').find(':input:first').val(),
					"questionGroupDescription":$(questionGroupContainer).find('.questionGroupDescriptionTools').find(':input:first').val(),
					"questionGroupCompetency":$(questionGroupContainer).find('.questionGroupCompetencyTools').find(':input:first').val(),
					"randomizeQuestions":$(questionGroupContainer).find('.checkboxGroupRandomizeQuestions').find(':input:first').is(':checked') ? true : false,
					"questions":[]
				}
				
				//BUILD QUESTIONS
				//for each question in question group
				$(questionGroupContainer).find('.questionContainer').each(
					function(j,questionContainer) {
						//var questionType = getQuestionTypeValueByQuestionTypeDOM($(questionContainer).find('.questionTypeContainer').find(':input:checked'));
						var questionType = $(questionContainer).find('.questionTypeToolsText').find('text').attr('value');
						if(questionType === QUESTION_TYPE_FILL_IN_THE_BLANK) {
							var questionData = {
								"questionGUID":$(questionContainer).attr('id'),
					 			"questionText":$(questionContainer).find('.questionTextTools').find(':input:first').val(),
					 			"questionType":questionType,
					 			//"competency":$(questionContainer).find('.questionCompetencyTools').find(':input:first').val(),
					 			"randomizeAnswers":$(questionContainer).find('.checkboxGroupRandomizeAnswers').find(':input:first').is(':checked')? true : false,
					 			"questionOrder":$(questionContainer).find('.questionOrderTools').find(':input:first').val(),
					 			"answers":[],
					 			"images":[],
					 			"videos":[],
					 			"audios":[],
					 			"correctAnswers":[],
					 			"incorrectAnswer":[]
							}
						} //end if question fill in the blank
						else if(questionType === QUESTION_TYPE_EXPERT_RESPONSE) {
							var questionData = {
								"questionGUID":$(questionContainer).attr('id'),
					 			"questionText":$(questionContainer).find('.questionTextTools').find(':input:first').val(),
					 			"questionType":questionType,
					 			//"competency":$(questionContainer).find('.questionCompetencyTools').find(':input:first').val(),
					 			"questionOrder":$(questionContainer).find('.questionOrderTools').find(':input:first').val(),
					 			"answers":[],
					 			"images":[],
					 			"videos":[],
					 			"audios":[]
							}
						}
						
						else if (questionType === QUESTION_TYPE_MULTIPLE_CHOICE) {
							var questionData = {
								"questionGUID":$(questionContainer).attr('id'),
					 			"questionText":$(questionContainer).find('.questionTextTools').find(':input:first').val(),
					 			"questionType":questionType,
					 			//"competency":$(questionContainer).find('.questionCompetencyTools').find(':input:first').val(),
					 			"feedback":			feedbackType === FEEDBACK_TYPE_QUESTION ?
					 								$(questionContainer).find('.questionFeedbackTools').find(':input:first').val() :
					 								'',
					 			"questionOrder":$(questionContainer).find('.questionOrderTools').find(':input:first').val(),
					 			"randomizeAnswers":$(questionContainer).find('.checkboxGroupRandomizeAnswers').find(':input:first').is(':checked')? true : false,
					 			"answers":[],
					 			"images":[],
					 			"videos":[],
					 			"audios":[]
							}
						} //end if question multiple choice
						
						else if(questionType === QUESTION_TYPE_MULTIPLE_SELECT) {
							var questionData = {
								"questionGUID":$(questionContainer).attr('id'),
					 			"questionText":$(questionContainer).find('.questionTextTools').find(':input:first').val(),
					 			"questionType":questionType,
					 			//"competency":$(questionContainer).find('.questionCompetencyTools').find(':input:first').val(),
					 			"feedback":feedbackType === FEEDBACK_TYPE_QUESTION ?
					 								$(questionContainer).find('.questionFeedbackTools').find(':input:first').val() :
					 								'',
					 			"pointsCorrect":parseInt($(questionContainer).find('.questionCorrectPointsTools').find(':input:first').val()),
					 			"pointsIncorrect":parseInt($(questionContainer).find('.questionIncorrectPointsTools').find(':input:first').val()),
					 			"questionOrder":$(questionContainer).find('.questionOrderTools').find(':input:first').val(),
					 			"randomizeAnswers":$(questionContainer).find('.checkboxGroupRandomizeAnswers').find(':input:first').is(':checked')? true : false,
					 			"answers":[],
					 			"images":[],
					 			"videos":[],
					 			"audios":[]
							}
							
							
						}//end if question multiple select
						
						//error handling
						else {
							console.log('cannot serialize for unhandle question type '+questionType);	
						}
						
						//BUILD IMAGES
						$(questionContainer).find('.imageContainerTools').each(
							function(x,image) {
								var imageData = {
									//TODO: path validation? Different for Mac / PC / Linux?
									"title":$(image).find('.imageTitleToolsText').find(':input:first').val(),
					 				"subtitle":$(image).find('.imageSubtitleToolsText').find(':input:first').val(),
					 				"imageURL":$(image).find('.imageURLToolsText').find(':input:first').val(),
					 				"altText":$(image).find('.altTextToolsText').find(':input:first').val(),
					 				"settings":{
					 					"width":$(image).find('.imageWidthToolsText').find(':input:first').val(),
					 					"height":$(image).find('.imageHeightToolsText').find(':input:first').val()
					 				}		 				
								}
								questionData.images.push(imageData);
							}
						);
						
						//BUILD VIDEOS
						$(questionContainer).find('.videoContainerTools').each(
							function(z,video) {
								var videoData = {
									//TODO: path validation? Different for Mac / PC / Linux?
									"title":$(video).find('.videoTitleToolsText').find(':input:first').val(),
					 				"subtitle":$(video).find('.videoSubtitleToolsText').find(':input:first').val(),
					 				"videoURL":$(video).find('.videoURLToolsText').find(':input:first').val(),
					 				"settings":{
					 					"width":$(video).find('.videoWidthToolsText').find(':input:first').val(),
					 					"height":$(video).find('.videoHeightToolsText').find(':input:first').val()
					 				},			 				
					 				"posterURL":$(video).find('.posterURLToolsText').find(':input:first').val(),
					 				"captionURL":$(video).find('.captionURLToolsText').find(':input:first').val()
								}
								questionData.videos.push(videoData);
							}
						);
						
						//BUILD AUDIOS
						$(questionContainer).find('.audioContainerTools').each(
							function(y,audio) {
								var audioData = {
									//TODO: path validation? Different for Mac / PC / Linux?
									"title":$(audio).find('.audioTitleToolsText').find(':input:first').val(),
					 				"subtitle":$(audio).find('.audioSubtitleToolsText').find(':input:first').val(),
					 				"audioURL":$(audio).find('.audioURLToolsText').find(':input:first').val(),
					 				"transcriptText":$(audio).find('.audioTranscriptTextToolsText').find(':input:first').val()
								}
								questionData.audios.push(audioData);
							}
						);
						
						
						//BUILD ANSWERS
						//for each answer. For fill in the blank, also correct and incorrect answers
						if(questionType === QUESTION_TYPE_FILL_IN_THE_BLANK) {
							//'answers' array is a single element ending in a '0'
							var answerData = {
								"answerGUID": $(questionContainer).attr('id')+'_0',
								"images":[],
								"videos":[],
								"audios":[]
							}
							questionData.answers.push(answerData);
							
							
							//CORRECT
							$(questionContainer).find('.answerContainer').each(
								function(k,answerContainer) {
									var answerData;
									//INCORRECT (only one)
									if( $(answerContainer).parents('.answersContainerIncorrect').length > 0) {
										answerData = {
											"answerGUID":$(answerContainer).attr('id'),
								 			//"answerText":$(answerContainer).find('.answerTextTools').find(':input:first').val(),
								 			"isCorrect":$(answerContainer).find('.answerIsCorrect').find(':input:first').is(':checked') ? true : false,	
								 			"feedback":feedbackType === ANSWER ? 
								 						$(answerContainer).find('.answerFeedbackTools').find(':input:first').val() :
								 						'',
								 			"points":parseInt($(answerContainer).find('.answerPointsTools').find(':input:first').val()),
								 			"images":[],
								 			"videos":[],
								 			"audios":[]
										}
										//BUILD IMAGES
										$(answerContainer).find('.imageContainerTools').each(
											function(x,image) {
												var imageData = {
													//TODO: path validation? Different for Mac / PC / Linux?
													"title":$(image).find('.imageTitleToolsText').find(':input:first').val(),
									 				"subtitle":$(image).find('.imageSubtitleToolsText').find(':input:first').val(),
									 				"imageURL":$(image).find('.imageURLToolsText').find(':input:first').val(),
									 				"altText":$(image).find('.altTextToolsText').find(':input:first').val(),
									 				"settings":{
									 					"width":$(image).find('.imageWidthToolsText').find(':input:first').val(),
									 					"height":$(image).find('.imageHeightToolsText').find(':input:first').val()
									 				}		 				
												}
												answerData.images.push(imageData);
											}
										);
										
										//BUILD VIDEOS
										$(answerContainer).find('.videoContainerTools').each(
											function(z,video) {
												var videoData = {
													//TODO: path validation? Different for Mac / PC / Linux?
													"title":$(video).find('.videoTitleToolsText').find(':input:first').val(),
									 				"subtitle":$(video).find('.videoSubtitleToolsText').find(':input:first').val(),
									 				"videoURL":$(video).find('.videoURLToolsText').find(':input:first').val(),
									 				"settings":{
									 					"width":$(video).find('.videoWidthToolsText').find(':input:first').val(),
									 					"height":$(video).find('.videoHeightToolsText').find(':input:first').val()
									 				},			 				
									 				"posterURL":$(video).find('.posterURLToolsText').find(':input:first').val(),
									 				"captionURL":$(video).find('.captionURLToolsText').find(':input:first').val()
												}
												answerData.videos.push(videoData);
											}
										);
										
										//BUILD AUDIOS
										$(answerContainer).find('.audioContainerTools').each(
											function(y,audio) {
												var audioData = {
													//TODO: path validation? Different for Mac / PC / Linux?
													"title":$(audio).find('.audioTitleToolsText').find(':input:first').val(),
									 				"subtitle":$(audio).find('.audioSubtitleToolsText').find(':input:first').val(),
									 				"audioURL":$(audio).find('.audioURLToolsText').find(':input:first').val(),
									 				"transcriptText":$(audio).find('.audioTranscriptTextToolsText').find(':input:first').val()
												}
												answerData.audios.push(audioData);
											}
										);
										
										
										
										
										questionData.incorrectAnswer.push(answerData);
									}
									//CORRECT
									else {
//										var answerData = {
//											"answerGUID":$(answerContainer).attr('id'),
//								 			"answerText":$(answerContainer).find('.answerTextTools').find(':input:first').val(),
//								 			"isCorrect":$(answerContainer).find('.answerIsCorrect').find(':input:first').is(':checked') ? true : false,	
//								 			"points":$(answerContainer).find('.answerPointsTools').find(':input:first').val(),
//								 			"feedback":$(answerContainer).find('.answerFeedbackTools').find(':input:first').val()	
//										}
										
										//attempts points
										if( $(answerContainer).find('.answerPointsAttemptsContainerTools').is(':visible') ) {
											var points = [];
											 $(answerContainer).find('.answerPointsAttemptsContainerTools').find('.answerAttemptTools').each(
											 	function(i,attemptAnswer) {
											 		var attemptAnswerData = {
											 			"attemptCount":$(attemptAnswer).find('.answerAttemptToolsCount').find(':input:first').val(),
											 			"points":parseInt($(attemptAnswer).find('.answerAttemptToolsPoints').find(':input:first').val()),
											 			"images":[],
											 			"videos":[],
											 			"audios":[]
											 		}
											 		
											 		//BUILD IMAGES
													$(attemptAnswer).find('.imageContainerTools').each(
														function(x,image) {
															var imageData = {
																//TODO: path validation? Different for Mac / PC / Linux?
																"title":$(image).find('.imageTitleToolsText').find(':input:first').val(),
												 				"subtitle":$(image).find('.imageSubtitleToolsText').find(':input:first').val(),
												 				"imageURL":$(image).find('.imageURLToolsText').find(':input:first').val(),
												 				"altText":$(image).find('.altTextToolsText').find(':input:first').val(),
												 				"settings":{
												 					"width":$(image).find('.imageWidthToolsText').find(':input:first').val(),
												 					"height":$(image).find('.imageHeightToolsText').find(':input:first').val()
												 				}		 				
															}
															attemptAnswerData.images.push(imageData);
														}
													);
													
													//BUILD VIDEOS
													$(attemptAnswer).find('.videoContainerTools').each(
														function(z,video) {
															var videoData = {
																//TODO: path validation? Different for Mac / PC / Linux?
																"title":$(video).find('.videoTitleToolsText').find(':input:first').val(),
												 				"subtitle":$(video).find('.videoSubtitleToolsText').find(':input:first').val(),
												 				"videoURL":$(video).find('.videoURLToolsText').find(':input:first').val(),
												 				"settings":{
												 					"width":$(video).find('.videoWidthToolsText').find(':input:first').val(),
												 					"height":$(video).find('.videoHeightToolsText').find(':input:first').val()
												 				},			 				
												 				"posterURL":$(video).find('.posterURLToolsText').find(':input:first').val(),
												 				"captionURL":$(video).find('.captionURLToolsText').find(':input:first').val()
															}
															attemptAnswerData.videos.push(videoData);
														}
													);
													
													//BUILD AUDIOS
													$(attemptAnswer).find('.audioContainerTools').each(
														function(y,audio) {
															var audioData = {
																//TODO: path validation? Different for Mac / PC / Linux?
																"title":$(audio).find('.audioTitleToolsText').find(':input:first').val(),
												 				"subtitle":$(audio).find('.audioSubtitleToolsText').find(':input:first').val(),
												 				"audioURL":$(audio).find('.audioURLToolsText').find(':input:first').val(),
												 				"transcriptText":$(audio).find('.audioTranscriptTextToolsText').find(':input:first').val()
															}
															attemptAnswerData.audios.push(audioData);
														}
													);
											 		
											 		
											 		points.push(attemptAnswerData);
											 	}
											 );
											 
											 answerData = {
												"answerGUID":$(answerContainer).attr('id'),
									 			"answerText":$(answerContainer).find('.answerTextTools').find(':input:first').val(),
									 			"isCorrect":$(answerContainer).find('.answerIsCorrect').find(':input:first').is(':checked') ? true : false,	
									 			"points":parseInt(points),
									 			"feedback":feedbackType === FEEDBACK_TYPE_ANSWER ? 
								 						$(answerContainer).find('.answerFeedbackTools').find(':input:first').val() :
								 						'',
									 			"images":[],
									 			"videos":[],
									 			"audios":[]
											}
											
										}
										
										//single point value
										else {
											answerData = {
												"answerGUID":$(answerContainer).attr('id'),
									 			"answerText":$(answerContainer).find('.answerTextTools').find(':input:first').val(),
									 			"isCorrect":$(answerContainer).find('.answerIsCorrect').find(':input:first').is(':checked') ? true : false,	
									 			"feedback":feedbackType === FEEDBACK_TYPE_ANSWER ? 
								 						$(answerContainer).find('.answerFeedbackTools').find(':input:first').val() :
								 						'',	
												"points":parseInt($(answerContainer).find('.answerPointsTools').find(':input:first').val()),
												"images":[],
									 			"videos":[],
									 			"audios":[]
											}
										}
										//BUILD IMAGES
										$(answerContainer).find('.imageContainerTools').each(
											function(x,image) {
												var imageData = {
													//TODO: path validation? Different for Mac / PC / Linux?
													"title":$(image).find('.imageTitleToolsText').find(':input:first').val(),
									 				"subtitle":$(image).find('.imageSubtitleToolsText').find(':input:first').val(),
									 				"imageURL":$(image).find('.imageURLToolsText').find(':input:first').val(),
									 				"altText":$(image).find('.altTextToolsText').find(':input:first').val(),
									 				"settings":{
									 					"width":$(image).find('.imageWidthToolsText').find(':input:first').val(),
									 					"height":$(image).find('.imageHeightToolsText').find(':input:first').val()
									 				}		 				
												}
												answerData.images.push(imageData);
											}
										);
										
										//BUILD VIDEOS
										$(answerContainer).find('.videoContainerTools').each(
											function(z,video) {
												var videoData = {
													//TODO: path validation? Different for Mac / PC / Linux?
													"title":$(video).find('.videoTitleToolsText').find(':input:first').val(),
									 				"subtitle":$(video).find('.videoSubtitleToolsText').find(':input:first').val(),
									 				"videoURL":$(video).find('.videoURLToolsText').find(':input:first').val(),
									 				"settings":{
									 					"width":$(video).find('.videoWidthToolsText').find(':input:first').val(),
									 					"height":$(video).find('.videoHeightToolsText').find(':input:first').val()
									 				},			 				
									 				"posterURL":$(video).find('.posterURLToolsText').find(':input:first').val(),
									 				"captionURL":$(video).find('.captionURLToolsText').find(':input:first').val()
												}
												answerData.videos.push(videoData);
											}
										);
										
										//BUILD AUDIOS
										$(answerContainer).find('.audioContainerTools').each(
											function(y,audio) {
												var audioData = {
													//TODO: path validation? Different for Mac / PC / Linux?
													"title":$(audio).find('.audioTitleToolsText').find(':input:first').val(),
									 				"subtitle":$(audio).find('.audioSubtitleToolsText').find(':input:first').val(),
									 				"audioURL":$(audio).find('.audioURLToolsText').find(':input:first').val(),
									 				"transcriptText":$(audio).find('.audioTranscriptTextToolsText').find(':input:first').val()
												}
												answerData.audios.push(audioData);
											}
										);
										questionData.correctAnswers.push(answerData);
									}
								}
							); //end each correct answer
												
							
						} //end if fill in the blank question
						
						else if(questionType === QUESTION_TYPE_EXPERT_RESPONSE) {
							//no answer information to serialize
							//only one answer
							//No answer-level audio,video,images for expert response...since there's just one answer, use question-level
							var answerData = {
								"answerGUID": $(questionContainer).attr('id').replace('question','answer')+'_0',
								"points":parseInt($(questionContainer).find('.pointsToolsText').find(':input:first').val()),
							}
							questionData.feedback = $(questionContainer).find('.feedbackToolsText').find(':input:first').val();
							questionData.answers.push(answerData);
							
						}//end if expert response
						
						//multiple choice/select
						else if(questionType === QUESTION_TYPE_MULTIPLE_CHOICE || questionType === QUESTION_TYPE_MULTIPLE_SELECT) {
							
							$(questionContainer).find('.answerContainer').each(
								function(k,answerContainer) {
									var answerData;
									
									//attempts points
									if( $(answerContainer).find('.answerPointsAttemptsContainerTools').is(':visible') ) {
										var points = [];
										 $(answerContainer).find('.answerPointsAttemptsContainerTools').find('.answerAttemptTools').each(
										 	function(i,attemptAnswer) {
										 		var attemptAnswerData = {
										 			"attemptCount":$(attemptAnswer).find('.answerAttemptToolsCount').find(':input:first').val(),
										 			"points":parseInt($(attemptAnswer).find('.answerAttemptToolsPoints').find(':input:first').val()),
										 			"images":[],
										 			"videos":[],
										 			"audios":[]
										 		}
										 		//BUILD IMAGES
												$(attemptAnswer).find('.imageContainerTools').each(
													function(x,image) {
														var imageData = {
															//TODO: path validation? Different for Mac / PC / Linux?
															"title":$(image).find('.imageTitleToolsText').find(':input:first').val(),
											 				"subtitle":$(image).find('.imageSubtitleToolsText').find(':input:first').val(),
											 				"imageURL":$(image).find('.imageURLToolsText').find(':input:first').val(),
											 				"altText":$(image).find('.altTextToolsText').find(':input:first').val(),
											 				"settings":{
											 					"width":$(image).find('.imageWidthToolsText').find(':input:first').val(),
											 					"height":$(image).find('.imageHeightToolsText').find(':input:first').val()
											 				}		 				
														}
														attemptAnswerData.images.push(imageData);
													}
												);
												
												//BUILD VIDEOS
												$(attemptAnswer).find('.videoContainerTools').each(
													function(z,video) {
														var videoData = {
															//TODO: path validation? Different for Mac / PC / Linux?
															"title":$(video).find('.videoTitleToolsText').find(':input:first').val(),
											 				"subtitle":$(video).find('.videoSubtitleToolsText').find(':input:first').val(),
											 				"videoURL":$(video).find('.videoURLToolsText').find(':input:first').val(),
											 				"settings":{
											 					"width":$(video).find('.videoWidthToolsText').find(':input:first').val(),
											 					"height":$(video).find('.videoHeightToolsText').find(':input:first').val()
											 				},			 				
											 				"posterURL":$(video).find('.posterURLToolsText').find(':input:first').val(),
											 				"captionURL":$(video).find('.captionURLToolsText').find(':input:first').val()
														}
														attemptAnswerData.videos.push(videoData);
													}
												);
												
												//BUILD AUDIOS
												$(attemptAnswer).find('.audioContainerTools').each(
													function(y,audio) {
														var audioData = {
															//TODO: path validation? Different for Mac / PC / Linux?
															"title":$(audio).find('.audioTitleToolsText').find(':input:first').val(),
											 				"subtitle":$(audio).find('.audioSubtitleToolsText').find(':input:first').val(),
											 				"audioURL":$(audio).find('.audioURLToolsText').find(':input:first').val(),
											 				"transcriptText":$(audio).find('.audioTranscriptTextToolsText').find(':input:first').val()
														}
														attemptAnswerData.audios.push(audioData);
													}
												);
										 		
										 		points.push(attemptAnswerData);
										 	}
										 );
										 if( questionType === QUESTION_TYPE_MULTIPLE_CHOICE) {
											 answerData = {
												"answerGUID":$(answerContainer).attr('id'),
									 			"answerText":$(answerContainer).find('.answerTextTools').find(':input:first').val(),
									 			"isCorrect":$(answerContainer).find('.answerIsCorrect').find(':input:first').is(':checked') ? true : false,	
									 			"points":parseInt(point),
									 			"feedback":feedbackType === FEEDBACK_TYPE_ANSWER ?
									 						$(answerContainer).find('.answerFeedbackTools').find(':input:first').val() :
									 						'',
									 			"images":[],
									 			"videos":[],
									 			"audios":[]
											}
										 }
										 else if( questionType === QUESTION_TYPE_MULTIPLE_SELECT) {
											 answerData = {
												"answerGUID":$(answerContainer).attr('id'),
									 			"answerText":$(answerContainer).find('.answerTextTools').find(':input:first').val(),
									 			"isCorrect":$(answerContainer).find('.answerIsCorrect').find(':input:first').is(':checked') ? true : false,	
									 			"feedback":feedbackType === FEEDBACK_TYPE_ANSWER ?
									 						$(answerContainer).find('.answerFeedbackTools').find(':input:first').val() :
									 						'',
									 			"images":[],
									 			"videos":[],
									 			"audios":[]
											}
										 }
										
									}
									
									//single point value
									else {
										 if( questionType === QUESTION_TYPE_MULTIPLE_CHOICE) {
											answerData = {
												"answerGUID":$(answerContainer).attr('id'),
									 			"answerText":$(answerContainer).find('.answerTextTools').find(':input:first').val(),
									 			"isCorrect":$(answerContainer).find('.answerIsCorrect').find(':input:first').is(':checked') ? true : false,	
									 			"feedback":feedbackType === FEEDBACK_TYPE_ANSWER ? 
									 						$(answerContainer).find('.answerFeedbackTools').find(':input:first').val() :
									 						'',
									 			"points":parseInt($(answerContainer).find('.answerPointsTools').find(':input:first').val()),
									 			"images":[],
									 			"videos":[],
									 			"audios":[]
											}
										 }
										 else if( questionType === QUESTION_TYPE_MULTIPLE_SELECT) {
											answerData = {
												"answerGUID":$(answerContainer).attr('id'),
									 			"answerText":$(answerContainer).find('.answerTextTools').find(':input:first').val(),
									 			"isCorrect":$(answerContainer).find('.answerIsCorrect').find(':input:first').is(':checked') ? true : false,	
									 			"feedback":feedbackType === FEEDBACK_TYPE_ANSWER ? 
									 						$(answerContainer).find('.answerFeedbackTools').find(':input:first').val() :
									 						'',
									 			"images":[],
									 			"videos":[],
									 			"audios":[]
											}
										 }
									}
									
									//BUILD IMAGES
									$(answerContainer).find('.imageContainerTools').each(
										function(x,image) {
											var imageData = {
												//TODO: path validation? Different for Mac / PC / Linux?
												"title":$(image).find('.imageTitleToolsText').find(':input:first').val(),
								 				"subtitle":$(image).find('.imageSubtitleToolsText').find(':input:first').val(),
								 				"imageURL":$(image).find('.imageURLToolsText').find(':input:first').val(),
								 				"altText":$(image).find('.altTextToolsText').find(':input:first').val(),
								 				"settings":{
								 					"width":$(image).find('.imageWidthToolsText').find(':input:first').val(),
								 					"height":$(image).find('.imageHeightToolsText').find(':input:first').val()
								 				}		 				
											}
											answerData.images.push(imageData);
										}
									);
									
									//BUILD VIDEOS
									$(answerContainer).find('.videoContainerTools').each(
										function(z,video) {
											var videoData = {
												//TODO: path validation? Different for Mac / PC / Linux?
												"title":$(video).find('.videoTitleToolsText').find(':input:first').val(),
								 				"subtitle":$(video).find('.videoSubtitleToolsText').find(':input:first').val(),
								 				"videoURL":$(video).find('.videoURLToolsText').find(':input:first').val(),
								 				"settings":{
								 					"width":$(video).find('.videoWidthToolsText').find(':input:first').val(),
								 					"height":$(video).find('.videoHeightToolsText').find(':input:first').val()
								 				},			 				
								 				"posterURL":$(video).find('.posterURLToolsText').find(':input:first').val(),
								 				"captionURL":$(video).find('.captionURLToolsText').find(':input:first').val()
											}
											answerData.videos.push(videoData);
										}
									);
									
									//BUILD AUDIOS
									$(answerContainer).find('.audioContainerTools').each(
										function(y,audio) {
											var audioData = {
												//TODO: path validation? Different for Mac / PC / Linux?
												"title":$(audio).find('.audioTitleToolsText').find(':input:first').val(),
								 				"subtitle":$(audio).find('.audioSubtitleToolsText').find(':input:first').val(),
								 				"audioURL":$(audio).find('.audioURLToolsText').find(':input:first').val(),
								 				"transcriptText":$(audio).find('.audioTranscriptTextToolsText').find(':input:first').val()
											}
											answerData.audios.push(audioData);
										}
									);
									
									questionData.answers.push(answerData);
								}
							); //end for each answer
							
						} //end if multiple choice or multiple select
						
						//error handling: no question type defined
						else {
							console.log('no question type defined');
							cl( $(questionContainer) );
						}
						
						if(questionData.answers.length > 0) {
							questionGroupData.questions.push(questionData);	
						}
					}
				); //end for each question
				
				
				
				questionGroups.push(questionGroupData);
			
			}
		); //end for each question group
		//default usePagination to true, if not defined
		var usePagination = $("#usePaginationCheckbox") != undefined && $("#usePaginationCheckbox").length > 0 ?
							 $("#usePaginationCheckbox").prop("checked") :
							 true;
		var isFlashcards = $("#isFlashcardsCheckbox").prop("checked");
		var useAttemptsScore = $("#useAttemptsScoreCheckbox").prop("checked");
		var usePassPercentage = $("#usePassPercentageCheckbox").prop("checked");
		var passPercentage = $("#passPercentageTools").val();
		var useGradebook = $("#useGradebookCheckbox").prop("checked");
		var sendScoreToGradebook = $("#sendScoreToGradebookCheckbox").prop("checked");
		var quizCompleteFeedback = $("#quizCompleteFeedback").val();
		var notes = $("#notes").val();
		var quizTitle = $("#quizTitle").val();
		var quizSubtitle = $("#quizSubtitle").val();
		var introTitle = $("#introTitle").val();
		var introDescription = $("#introDescription").val();
		var instructionsTitle = $("#instructionsTitle").val();
		var instructionsDescription = $("#instructionsDescription").val();
		var showScore = $("#showScoreCheckbox").prop("checked");
		var serializedQuiz = {};
		if(usePassPercentage && passPercentage != undefined) {
			serializedQuiz = {	
								"usePagination":usePagination,
								"isFlashcards":isFlashcards,
								"useAttemptsScore":useAttemptsScore,
								"usePassPercentage":usePassPercentage,
								"passPercentage":passPercentage,
								"useGradebook":useGradebook,
								"sendScoreToGradebook":sendScoreToGradebook,
								"quizTitle":quizTitle,
								"quizSubtitle":quizSubtitle,
								"introTitle":introTitle,
								"introDescription":introDescription,
								"quizInstructionsHeader":instructionsTitle,
								"quizInstructionsDescription":instructionsDescription,
								"quizCompleteFeedback":quizCompleteFeedback,
								"questionGroups":questionGroups,
								"showScore":showScore,
								"showQuizScore":showScore,
								"feedbackType":feedbackType,
								"notes":notes
							 };
			
		}
		
		else {
			serializedQuiz = {	
								"usePagination":usePagination,
								"isFlashcards":isFlashcards,
								"useAttemptsScore":useAttemptsScore,
								"usePassPercentage":usePassPercentage,
								"useGradebook":useGradebook,
								"sendScoreToGradebook":sendScoreToGradebook,
								"quizTitle":quizTitle,
								"quizSubtitle":quizSubtitle,
								"introTitle":introTitle,
								"introDescription":introDescription,
								"quizInstructionsHeader":instructionsTitle,
								"quizInstructionsDescription":instructionsDescription,
								"quizCompleteFeedback":quizCompleteFeedback,
								"questionGroups":questionGroups,
								"showScore":showScore,
								"showQuizScore":showScore,
								"feedbackType":feedbackType,
								"notes":notes
							 };
		}
		cl(serializedQuiz);
		return serializedQuiz;
		//exportJSON(JSON.stringify(serializedQuiz));
		
	} //end serialize
	
	function exportQuiz(serializedQuiz) {
		//remove any trailing commas without a follow-on attribute, which would produce invalid JSON
		exportJSON(JSON.stringify(serializedQuiz).replace(/(.*?),\s*(\}|])/g, "$1$2"));	
	}
	
	function exportJSON(json) {
		var a = document.createElement('a');
	  	a.setAttribute('href', 'data:text/plain;charset=utf-u,'+encodeURIComponent(json));
	  	a.setAttribute('download', exportFilename+".json");
	  	a.click();
	  	//document.getElementById('a').remove();
	  	alert('Your quiz has been exported.');
	  	$("#loader").hide();
	  	scrollToElement("#mainContent");
	  	setDirty(false);
	}
	
	function onConfirmExportClick(e) {
		$("#loader").show();
		var serializedQuiz = quizToolCommon.serialize();
		exportQuiz(serializedQuiz);
	}
	
	function onConfirmValidateDataClick(e) {
		onConfirmValidateData();
	}
	
	function onConfirmValidateData() {
		cl('onConfirmValidateData');
		confirmValidateData = true;
	}
	
	quizToolCommon.deserialize = function deserialize() {
		
	}
	
	quizToolCommon.render = function render() {
		cl('render');
		//cl(quizData);
		$("#usePaginationCheckbox").prop('checked',quizData.usePagination);
		$("#isFlashcardsCheckbox").prop('checked',quizData.isFlashcards);
		$("#useAttemptsScoreCheckbox").prop('checked',quizData.useAttemptsScore);
		$("#usePassPercentageCheckbox").prop('checked',quizData.usePassPercentage);
		$("#passPercentageTools").val(quizData.passPercentage);
		$("#quizCompleteFeedback").val(quizData.quizCompleteFeedback);
		$("#notes").val(quizData.notes);
		$("#quizTitle").val(quizData.quizTitle);
		$("#quizSubtitle").val(quizData.quizSubtitle);
		$("#introTitle").val(quizData.introTitle);
		$("#introDescription").val(quizData.introDescription);
		$("#instructionsTitle").val(quizData.quizInstructionsHeader);
		$("#instructionsDescription").val(quizData.quizInstructionsDescription);
		$("#useGradebookCheckbox").prop('checked',quizData.useGradebook);
		$("#sendScoreToGradebookCheckbox").prop('checked',quizData.sendScoreToGradebook);
		$("#showScoreCheckbox").prop('checked',quizData.showScore);
		$(".radioFeedbackType[id=feedbackType"+cmHelpers.capitalizeFirstLetter(quizData.feedbackType)+"]").prop('checked',true);
		
		if(quizData.usePassPercentage) {
			$(".passPercentageToolsContainer").show();	
		}
		else {
			$(".passPercentageToolsContainer").hide();	
		}
		
		if(quizData.useGradebook) {
			//$(".checkboxGroupSendScoreToGradebook").show();
			//$(".checkboxGroupUsePassPercentage").show();
		}
		else {
			$(".checkboxGroupSendScoreToGradebook").hide();
			$("#sendScoreToGradebookCheckbox").prop('checked',false);
			
			$(".checkboxGroupUsePassPercentage").hide();
			$("#usePassPercentageCheckbox").prop('checked',false);
			$(".passPercentageToolsContainer").hide();
			$("#passPercentageTools").val('0');
		}
		
		if(quizData.sendScoreToGradebook) {
			$(".checkboxGroupUsePassPercentage").show();
		}
		else {
			$(".checkboxGroupUsePassPercentage").hide();
			$("#usePassPercentageCheckbox").prop('checked',false);
			$(".passPercentageToolsContainer").hide();
			$("#passPercentageTools").val('0');
		}
		
		
		var quizContainer = $(QUIZ_CONTAINER_TEMPLATE);
		//for each question group
		$.each(quizData.questionGroups, function(i,questionGroup)  {
			var questionGroupContainer = createQuestionGroup(questionGroup);
			
			//for each question
			$.each(questionGroup.questions, function(j,question)  {
				var questionContainer = createQuestion(question);
				 	
			 	$.each(question.answers, function(j,answer)  {
			 		$(questionContainer).find('.answersContainer').append( createAnswer(answer) );
			 	});
				
			 	questionGroupContainer.find('.questionsContainer').append(questionContainer);
				
			}) //end for each question
			
			quizContainer.append(questionGroupContainer);
		}); //end for each question group
		
		
		setCharacterLimits();
		setFeedbackType();
		setDirty(false);
	} //end render
	
	//read maxlength on all inputs and textareas 
	function setCharacterLimits() {
		$('input').each(
			function(i,input) {
				updateCharacterLimit(input)
			}
		)
		$('textarea').each(
			function(i,textarea) {
				updateCharacterLimit(textarea)
			}
		)
		
	}
	
	//hide the feedback type not used (questions / answers)
	function setFeedbackType() {
		var feedbackType = $(".radioFeedbackType:checked").attr('id').replace('feedbackType','');
		if(feedbackType === FEEDBACK_TYPE_QUESTION) {
			$('.answerFeedbackTools').hide();
			$('.questionFeedbackTools').show();
			$('.questionFeedbackCorrectTools').show();
			$('.questionFeedbackIncorrectTools').show();
			
		}
		else if(feedbackType === FEEDBACK_TYPE_ANSWER) {
			$('.questionFeedbackCorrectTools').hide();
			$('.questionFeedbackIncorrectTools').hide();
			$('.questionFeedbackTools').hide();
			$('.answerFeedbackTools').show();
		}
	}
	
	function updateCharacterLimit(element) {
		var maxlength = $(element).attr('maxlength');
		if(maxlength != undefined) {
			//assumes characterLimitContainer is immediate sibling of element
			if($(element).next().hasClass('characterLimitContainer')) {
				var characterLimitContainer = $(element).next();
				var charactersEnteredCount = $(element).val().length;
				var charactersRemainingCount = maxlength - charactersEnteredCount;
				$(characterLimitContainer).find('.charactersRemaining').html(charactersRemainingCount);
			}
		}
	}
	
	
	//LOAD
	
	/*function loadData(fileName) {
		$.ajax({
	       url: DATA_PATH+fileName,
	        //url: "data/quiz.json",
	        dataType: "json"
	   })
	   .fail(function(data, textStatus, error){
	       cl('questions.json did not load, status: '+textStatus+' , error: '+ error);
	   })
	   .success(function(data) {
	    	cl('questions.json loaded');
	    	quizData = data;
	    	onDataLoadComplete();
	   })
	   /*.always(function(data){
	        if(data == ERROR_NO_USER_GUID) {
	            callback(ERROR_NO_USER_GUID);
	        }
	        else {
	            callback();
	        }
	   });*/
	//}
	
	//if anything has changed and we need to account for older schemes
	function migrateData() {
		//feedback
		if(quizData.feedbackType == undefined || quizData.feedbackType.length === 0) {
			quizData.feedbackType = FEEDBACK_TYPE_QUESTION;	
		}
		//competency: question level --> questionGroupLevel
			//not editable so not part of userSaveData
	
		$.each(quizData.questionGroups, function(i,questionGroup)  {
			$.each(questionGroup.questions, function(j,question) {
				if(question.competency != undefined && question.competency.length > 0) {
					//if competency already exists at the questionGroup level, don't override
					if(!(questionGroup.competency != undefined && questionGroup.competency.length > 0)) {
						questionGroup.competency = question.competency;
					}
					//delete competency from all questions
					delete question.competency;
				}
			});
		});
		
		//feedback question level: feedbackCorrect and feedbackIncorrect --> feedback
		$.each(quizData.questionGroups, function(i,questionGroup)  {
			$.each(questionGroup.questions, function(j,question) {
				if(question.feedbackCorrect != undefined && question.feedbackCorrect.length > 0) {
					//if feedback already exists at the questionGroup level, don't override
					if(!(questionGroup.feedback != undefined && questionGroup.feedback.length > 0)) {
						question.feedback = question.feedbackCorrect;
					}
					//delete feedbackCorrect from all questions
					delete question.feedbackCorrect;
				}
				if(question.feedbackIncorrect != undefined && question.feedbackIncorrect.length > 0) {
					//if feedback already exists at the questionGroup level, don't override
					if(!(questionGroup.feedback != undefined && questionGroup.feedback.length > 0)) {
						question.feedback = question.feedbackIncorrect;
					}
					//delete feedbackIncorrect from all questions
					delete question.feedbackIncorrect;
				}
			});
		});
		
		if( quizData.quizSubtitle == undefined && quizData.quizDescription != undefined) {
			quizData.quizSubtitle = quizData.quizDescription;	
		}
		
	}
	
	function onDataLoadComplete() {
		cl('onDataLoadComplete');
		//checkForAllDataLoadsComplete();
		
		cl('onAllDataLoadsComplete');
		migrateData();
		$("#loader").show();
		reset();
		quizToolCommon.render();	
		//quizToolCommon.deserialize();
		quizToolCommon.setBindings();
		//after deserialize, check each question group for completion and set UI
		//checkForAllQuestionGroupsComplete();
		//checkForQuizComplete();
		//check for all answered if not complete
		//checkForAllQuestionGroupsAllAnswered();
		//checkForQuizAllAnswered();
		
		$('.accordion-controls').show();
		$('#accordion1').show();		
		$(".btnSaveQuiz").show();
		$('#previewQuizButton').show();
		$(".checkboxGroupUsePagination").show();
		$(".checkboxGroupIsFlashcards").show();
		$(".checkboxGroupUseAttemptsScore").show();
		//$(".checkboxGroupUsePassPercentage").show();
		//$(".passPercentageToolsContainer").show();
		$('.checkboxGroupShowScore').show();
		$('.checkboxGroupUseGradebook').show();
		//$('.checkboxGroupSendScoreToGradebook').show();
		$('.quizCompleteFeedbackContainer').show();
		$('.quizHeaderContainer').show();
		$(".btnAddQuestionGroup").show();
		$("#loader").hide();
		
	}
	
	function reset() {
		$('.quizContainer').empty();
		$('.accordion-controls-hide').children('a').click();
		$('#previewQuizButton').hide();
	}
	
	function onAfterModalClose() {
		
	}
	
	function createAnswerAttempt(attempt,answerAttemptsContainer) {
		//render each attempt from template
		var answerAttemptCountTools;
		//if default
		if(attempt.attemptCount === -1) {
			answerAttemptCountTools = $(
				ANSWER_ATTEMPT_COUNT_DEFAULT_TOOLS
				.replace(/PLACEHOLDER_ANSWER_ATTEMPT_COUNT_TOOLS/g,$(answerAttemptsContainer).parents('.answerContainer').attr('id') + '-attempt' + attempt.attemptCount)
				.replace(PLACEHOLDER_VALUE,attempt.attemptCount)
				);
		}
		
		else {
			answerAttemptCountTools = $(
				ANSWER_ATTEMPT_COUNT_TOOLS
				.replace(/PLACEHOLDER_ANSWER_ATTEMPT_COUNT_TOOLS/g,$(answerAttemptsContainer).parents('.answerContainer').attr('id') + '-attempt' + attempt.attemptCount)
				.replace(PLACEHOLDER_VALUE,attempt.attemptCount)
			);
		}
		
		var answerAttemptPointsTools = $(
			ANSWER_ATTEMPT_POINTS_TOOLS
			.replace(/PLACEHOLDER_ANSWER_ATTEMPT_COUNT_POINTS/g,$(answerAttemptsContainer).parents('.answerContainer').attr('id') + '-attempt' + attempt.attemptCount)
			.replace(PLACEHOLDER_VALUE,attempt.points)
		);
		
		var answerAttemptTools = $(
			ANSWER_ATTEMPT_TOOLS
			.replace(PLACEHOLDER_ANSWER_ATTEMPT_GUID, $(answerAttemptsContainer).parents('.answerContainer').attr('id') + '-attempt' + attempt.attemptCount)
			//.replace(PLACEHOLDER_ANSWER_ATTEMPT_COUNT_POINTS,attempt.points)
			//.replace(PLACEHOLDER_VALUE,attempt.points)
		);
		
		answerAttemptTools.prepend(answerAttemptPointsTools);
		answerAttemptTools.prepend(answerAttemptCountTools);
		if(attempt.attemptCount === -1) {
			answerAttemptTools.insertAfter( $(answerAttemptsContainer).find('.answerPointsToolsText') );
			//answerAttemptsContainer.insertAt(0,answerAttemptTools);
		}
		else {
			answerAttemptsContainer.append(answerAttemptTools);
		}
		setDirty(true);
	}
	
	
	function createAnswerAttempts(points,answerAttemptsContainer) {
		$.each(points, function(i,attempt) {
			createAnswerAttempt(attempt,answerAttemptsContainer);
		});
		setDirty(true);
	}
	
	function createAnswerAttemptsContainer(answer,answerContainer) {
		var answerAttemptsContainer = $(
			ANSWER_POINTS_ATTEMPTS_CONTAINER_TOOLS
			.replace(/PLACEHOLDER_ANSWER_TEXT_GUID_TOOLS/g,answer.answerGUID)
		);
		
		var answerAttemptDeleteButton =  $(
			ANSWER_ATTEMPT_DELETE_BUTTON
		).on('click', function(e) {	onDeleteAnswerAttemptClick(e); })
		answerAttemptsContainer.prepend(answerAttemptDeleteButton);
		
		var answerAttemptAddButton =  $(
			ANSWER_ATTEMPT_ADD_BUTTON
		).on('click', function(e) {	onAddAnswerAttemptClick(e); })
		answerAttemptsContainer.prepend(answerAttemptAddButton);
		
		var answerAttemptRemoveAttemptScoringButton =  $(
			ANSWER_ATTEMPT_REMOVE_ATTEMPT_SCORING_BUTTON
		).on('click', function(e) {	onAnswerAttemptRemoveAttemptScoringClick(e); })
		answerAttemptsContainer.prepend(answerAttemptRemoveAttemptScoringButton);
		
		answerContainer.append(answerAttemptsContainer);
		setDirty(true);
	}
	
	
	//CREATE
	//Optional param of question which can be passed if new answer is being added to new question, which is not yet on the DOM/rendered
	//case in point: adding the placeholder incorrect answer for a newly-created fill in the blank question
	function createAnswer(answer,newQuestion) {
 		var question = newQuestion != undefined ? newQuestion : getQuestionDataByAnswerGUID(answer.answerGUID);
 		var questionType = getQuestionType(question);
 		var answerContainer = $(ANSWER_CONTAINER_TEMPLATE_TOOLS
 			.replace(PLACEHOLDER_ANSWER_DATA_ANSWER_GUID,answer.answerGUID)
 		);
 		
 		//SPECIFIC TO QUESTION TYPE
 		//MULTIPLE CHOICE
	 	if(questionType === QUESTION_TYPE_MULTIPLE_CHOICE) {
	 		//delete answer
	 		var answerDeleteButton =  $(
	 			ANSWER_DELETE_BUTTON
			).on('click', function(e) {	onDeleteAnswerClick(e); })
			.modaal({
					type:'inline',
					animation:'fade',
					after_close: onAfterModalClose,
					should_open: false,
					hide_close: true
				});
	 		answerContainer.append(answerDeleteButton);
	 		
	 		
	 		var answerAttemptAddAttemptScoringButton =  $(
	 				ANSWER_ATTEMPT_ADD_ATTEMPT_SCORING_BUTTON
				).on('click', function(e) {	onAnswerAttemptAddAttemptScoringClick(e); })
	 		answerContainer.append(answerAttemptAddAttemptScoringButton);
	 		/*
	 		var imagesAddButton = $(
	 			ADD_IMAGES_BUTTON
	 		).on('click', function(e) {
				onAddAnswerImagesClick(e);	
			});
			
			answerContainer.append(imagesAddButton);
	 		
	 		var videosAddButton = $(
	 			ADD_VIDEOS_BUTTON
	 		).on('click', function(e) {
				onAddAnswerVideosClick(e);	
			});
			
			answerContainer.append(videosAddButton);
			
			var audiosAddButton = $(
	 			ADD_AUDIOS_BUTTON
	 		).on('click', function(e) {
				onAddAnswerAudiosClick(e);	
			});
			
			answerContainer.append(audiosAddButton);
	 		*/
	 		
	 		
	 		
	 		
	 		//answer text
	 		var answerText = $( 
	 			ANSWER_TEXT_TOOLS
	 			.replace(/PLACEHOLDER_ANSWER_TEXT_GUID_TOOLS/g,answer.answerGUID)
	 			.replace(PLACEHOLDER_VALUE,(answer.answerText != undefined ? answer.answerText : ''))
	 		);
	 		(answerText).find(':input').on('change keyup', function(e) { onInputChange(e) });
	 		updateCharacterLimit( (answerText).find(':input') );
	 		answerContainer.append(answerText);
	 		
	 		//feedback
	 		var answerFeedback = $( 
	 			ANSWER_FEEDBACK_TOOLS
	 			.replace(/PLACEHOLDER_ANSWER_TEXT_GUID_TOOLS/g,answer.answerGUID)
	 			.replace(PLACEHOLDER_VALUE,(answer.feedback != undefined ? answer.feedback : ''))
	 		);
	 		(answerFeedback).find(':input').on('change keyup', function(e) { onInputChange(e) });
	 		updateCharacterLimit( (answerFeedback).find(':input') );
	 		answerContainer.append(answerFeedback);
	 		
	 		//points
	 		//are points an array, and using attemptsScore?
	 		if( $("#useAttemptsScoreCheckbox").prop("checked") && $.isArray(answer.points) ) {
				createAnswerAttemptsContainer(answer,answerContainer);
				createAnswerAttempts(answer.points,$(answerContainer).find('.answerPointsAttemptsContainerTools'));
				$(answerContainer).find('.btnAddAnswerAttemptScoring').hide();
				
	 		} //end if attempts scoring
	 		
	 		
	 		//else no attempts scoring
	 		else {
		 		createAnswerPoints(answer,answerContainer);
	 		}
	 		
	 		
	 		//IMAGES
		 	if(answer.images != undefined && answer.images.length > 0)  {
	 			if( $(answerContainer).find('.imagesContainerTools').length === 0 ) {
		 			createImagesContainer( answerContainer );
	 			}
	 			
	 			$.each(answer.images, function(z,images) {
	 				createImage( answerContainer, images );	
	 			});
	 			//$(imagesAddButton).hide();
	 		}
	 		
	 		//else doesn't have images 
	 		else {
	 			if( $(answerContainer).find('.imagesContainerTools').length > 0 ) {
	 				$(answerContainer).find('.imagesContainerTools').remove();
	 				//$(imagesAddButton).show();
	 			}
	 		}
		 	
		 	//VIDEOS
		 	if(answer.videos != undefined && answer.videos.length > 0)  {
	 			if( $(answerContainer).find('.videosContainerTools').length === 0 ) {
			 		//$(videosAddButton).css('display','none');
		 			createVideosContainer( answerContainer );
	 			}
	 			
	 			$.each(answer.videos, function(z,video) {
	 				createVideo( answerContainer, video );	
	 			});
	 			//$(videosAddButton).hide();
	 		}
	 		
	 		//else doesn't have videos 
	 		else {
	 			if( $(answerContainer).find('.videosContainerTools').length > 0 ) {
	 				$(answerContainer).find('.videosContainerTools').remove();
	 				//$(videosAddButton).show();
	 			}
	 		}
	 		
	 		//AUDIOS
		 	if(answer.audios != undefined && answer.audios.length > 0)  {
	 			if( $(answerContainer).find('.audiosContainerTools').length === 0 ) {
		 			createAudiosContainer( answerContainer );
	 			}
	 			
	 			$.each(answer.audios, function(z,audio) {
	 				createAudio( answerContainer, audio );	
	 			});
	 			//$(audiosAddButton).hide();
	 		}
	 		
	 		//else doesn't have audios 
	 		else {
	 			if( $(answerContainer).find('.audiosContainerTools').length > 0 ) {
	 				$(answerContainer).find('.audiosContainerTools').remove();
	 				//$(audiosAddButton).show();
	 			}
	 		}
	 		
	 		//isCorrect radio (only one per question)
 		 	var answerIsCorrect = $( 
 				ANSWER_IS_CORRECT_RADIO_TOOLS
 				.replace(/PLACEHOLDER_ANSWER_TEXT_GUID_TOOLS/g,answer.answerGUID)
 				.replace(/PLACEHOLDER_QUESTION_TEXT_GUID_TOOLS/g,question.questionGUID)
 				.replace(PLACEHOLDER_RADIO_CHECKED,(answer.isCorrect === true ? 'checked' : ''))
 			);
 			answerContainer.append(answerIsCorrect);
	 	} //end if question multipleChoice
	 	
	 		 	
	 	else if(questionType === QUESTION_TYPE_MULTIPLE_SELECT) {
	 		//delete answer
	 		var answerDeleteButton =  $(
	 			ANSWER_DELETE_BUTTON
			).on('click', function(e) {	onDeleteAnswerClick(e); })
			.modaal({
					type:'inline',
					animation:'fade',
					after_close: onAfterModalClose,
					should_open: false,
					hide_close: true
				});
	 		answerContainer.append(answerDeleteButton);
	 		
	 		var answerAttemptAddAttemptScoringButton =  $(
	 				ANSWER_ATTEMPT_ADD_ATTEMPT_SCORING_BUTTON
				).on('click', function(e) {	onAnswerAttemptAddAttemptScoringClick(e); })
	 		answerContainer.append(answerAttemptAddAttemptScoringButton);
	 		
	 		//answer text
	 		var answerText = $( 
	 			ANSWER_TEXT_TOOLS
	 			.replace(/PLACEHOLDER_ANSWER_TEXT_GUID_TOOLS/g,answer.answerGUID)
	 			.replace(PLACEHOLDER_VALUE,(answer.answerText != undefined ? answer.answerText : ''))
	 		);
	 		(answerText).find(':input').on('change keyup', function(e) { onInputChange(e) });
	 		updateCharacterLimit( (answerText).find(':input') );
	 		answerContainer.append(answerText);
	 		
	 		//feedback
	 		var answerFeedback = $( 
	 			ANSWER_FEEDBACK_TOOLS
	 			.replace(/PLACEHOLDER_ANSWER_TEXT_GUID_TOOLS/g,answer.answerGUID)
	 			.replace(PLACEHOLDER_VALUE,(answer.feedback != undefined ? answer.feedback : ''))
	 		);
	 		(answerFeedback).find(':input').on('change keyup', function(e) { onInputChange(e) });
	 		updateCharacterLimit( (answerFeedback).find(':input') );
	 		answerContainer.append(answerFeedback); 
	 		
	 		//Points are at quesiton level for multiple select
	 		//are points an array, and using attemptsScore?
	 		//TODO: make this work for question scoring
	 		/*if( $("#useAttemptsScoreCheckbox").prop("checked") && $.isArray(question.pointsCorrect) ) {
				createAnswerAttemptsContainer(answer,answerContainer);
				createAnswerAttempts(question.pointsCorrect,$(answerContainer).find('.answerPointsAttemptsContainerTools'));
				$(answerContainer).find('.btnAddAnswerAttemptScoring').hide();
				
	 		} //end if attempts scoring
	 		*/
	 		
	 		//else no attempts scoring
	 		//else {
		 	//	createAnswerPoints(answer,answerContainer);
	 		//}
	 		
	 		//isCorrect checkbox (multiple possible per question)
	 		 var answerIsCorrect = $( 
	 			ANSWER_IS_CORRECT_CHECKBOX_TOOLS
	 			.replace(/PLACEHOLDER_ANSWER_TEXT_GUID_TOOLS/g,answer.answerGUID)
	 			.replace(PLACEHOLDER_CHECKBOX_CHECKED,(answer.isCorrect === true ? 'checked' : ''))
	 		);
	 		answerContainer.append(answerIsCorrect);
	 	} //end if question multipleSelect
	 	
	 	
	 	else if(questionType === QUESTION_TYPE_FILL_IN_THE_BLANK) {
	 		var answerGUID = answer.answerGUID.substring(answer.answerGUID.lastIndexOf("_") + 1);
	 		//if GUID ends in incorrect
	 		if( answerGUID === 'incorrect' ) {
		 		//feedback
		 		var answerFeedback = $( 
		 			ANSWER_FEEDBACK_TOOLS
		 			.replace(/PLACEHOLDER_ANSWER_TEXT_GUID_TOOLS/g,answer.answerGUID)
		 			.replace(PLACEHOLDER_VALUE,(answer.feedback != undefined ? answer.feedback : ''))
		 		);
		 		answerContainer.append(answerFeedback);
		 		
		 		//no delete button, can't remove the incorrect option
	 			//no answer text either, only feedback
	 			//points
		 		createAnswerPoints(answer,answerContainer);
	 		}
	 		//answer correct
	 		else {
		 		//if answer GUID ends in '0', don't render. When we serialize we'll just append a placeholder answer of '_0' for this question.
		 		if(parseInt(answerGUID) !== 0) {
		 			//delete answer
			 		var answerDeleteButton =  $(
			 			ANSWER_DELETE_BUTTON
					)
					.on('click', function(e) {	onDeleteAnswerClick(e); })
					.modaal({
						type:'inline',
						animation:'fade',
						after_close: onAfterModalClose,
						should_open:false,
						hide_close: true
					});
			 		answerContainer.append(answerDeleteButton);
			 		
			 		var answerAttemptAddAttemptScoringButton =  $(
			 				ANSWER_ATTEMPT_ADD_ATTEMPT_SCORING_BUTTON
						).on('click', function(e) {	onAnswerAttemptAddAttemptScoringClick(e); })
			 		answerContainer.append(answerAttemptAddAttemptScoringButton);
			 		
			 		//answer text
			 		var answerText = $( 
			 			ANSWER_TEXT_TOOLS
			 			.replace(/PLACEHOLDER_ANSWER_TEXT_GUID_TOOLS/g,answer.answerGUID)
			 			.replace(PLACEHOLDER_VALUE,(answer.answerText != undefined ? answer.answerText : ''))
			 		);
			 		(answerText).find(':input').on('change keyup', function(e) { onInputChange(e) });
	 				updateCharacterLimit( (answerText).find(':input') );
			 		answerContainer.append(answerText);
			 		
			 		//feedback
			 		var answerFeedback = $( 
			 			ANSWER_FEEDBACK_TOOLS
			 			.replace(/PLACEHOLDER_ANSWER_TEXT_GUID_TOOLS/g,answer.answerGUID)
			 			.replace(PLACEHOLDER_VALUE,(answer.feedback != undefined ? answer.feedback : ''))
			 		);
			 		(answerFeedback).find(':input').on('change keyup', function(e) { onInputChange(e) });
	 				updateCharacterLimit( (answerFeedback).find(':input') );
			 		answerContainer.append(answerFeedback);
			 		
			 		//are points an array, and using attemptsScore?
			 		if( $("#useAttemptsScoreCheckbox").prop("checked") && $.isArray(answer.points) ) {
						createAnswerAttemptsContainer(answer,answerContainer);
						createAnswerAttempts(answer.points,$(answerContainer).find('.answerPointsAttemptsContainerTools'));
						$(answerContainer).find('.btnAddAnswerAttemptScoring').hide();
						
			 		} //end if attempts scoring
			 		
			 		//else no attempts scoring
			 		else {
				 		createAnswerPoints(answer,answerContainer);
			 		}
			 		
			 		//points
//			 		var answerPoints = $( 
//			 			ANSWER_POINTS_TOOLS
//			 			.replace(/PLACEHOLDER_ANSWER_TEXT_GUID_TOOLS/g,answer.answerGUID)
//			 			.replace(PLACEHOLDER_VALUE,(answer.points != undefined ? answer.points : 0))
//			 		);
//			 		answerContainer.append(answerPoints);
	 			}
	 			
	 			//ends in '0', don't append anything
	 			else {
	 				answerContainer = null;
	 			}
	 		}
	 	} //end if question fillInTheBlank
 		return answerContainer;
 		
	
 		//feedback
 		//var feedback = $( FEEDBACK_PLACEHOLDER_TEMPLATE.replace(PLACEHOLDER_ANSWER_DATA_FEEDBACK,answerData.feedback) );
 		//answerContainer.append(answer);
 		//answerContainer.append(feedback);
 		//answersContainerRadioGroup.append(answerContainer);
		//answersContainer.append(answerContainer);
 		setFeedbackType();
 		setDirty(true);
		
	}
	
	//at question level
	function createMultipleSelectPoints(question,questionContainer) {
		cl('createMultipleSelectPoints');
		var questionCorrectPoints = $( 
 			QUESTION_CORRECT_POINTS_TOOLS
 			.replace(PLACEHOLDER_QUESTION_TEXT_GUID_TOOLS,question.questionGUID)
 			.replace(PLACEHOLDER_VALUE,(question.pointsCorrect != undefined ? question.pointsCorrect : 0))
 		);
 		questionContainer.append(questionCorrectPoints);
		
 		var questionIncorrectPoints = $( 
 			QUESTION_INCORRECT_POINTS_TOOLS
 			.replace(PLACEHOLDER_QUESTION_TEXT_GUID_TOOLS,question.questionGUID)
 			.replace(PLACEHOLDER_VALUE,(question.pointsIncorrect != undefined ? question.pointsIncorrect : 0))
 		);
 		questionContainer.append(questionIncorrectPoints);
 		
 		setDirty(true);
	}
	
	//single value, not attempt scoring
	function createAnswerPoints(answer,answerContainer, isInsertAfter) {
		var answerPoints = $( 
 			ANSWER_POINTS_TOOLS
 			.replace(/PLACEHOLDER_ANSWER_TEXT_GUID_TOOLS/g,answer.answerGUID)
 			.replace(PLACEHOLDER_VALUE,(answer.points != undefined ? answer.points : 0))
 		);
 		
 		if(isInsertAfter) {
 			var answerTextTools = $(answerContainer).find('.answerTextTools');
 			answerPoints.insertAfter( answerTextTools );
 		}
 		
 		else {
 			answerContainer.append(answerPoints);		
 		}
 		setDirty(true);
	}
	
	function getQuestionOrder() {
		//count will be current questions on DOM...increment by 1 for new question #
		return $('#'+currentQuestionGroupGUID).find('.questionContainer').length + 1;
	}
	
	//after question delete
	function updateQuestionOrder() {
		$('#'+currentQuestionGroupGUID).find('.questionContainer').each(
			function(i,questionContainer) {
				$(questionContainer).find('.questionOrderToolsText').find(':input').val(i+1);
			}
		);
	}
	
	function createQuestion(question) {
		//different rendering for different question types
 		var questionType = getQuestionType(question);
		var questionTypeDisplay = getQuestionTypeDisplay(question);
 		//COMMON FOR ALL QUESTIONS
 		var questionContainer = $(
 			QUESTION_CONTAINER_TEMPLATE_TOOLS
 			.replace(PLACEHOLDER_QUESTION_TYPE,questionType)
 			.replace(/PLACEHOLDER_QUESTION_QUESTION_GUID/g,question.questionGUID)
 		);
 		
	 	//SPECIFIC TO QUESTION TYPE
	 	
	 	//MULTIPLE CHOICE
	 	if(questionType === QUESTION_TYPE_MULTIPLE_CHOICE || questionType === QUESTION_TYPE_MULTIPLE_SELECT) {
		 	var questionDeleteButton = $(
	 			QUESTION_DELETE_BUTTON
			).on('click', function(e) {
				onDeleteQuestionClick(e);	
			}).modaal({
				type:'inline',
				animation:'fade',
				after_close: onAfterModalClose,
				should_open: false,
				hide_close: true
			});
	 		questionContainer.append(questionDeleteButton);
	 		
	 		/*var answerAddButton = $(
	 			ANSWER_ADD_BUTTON
	 		).on('click', function(e) {
				onAddAnswerClick(e);	
			}).modaal({
				type:'inline',
				animation:'fade',
				after_close: onAfterModalClose,
				hide_close: true
			});*/
	 		var answerAddButton = $(
	 			ANSWER_ADD_BUTTON
	 		).on('click', function(e) {
				onAddAnswerClick(e);	
			});
	 		
	 		/*
	 		var imagesAddButton = $(
	 			ADD_IMAGES_BUTTON
	 		).on('click', function(e) {
				onAddImagesClick(e);	
			});
			
			questionContainer.append(imagesAddButton);
	 		
	 		var videosAddButton = $(
	 			ADD_VIDEOS_BUTTON
	 		).on('click', function(e) {
				onAddVideosClick(e);	
			});
			
			questionContainer.append(videosAddButton);
			
			var audiosAddButton = $(
	 			ADD_AUDIOS_BUTTON
	 		).on('click', function(e) {
				onAddAudiosClick(e);	
			});
			
			questionContainer.append(audiosAddButton);
	 		*/
	 		
			//order
			var questionOrder = $( QUESTION_ORDER_TEMPLATE_TOOLS
		 		.replace(/PLACEHOLDER_QUESTION_TEXT_GUID_TOOLS/g,question.questionGUID )
		 		.replace(PLACEHOLDER_VALUE,question.questionOrder != undefined && question.questionOrder.length > 0  ? question.questionOrder : getQuestionOrder())		 		
	 		);
	 		(questionOrder).find(':input').on('change keyup', function(e) { onInputChange(e) });
	 		questionContainer.append(questionOrder);
			
	 		//text
	 		var questionText = $( QUESTION_TEXT_TEMPLATE_TOOLS
		 		.replace(/PLACEHOLDER_QUESTION_TEXT_GUID_TOOLS/g,question.questionGUID )
		 		.replace(PLACEHOLDER_VALUE,question.questionText)		 		
	 		);
	 		(questionText).find(':input').on('change keyup', function(e) { onInputChange(e) });
	 		updateCharacterLimit( (questionText).find(':input') );
	 		questionContainer.append(questionText);


	 		//competency
	 		/*var questionCompetency = $( QUESTION_COMPETENCY_TEMPLATE_TOOLS
		 		.replace(/PLACEHOLDER_QUESTION_TEXT_GUID_TOOLS/g,question.questionGUID )
		 		.replace(PLACEHOLDER_VALUE,question.competency)
	 		);
	 		(questionCompetency).find(':input').on('change keyup', function(e) { onInputChange(e) });
	 		updateCharacterLimit( (questionCompetency).find(':input') );
	 		questionContainer.append(questionCompetency);
	 		*/
	 		//Feedback correct and incorrect
	 		var questionFeedback = $( QUESTION_FEEDBACK_TOOLS
		 		.replace(/PLACEHOLDER_QUESTION_TEXT_GUID_TOOLS/g,question.questionGUID )
		 		.replace(PLACEHOLDER_VALUE,question.feedback)
	 		);
	 		(questionFeedback).find(':input').on('change keyup', function(e) { onInputChange(e) });
	 		updateCharacterLimit( (questionFeedback).find(':input') );
	 		questionContainer.append(questionFeedback);
	 		
	 		//if multiple select, add points at question level
	 		if(questionType === QUESTION_TYPE_MULTIPLE_SELECT) {
	 			createMultipleSelectPoints(question,questionContainer);	
	 		}
	 		
//	 		var questionTypeRadioGroup = $( QUESTION_TYPE_RADIO_GROUP_TEMPLATE_TOOLS
//		 		.replace(/PLACEHOLDER_QUESTION_QUESTION_GUID/g,question.questionGUID)
//		 		.replace(PLACEHOLDER_CHECKBOX_QUESTION_TYPE_MULTIPLE_CHOICE_CHECKED,(question.questionType === QUESTION_TYPE_MULTIPLE_CHOICE ? 'checked' : ''))
//		 		.replace(PLACEHOLDER_CHECKBOX_QUESTION_TYPE_MULTIPLE_SELECT_CHECKED,(question.questionType === QUESTION_TYPE_MULTIPLE_SELECT ? 'checked' : ''))
//		 		.replace(PLACEHOLDER_CHECKBOX_QUESTION_TYPE_FILL_IN_THE_BLANK_CHECKED,(question.questionType === QUESTION_TYPE_FILL_IN_THE_BLANK ? 'checked' : ''))
//		 		.replace(PLACEHOLDER_CHECKBOX_QUESTION_TYPE_EXPERT_RESPONSE_CHECKED,(question.questionType === QUESTION_TYPE_EXPERT_RESPONSE ? 'checked' : ''))
//		 	);
//		 	questionContainer.append(questionTypeRadioGroup);
	 		
	 		var randomizeAnswersCheckbox = $( RANDOMIZE_ANSWERS_TEMPLATE_TOOLS 
		 		.replace(/PLACEHOLDER_QUESTION_QUESTION_GUID/g,question.questionGUID)
		 		.replace(PLACEHOLDER_CHECKBOX_CHECKED,(question.randomizeAnswers === true ? 'checked' : ''))
	 		);
		 	questionContainer.append(randomizeAnswersCheckbox);
	 		
		 	var questionType = $( QUESTION_TYPE_TEMPLATE_TOOLS
		 		.replace(/PLACEHOLDER_QUESTION_QUESTION_GUID/g,question.questionGUID)
		 		.replace(/PLACEHOLDER_VALUE/g,question.questionType)
		 		.replace(PLACEHOLDER_DISPLAY,questionTypeDisplay)
	 		);
	 		questionContainer.append(questionType);
	 		 		
		 	//IMAGES
		 	if(question.images != undefined && question.images.length > 0)  {
	 			if( $(questionContainer).find('.imagesContainerTools').length === 0 ) {
		 			createImagesContainer( questionContainer );
	 			}
	 			
	 			$.each(question.images, function(z,images) {
	 				createImage( questionContainer, images );	
	 			});
	 			//$(imagesAddButton).hide();
	 		}
	 		
	 		//else doesn't have images 
	 		else {
	 			if( $(questionContainer).find('.imagesContainerTools').length > 0 ) {
	 				$(questionContainer).find('.imagesContainerTools').remove();
	 				//$(imagesAddButton).show();
	 			}
	 		}
		 	
		 	//VIDEOS
		 	if(question.videos != undefined && question.videos.length > 0)  {
	 			if( $(questionContainer).find('.videosContainerTools').length === 0 ) {
			 		//$(videosAddButton).css('display','none');
		 			createVideosContainer( questionContainer );
	 			}
	 			
	 			$.each(question.videos, function(z,video) {
	 				createVideo( questionContainer, video );	
	 			});
	 			//$(videosAddButton).hide();
	 		}
	 		
	 		//else doesn't have videos 
	 		else {
	 			if( $(questionContainer).find('.videosContainerTools').length > 0 ) {
	 				$(questionContainer).find('.videosContainerTools').remove();
	 				//$(videosAddButton).show();
	 			}
	 		}
	 		
	 		//AUDIOS
		 	if(question.audios != undefined && question.audios.length > 0)  {
	 			if( $(questionContainer).find('.audiosContainerTools').length === 0 ) {
		 			createAudiosContainer( questionContainer );
	 			}
	 			
	 			$.each(question.audios, function(z,audio) {
	 				createAudio( questionContainer, audio );	
	 			});
	 			//$(audiosAddButton).hide();
	 		}
	 		
	 		//else doesn't have audios 
	 		else {
	 			if( $(questionContainer).find('.audiosContainerTools').length > 0 ) {
	 				$(questionContainer).find('.audiosContainerTools').remove();
	 				//$(audiosAddButton).show();
	 			}
	 		}
		 	
		 	var answersContainer = $(ANSWERS_CONTAINER_TEMPLATE_TOOLS);
		 	
		 	questionContainer.append(answersContainer);
	 		questionContainer.append(answerAddButton);

	 	} //end if multiple choice question
	 	
	 	else if(questionType === QUESTION_TYPE_FILL_IN_THE_BLANK) {
//	 		cl(question);
	 		var questionDeleteButton = $(
	 			QUESTION_DELETE_BUTTON
			).on('click', function(e) {
				onDeleteQuestionClick(e);	
			}).modaal({
				type:'inline',
				animation:'fade',
				after_close: onAfterModalClose,
				should_open: false,
				hide_close: true
			});
	 		questionContainer.append(questionDeleteButton);
	 		
	 		var answerAddCorrectButton = $(
	 			ANSWER_ADD_CORRECT_BUTTON
	 		).on('click', function(e) {
				onAddCorrectAnswerClick(e);	
			}).modaal({
				type:'inline',
				animation:'fade',
				after_close: onAfterModalClose,
				hide_close: true
			});
	 		questionContainer.append(answerAddCorrectButton);
	 		
	 		var videosAddButton = $(
	 			ADD_VIDEOS_BUTTON
	 		).on('click', function(e) {
				onAddVideosClick(e);	
			});
			
			var audiosAddButton = $(
	 			ADD_AUDIOS_BUTTON
	 		).on('click', function(e) {
				onAddAudiosClick(e);	
			});
			
			questionContainer.append(audiosAddButton);
			
			questionContainer.append(videosAddButton);
	 		
			//order
			var questionOrder = $( QUESTION_ORDER_TEMPLATE_TOOLS
		 		.replace(/PLACEHOLDER_QUESTION_TEXT_GUID_TOOLS/g,question.questionGUID )
		 		.replace(PLACEHOLDER_VALUE,question.questionOrder != undefined && question.questionOrder.length > 0  ? question.questionOrder : getQuestionOrder())		 		
	 		);
	 		(questionOrder).find(':input').on('change keyup', function(e) { onInputChange(e) });
	 		questionContainer.append(questionOrder);
			
	 		//text
	 		var questionText = $( QUESTION_TEXT_TEMPLATE_TOOLS
		 		.replace(/PLACEHOLDER_QUESTION_TEXT_GUID_TOOLS/g,question.questionGUID )
		 		.replace(PLACEHOLDER_VALUE,question.questionText)
	 		);
	 		(questionText).find(':input').on('change keyup', function(e) { onInputChange(e) });
	 		updateCharacterLimit( (questionText).find(':input') );
	 		questionContainer.append(questionText);
	 		
	 		//competency
	 		/*var questionCompetency = $( QUESTION_COMPETENCY_TEMPLATE_TOOLS
		 		.replace(/PLACEHOLDER_QUESTION_TEXT_GUID_TOOLS/g,question.questionGUID )
		 		.replace(PLACEHOLDER_VALUE,question.competency)
	 		);
	 		(questionCompetency).find(':input').on('change keyup', function(e) { onInputChange(e) });
	 		updateCharacterLimit( (questionCompetency).find(':input') );
	 		questionContainer.append(questionCompetency);
	 		*/
//	 		var questionTypeRadioGroup = $( QUESTION_TYPE_RADIO_GROUP_TEMPLATE_TOOLS
//		 		.replace(/PLACEHOLDER_QUESTION_QUESTION_GUID/g,question.questionGUID)
//		 		.replace(PLACEHOLDER_CHECKBOX_QUESTION_TYPE_MULTIPLE_CHOICE_CHECKED,(question.questionType === QUESTION_TYPE_MULTIPLE_CHOICE ? 'checked' : ''))
//		 		.replace(PLACEHOLDER_CHECKBOX_QUESTION_TYPE_MULTIPLE_SELECT_CHECKED,(question.questionType === QUESTION_TYPE_MULTIPLE_SELECT ? 'checked' : ''))
//		 		.replace(PLACEHOLDER_CHECKBOX_QUESTION_TYPE_FILL_IN_THE_BLANK_CHECKED,(question.questionType === QUESTION_TYPE_FILL_IN_THE_BLANK ? 'checked' : ''))
//		 		.replace(PLACEHOLDER_CHECKBOX_QUESTION_TYPE_EXPERT_RESPONSE_CHECKED,(question.questionType === QUESTION_TYPE_EXPERT_RESPONSE ? 'checked' : ''))
//		 	);
//		 	questionContainer.append(questionTypeRadioGroup);
	 		
	 		var questionType = $( QUESTION_TYPE_TEMPLATE_TOOLS
		 		.replace(/PLACEHOLDER_QUESTION_QUESTION_GUID/g,question.questionGUID)
		 		.replace(/PLACEHOLDER_VALUE/g,question.questionType)
		 		.replace(PLACEHOLDER_DISPLAY,questionTypeDisplay)
	 		);
	 		questionContainer.append(questionType);
	 		
	 		//VIDEOS
		 	if(question.videos != undefined && question.videos.length > 0)  {
	 			if( $(questionContainer).find('.videosContainerTools').length === 0 ) {
			 		//$(videosAddButton).css('display','none');
		 			createVideosContainer( questionContainer );
	 			}
	 			
	 			$.each(question.videos, function(z,video) {
	 				createVideo( questionContainer, video );	
	 			});
	 			$(videosAddButton).hide();
	 		}
	 		
	 		//else doesn't have videos 
	 		else {
	 			if( $(questionContainer).find('.videosContainerTools').length > 0 ) {
	 				$(questionContainer).find('.videosContainerTools').remove();
	 				$(videosAddButton).show();
	 			}
	 		}
	 		
	 		//AUDIOS
		 	if(question.audios != undefined && question.audios.length > 0)  {
	 			if( $(questionContainer).find('.audiosContainerTools').length === 0 ) {
		 			createAudiosContainer( questionContainer );
	 			}
	 			
	 			$.each(question.audios, function(z,audio) {
	 				createAudio( questionContainer, audio );	
	 			});
	 			$(audiosAddButton).hide();
	 		}
	 		
	 		//else doesn't have audios 
	 		else {
	 			if( $(questionContainer).find('.audiosContainerTools').length > 0 ) {
	 				$(questionContainer).find('.audiosContainerTools').remove();
	 				$(audiosAddButton).show();
	 			}
	 		}
	 		
	 		var correctAnswers = getCorrectFillInTheBlankAnswersByQuestionGUID(question.questionGUID);
	 		
	 		var correctAnswersContainer = $(ANSWERS_CONTAINER_CORRECT_ANSWERS_TEMPLATE_TOOLS);
	 		
	 		$.each(correctAnswers,
	 			function(i,correctAnswer) {
	 				//container for correct answer
					//var correctAnswerContainer = $(ANSWER_CONTAINER_CORRECT_ANSWER_TEMPLATE_TOOLS
		 			//	.replace(PLACEHOLDER_ANSWER_DATA_ANSWER_GUID,correctAnswer.answerGUID)
		 			//);
		 			
		 			//build correct answer
		 			//TODO: can just call createAnswer?
		 			var correctAnswerContainer = createAnswer(correctAnswer);
		 			correctAnswersContainer.append(correctAnswerContainer);
	 			}
 			);
 			
 			var incorrectAnswer = getIncorrectFillInTheBlankAnswerByQuestionGUID(question.questionGUID);
 			//if no incorrect answer (creating new), create one
 			if(incorrectAnswer === undefined) {
 				incorrectAnswer = {
			 					"answerGUID":question.questionGUID.replace('question','answer')+"_incorrect",
			 					"points":0,
			 					"isCorrect":false,
			 					"feedback":""
			 					};
 			}
 			
 			var incorrectAnswersContainer = $(ANSWERS_CONTAINER_INCORRECT_ANSWERS_TEMPLATE_TOOLS);
 			//only one
 			var incorrectAnswerContainer = createAnswer(incorrectAnswer,question);
 			//TODO: refactor
 			if(incorrectAnswerContainer.questionText === undefined) {
 				incorrectAnswerContainer.questionText = "";
 			}
 			if(incorrectAnswerContainer.questionType === undefined) {
 				incorrectAnswerContainer.questionType = QUESTION_TYPE_FILL_IN_THE_BLANK;	
 			}
 			//if(incorrectAnswerContainer.competency === undefined) {
 			//	incorrectAnswerContainer.competency = "";	
 			//}
		 	incorrectAnswersContainer.append(incorrectAnswerContainer);
 			
 			
	 	} //end if fill in the blank question type
	 	
	 	else if(questionType === QUESTION_TYPE_EXPERT_RESPONSE) {
			var questionDeleteButton = $(
	 			QUESTION_DELETE_BUTTON
			).on('click', function(e) {
				onDeleteQuestionClick(e);	
			}).modaal({
				type:'inline',
				animation:'fade',
				after_close: onAfterModalClose,
				should_open: false,
				hide_close: true
			});
	 		questionContainer.append(questionDeleteButton);
	 		
	 		var videosAddButton = $(
	 			ADD_VIDEOS_BUTTON
	 		).on('click', function(e) {
				onAddVideosClick(e);	
			});
			
			var audiosAddButton = $(
	 			ADD_AUDIOS_BUTTON
	 		).on('click', function(e) {
				onAddAudiosClick(e);	
			});
			
			questionContainer.append(audiosAddButton);
			
			questionContainer.append(videosAddButton);
	 		
			//order
			var questionOrder = $( QUESTION_ORDER_TEMPLATE_TOOLS
		 		.replace(/PLACEHOLDER_QUESTION_TEXT_GUID_TOOLS/g,question.questionGUID )
		 		.replace(PLACEHOLDER_VALUE,question.questionOrder != undefined && question.questionOrder.length > 0  ? question.questionOrder : getQuestionOrder())		 		
	 		);
	 		(questionOrder).find(':input').on('change keyup', function(e) { onInputChange(e) });
	 		questionContainer.append(questionOrder);
			
	 		//text
	 		var questionText = $( QUESTION_TEXT_TEMPLATE_TOOLS
		 		.replace(/PLACEHOLDER_QUESTION_TEXT_GUID_TOOLS/g,question.questionGUID )
		 		.replace(PLACEHOLDER_VALUE,question.questionText)
	 		);
	 		(questionText).find(':input').on('change keyup', function(e) { onInputChange(e) });
	 		updateCharacterLimit( (questionText).find(':input') );
	 		questionContainer.append(questionText);
	 		
	 		//competency
	 		/*var questionCompetency = $( QUESTION_COMPETENCY_TEMPLATE_TOOLS
		 		.replace(/PLACEHOLDER_QUESTION_TEXT_GUID_TOOLS/g,question.questionGUID )
		 		.replace(PLACEHOLDER_VALUE,question.competency)
	 		);
	 		(questionCompetency).find(':input').on('change keyup', function(e) { onInputChange(e) });
	 		updateCharacterLimit( (questionCompetency).find(':input') );
	 		questionContainer.append(questionCompetency);
	 		*/
//	 		var questionTypeRadioGroup = $( QUESTION_TYPE_RADIO_GROUP_TEMPLATE_TOOLS
//		 		.replace(/PLACEHOLDER_QUESTION_QUESTION_GUID/g,question.questionGUID)
//		 		.replace(PLACEHOLDER_CHECKBOX_QUESTION_TYPE_MULTIPLE_CHOICE_CHECKED,(question.questionType === QUESTION_TYPE_MULTIPLE_CHOICE ? 'checked' : ''))
//		 		.replace(PLACEHOLDER_CHECKBOX_QUESTION_TYPE_MULTIPLE_SELECT_CHECKED,(question.questionType === QUESTION_TYPE_MULTIPLE_SELECT ? 'checked' : ''))
//		 		.replace(PLACEHOLDER_CHECKBOX_QUESTION_TYPE_FILL_IN_THE_BLANK_CHECKED,(question.questionType === QUESTION_TYPE_FILL_IN_THE_BLANK ? 'checked' : ''))
//		 		.replace(PLACEHOLDER_CHECKBOX_QUESTION_TYPE_EXPERT_RESPONSE_CHECKED,(question.questionType === QUESTION_TYPE_EXPERT_RESPONSE ? 'checked' : ''))
//		 	);
//		 	questionContainer.append(questionTypeRadioGroup);
	 		
	 		var questionType = $( QUESTION_TYPE_TEMPLATE_TOOLS
		 		.replace(/PLACEHOLDER_QUESTION_QUESTION_GUID/g,question.questionGUID)
		 		.replace(/PLACEHOLDER_VALUE/g,question.questionType)
		 		.replace(PLACEHOLDER_DISPLAY,questionTypeDisplay)
	 		);
	 		questionContainer.append(questionType);
	 		
	 		//VIDEOS
		 	if(question.videos != undefined && question.videos.length > 0)  {
	 			if( $(questionContainer).find('.videosContainerTools').length === 0 ) {
			 		//$(videosAddButton).css('display','none');
		 			createVideosContainer( questionContainer );
	 			}
	 			
	 			$.each(question.videos, function(z,video) {
	 				createVideo( questionContainer, video );	
	 			});
	 			$(videosAddButton).hide();
	 		}
	 		
	 		//else doesn't have videos 
	 		else {
	 			if( $(questionContainer).find('.videosContainerTools').length > 0 ) {
	 				$(questionContainer).find('.videosContainerTools').remove();
	 				$(videosAddButton).show();
	 			}
	 		}
	 		
	 		//AUDIOS
		 	if(question.audios != undefined && question.audios.length > 0)  {
	 			if( $(questionContainer).find('.audiosContainerTools').length === 0 ) {
		 			createAudiosContainer( questionContainer );
	 			}
	 			
	 			$.each(question.audios, function(z,audio) {
	 				createAudio( questionContainer, audio );	
	 			});
	 			$(audiosAddButton).hide();
	 		}
	 		
	 		//else doesn't have audios 
	 		else {
	 			if( $(questionContainer).find('.audiosContainerTools').length > 0 ) {
	 				$(questionContainer).find('.audiosContainerTools').remove();
	 				$(audiosAddButton).show();
	 			}
	 		}
	 		
	 		//TODO : refactor
	 		//if newly created, add answer
	 		if(question.answers.length === 0) {
	 			var newAnswer = {
	 				"answerGUID":question.questionGUID.replace('question','answer')+"_0",
			 		"points":0,
			 		"feedback":""
	 			}
	 			question.answers.push(newAnswer);
	 		}
	 		
	 		
	 		//points for completion
	 		var points = $( 
	 			EXPERT_RESPONSE_POINTS_TEMPLATE_TOOLS
	 			.replace(/PLACEHOLDER_ANSWER_TEXT_GUID_TOOLS/g,question.questionGUID)
	 			.replace(PLACEHOLDER_VALUE,(question.answers[0].points != undefined ? question.answers[0].points : 0))
	 		);
	 		questionContainer.append(points);
	 		
	 		//feedback
	 		var feedback = $( 
	 			EXPERT_RESPONSE_FEEDBACK_TEMPLATE_TOOLS
	 			.replace(/PLACEHOLDER_ANSWER_TEXT_GUID_TOOLS/g,question.questionGUID)
	 			.replace(PLACEHOLDER_VALUE,(question.feedback != undefined ? question.feedback : ''))
	 		);
	 		(feedback).find(':input').on('change keyup', function(e) { onInputChange(e) });
	 		updateCharacterLimit( (feedback).find(':input') );
	 		questionContainer.append(feedback);
	 		
	 		//var answersContainer = $(ANSWERS_CONTAINER_TEMPLATE_TOOLS);
		 	//questionContainer.append(answersContainer);
	 		
	 	} //end question type expert response
	 	
	 	
	 	
	 	//error handling: no matching question type
	 	else {
	 		console.log('unable to render: questionType of '+questionType+' not handled');
	 	}
	 	questionContainer.append(correctAnswersContainer);
	 	questionContainer.append(incorrectAnswersContainer);
	 	setFeedbackType();
	 	setDirty(true);
	 	
	 	return questionContainer;
	 	
		
	}
	
	function createQuestionGroup(questionGroup) {
		var questionGroupContainer = $( QUESTION_GROUP_CONTAINER_TEMPLATE.replace(PLACEHOLDER_QUESTION_GROUP_GUID,questionGroup.questionGroupGUID) );
		//delete question group
 		var questionGroupDeleteButton =  $(
 			QUESTION_GROUP_DELETE_BUTTON
		).on('click', function(e) {
			onDeleteQuestionGroupClick(e);	
		}).modaal({
			type:'inline',
			animation:'fade',
			after_close: onAfterModalClose,
			hide_close: true
		});
 		
 		
 		//bind new button events
 		
		questionGroupContainer.find('.btnDeleteQuestionGroup').modaal({
			type:'inline',
			animation:'fade',
			after_close: onAfterModalClose,
			hide_close: true
		});
		
		questionGroupContainer.find('.btnDeleteQuestionGroup').on('click', function(e) {
			onDeleteQuestionGroupClick(e);	
		});
	 	questionGroupContainer.append(questionGroupDeleteButton);

		 		
 		var questionAddButton = $(
 			QUESTION_ADD_BUTTON
 		).on('click', function(e) {
			onAddQuestionClick(e);	
		}).modaal({
			type:'inline',
			animation:'fade',
			after_close: onAfterModalClose,
			hide_close: true
		});
 		
 		
 		questionGroupContainer.find('.btnAddQuestion').modaal({
			type:'inline',
			animation:'fade',
			after_close: onAfterModalClose,
			hide_close: true
		});
		
		questionGroupContainer.find('.btnAddQuestion').on('click', function(e) {
			onAddQuestionClick(e);	
		});
		
		var randomizeQuestionsCheckbox = $( RANDOMIZE_QUESTIONS_TEMPLATE_TOOLS 
	 		.replace(/PLACEHOLDER_QUESTION_GROUP_GUID/g,questionGroup.questionGroupGUID)
 			.replace(PLACEHOLDER_CHECKBOX_CHECKED,(questionGroup.randomizeQuestions === true ? 'checked' : ''))
 		);
 		
 		questionGroupContainer.append(randomizeQuestionsCheckbox);
		
		var questionGroupTitle = $(
			QUESTION_GROUP_TITLE_TEMPLATE_TOOLS
			.replace(/PLACEHOLDER_QUESTION_GROUP_TITLE_GUID_TOOLS/g,questionGroup.questionGroupGUID+'-title')
			.replace(PLACEHOLDER_VALUE,questionGroup.questionGroupTitle)
		);
		(questionGroupTitle).find(':input').on('change keyup', function(e) { onInputChange(e) });
	 	updateCharacterLimit( (questionGroupTitle).find(':input') );
	 	
		questionGroupContainer.append(questionGroupTitle);
		var questionGroupDescription = $(
			QUESTION_GROUP_DESCRIPTION_TEMPLATE_TOOLS
			.replace(/PLACEHOLDER_QUESTION_GROUP_DESCRIPTION_GUID_TOOLS/g,questionGroup.questionGroupGUID+'-description')
			.replace(PLACEHOLDER_VALUE,questionGroup.questionGroupDescription)
		);
		(questionGroupDescription).find(':input').on('change keyup', function(e) { onInputChange(e) });
	 	updateCharacterLimit( (questionGroupDescription).find(':input') );
		questionGroupContainer.append(questionGroupDescription);
		
		//competency
 		var questionGroupCompetency = $( QUESTION_GROUP_COMPETENCY_TEMPLATE_TOOLS
	 		.replace(/PLACEHOLDER_QUESTION_GROUP_COMPETENCY_GUID_TOOLS/g,questionGroup.questionGroupGUID )
	 		.replace(PLACEHOLDER_VALUE,questionGroup.questionGroupCompetency)
 		);
 		(questionGroupCompetency).find(':input').on('change keyup', function(e) { onInputChange(e) });
 		updateCharacterLimit( (questionGroupCompetency).find(':input') );
 		questionGroupContainer.append(questionGroupCompetency);
	 		
	 	var questionsContainer = $(QUESTIONS_CONTAINER_TEMPLATE_TOOLS);
	 	
	 	questionGroupContainer.append(questionsContainer);
	 	
	 	questionGroupContainer.append(questionAddButton);
	 	
	 	setDirty(true);
	 	
	 	return questionGroupContainer;
		
	}
	
	function createImagesContainer(container) {
		cl('createImagesContainer');
		$(container).find('.btnAddImages').hide();
		
		//images container
 		var imagesContainer = $( 
 			IMAGES_CONTAINER_TOOLS
 		);
 		
 		var deleteImagesButton = $(
 			DELETE_IMAGES_BUTTON
 		).on('click', function(e) {
			onDeleteImagesClick(e);	
		});
		
 		imagesContainer.append(deleteImagesButton);
 		
 		var addImageButton = $(
 			ADD_IMAGE_BUTTON
 		).on('click', function(e) {
			onAddImageClick(e);	
		});
 		imagesContainer.append(addImageButton);
	 		
 		imagesContainer.insertAfter( $(container).find('.checkbox-group:first') );
 		
 		setDirty(true);
		
	}
	
	function createVideosContainer(container) {
		cl('createVideosContainer');
		$(container).find('.btnAddVideos').hide();
		
		//videos container
 		var videosContainer = $( 
 			VIDEOS_CONTAINER_TOOLS
 		);
 		
 		var deleteVideosButton = $(
 			DELETE_VIDEOS_BUTTON
 		).on('click', function(e) {
			onDeleteVideosClick(e);	
		});
		
 		videosContainer.append(deleteVideosButton);
 		
 		var addVideoButton = $(
 			ADD_VIDEO_BUTTON
 		).on('click', function(e) {
			onAddVideoClick(e);	
		});
 		videosContainer.append(addVideoButton);
	 		
 		videosContainer.insertAfter( $(container).find('.checkbox-group:first') );
 		
 		setDirty(true);
		
	}
	
	function createAudiosContainer(container) {
		cl('createAudiosContainer');
		$(container).find('.btnAddAudios').hide();
		
		//audios container
 		var audiosContainer = $( 
 			AUDIOS_CONTAINER_TOOLS
 		);
 		
 		var deleteAudiosButton = $(
 			DELETE_AUDIOS_BUTTON
 		).on('click', function(e) {
			onDeleteAudiosClick(e);	
		});
		
 		audiosContainer.append(deleteAudiosButton);
 		
 		var addAudioButton = $(
 			ADD_AUDIO_BUTTON
 		).on('click', function(e) {
			onAddAudioClick(e);	
		});
 		audiosContainer.append(addAudioButton);
	 		
 		audiosContainer.insertAfter( $(container).find('.checkbox-group:first') );
 		
 		setDirty(true);
		
	}
	
	function createAudio(container,audio) {
		var audiosContainer = $(container).find('.audiosContainerTools');
		var containerGUID = $(container).attr('id');
 		var audioContainer = $( 
 			AUDIO_CONTAINER_TOOLS
 		);
 		
 		var deleteAudioButton = $(
 			DELETE_AUDIO_BUTTON
 		).on('click', function(e) {
			onDeleteAudioClick(e);	
		});
		
		audioContainer.append(deleteAudioButton);
 		
 		
 		var audioTitle = $(
 			AUDIO_TITLE_TEMPLATE_TOOLS
 			.replace(/PLACEHOLDER_GUID_TOOLS/g,containerGUID)
 			.replace(PLACEHOLDER_VALUE,audio.title)
 		);
 		
 		audioContainer.append(audioTitle);
 		
		var audioSubtitle = $(
 			AUDIO_SUBTITLE_TEMPLATE_TOOLS
 			.replace(/PLACEHOLDER_GUID_TOOLS/g,containerGUID)
 			.replace(PLACEHOLDER_VALUE,audio.subtitle)
 		);
 		
 		audioContainer.append(audioSubtitle);
 		
 		var audioURL = $(
 			AUDIO_URL_TEMPLATE_TOOLS
 			.replace(/PLACEHOLDER_GUID_TOOLS/g,containerGUID)
 			.replace(PLACEHOLDER_VALUE,audio.audioURL)
 		);
 		
 		audioContainer.append(audioURL);
 		
 		var audioTranscriptText = $(
 			AUDIO_TRANSCRIPT_TEXT_TEMPLATE_TOOLS
 			.replace(/PLACEHOLDER_GUID_TOOLS/g,containerGUID)
 			.replace(PLACEHOLDER_VALUE,audio.transcriptText)
		);
 		audioContainer.append(audioTranscriptText);
 		
 		
		$(audiosContainer).append(audioContainer);
		
		setDirty(true);
		
	}
	
	function createImage(container,image) {
		var imagesContainer = $(container).find('.imagesContainerTools');
		var containerGUID = $(container).attr('id');
 		var imageContainer = $( 
 			IMAGE_CONTAINER_TOOLS
 		);
 		
 		var deleteImageButton = $(
 			DELETE_IMAGE_BUTTON
 		).on('click', function(e) {
			onDeleteImageClick(e);	
		});
		
		imageContainer.append(deleteImageButton);
 		
 		
 		var imageTitle = $(
 			IMAGE_TITLE_TEMPLATE_TOOLS
 			.replace(/PLACEHOLDER_GUID_TOOLS/g,containerGUID)
 			.replace(PLACEHOLDER_VALUE,image.title)
 		);
 		
 		imageContainer.append(imageTitle);
 		
		var imageSubtitle = $(
 			IMAGE_SUBTITLE_TEMPLATE_TOOLS
 			.replace(/PLACEHOLDER_GUID_TOOLS/g,containerGUID)
 			.replace(PLACEHOLDER_VALUE,image.subtitle)
 		);
 		
 		imageContainer.append(imageSubtitle);
 		
 		var imageURL = $(
 			IMAGE_URL_TEMPLATE_TOOLS
 			.replace(/PLACEHOLDER_GUID_TOOLS/g,containerGUID)
 			.replace(PLACEHOLDER_VALUE,image.imageURL)
 		);
 		
 		imageContainer.append(imageURL);
 		
 		var imageAltText = $(
 			IMAGE_ALT_TEXT_TEMPLATE_TOOLS
 			.replace(/PLACEHOLDER_GUID_TOOLS/g,containerGUID)
 			.replace(PLACEHOLDER_VALUE,image.altText)
 		);
 		
 		imageContainer.append(imageAltText);
 		
 		var imageWidth = $(
 			IMAGE_WIDTH_TEMPLATE_TOOLS
 			.replace(/PLACEHOLDER_GUID_TOOLS/g,containerGUID)
 			.replace(PLACEHOLDER_VALUE,image.settings.width)
 		);
 		
 		imageContainer.append(imageWidth);
 		
 		var imageHeight = $(
 			IMAGE_HEIGHT_TEMPLATE_TOOLS
 			.replace(/PLACEHOLDER_GUID_TOOLS/g,containerGUID)
 			.replace(PLACEHOLDER_VALUE,image.settings.height)
 		);
 		
 		imageContainer.append(imageHeight);
 		
 		
		$(imagesContainer).append(imageContainer);
		
		setDirty(true);
		
	}
	
	
	function createVideo(container,video) {
		var videosContainer = $(container).find('.videosContainerTools');
		var containerGUID = $(container).attr('id');
 		var videoContainer = $( 
 			VIDEO_CONTAINER_TOOLS
 		);
 		
 		var deleteVideoButton = $(
 			DELETE_VIDEO_BUTTON
 		).on('click', function(e) {
			onDeleteVideoClick(e);	
		});
		
		videoContainer.append(deleteVideoButton);
 		
 		
 		var videoTitle = $(
 			VIDEO_TITLE_TEMPLATE_TOOLS
 			.replace(/PLACEHOLDER_GUID_TOOLS/g,containerGUID)
 			.replace(PLACEHOLDER_VALUE,video.title)
 		);
 		
 		videoContainer.append(videoTitle);
 		
		var videoSubtitle = $(
 			VIDEO_SUBTITLE_TEMPLATE_TOOLS
 			.replace(/PLACEHOLDER_GUID_TOOLS/g,containerGUID)
 			.replace(PLACEHOLDER_VALUE,video.subtitle)
 		);
 		
 		videoContainer.append(videoSubtitle);
 		
 		var videoURL = $(
 			VIDEO_URL_TEMPLATE_TOOLS
 			.replace(/PLACEHOLDER_GUID_TOOLS/g,containerGUID)
 			.replace(PLACEHOLDER_VALUE,video.videoURL)
 		);
 		
 		videoContainer.append(videoURL);
 		
 		var posterURL = $(
 			POSTER_URL_TEMPLATE_TOOLS
 			.replace(/PLACEHOLDER_GUID_TOOLS/g,containerGUID)
 			.replace(PLACEHOLDER_VALUE,video.posterURL)
 		);
 		
 		videoContainer.append(posterURL);
 		
 		var captionURL = $(
 			CAPTION_URL_TEMPLATE_TOOLS
 			.replace(/PLACEHOLDER_GUID_TOOLS/g,containerGUID)
 			.replace(PLACEHOLDER_VALUE,video.captionURL)
 		);
 		
 		videoContainer.append(captionURL);
 		
 		var videoWidth = $(
 			VIDEO_WIDTH_TEMPLATE_TOOLS
 			.replace(/PLACEHOLDER_GUID_TOOLS/g,containerGUID)
 			.replace(PLACEHOLDER_VALUE,video.settings.width)
 		);
 		
 		videoContainer.append(videoWidth);
 		
 		var videoHeight = $(
 			VIDEO_HEIGHT_TEMPLATE_TOOLS
 			.replace(/PLACEHOLDER_GUID_TOOLS/g,containerGUID)
 			.replace(PLACEHOLDER_VALUE,video.settings.height)
 		);
 		
 		videoContainer.append(videoHeight);
 		
 		
		$(videosContainer).append(videoContainer);
		
		setDirty(true);
		
	}
	
	
	//ADD
	function onAddQuestionGroupClick(e) {
		cl('onAddQuestionGroupClick');
		setDirty(true);
		onConfirmAddQuestionGroupClick(e);
	}
	
	function onConfirmAddQuestionGroupClick(e) {
		onConfirmAddQuestionGroup()
	}
	
	function onConfirmAddQuestionGroup() {
		var newGUID = "questionGroup"+(parseInt(getHighestQuestionGroupGUID()) + 1);
		var newQuestionGroup = {
			"questionGroupGUID":newGUID,
 			"questionGroupTitle":"",
 			"questionGroupDescription":"",
 			"questionGroupCompetency":"",
 			"randomizeQuestions":false
		}
		$('.quizContainer').append( createQuestionGroup(newQuestionGroup) );
		//currentQuestionGroupGUID = newGUID;
		//onConfirmAddQuestion();
		//currentQuestionGroupGUID = null;
		scrollToElement('#'+newGUID);
		setDirty(true);
	}
	
	function onAddQuestionClick(e) {
		cl('onAddQuestionClick');
		currentQuestionGroupGUID = $(e.currentTarget).closest('.questionGroupContainer').attr('id');
		setDirty(true);
	}
	
	//if answer is multiple choice or multiple select, when it updates (question added or removed), make sure it always has a selected correct answer
	function checkForQuestionHasCorrectAnswer(questionGUID) {
		var questionType = getQuestionTypeByQuestionGUID(questionGUID);
		var hasCorrectAnswer = false;
		if(questionType === QUESTION_TYPE_MULTIPLE_CHOICE || questionType === QUESTION_TYPE_MULTIPLE_SELECT) {
			//$(answerContainer).find('.answerIsCorrect').find(':input:first').is(':checked') ? true : false,	
			$('#'+questionGUID).find('.answerContainer').each( 
				function(i,answer) {
					if( $(answer).find('.answerIsCorrect').find(':input:first').is(':checked') ) {
						hasCorrectAnswer = true;
					}
				}
			);			
		}
		
		//if no answer is selected, select the first one
		if(!hasCorrectAnswer) {
			$('#'+questionGUID).find('.answerContainer:first').find('.answerIsCorrect').find(':input:first').prop('checked',true);
		}
	}
	
	function onConfirmAddQuestionClick(e) {
		cl('onConfirmAddQuestionClick');
		onConfirmAddQuestion();
	}
	
	function onConfirmAddQuestion() {
		//cl( $(e.target).parents('.modal-dialog').find('#addQuestionQuestionTypeSelect') );
		var questionType = $('#addQuestionQuestionTypeSelect').find(":selected").attr('value');
		var currentQuestionGroupGUIDNumber =  currentQuestionGroupGUID.replace('questionGroup','');
		var newGUID = "question"+currentQuestionGroupGUIDNumber+"_"+(parseInt(getHighestQuestionGUIDByQuestionGroupGUID(currentQuestionGroupGUID)) + 1);
		var newQuestion;
		if(questionType === QUESTION_TYPE_MULTIPLE_CHOICE || questionType === QUESTION_TYPE_MULTIPLE_SELECT) {
				newQuestion = {
					"questionGUID":newGUID,
		 			"questionText":"",//"text for "+newGUID,
		 			"questionType":questionType,
		 			//"competency":"",//competency for "+newGUID,
		 			"feedback":"",
		 			"randomizeAnswers":false,
		 			"answers": []
				}
			
		}
		else if(questionType === QUESTION_TYPE_FILL_IN_THE_BLANK) {
			newQuestion = {
				"questionGUID":newGUID,
	 			"questionText":"text for "+newGUID,
	 			"questionType":questionType,
	 			//"competency":"competency for "+newGUID,
	 			"randomizeAnswers":false,
	 			"answers": [],
	 			"correctAnswers":[],
	 			"incorrectAnswer":[]
			}	
		}
		else if(questionType === QUESTION_TYPE_EXPERT_RESPONSE) {
			newQuestion = {
					"questionGUID":newGUID,
		 			"questionText":"text for "+newGUID,
		 			"questionType":questionType,
		 			//"competency":"competency for "+newGUID,
		 			"randomizeAnswers":false,
		 			"answers": []
				}
		}
		//unhandled exception
		else {
			console.log('unable to create question for unhandled question type of: '+questionType);	
		}
		
		$('#'+currentQuestionGroupGUID).find('.questionsContainer').append( createQuestion(newQuestion) );
		currentQuestionGroupGUID = null;
		scrollToElement('#'+newGUID);
		//automatically add first answer
		currentQuestionGUID = newGUID;
		onConfirmAddAnswer();
		currentQuestionGUID = null;
		checkForQuestionHasCorrectAnswer(newGUID);
		$('#'+newGUID).closest('.questionsContainer').find('.emptyMSG:first').hide();
		setDirty(true);
	}
	
	
	function onAddAnswerClick(e) {
		cl('onAddAnswerClick');
		currentQuestionGUID = $(e.currentTarget).closest('.questionContainer').attr('id');
		onConfirmAddAnswerClick(e);
		setDirty(true);
	}
	
	function onAddImageClick(e) {
		cl('onAddImageClick');
		
		var newImage = {
			"title":"image title",
			"subtitle":"image subtitle",
			"imageURL":"images/my_image.png",
			"settings":{
				"width":"800",
				"height":"900"
			},			 				
			"altText":"image alt text",
		}
		
		setDirty(true);
		
		createImage( $(e.currentTarget).closest('.questionContainer'),newImage );
		
		
	}
	
	
	function onAddVideoClick(e) {
		cl('onAddVideoClick');
		//video container
		
		var newVideo = {
			"title":"video title",
			"subtitle":"video subtitle",
			"videoURL":"videos/my_video.mp4",
			"settings":{
				"width":"800",
				"height":"900"
			},			 				
			"posterURL":"images/my_video_poster.png",
			"captionURL":"captions/my_video_caption.vtt"	
		}
		
		createVideo( $(e.currentTarget).closest('.questionContainer'),newVideo );
		
		setDirty(true);
	}
	
	function onAddAudioClick(e) {
		cl('onAddAudioClick');
		//audio container
		
		var newAudio = {
			"title":"audio title",
			"subtitle":"audio subtitle",
			"audioURL":"audio/my_audio.mp3",
			"transcriptText":"audio transcript text"
		}
		
		createAudio( $(e.currentTarget).closest('.questionContainer'),newAudio );
		
		setDirty(true);
	}
	
	function onDeleteImageClick(e) {
		cl('onDeleteImageClick');
		$(e.currentTarget).closest('.imageContainerTools').remove();
		setDirty(true);
	}
	
	function onDeleteVideoClick(e) {
		cl('onDeleteVideoClick');
		$(e.currentTarget).closest('.videoContainerTools').remove();
		setDirty(true);
	}
	
	function onDeleteAudioClick(e) {
		cl('onDeleteAudioClick');
		$(e.currentTarget).closest('.audioContainerTools').remove();
		setDirty(true);
	}
	
	function onDeleteImagesClick(e) {
		cl('onDeleteImagesClick');
		$(e.currentTarget).closest('.questionContainer').find('.btnAddImages').show();
		$(e.currentTarget).closest('.questionContainer').find('.imagesContainerTools').remove();
		setDirty(true);
	}
	
	function onDeleteVideosClick(e) {
		cl('onDeleteVideosClick');
		$(e.currentTarget).closest('.questionContainer').find('.btnAddVideos').show();
		$(e.currentTarget).closest('.questionContainer').find('.videosContainerTools').remove();
		setDirty(true);
	}
	
	function onDeleteAudiosClick(e) {
		cl('onDeleteAudiosClick');
		$(e.currentTarget).closest('.questionContainer').find('.btnAddAudios').show();
		$(e.currentTarget).closest('.questionContainer').find('.audiosContainerTools').remove();
		setDirty(true);
	}
	
	//TODO merge below
	function onAddImagesClick(e) {
		createImagesContainer( $(e.currentTarget).closest('.questionContainer') );
		setDirty(true);
	}
	
	function onAddAnswerImagesClick(e) {
		createImagesContainer( $(e.currentTarget).closest('.answerContainer') );
		setDirty(true);
	}
	
	function onAddVideosClick(e) {
		createVideosContainer( $(e.currentTarget).closest('.questionContainer') );
		setDirty(true);
	}
	
	function onAddAnswerVideosClick(e) {
		createVideosContainer( $(e.currentTarget).closest('.answerContainer') );
		setDirty(true);
	}
	
	function onAddAudiosClick(e) {
		createAudiosContainer( $(e.currentTarget).closest('.questionContainer') );
		setDirty(true);
	}
	
	function onAddAnswerAudiosClick(e) {
		createAudiosContainer( $(e.currentTarget).closest('.answerContainer') );
		setDirty(true);
	}
	
	function onAddCorrectAnswerClick(e) {
		currentQuestionGUID = $(e.currentTarget).closest('.questionContainer').attr('id');
		setDirty(true);
		
	}
	
	function onConfirmAddAnswerClick(e) {
		onConfirmAddAnswer();
	}
	
	function onConfirmAddAnswer() {
		//get highest answerID in this question
		var currentQuestionGUIDNumber = currentQuestionGUID.replace('question','');
		var currentQuestionType = getQuestionTypeByQuestionGUID(currentQuestionGUID);
		var newGUID = "answer"+currentQuestionGUIDNumber+"_"+(parseInt(getHighestAnswerGUIDByQuestionGUID(currentQuestionGUID)) + 1);
		var newAnswer = {
			"answerGUID":newGUID,
			"answerText":"",//"text for "+newGUID,
			"isCorrect":false,
			"points":0,
			"feedback":""//"feedback for "+newGUID	
		}
		var newAnswerDOM = createAnswer(newAnswer);
		$('#'+currentQuestionGUID).find('.answersContainer').append( newAnswerDOM );
		//if ER, scroll to question, no answer appended to DOM
		if(currentQuestionType === QUESTION_TYPE_EXPERT_RESPONSE) {
			scrollToElement('#'+currentQuestionGUID);	
		}
		else {
			scrollToElement('#'+newGUID);
		}
		checkForQuestionHasCorrectAnswer(currentQuestionGUID);
		currentQuestionGUID = null;
		setFeedbackType();
		setDirty(true);
	}
	
	function onConfirmAddCorrectAnswerClick(e) {
		var currentQuestionGUIDNumber = currentQuestionGUID.replace('question','');
		var newGUID = "answer"+currentQuestionGUIDNumber+"_"+(parseInt(getHighestCorrectAnswerGUIDByQuestionGUID(currentQuestionGUID)) + 1);
		var newAnswer = {
			"answerGUID":newGUID,
			"answerText":"text for "+newGUID,
			"isCorrect":false,
			"points":0,
			"feedback":"feedback for "+newGUID	
		}
		$('#'+currentQuestionGUID).find('.answersContainer').append( createAnswer(newAnswer) );
		currentQuestionGUID = null;
		scrollToElement('#'+newGUID);
		setDirty(true);
	}
	
	function getHighestAnswerGUIDByQuestionGUID(questionGUID) {
		var currentHighestGUID = 0;
		var questionDOM = $('#'+questionGUID);
		$(questionDOM).find('.answerContainer').each(
			function(i,answerContainer) {
				var currentGUID = $(answerContainer).attr('id');
				currentGUID = currentGUID.substring(currentGUID.lastIndexOf("_") + 1);
				if(parseInt(currentGUID) > parseInt(currentHighestGUID)) {
					currentHighestGUID = currentGUID;	
				}
			}
		);
		setDirty(true);
		return currentHighestGUID;
		
	} //end getHighestAnswerGUIDByQuestionGUID
	
	function getHighestCorrectAnswerGUIDByQuestionGUID(questionGUID) {
		var currentHighestGUID = 0;
		var questionDOM = $('#'+questionGUID);
		$(questionDOM).find('.answersContainerCorrectAnswersTools').find('.answerContainer').each(
			function(i,answerContainer) {
				var currentGUID = $(answerContainer).attr('id');
				currentGUID = currentGUID.substring(currentGUID.lastIndexOf("_") + 1);
				if(parseInt(currentGUID) > parseInt(currentHighestGUID)) {
					currentHighestGUID = currentGUID;	
				}
			}
		);
		setDirty(true);
		return currentHighestGUID;
		
	} //end getHighestAnswerGUIDByQuestionGUID
	
	function getHighestQuestionGUIDByQuestionGroupGUID(questionGroupGUID) {
		var currentHighestGUID = 0;
		var questionGroupDOM = $('#'+questionGroupGUID);
		$(questionGroupDOM).find('.questionContainer').each(
			function(i,questionContainer) {
				var currentGUID = $(questionContainer).attr('id');
				currentGUID = currentGUID.substring(currentGUID.indexOf("_") + 1);
				if(parseInt(currentGUID) > parseInt(currentHighestGUID)) {
					currentHighestGUID = currentGUID;	
				}
			}
		);
		setDirty(true);
		cl('currentHighestGUID: '+currentHighestGUID);
		return currentHighestGUID;
		
	} //end getHighestQuestionGUIDByQuestionGroupGUID
	
	function getHighestQuestionGroupGUID() {
		var currentHighestGUID = 0;
		$('.questionGroupContainer').each(
			function(i,questionGroupContainer) {
				var currentGUID = $(questionGroupContainer).attr('id');
				currentGUID = currentGUID.replace('questionGroup','');
				if(parseInt(currentGUID) > parseInt(currentHighestGUID)) {
					currentHighestGUID = currentGUID;	
				}
			}
		);
		setDirty(true);
		return currentHighestGUID;
		
	} //end getHighestQuestionGroupGUID
	
	
	
	//DELETE 
	
	function onDeleteQuestionGroupClick(e) {
		currentQuestionGroupGUID = $(e.currentTarget).closest('.questionGroupContainer').attr('id');	
		setDirty(true);
	}
	
	function onConfirmDeleteQuestionGroup() {
		$('#'+currentQuestionGroupGUID).remove();
		currentQuestionGroupGUID = null;
		setDirty(true);	
		
	}
	
	function onConfirmDeleteQuestionGroupClick(e) {
		onConfirmDeleteQuestionGroup();
	}
	
	function onDeleteQuestionClick(e) {
		currentQuestionGUID = $(e.currentTarget).closest('.questionContainer').attr('id');
		//if no siblings, don't allow regular delete
		cl( $(e.currentTarget).closest('.questionContainer') );
		if( $(e.currentTarget).closest('.questionContainer').siblings('.questionContainer').length === 0 ) {
			$(e.currentTarget).attr('href','#modalDeleteOnlyQuestion');
		}
		//else allow regular delete
		else {
			$(e.currentTarget).attr('href','#modalDeleteQuestion');
		}
		$(e.currentTarget).data('modaal').options.should_open = true;
		$(e.currentTarget).modaal();
		setDirty(true);
	}
	
	function onConfirmDeleteQuestionClick(e) {
		onConfirmDeleteQuestion();
	}
	
	function onConfirmDeleteQuestion() {
		//needed for sort order update
		if(currentQuestionGroupGUID == undefined) {
			currentQuestionGroupGUID = $('#'+currentQuestionGUID).parents('.questionGroupContainer').attr('id');	
		}
		//currently don't need...if we are delete the last question, we auto-delete the question group
		//if($('#'+currentQuestionGUID).siblings('.questionContainer').length === 0) {
		//	$('#'+currentQuestionGUID).find('.emptyMSG:first').show();	
		//}
		$('#'+currentQuestionGUID).remove();
		updateQuestionOrder();
		//checkForQuestionHasCorrectAnswer(currentQuestionGUID);
		currentQuestionGUID = null;
		currentQuestionGroupGUID = null;
		setDirty(true);
	}
	
	function onAddAnswerAttemptClick(e) {
		var answerGUID = $(e.currentTarget).parents('.answerContainer').attr('id');
		var answerAttemptsContainer =  $(e.currentTarget).parents('.answerPointsAttemptsContainerTools');
		var newAttemptCount = getHighestAttemptCountByAnswerGUID(answerGUID) + 1;
		if( newAttemptCount == 0) {
			newAttemptCount = 1;	
		}
		var attempt = {
			"attemptCount":newAttemptCount,
			"points":0
		}
		
		createAnswerAttempt(attempt,answerAttemptsContainer);
		setDirty(true);
		
	}
	
	function onAnswerAttemptAddAttemptScoringClick(e) {
		var answerGUID = $(e.currentTarget).parents('.answerContainer').attr('id');
		var answerContainer = $(e.currentTarget).parents('.answerContainer');
		var answer = getAnswerDataByAnswerGUID(answerGUID);
		$(answerContainer).find('.answerPointsTools').remove();
		createAnswerAttemptsContainer(answer,answerContainer);
		var answerAttemptsContainer =  $(answerContainer).find('.answerPointsAttemptsContainerTools');
		//add default
		var attempt = {
			'attemptCount':-1,
			'points':0
		}
		createAnswerAttempt(attempt,answerAttemptsContainer);
		
		$(answerContainer).find('.btnAddAnswerAttemptScoring').hide();
		setDirty(true);
	}
	
	function onAnswerAttemptRemoveAttemptScoringClick(e) {
		cl('onAnswerAttemptRemoveAttemptScoringClick');
		var answerGUID = $(e.currentTarget).parents('.answerContainer').attr('id');
		var answerContainer = $(e.currentTarget).parents('.answerContainer');
		var answerAttemptsContainer =  $(e.currentTarget).parents('.answerPointsAttemptsContainerTools');
		$(answerAttemptsContainer).remove();
		var answer = getAnswerDataByAnswerGUID(answerGUID);
		answer.points = 0;
		createAnswerPoints(answer,answerContainer,true);
		
		$(answerContainer).find('.btnAddAnswerAttemptScoring').show();
		setDirty(true);
		
		
	}
	
	function onDeleteAnswerAttemptClick(e) {
		//remove the last attempt count
		var answerGUID = $(e.currentTarget).parents('.answerContainer').attr('id');
		var answerAttemptsContainer =  $(e.currentTarget).parents('.answerPointsAttemptsContainerTools');
		var attemptToRemoveCount = getHighestAttemptCountByAnswerGUID(answerGUID);
		var attemptToRemove = getHighestAttemptDOMByAnswerGUID(answerGUID);
		if(attemptToRemoveCount === -1) {
			alert('cannot remove the default value');	
		}
		else {
			$(attemptToRemove).remove();
		}
		setDirty(true);
	}
	
	function onConfirmDeleteOnlyAnswerClick(e) {
		onConfirmDeleteOnlyAnswer();
	}
	
	function onConfirmDeleteOnlyAnswer() {
		//delete answer, then question
		currentQuestionGUID = $('#'+currentAnswerGUID).closest('.questionContainer').attr('id');
		onConfirmDeleteAnswer();
		onConfirmDeleteQuestion();
		currentAnswerGUID = null;
		currentQuestionGUID = null;
	}
	
	function onConfirmDeleteOnlyQuestionClick(e) {
		onConfirmDeleteOnlyQuestion();	
	}
	
	function onConfirmDeleteOnlyQuestion() {
		//delete the question(and all its answers), then question group
		//TODO: clean this up, consider passing all delete targets as params instead of scoping as member vars
		var tempCurrentQuestionGroupGUID = $('#'+currentQuestionGUID).closest('.questionGroupContainer').attr('id');
		onConfirmDeleteQuestion();
		currentQuestionGroupGUID= tempCurrentQuestionGroupGUID;
		onConfirmDeleteQuestionGroup();
		currentQuestionGUID = null;
		currentQuestionGroupGUID = null;
	}
	
	
	function onDeleteAnswerClick(e) {
		currentAnswerGUID = $(e.currentTarget).closest('.answerContainer').attr('id');
		//if no siblings, don't allow regular delete
		if( $(e.currentTarget).closest('.answerContainer').siblings().length === 0 ) {
			$(e.currentTarget).attr('href','#modalDeleteOnlyAnswer');
		}
		//else allow regular delete
		else {
			$(e.currentTarget).attr('href','#modalDeleteAnswer');
		}
		$(e.currentTarget).data('modaal').options.should_open = true;
		$(e.currentTarget).modaal();
		setDirty(true);
	}
	
	function onConfirmDeleteAnswerClick(e) {
		onConfirmDeleteAnswer();
	}
	
	function onConfirmDeleteAnswer() {
		$('#'+currentAnswerGUID).remove();
		checkForQuestionHasCorrectAnswer(getQuestionGUIDByAnswerGUID(currentAnswerGUID));
		currentAnswerGUID = null;
		
		setDirty(true);
	}
	
	function setDirty(state) {
		if(state === true) {
			isDirty = true;
			$('.btnSaveQuiz').removeClass('disabled');
		}
		else {
			isDirty = false;
			$('.btnSaveQuiz').addClass('disabled');
		}
	}
	
	//form validation and warning/error handling
	function validateData() {
		//TODO: externalize this...templates?
		var hasErrors = false;
		var errorMessage = '';
		var noErrorsMessage = 'No issues found.'
		//If > 100 questions in the quiz
		if( $('.questionContainerTools').length > 100) {
			errorMessage += 'You have '+ $('.questionContainerTools').length + ' questions in your quiz. It is recommended you have no more than 100.<br />';
			hasErrors = true;
		}
		//if > 25 questions in any given category
		$('.questionGroupContainer').each(
			function(i,questionGroup) {
				if( $(questionGroup).find('.questionContainerTools').length > 25) {
					errorMessage += 'You have '+  $(questionGroup).find('.questionContainerTools').length + ' questions in your question set titled '+
					$(questionGroup).find('.questionGroupTitleToolsText').find(':input:first').val()+' .'+					
					'It is recommended you have no more than 25.<br />';
					hasErrors = true;	
				}
			}
		);
		
		if(hasErrors) {
			$('.validateDataMessageContainer').html(errorMessage);
			$('.validateDataMessageContainer').show();
			$('.validateDataDialogHeader').show();
		}
		else {
			$('.validateDataMessageContainer').hide();
			$('.validateDataDialogHeader').hide();
			$('.validateDataMessageContainer').html(noErrorsMessage);	
		}
		
	}
	
	
}( window.quizToolCommon = window.quizToolCommon || {}, jQuery ));