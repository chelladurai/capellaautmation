//PLACEHOLDER VARS (replaced in app by actual vars at runtime

var PLACEHOLDER_QUESTION_GROUP_GUID = "PLACEHOLDER_QUESTION_GROUP_GUID";
var PLACEHOLDER_QUESTION_GROUP_TITLE = "PLACEHOLDER_QUESTION_GROUP_TITLE";
var PLACEHOLDER_QUESTION_GROUP_DESCRIPTION = "PLACEHOLDER_QUESTION_GROUP_DESCRIPTION";
var PLACEHOLDER_QUESTION_GROUP_COMPETENCY = "PLACEHOLDER_QUESTION_GROUP_COMPETENCY";
var PLACEHOLDER_QUESTION_TYPE = "PLACEHOLDER_QUESTIONS_TYPE";
var PLACEHOLDER_QUESTION_QUESTION_GUID = "PLACEHOLDER_QUESTION_QUESTIONS_GUID";
var PLACEHOLDER_QUESTION_QUESTION_TEXT = "PLACEHOLDER_QUESTION_QUESTION_TEXT";
var PLACEHOLDER_ANSWER_DATA_ANSWER_GUID = "PLACEHOLDER_ANSWER_DATA_ANSWER_GUID";
var PLACEHOLDER_QUESTION_QUESTION_GUID = "PLACEHOLDER_QUESTION_QUESTION_GUID";
var PLACEHOLDER_ANSWER_DATA_ANSWER_TEXT = "PLACEHOLDER_ANSWER_DATA_ANSWER_TEXT";
var PLACEHOLDER_ANSWER_DATA_FEEDBACK = "PLACEHOLDER_ANSWER_DATA_FEEDBACK";
var PLACEHOLDER_RESOURCE_RESOURCE_GUID = "PLACEHOLDER_RESOURCE_RESOURCE_GUID";
var PLACEHOLDER_RESOURCE_RESOURCE_TEXT = "PLACEHOLDER_RESOURCE_RESOURCE_TEXT";
//var PLACEHOLDER_ANSWER_DATA_ANSWER_GUID_TEXT_ENTRY = "PLACEHOLDER_ANSWER_DATA_ANSWER_GUID_TEXT_ENTRY";

var PLACEHOLDER_SECTION_ID_COUNT = "PLACEHOLDER_SECTION_ID_COUNT";
var PLACEHOLDER_QUESTION_NUMBER_OF_ATTEMPTS = "PLACEHOLDER_QUESTION_NUMBER_OF_ATTEMPTS";
var PLACEHOLDER_QUESTION_POINT_VALUE = "PLACEHOLDER_QUESTION_POINT_VALUE";

var PLACEHOLDER_QUESTION_FEEDBACK_TEXT = "PLACEHOLDER_QUESTION_FEEDBACK_TEXT";

var PLACEHOLDER_QUESTION_GROUP_FEEDBACK_TEXT = "PLACEHOLDER_QUESTION_GROUP_FEEDBACK_TEXT";

var PLACEHOLDER_ANSWER_LETTER = "PLACEHOLDER_ANSWER_LETTER";

var PLACEHOLDER_BANNER_TEXT = "PLACEHOLDER_BANNER_TEXT";

var PLACEHOLDER_QUESTION_NUMBER = "PLACEHOLDER_QUESTION_NUMBER";
var PLACEHOLDER_QUESTION_TOTAL_COUNT = "PLACEHOLDER_QUESTION_TOTAL_COUNT";

var PLACEHOLDER_QUESTION_CORRECT_ANSWER = "PLACEHOLDER_QUESTION_CORRECT_ANSWER";

var PLACEHOLDER_CATEGORY_SCORE_LABEL = "PLACEHOLDER_CATEGORY_SCORE_LABEL";
var PLACEHOLDER_CATEGORY_SCORE_PARENT_LABEL = "PLACEHOLDER_CATEGORY_SCORE_PARENT_LABEL";
var PLACEHOLDER_CATEGORY_SCORE_VALUE = "PLACEHOLDER_CATEGORY_SCORE_VALUE";
var PLACEHOLDER_CATEGORY_SCORE_PARENT_VALUE = "PLACEHOLDER_CATEGORY_SCORE_PARENT_VALUE";

var PLACEHOLDER_CATEGORY_SCORE_HEADER = "PLACEHOLDER_CATEGORY_SCORE_HEADER";
var PLACEHOLDER_CATEGORY_SCORE_EXPLANATION = "PLACEHOLDER_CATEGORY_SCORE_EXPLANATION";

var PLACEHOLDER_CATEGORY_NAME = "PLACEHOLDER_CATEGORY_NAME";
var PLACEHOLDER_CATEGORY_PARENT_NAME = "PLACEHOLDER_CATEGORY_PARENT_NAME";

//CONTAINER PARENTS (first things attached to DOM)
var QUESTIONS_CONTAINER_PARENT_TEMPLATE = '<div class="questionsContainerParent">'+
            '<div class="questionsContainer"></div>'+
        '</div>';
        
var QUESTIONS_CONTAINER_TEXT_RADIO_BUTTONS_PARENT_TEMPLATE = '<div class="questionsContainerParent">'+
            '<div class="questionsContainer textRadioButtonsContainer container"></div>'+
            '<hr/>'+
        '</div>';        
        
var RESOURCES_CONTAINER_PARENT_TEMPLATE = '<div class="resourcesContainerParent">'+
            '<div class="resourcesContainer"></div>'+
            '<hr/>'+
        '</div>'; 
        
var QUIZ_SCORE_CONTAINER_PARENT_TEMPLATE = '<div class="quizScoreContainerParent"></div>';

var QUIZ_BUTTONS_CONTAINER_TEMPLATE = '<div class="quizButtonsContainer button-group-justified">'+
            '<a class="btnResetQuiz button button-primary" href="#modalResetQuiz" disabled="disabled">Reset Activity</button>'+
            '<a class="btnSubmitQuiz button button-primary" href="#modalSubmitQuiz" disabled="disabled">Submit Activity</button>'+
            '<!-- <button class="btnHighlightUnansweredQuestions button button-primary" href="#">Highlight Unanswered Questions</button> -->'+
        '</div>';
        
// var QUIZ_FEEDBACK_CONTAINER_PARENT_TEMPLATE = '<div class="quizFeedbackContainerParent">'+
//             '<div class="quizFeedbackContainer"></div>'+
//             '<hr/>'+
//         '</div>'; 

var QUIZ_FEEDBACK_CONTAINER_PARENT_TEMPLATE = '<div class="quizFeedbackContainerParent">'+
            '<div class="congrats quizFeedbackHeader">Congratulations!</div>'+
            '<div class="quizFeedbackContainer">'+
            '<hr/>'+
            '</div>'+
        '</div>'; 
var PLACEHOLDER_QUIZ_INSTRUCTIONS_HEADER = "PLACEHOLDER_QUIZ_INSTRUCTIONS_HEADER";
var PLACEHOLDER_QUIZ_INSTRUCTIONS_DESCRIPTION = "PLACEHOLDER_QUIZ_INSTRUCTIONS_DESCRIPTION";
        
var QUIZ_INSTRUCTIONS_CONTAINER= '<div class="quizInstructionsContainer"></div>';
var QUIZ_INSTRUCTIONS_HEADER = '<div class="quizInstructionsHeader">'+PLACEHOLDER_QUIZ_INSTRUCTIONS_HEADER+'</div>';
var QUIZ_INSTRUCTIONS_DESCRIPTION = '<div class="quizInstructionsDescription">'+PLACEHOLDER_QUIZ_INSTRUCTIONS_DESCRIPTION+'</div>';

//TEMPLATE MARKUP (designers can manipulate this as needed without a developer)
var QUESTION_MULTIPLE_CHOICE_CHOOSE_TEXT_LABEL_TEMPATE = '<div class="chooseTextMultipleChoiceLabel">Choose one answer</div>';
var QUESTION_MULTIPLE_SELECT_CHOOSE_TEXT_LABEL_TEMPATE = '<div class="chooseTextMultipleSelectLabel">Choose ALL answers that apply</div>';
var QUESTION_BOILERPLATE_FEEDBACK_CONTAINER_TEMPLATE = '<div class="questionBoilerplateFeedbackContainer"></div>';
var QUESTION_MULTIPLE_CHOICE_BIOLERPLATE_FEEDBACK_CORRECT_TEMPLATE = '<div class="multipleChoiceBoilerplateFeedbackCorrect">Your answer is correct.</div>';
var QUESTION_MULTIPLE_CHOICE_BIOLERPLATE_FEEDBACK_INCORRECT_TEMPLATE = '<div class="multipleChoiceBoilerplateFeedbackIncorrect">Your answer is incorrect. The correct answer is ' +
	'<span class="multipleChoiceBoilerplateFeedbackCorrectAnswer">'+PLACEHOLDER_QUESTION_CORRECT_ANSWER+'.</span></div>';
var QUESTION_MULTIPLE_SELECT_BIOLERPLATE_FEEDBACK_CORRECT_TEMPLATE = '<div class="multipleSelectBoilerplateFeedbackCorrect">Your answers are correct.</div>';
var QUESTION_MULTIPLE_SELECT_BIOLERPLATE_FEEDBACK_CORRECT_SINGLE_TEMPLATE = '<div class="multipleSelectBoilerplateFeedbackCorrectSingle">Your answer is correct.</div>';
var QUESTION_MULTIPLE_SELECT_BIOLERPLATE_FEEDBACK_INCORRECT_TEMPLATE = '<div class="multipleSelectBoilerplateFeedbackIncorrect">Your answers are incorrect. The correct answers are ' +
	'<span class="multipleSelectBoilerplateFeedbackCorrectAnswers">'+PLACEHOLDER_QUESTION_CORRECT_ANSWER+'.</span></div>';
var QUESTION_MULTIPLE_SELECT_BIOLERPLATE_FEEDBACK_INCORRECT_SINGLE_ANSWER_MULTIPLE_CORRECT_TEMPLATE = '<div class="multipleSelectBoilerplateFeedbackIncorrectSingleAnswerMultipleCorrect multipleSelectBoilerplateFeedbackIncorrect">Your answer is incorrect. The correct answers are ' +
	'<span class="multipleSelectBoilerplateFeedbackCorrectAnswers">'+PLACEHOLDER_QUESTION_CORRECT_ANSWER+'.</span></div>';
var QUESTION_MULTIPLE_SELECT_BIOLERPLATE_FEEDBACK_INCORRECT_SINGLE_ANSWER_SINGLE_CORRECT_TEMPLATE = '<div class="multipleSelectBoilerplateFeedbackIncorrectSingleAnswerMultipleCorrect multipleSelectBoilerplateFeedbackIncorrect">Your answer is incorrect. The correct answer is ' +
	'<span class="multipleSelectBoilerplateFeedbackCorrectAnswers">'+PLACEHOLDER_QUESTION_CORRECT_ANSWER+'.</span></div>';
var QUESTION_MULTIPLE_SELECT_BIOLERPLATE_FEEDBACK_INCORRECT_MULTIPLE_ANSWERS_SINGLE_CORRECT_TEMPLATE = '<div class="multipleSelectBoilerplateFeedbackIncorrectMultipleAnswersSingleCorrect multipleSelectBoilerplateFeedbackIncorrect">Your answers are incorrect. The correct answer is ' +
	'<span class="multipleSelectBoilerplateFeedbackCorrectAnswers">'+PLACEHOLDER_QUESTION_CORRECT_ANSWER+'.</span></div>';
var QUESTION_MULTIPLE_SELECT_BIOLERPLATE_FEEDBACK_INCORRECT_MULTIPLE_ANSWERS_MULTIPLE_CORRECT_TEMPLATE = '<div class="multipleSelectBoilerplateFeedbackIncorrectMultipleAnswersMultipleCorrect multipleSelectBoilerplateFeedbackIncorrect">Your answers are incorrect. The correct answers are ' +
	'<span class="multipleSelectBoilerplateFeedbackCorrectAnswers">'+PLACEHOLDER_QUESTION_CORRECT_ANSWER+'.</span></div>';	
var QUESTION_GROUP_TITLE_TEMPLATE = '<div class="questionGroupTitle" id="'+PLACEHOLDER_QUESTION_GROUP_GUID+'">'+PLACEHOLDER_QUESTION_GROUP_TITLE+'</div>';
var QUESTION_GROUP_DESCRIPTION_TEMPLATE = '<div class="questionGroupDescription">'+PLACEHOLDER_QUESTION_GROUP_DESCRIPTION+'</div>';
var QUESTION_GROUP_COMPETENCY_TEMPLATE = '<div class="questionGroupCompetency"><span class="questionGroupCompetencyLabel"><strong>Competency:</strong> </span>'+PLACEHOLDER_QUESTION_GROUP_COMPETENCY+'</div>';
var QUESTION_GROUP_CONTAINER_TEMPLATE = '<div class="questionGroupContainer row" id="'+PLACEHOLDER_QUESTION_GROUP_GUID+'"></div>';
var QUESTION_CONTAINER_TEMPLATE = '<div class="questionContainer row" data-question-type="'+PLACEHOLDER_QUESTION_TYPE+'" id="'+PLACEHOLDER_QUESTION_QUESTION_GUID+'"></div>';
var ANSWERS_CONTAINER_TEMPLATE = '<div class="answersContainer"></div>';
var QUESTION_FEEDBACK_TEMPLATE = '<div class="questionFeedback"></div>';
var QUESTION_FEEDBACK_TEXT_CONTAINER_TEMPLATE = '<div class="questionFeedbackTextContainer">' +
             '<div class="questionFeedbackHeader"><strong>Feedback</strong></div>' +
              '<div class="questionFeedbackText"></div>' +
              '</div>';
var QUESTION_COUNT_TEMPLATE = '<div class="questionCountContainer">Question <span class="questionCount">'+PLACEHOLDER_QUESTION_NUMBER+'</span> <span class="of">of</span> <span class="questionGroupTotalCount">'+PLACEHOLDER_QUESTION_TOTAL_COUNT+'</span></div>';		
var QUESTION_TEXT_TEMPLATE = '<legend class="questionText">'+PLACEHOLDER_QUESTION_QUESTION_TEXT+'</legend>';
var QUESTION_NUMBER_OF_ATTEMPTS_TEMPLATE = '<div class="questionNumberOfAttemptsLabel">Number of Attempts: <div class="questionNumberOfAttempts">'+PLACEHOLDER_QUESTION_NUMBER_OF_ATTEMPTS+'</div></div>';
var QUESTION_POINT_VALUE_TEMPLATE = '<div class="questionPointValueLabel">Value: <div class="questionPointValue">'+PLACEHOLDER_QUESTION_POINT_VALUE+'</div></div>';
var ANSWERS_CONTAINER_RADIO_GROUP_TEMPLATE = '<div class="radio-group"></div>';
var ANSWER_CONTAINER_TEMPLATE = '<div class="answerContainer"></div>';
var ANSWERS_CONTAINER_CHECKBOX_GROUP_TEMPLATE = '<div class="checkbox-group"></div>';

//DEPRECATED
var ANSWER_RADIO_TEMPLATE = '<label class="answer" for="'+PLACEHOLDER_ANSWER_DATA_ANSWER_GUID+'"><span class="answerIndicator fa fa-square fa-2x"></span><input type="radio" name="answers'+PLACEHOLDER_QUESTION_QUESTION_GUID+'" id="'+PLACEHOLDER_ANSWER_DATA_ANSWER_GUID+'" /><span><span class="answerLetter">'+PLACEHOLDER_ANSWER_LETTER+')&nbsp;</span>'+PLACEHOLDER_ANSWER_DATA_ANSWER_TEXT+'</span></label>';

var ANSWER_RADIO_LABEL_TEMPLATE = '<label class="answer" for="'+PLACEHOLDER_ANSWER_DATA_ANSWER_GUID+'"></label>';
var ANSWER_RADIO_INPUT_TEMPLATE = '<span class="answerIndicator fa fa-square fa-2x"></span><input type="radio" name="answers'+PLACEHOLDER_QUESTION_QUESTION_GUID+'" id="'+PLACEHOLDER_ANSWER_DATA_ANSWER_GUID+'" /><span><span class="answerLetter">'+PLACEHOLDER_ANSWER_LETTER+')&nbsp;</span>'+PLACEHOLDER_ANSWER_DATA_ANSWER_TEXT+'</span>';

//DEPRECATED
var ANSWER_CHECKBOX_TEMPLATE = '<label class="answer" for="'+PLACEHOLDER_ANSWER_DATA_ANSWER_GUID+'"><span class="answerIndicator fa fa-square fa-2x"></span><input type="checkbox" name="answers'+PLACEHOLDER_QUESTION_QUESTION_GUID+'" id="'+PLACEHOLDER_ANSWER_DATA_ANSWER_GUID+'" /><span><span class="answerLetter">'+PLACEHOLDER_ANSWER_LETTER+')&nbsp;</span>'+PLACEHOLDER_ANSWER_DATA_ANSWER_TEXT+'</span></label>';

var ANSWER_CHECKBOX_LABEL_TEMPLATE = '<label class="answer" for="'+PLACEHOLDER_ANSWER_DATA_ANSWER_GUID+'"></label>';
var ANSWER_CHECKBOX_INPUT_TEMPLATE = '<span class="answerIndicator fa fa-square fa-2x"></span><input type="checkbox" name="answers'+PLACEHOLDER_QUESTION_QUESTION_GUID+'" id="'+PLACEHOLDER_ANSWER_DATA_ANSWER_GUID+'" /><span><span class="answerLetter">'+PLACEHOLDER_ANSWER_LETTER+')&nbsp;</span>'+PLACEHOLDER_ANSWER_DATA_ANSWER_TEXT+'</span>';

var ANSWER_FILL_IN_THE_BLANK_TEMPLATE = '<label class="answer" for="'+PLACEHOLDER_ANSWER_DATA_ANSWER_GUID+'"></span><input type="text" maxlength="3000" id="'+PLACEHOLDER_ANSWER_DATA_ANSWER_GUID+'"></label>';
var ANSWER_EXPERT_RESPONSE_TEMPLATE = '<label class="answer" for="'+PLACEHOLDER_ANSWER_DATA_ANSWER_GUID+'">'+PLACEHOLDER_QUESTION_QUESTION_TEXT+'</label><textarea type="text" maxlength="3000" id="'+PLACEHOLDER_ANSWER_DATA_ANSWER_GUID+'"></textarea>';

var FEEDBACK_PLACEHOLDER_TEMPLATE = '<div class="answerFeedback">'+PLACEHOLDER_ANSWER_DATA_FEEDBACK+'<div>';

var QUESTION_GROUP_SCORE_CONTAINER_PARENT_TEMPLATE = '<div class="questionGroupScoreContainerParent">';
var QUESTIONS_GROUP_SCORE_CONTAINER_TEMPLATE = '<div class="questionGroupScoreContainer">';
var QUESTION_GROUP_POINTS_TEMPLATE = 'You scored a total of <span class="totalQuestionGroupPoints"></span> out of a possible <span class="totalPossibleQuestionGroupPoints"> on this page.</span>'

//category scoring (for likert scale)
var CATEGORY_SCORE_HEADER = '<div class="categoryScoreHeader">'+PLACEHOLDER_CATEGORY_SCORE_HEADER+'</div><div class="categoryScoreExplanation">'+PLACEHOLDER_CATEGORY_SCORE_EXPLANATION+'</div>';
var CATEGORY_SCORE_CONTAINER_TEMPLATE = '<div class="categoryScoreContainer" id="categoryScore'+PLACEHOLDER_CATEGORY_NAME+'">'+
	'<span class="categoryScoreLabel">'+PLACEHOLDER_CATEGORY_SCORE_LABEL+'</span>'+
	'<span class="categoryScoreValue">'+PLACEHOLDER_CATEGORY_SCORE_VALUE+'</span>'+
	'</div>';
	
var CATEGORY_SCORE_CONTAINER_PARENT_TEMPLATE = '<div class="categoryScoreContainerParent" id="categoryScoreParent'+PLACEHOLDER_CATEGORY_PARENT_NAME+'">'+
	'<span class="categoryScoreParentLabel">'+PLACEHOLDER_CATEGORY_SCORE_PARENT_LABEL+': </span>'+
	'<span class="categoryScoreParentValue">'+PLACEHOLDER_CATEGORY_SCORE_PARENT_VALUE+'</span>'+
	'<br/>'+
	'</div>';	

var QUESTIONS_CONTAINER_TEMPLATE = '.questionsContainer';
var QUIZ_CONTAINER_TEMPLATE = '.quizContainer';
var QUESTION_CONTAINER_BUTTON_GROUP_TEMPLATE = '<div class="questionContainerButtonGroup button-group-justified"></div>';
var QUESTION_CONTAINER_BUTTON_RESET_TEMPLATE = '<a class="btnResetQuestionGroup button button-secondary" href="#modalResetQuestionGroup">Try Again</a>';
var QUESTION_CONTAINER_BUTTON_SUBMIT_TEMPLATE = '<a class="btnSubmitQuestionGroup button button-primary" disabled="disabled">Submit</a>';


var RESOURCES_CONTAINER_TEMPLATE = '.resourcesContainer';
var RESOURCE_CONTAINER_TEMPLATE = '<div class="resourceContainer row" id="'+PLACEHOLDER_RESOURCE_RESOURCE_GUID+'"></div>';
var RESOURCE_TEXT_TEMPLATE = '<div class="col-sm-4 resourceText">'+PLACEHOLDER_RESOURCE_RESOURCE_TEXT+'</div>';


//TOOLS
var PLACEHOLDER_VALUE = "PLACEHOLDER_VALUE";
var PLACEHOLDER_DISPLAY = "PLACEHOLDER_DISPLAY";
var PLACEHOLDER_QUESTION_GROUP_TITLE_GUID_TOOLS = "PLACEHOLDER_QUESTION_GROUP_TITLE_GUID_TOOLS";
var PLACEHOLDER_QUESTION_GROUP_DESCRIPTION_GUID_TOOLS = "PLACEHOLDER_QUESTION_GROUP_DESCRIPTION_GUID_TOOLS";
var PLACEHOLDER_QUESTION_GROUP_COMPETENCY_GUID_TOOLS = "PLACEHOLDER_QUESTION_GROUP_COMPETENCY_GUID_TOOLS";
var PLACEHOLDER_QUESTION_TEXT_GUID_TOOLS = "PLACEHOLDER_QUESTION_TEXT_GUID_TOOLS";
var PLACEHOLDER_ANSWER_TEXT_GUID_TOOLS = "PLACEHOLDER_ANSWER_TEXT_GUID_TOOLS";
var PLACEHOLDER_CHECKBOX_CHECKED = "PLACEHOLDER_CHECKBOX_CHECKED";
var PLACEHOLDER_RADIO_CHECKED = "PLACEHOLDER_RADIO_CHECKED";
var PLACEHOLDER_CHECKBOX_QUESTION_TYPE_MULTIPLE_CHOICE_CHECKED = "PLACEHOLDER_CHECKBOX_QUESTION_TYPE_MULTIPLE_CHOICE_CHECKED";
var PLACEHOLDER_CHECKBOX_QUESTION_TYPE_MULTIPLE_SELECT_CHECKED = "PLACEHOLDER_CHECKBOX_QUESTION_TYPE_MULTIPLE_SELECT_CHECKED";
var PLACEHOLDER_CHECKBOX_QUESTION_TYPE_FILL_IN_THE_BLANK_CHECKED = "PLACEHOLDER_CHECKBOX_QUESTION_TYPE_FILL_IN_THE_BLANK_CHECKED";
var PLACEHOLDER_CHECKBOX_QUESTION_TYPE_EXPERT_RESPONSE_CHECKED = "PLACEHOLDER_CHECKBOX_QUESTION_TYPE_EXPERT_RESPONSE_CHECKED";

var PLACEHOLDER_GUID_TOOLS = "PLACEHOLDER_GUID_TOOLS";

var PLACEHOLDER_ANSWER_ATTEMPT_COUNT_TOOLS = "PLACEHOLDER_ANSWER_ATTEMPT_COUNT_TOOLS";
var PLACEHOLDER_ANSWER_ATTEMPT_COUNT_POINTS = "PLACEHOLDER_ANSWER_ATTEMPT_COUNT_POINTS";

var PLACEHOLDER_ANSWER_ATTEMPT_GUID = "PLACEHOLDER_ANSWER_ATTEMPT_GUID";

var QUESTION_GROUP_TITLE_TEMPLATE_TOOLS = '<div class="questionGroupTitleTools">' +
		'<label class="questionGroupTitleToolsText" for="'+PLACEHOLDER_QUESTION_GROUP_TITLE_GUID_TOOLS+'"><h4>Question Group Title</h4><input type="text" placeholder="Enter text..." maxlength="300" id="'+PLACEHOLDER_QUESTION_GROUP_TITLE_GUID_TOOLS+'" value="'+PLACEHOLDER_VALUE+'"></input>'+
		'<div class="characterLimitContainer"><span class="charactersRemaining">0</span> characters remaining</div></label>'+
		'</div>';
var QUESTION_GROUP_DESCRIPTION_TEMPLATE_TOOLS = '<div class="questionGroupDescriptionTools">' +
		'<label class="questionGroupDescriptionToolsText" for="'+PLACEHOLDER_QUESTION_GROUP_DESCRIPTION_GUID_TOOLS+'"><h5>Question Group Description</h5><textarea type="text" placeholder="Enter text..." maxlength="3000" id="'+PLACEHOLDER_QUESTION_GROUP_DESCRIPTION_GUID_TOOLS+'">'+PLACEHOLDER_VALUE+'</textarea>'+
		'<div class="characterLimitContainer"><span class="charactersRemaining">0</span> characters remaining</div></label>'
		'</div>';
var QUESTION_ORDER_TEMPLATE_TOOLS = '<div class="questionOrderTools">' +
		'<label class="questionOrderToolsText" for="'+PLACEHOLDER_QUESTION_TEXT_GUID_TOOLS+'"><h6>Order</h6><input type="text" class="numericOnly questionOrderInput" placeholder="Enter text..." maxlength="3000" id="'+PLACEHOLDER_QUESTION_TEXT_GUID_TOOLS+'-order" value="'+PLACEHOLDER_VALUE+'"></input>'+
		'</div>';
var QUESTION_TEXT_TEMPLATE_TOOLS = '<div class="questionTextTools">' +
		'<label class="questionTextToolsText" for="'+PLACEHOLDER_QUESTION_TEXT_GUID_TOOLS+'"><h5>Question Text</h5><input type="text" placeholder="Enter text..." maxlength="3000" id="'+PLACEHOLDER_QUESTION_TEXT_GUID_TOOLS+'-text" value="'+PLACEHOLDER_VALUE+'"></input>'+
		'<div class="characterLimitContainer"><span class="charactersRemaining">0</span> characters remaining</div></label>'+
		'</div>';
var QUESTION_GROUP_COMPETENCY_TEMPLATE_TOOLS = '<div class="questionGroupCompetencyTools">' +
		'<label class="questionGroupCompetencyToolsText" for="'+PLACEHOLDER_QUESTION_GROUP_COMPETENCY_GUID_TOOLS+'"><h5>Competency</h5><input type="text" placeholder="Enter text..." maxlength="3000" id="'+PLACEHOLDER_QUESTION_GROUP_COMPETENCY_GUID_TOOLS+'-competency" value="'+PLACEHOLDER_VALUE+'"></input>'+
		'<div class="characterLimitContainer"><span class="charactersRemaining">0</span> characters remaining</div></label>'+
		'</div>';
var QUESTION_CONTAINER_TEMPLATE_TOOLS = '<div class="questionContainer questionContainerTools row" data-question-type="'+PLACEHOLDER_QUESTION_TYPE+'" id="'+PLACEHOLDER_QUESTION_QUESTION_GUID+'"></div>';
var RANDOMIZE_QUESTIONS_TEMPLATE_TOOLS = '<div class="checkbox-group checkboxGroupRandomizeQuestions"><label class="" for="'+PLACEHOLDER_QUESTION_GROUP_GUID+'-randomizeCheckbox"><input '+PLACEHOLDER_CHECKBOX_CHECKED+' type="checkbox" name="'+PLACEHOLDER_QUESTION_GROUP_GUID+'-randomizeCheckbox" id="'+PLACEHOLDER_QUESTION_GROUP_GUID+'-randomizeCheckbox"><span>Randomize questions</span></label></div>';
var RANDOMIZE_ANSWERS_TEMPLATE_TOOLS = 	'<div class="checkbox-group checkboxGroupRandomizeAnswers"><label class="" for="'+PLACEHOLDER_QUESTION_QUESTION_GUID+'-randomizeCheckbox"><input '+PLACEHOLDER_CHECKBOX_CHECKED+' type="checkbox" name="'+PLACEHOLDER_QUESTION_QUESTION_GUID+'-randomizeCheckbox" id="'+PLACEHOLDER_QUESTION_QUESTION_GUID+'-randomizeCheckbox"><span>Randomize answers</span></label></div>';
// BELOW EDITED BY JL
// var QUESTIONS_CONTAINER_TEMPLATE_TOOLS = '<div class="questionsContainer questionsContainerTools"><span class="emptyMSG"><strong>You don\'t have any questions created yet.</strong><br> Use the "Add Question" button below to get started.</span></div>';
var QUESTIONS_CONTAINER_TEMPLATE_TOOLS = '<div class="questionsContainer questionsContainerTools"></div>';

//correct and incorrect points are question level for multiple select
var QUESTION_CORRECT_POINTS_TOOLS = '<div class="questionCorrectPointsTools">' +
		'<label class="questionCorrectPointsToolsText" for="'+PLACEHOLDER_QUESTION_TEXT_GUID_TOOLS+'-correct-points"><h5>Points for Correct Answer</h5><input type="text" maxlength="3000" id="'+PLACEHOLDER_QUESTION_TEXT_GUID_TOOLS+'-correct-points" value="'+PLACEHOLDER_VALUE+'"></input>'+
		'</div>';
var QUESTION_INCORRECT_POINTS_TOOLS = '<div class="questionIncorrectPointsTools">' +
		'<label class="questionIncorrectPointsToolsText" for="'+PLACEHOLDER_QUESTION_TEXT_GUID_TOOLS+'-incorrect-points"><h5>Points for Incorrect Answer</h5><input type="text" maxlength="3000" id="'+PLACEHOLDER_QUESTION_TEXT_GUID_TOOLS+'-incorrect-points" value="'+PLACEHOLDER_VALUE+'"></input>'+
		'</div>';


var ANSWERS_CONTAINER_TEMPLATE_TOOLS = '<div class="answersContainer answersContainerTools"></div>';
var ANSWERS_CONTAINER_CORRECT_ANSWERS_TEMPLATE_TOOLS = '<div class="answersContainer answersContainerCorrectAnswersTools">' +
	'<h5>Answers that will be treated as correct for this question</h5>' +
	'</div>';
var ANSWERS_CONTAINER_INCORRECT_ANSWERS_TEMPLATE_TOOLS = '<div class="answersContainerIncorrect answersContainerIncorrectAnswersTools">' +
	'<h5>Feedback and points for any answers that doesn\'t match one of the correct answers</h5>' +
	'</div>';
var ANSWER_CONTAINER_TEMPLATE_TOOLS = '<div class="answerContainer" id="'+PLACEHOLDER_ANSWER_DATA_ANSWER_GUID+'"></div>';
var ANSWER_CONTAINER_CORRECT_ANSWER_TEMPLATE_TOOLS = '<div class="answerContainerCorrectAnswer" id="'+PLACEHOLDER_ANSWER_DATA_ANSWER_GUID+'">' +
		'</div>';
var ANSWER_CONTAINER_INCORRECT_ANSWER_TEMPLATE_TOOLS = '<div class="answerContainerIncorrectAnswer" id="'+PLACEHOLDER_ANSWER_DATA_ANSWER_GUID+'"></div>';
var ANSWERS_CONTAINER_RADIO_GROUP_TEMPLATE_TOOLS = '<div class="radio-group"></div>';

//var QUESTION_TYPE_RADIO_GROUP_TEMPLATE_TOOLS = '<h5>Question Type</h5><div class="radio-group questionTypeContainer">'+
//	'<label for="'+PLACEHOLDER_QUESTION_QUESTION_GUID+'-questionTypeMultipleChoice"><input '+PLACEHOLDER_CHECKBOX_QUESTION_TYPE_MULTIPLE_CHOICE_CHECKED+' type="radio" name="'+PLACEHOLDER_QUESTION_QUESTION_GUID+'-questionTypeGroup" id="'+PLACEHOLDER_QUESTION_QUESTION_GUID+'-questionTypeMultipleChoice" class="questionTypeMultipleChoice disabled"><span>Multiple Choice</span></label>' +
//	'<label for="'+PLACEHOLDER_QUESTION_QUESTION_GUID+'-questionTypeMultipleSelect"><input '+PLACEHOLDER_CHECKBOX_QUESTION_TYPE_MULTIPLE_SELECT_CHECKED+' type="radio" name="'+PLACEHOLDER_QUESTION_QUESTION_GUID+'-questionTypeGroup" id="'+PLACEHOLDER_QUESTION_QUESTION_GUID+'-questionTypeMultipleSelect" class="questionTypeMultipleSelect disabled"><span>Multiple Select</span></label>' +
//	'<label for="'+PLACEHOLDER_QUESTION_QUESTION_GUID+'-questionTypeFillInTheBlank"><input '+PLACEHOLDER_CHECKBOX_QUESTION_TYPE_FILL_IN_THE_BLANK_CHECKED+' type="radio" name="'+PLACEHOLDER_QUESTION_QUESTION_GUID+'-questionTypeGroup" id="'+PLACEHOLDER_QUESTION_QUESTION_GUID+'-questionTypeFillInTheBlank" class="questionTypeFillInTheBlank disabled"><span>Fill in the Blank</span></label>' +
//	'<label for="'+PLACEHOLDER_QUESTION_QUESTION_GUID+'-questionTypeExpertResponse"><input '+PLACEHOLDER_CHECKBOX_QUESTION_TYPE_EXPERT_RESPONSE_CHECKED+' type="radio" name="'+PLACEHOLDER_QUESTION_QUESTION_GUID+'-questionTypeGroup" id="'+PLACEHOLDER_QUESTION_QUESTION_GUID+'-questionTypeExpertResponse" class="questionTypeExpertResponse "><span>Expert Response</span></label>' +
//	'</div>';

var QUESTION_TYPE_TEMPLATE_TOOLS = '<div class="questionTypeTools">' +
		'<label class="questionTypeToolsText" for="'+PLACEHOLDER_QUESTION_QUESTION_GUID+'"><h5>Question Type</h5><text type="text" id="'+PLACEHOLDER_QUESTION_QUESTION_GUID+'-question-type" value="'+PLACEHOLDER_VALUE+'">'+PLACEHOLDER_DISPLAY+'</text></label>'
		'</div>';

var ANSWERS_CONTAINER_RADIO_GROUP_TEMPLATE_TOOLS = '<div class="answersContainerRadioGroupTools"></div>'
var ANSWER_CONTAINER_RADIO_GROUP_TEMPLATE_TOOLS = '<div class="answerContainerRadioGroupTools"></div>';
var ANSWER_TEXT_TOOLS = '<div class="answerTextTools">' +
		'<label class="answerTextToolsText" for="'+PLACEHOLDER_ANSWER_TEXT_GUID_TOOLS+'-text"><h5>Answer Text</h5><input type="text" placeholder="Enter text..." maxlength="1000" id="'+PLACEHOLDER_ANSWER_TEXT_GUID_TOOLS+'-text" value="'+PLACEHOLDER_VALUE+'"></input>'+
		'<div class="characterLimitContainer"><span class="charactersRemaining">0</span> characters remaining</div></label>'+
		'</div>';
var ANSWER_POINTS_TOOLS = '<div class="answerPointsTools">' +
		'<label class="answerPointsToolsText" for="'+PLACEHOLDER_ANSWER_TEXT_GUID_TOOLS+'-points"><h5>Points </h5><input type="text" maxlength="3000" id="'+PLACEHOLDER_ANSWER_TEXT_GUID_TOOLS+'-points" value="'+PLACEHOLDER_VALUE+'"></input>'+
		'</div>';
var ANSWER_POINTS_ATTEMPTS_CONTAINER_TOOLS = '<div class="answerPointsAttemptsContainerTools">' +
		'<label class="answerPointsToolsText" id="'+PLACEHOLDER_ANSWER_TEXT_GUID_TOOLS+'-points"><h5>Points per attempt</h5>' +
		'</div>';
//var ANSWER_ATTEMPT_TOOLS = '<div class="answerAttemptTools">' +
//		'<label class="answerAttemptToolsText" for="'+PLACEHOLDER_ANSWER_ATTEMPT_COUNT_POINTS+'-points"><h5>Points</h5><input type="text" maxlength="3000" value="'+PLACEHOLDER_VALUE+'"></label>' +
//		'</div>';

var ANSWER_ATTEMPT_TOOLS = '<div class="answerAttemptTools" id="'+PLACEHOLDER_ANSWER_ATTEMPT_GUID+'"></div>';

var ANSWER_ATTEMPT_POINTS_TOOLS = '<div class="answerAttemptPointsTools">' +
		'<label class="answerAttemptToolsPoints" for="'+PLACEHOLDER_ANSWER_ATTEMPT_COUNT_POINTS+'-points"><h5>Points</h5><input id="'+PLACEHOLDER_ANSWER_ATTEMPT_COUNT_POINTS+'-points" type="text" maxlength="3000" value="'+PLACEHOLDER_VALUE+'"></input>'+
		'</div>';


var ANSWER_ATTEMPT_COUNT_TOOLS = '<div class="answerAttemptCountTools">' +
	'<label class="answerAttemptToolsCount" for="'+PLACEHOLDER_ANSWER_ATTEMPT_COUNT_TOOLS+'-count"><h5>Attempt count</h5><input id="'+PLACEHOLDER_ANSWER_ATTEMPT_COUNT_TOOLS+'-count" readonly="readonly" type="text" maxlength="3000" value="'+PLACEHOLDER_VALUE+'"></input>'+
	'</div>';

var ANSWER_ATTEMPT_COUNT_DEFAULT_TOOLS = '<div class="answerAttemptCountTools">' +
	'<label class="answerAttemptToolsCount" for="'+PLACEHOLDER_ANSWER_ATTEMPT_COUNT_TOOLS+'-count"><h5>Default (if number of attempts exceeds the last one defined, this is the default amount of points awarded)</h5><input id="'+PLACEHOLDER_ANSWER_ATTEMPT_COUNT_TOOLS+'-count" readonly="readonly" type="text" maxlength="3000" value="'+PLACEHOLDER_VALUE+'"></input>'+
	'</div>';

var ANSWER_ATTEMPT_ADD_BUTTON = '<button class="btnAddAnswerAttempt button button-primary addDelete-Secondary"><span class="fa fa-plus-circle" aria-hidden="true"></span> Add Attempt</button>';

var ANSWER_ATTEMPT_DELETE_BUTTON = '<button class="btnDeleteAnswerAttempt button button-white addDelete-Secondary"><span class="fa fa-trash" aria-hidden="true"></span> Delete Attempt</button>';

var ANSWER_ATTEMPT_REMOVE_ATTEMPT_SCORING_BUTTON = '<button class="btnRemoveAnswerAttemptScoring button button-white addDelete-Secondary"><span class="fa fa-minus-circle" aria-hidden="true"></span> Remove attempt scoring for this answer</button>';
var ANSWER_ATTEMPT_ADD_ATTEMPT_SCORING_BUTTON = '<button class="btnAddAnswerAttemptScoring button button-white addDelete-Secondary"><span class="fa fa-plus-circle" aria-hidden="true"></span> Add attempt scoring for this answer</button>';

var ANSWER_FEEDBACK_TOOLS = '<div class="answerFeedbackTools">' +
		'<label class="answerFeedbackToolsText" for="'+PLACEHOLDER_ANSWER_TEXT_GUID_TOOLS+'-points"><h5>Feedback</h5><textarea type="text" placeholder="Enter text..." maxlength="1000" id="'+PLACEHOLDER_ANSWER_TEXT_GUID_TOOLS+'-feedback">'+PLACEHOLDER_VALUE+'</textarea>'+
		'<div class="characterLimitContainer"><span class="charactersRemaining">0</span> characters remaining</div></label>'+
		'</div>';
var QUESTION_FEEDBACK_TOOLS = '<div class="questionFeedbackTools">' +
		'<label class="questionFeedbackToolsText" for="'+PLACEHOLDER_QUESTION_TEXT_GUID_TOOLS+'-points"><h5>Question Feedback</h5><textarea type="text" placeholder="Enter text..." maxlength="1000" id="'+PLACEHOLDER_QUESTION_TEXT_GUID_TOOLS+'-feedback">'+PLACEHOLDER_VALUE+'</textarea>'+
		'<div class="characterLimitContainer"><span class="charactersRemaining">0</span> characters remaining</div></label>'+
		'</div>';		
var QUESTION_FEEDBACK_CORRECT_TOOLS = '<div class="questionFeedbackCorrectTools">' +
		'<label class="questionFeedbackCorrectToolsText" for="'+PLACEHOLDER_QUESTION_TEXT_GUID_TOOLS+'-points"><h5>Question Feedback Correct</h5><input type="text" placeholder="Enter text..." maxlength="1000" id="'+PLACEHOLDER_QUESTION_TEXT_GUID_TOOLS+'-feedback" value="'+PLACEHOLDER_VALUE+'"></input>'+
		'<div class="characterLimitContainer"><span class="charactersRemaining">0</span> characters remaining</div></label>'+
		'</div>';		
var QUESTION_FEEDBACK_INCORRECT_TOOLS = '<div class="questionFeedbackIncorrectTools">' +
		'<label class="questionFeedbackIncorrectToolsText" for="'+PLACEHOLDER_QUESTION_TEXT_GUID_TOOLS+'-points"><h5>Question Feedback Incorrect</h5><input type="text" placeholder="Enter text..." maxlength="1000" id="'+PLACEHOLDER_QUESTION_TEXT_GUID_TOOLS+'-feedback" value="'+PLACEHOLDER_VALUE+'"></input>'+
		'<div class="characterLimitContainer"><span class="charactersRemaining">0</span> characters remaining</div></label>'+
		'</div>';		
		
var ANSWER_IS_CORRECT_CHECKBOX_TOOLS = '<div class="checkbox-group answerIsCorrect answerIsCorrectCheckbox">' +
		'<label class="" for="'+PLACEHOLDER_ANSWER_TEXT_GUID_TOOLS+'-checkboxIsCorrect"><input '+PLACEHOLDER_CHECKBOX_CHECKED+' type="checkbox" name="'+PLACEHOLDER_ANSWER_TEXT_GUID_TOOLS+'-checkboxIsCorrect" id="'+PLACEHOLDER_ANSWER_TEXT_GUID_TOOLS+'-checkboxIsCorrect"><span>Correct Answer</span></input>'+
		'</div>';
var ANSWER_IS_CORRECT_RADIO_TOOLS = '<div class="radio-group answerIsCorrect answerIsCorrectRadio">' +
		'<label class="" for="'+PLACEHOLDER_ANSWER_TEXT_GUID_TOOLS+'-radioIsCorrect"><input '+PLACEHOLDER_RADIO_CHECKED+' type="radio" name="'+PLACEHOLDER_QUESTION_TEXT_GUID_TOOLS+'-radioIsCorrect" id="'+PLACEHOLDER_ANSWER_TEXT_GUID_TOOLS+'-radioIsCorrect"><span>Correct Answer</span></input>'+
		'</div>';
var ANSWER_DELETE_BUTTON = '<a class="btnDeleteAnswer button button-white addDelete-Secondary" href="#modalDeleteAnswer"><span class="fa fa-trash" aria-hidden="true"></span> Delete Answer</a>';
var QUESTION_DELETE_BUTTON = '<a class="btnDeleteQuestion button button-white addDelete-Secondary" href="#modalDeleteQuestion"><span class="fa fa-trash" aria-hidden="true"></span> Delete Question</a>';
var QUESTION_GROUP_DELETE_BUTTON = '<a class="btnDeleteQuestionGroup button button-white addDelete-Secondary" href="#modalDeleteQuestionGroup"><span class="fa fa-trash" aria-hidden="true"></span> Delete Question Group</a>';

var ANSWER_ADD_BUTTON = '<button class="btnAddAnswer button button-primary addDelete-Secondary" href="#modalAddAnswer"><span class="fa fa-plus-circle" aria-hidden="true"></span> Add Answer</button>';
var ANSWER_ADD_CORRECT_BUTTON = '<button class="btnAddCorrectAnswer button button-white addDelete-Secondary" href="#modalAddCorrectAnswer"><span class="fa fa-plus-circle" aria-hidden="true"></span> Add Correct Answer</button>';
var QUESTION_ADD_BUTTON = '<button class="btnAddQuestion button button-primary addDelete-Secondary" href="#modalAddQuestion"><span class="fa fa-plus-circle" aria-hidden="true"></span> Add Question</button>';
var QUESTION_GROUP_ADD_BUTTON = '<button class="btnAddQuestionGroup button button-white addDelete-Secondary" href="#modalAddQuestionGroup"><span class="fa fa-plus-circle" aria-hidden="true"></span> Add Question Group</button>';

var EXPERT_RESPONSE_POINTS_TEMPLATE_TOOLS = '<div class="pointsTools">' +
		'<label class="pointsToolsText" for="'+PLACEHOLDER_ANSWER_TEXT_GUID_TOOLS+'-points"><h5>Points awarded for all answers</h5><input type="text" maxlength="3000" id="'+PLACEHOLDER_ANSWER_TEXT_GUID_TOOLS+'-points" value="'+PLACEHOLDER_VALUE+'"></input>'+
		'<div class="characterLimitContainer"><span class="charactersRemaining">0</span> characters remaining</div></label>'+
		'</div>';

var EXPERT_RESPONSE_FEEDBACK_TEMPLATE_TOOLS = '<div class="feedbackTools">' +
		'<label class="feedbackToolsText" for="'+PLACEHOLDER_ANSWER_TEXT_GUID_TOOLS+'-points"><h5>Feedback</h5><input type="text" placeholder="Enter text..." maxlength="1000" id="'+PLACEHOLDER_ANSWER_TEXT_GUID_TOOLS+'-feedback" value="'+PLACEHOLDER_VALUE+'"></input>'+
		'<div class="characterLimitContainer"><span class="charactersRemaining">0</span> characters remaining</div></label>'+
		'</div>';


var PAGINATION_CONTAINER = '<div class="container pagination" id="pagination1"></div>';
var PAGINATION_CONTENT = '<div class="pagination-content" aria-live="polite" id="pagination-content"></div>';
var PAGINATION_SECTION = '<section id="section'+PLACEHOLDER_SECTION_ID_COUNT+'" class="pagination-content-page" aria-labelledby="'+PLACEHOLDER_QUESTION_GROUP_GUID+'Title"></section>';
var PAGINATION_NAV = '<nav class="pagination-nav" aria-label="Pagination Navigation" id="pagination-nav"></nav>';
var PAGINATION_NAV_LIST_CONTAINER = '<ul id="paginationNavListContainer"></ul>';
var PAGINATION_NAV_ITEM = '<li class="pagination-nav-item" id="nav'+PLACEHOLDER_SECTION_ID_COUNT+'" aria-label="Page '+PLACEHOLDER_SECTION_ID_COUNT+'"' +
							' aria-controls="section'+PLACEHOLDER_SECTION_ID_COUNT+'" aria-current="false">' +
								'<a href="#'+PLACEHOLDER_SECTION_ID_COUNT+'">'+PLACEHOLDER_SECTION_ID_COUNT+'</a>' +
							'</li>';
var PAGINATION_NAV_ITEM_PREV = '<li class="pagination-nav-prev pagination-nav-is-disabled aria-disabled="true"><a href="#">Previous</a></li>';
var PAGINATION_NAV_ITEM_NEXT = '<li class="pagination-nav-next aria-disabled="false"><a href="#">Next</a></li>';


var QUESTION_INDICATOR_TEMPLATE = '<span class="questionIndicator fa fa-square fa-3x" aria-hidden="true"></span>';
var ANSWER_INDICATOR_TEMPLATE = '<span class="answerIndicator fa fa-square fa-1.5x"></span>';

var QUIZ_SCORE_CONTAINER = '<div class="quizScoreContainer">You scored <span class="totalQuizPoints"></span> out of a possible <span class="totalPossibleQuizPoints">.</span></div></div>';

//var ANSWER_LETTER_TEMPLATE = '<span class="answerLetter">'+PLACEHOLDER_VALUE+'</span>';

//IMAGES
var PLACEHOLDER_IMAGE_TITLE = "PLACEHOLDER_IMAGE_TITLE";
var PLACEHOLDER_IMAGE_SUBTITLE = "PLACEHOLDER_IMAGE_SUBTITLE";
//alt tag
var PLACEHOLDER_IMAGE_ALT_TEXT = "PLACEHOLDER_IMAGE_ALT_TEXT";
var PLACEHOLDER_IMAGE_URL = "PLACEHOLDER_IMAGE_URL";
var PLACEHOLDER_IMAGE_WIDTH = "PLACEHOLDER_IMAGE_WIDTH";
var PLACEHOLDER_IMAGE_HEIGHT = "PLACEHOLDER_IMAGE_HEIGHT";
//image link (to 3rd party video or website)
var PLACEHOLDER_IMAGE_LINK = "PLACEHOLDER_IMAGE_LINK";


var IMAGE_CONTAINER_TEMPLATE = '<div class="image-container container-grid-child container-grid-child-70">' +
	'<h3>'+PLACEHOLDER_IMAGE_TITLE+'</h3>' +
	'<p>'+PLACEHOLDER_IMAGE_SUBTITLE+'</p>' +
	'<img class="questionImage" src="'+PLACEHOLDER_IMAGE_URL+'" alt="'+PLACEHOLDER_IMAGE_ALT_TEXT+'" height="'+PLACEHOLDER_IMAGE_HEIGHT+'" width="'+PLACEHOLDER_IMAGE_WIDTH+'" />' +
	'</div>';
	
var IMAGE_CONTAINER_LINK_TEMPLATE = '<div class="image-container container-grid-child container-grid-child-70">' +
	'<h3>'+PLACEHOLDER_IMAGE_TITLE+'</h3>' +
	'<p>'+PLACEHOLDER_IMAGE_SUBTITLE+'</p>' +
	'<a target="_blank" href="'+PLACEHOLDER_IMAGE_LINK+'">'+
	'<img class="questionImage" src="'+PLACEHOLDER_IMAGE_URL+'" alt="'+PLACEHOLDER_IMAGE_ALT_TEXT+'" height="'+PLACEHOLDER_IMAGE_HEIGHT+'" width="'+PLACEHOLDER_IMAGE_WIDTH+'" />' +
	'</a></div>';	

var ADD_IMAGES_BUTTON = '<button class="btnAddImages button button-white addDelete-Secondary"><span class="fa fa-plus-circle" aria-hidden="true"></span> Add Images</button>';
var DELETE_IMAGES_BUTTON = '<button class="btnDeleteImages button button-white addDelete-Secondary"><span class="fa fa-trash" aria-hidden="true"></span> Delete all images for this question</button>';

var ADD_IMAGE_BUTTON = '<button class="btnAddImage button button-white addDelete-Secondary"><span class="fa fa-plus-circle" aria-hidden="true"></span> Add Image</button>';
var DELETE_IMAGE_BUTTON = '<button class="btnDeleteImage button button-white addDelete-Secondary"><span class="fa fa-trash" aria-hidden="true"></span> Delete Image</button>';

var IMAGES_CONTAINER_TOOLS = '<div class="imagesContainerTools">' +
	'<div class="imagesContainerTextTools"><h5>Images</h5>' +
	'</div>';

var IMAGE_CONTAINER_TOOLS = '<div class="imageContainerTools">' +
	'<div class="imageContainerTextTools"><h5>Image</h5>' +
	'</div>';

var IMAGE_TITLE_TEMPLATE_TOOLS = '<div class="imageTitleTools">' +
		'<label class="imageTitleToolsText" for="'+PLACEHOLDER_GUID_TOOLS+'-image-title"><h5>Title</h5><input type="text" maxlength="3000" id="'+PLACEHOLDER_GUID_TOOLS+'-image-title" value="'+PLACEHOLDER_VALUE+'"></input>'+
		'<div class="characterLimitContainer"><span class="charactersRemaining">0</span> characters remaining</div></label>'+
		'</div>';

var IMAGE_SUBTITLE_TEMPLATE_TOOLS = '<div class="imageSubtitleTools">' +
		'<label class="imageSubtitleToolsText" for="'+PLACEHOLDER_GUID_TOOLS+'-image-subtitle"><h5>Subtitle</h5><input type="text" maxlength="3000" id="'+PLACEHOLDER_GUID_TOOLS+'-image-subtitle" value="'+PLACEHOLDER_VALUE+'"></input>'+
		'<div class="characterLimitContainer"><span class="charactersRemaining">0</span> characters remaining</div></label>'+
		'</div>';

var IMAGE_URL_TEMPLATE_TOOLS = '<div class="imageURLTools">' +
		'<label class="imageURLToolsText" for="'+PLACEHOLDER_GUID_TOOLS+'-image-url"><h5>Path to image and filename (example: images/my_image.png)</h5><input type="text" maxlength="3000" id="'+PLACEHOLDER_GUID_TOOLS+'-image-url" value="'+PLACEHOLDER_VALUE+'"></input>'+
		'<div class="characterLimitContainer"><span class="charactersRemaining">0</span> characters remaining</div></label>'+
		'</div>';

var IMAGE_ALT_TEXT_TEMPLATE_TOOLS = '<div class="imageAltTextTools">' +
		'<label class="imageAltTextToolsText" for="'+PLACEHOLDER_GUID_TOOLS+'-image-alt-text"><h5>Alt tag text for image</h5><input type="text" maxlength="3000" id="'+PLACEHOLDER_GUID_TOOLS+'-image-alt-text" value="'+PLACEHOLDER_VALUE+'"></input>'+
		'<div class="characterLimitContainer"><span class="charactersRemaining">0</span> characters remaining</div></label>'+
		'</div>';

var IMAGE_WIDTH_TEMPLATE_TOOLS = '<div class="imageWidthTools">' +
		'<label class="imageWidthToolsText" for="'+PLACEHOLDER_GUID_TOOLS+'-image-width"><h5>Image width (in pixels)</h5><input type="text" maxlength="4" id="'+PLACEHOLDER_GUID_TOOLS+'-image-width" value="'+PLACEHOLDER_VALUE+'"></input>'+
		'<div class="characterLimitContainer"><span class="charactersRemaining">0</span> characters remaining</div></label>'+
		'</div>';
var IMAGE_HEIGHT_TEMPLATE_TOOLS = '<div class="imageHeightTools">' +
		'<label class="imageHeightToolsText" for="'+PLACEHOLDER_GUID_TOOLS+'-image-height"><h5>Image height (in pixels)</h5><input type="text" maxlength="4" id="'+PLACEHOLDER_GUID_TOOLS+'-image-height" value="'+PLACEHOLDER_VALUE+'"></input>'+
		'<div class="characterLimitContainer"><span class="charactersRemaining">0</span> characters remaining</div></label>'+
		'</div>';

//VIDEO
var PLACEHOLDER_VIDEO_TITLE = "PLACEHOLDER_VIDEO_TITLE";
var PLACEHOLDER_VIDEO_SUBTITLE = "PLACEHOLDER_VIDEO_SUBTITLE";
var PLACEHOLDER_VIDEO_URL = "PLACEHOLDER_VIDEO_URL";
var PLACEHOLDER_POSTER_URL = "PLACEHOLDER_POSTER_URL";
var PLACEHOLDER_VIDEO_WIDTH = "PLACEHOLDER_VIDEO_WIDTH";
var PLACEHOLDER_VIDEO_HEIGHT = "PLACEHOLDER_VIDEO_HEIGHT";
var PLACEHOLDER_CAPTION_URL = "PLACEHOLDER_CAPTION_URL";


var VIDEO_CONTAINER_TEMPLATE = '<div class="video-container container-grid-child container-grid-child-70">' +
	'<h3>'+PLACEHOLDER_VIDEO_TITLE+'</h3>' +
	'<p>'+PLACEHOLDER_VIDEO_SUBTITLE+'</p>' +
	'<video class="mejs-capella" src="'+PLACEHOLDER_VIDEO_URL+'" poster="'+PLACEHOLDER_POSTER_URL+'" height="'+PLACEHOLDER_VIDEO_HEIGHT+'" width="'+PLACEHOLDER_VIDEO_WIDTH+'">' +
	'<track src="'+PLACEHOLDER_CAPTION_URL+'" kind="subtitles" srclang="en" label="English" />' +
	'</video>' +
	'</div>';

var ADD_VIDEOS_BUTTON = '<button class="btnAddVideos button button-white addDelete-Secondary"><span class="fa fa-plus-circle" aria-hidden="true"></span> Add Videos</button>';
var DELETE_VIDEOS_BUTTON = '<button class="btnDeleteVideos button button-white addDelete-Secondary"><span class="fa fa-trash" aria-hidden="true"></span> Delete all videos for this question</button>';

var ADD_VIDEO_BUTTON = '<button class="btnAddVideo button button-white addDelete-Secondary"><span class="fa fa-plus-circle" aria-hidden="true"></span> Add Video</button>';
var DELETE_VIDEO_BUTTON = '<button class="btnDeleteVideo button button-white addDelete-Secondary"><span class="fa fa-trash" aria-hidden="true"></span> Delete Video</button>';

var VIDEOS_CONTAINER_TOOLS = '<div class="videosContainerTools">' +
	'<div class="videosContainerTextTools"><h5>Videos</h5>' +
	'</div>';

var VIDEO_CONTAINER_TOOLS = '<div class="videoContainerTools">' +
	'<div class="videoContainerTextTools"><h5>Video</h5>' +
	'</div>';

var VIDEO_TITLE_TEMPLATE_TOOLS = '<div class="videoTitleTools">' +
		'<label class="videoTitleToolsText" for="'+PLACEHOLDER_GUID_TOOLS+'-video-title"><h5>Title</h5><input type="text" maxlength="3000" id="'+PLACEHOLDER_GUID_TOOLS+'-video-title" value="'+PLACEHOLDER_VALUE+'"></input>'+
		'<div class="characterLimitContainer"><span class="charactersRemaining">0</span> characters remaining</div></label>'+
		'</div>';

var VIDEO_SUBTITLE_TEMPLATE_TOOLS = '<div class="videoSubtitleTools">' +
		'<label class="videoSubtitleToolsText" for="'+PLACEHOLDER_GUID_TOOLS+'-video-subtitle"><h5>Subtitle</h5><input type="text" maxlength="3000" id="'+PLACEHOLDER_GUID_TOOLS+'-video-subtitle" value="'+PLACEHOLDER_VALUE+'"></input>'+
		'<div class="characterLimitContainer"><span class="charactersRemaining">0</span> characters remaining</div></label>'+
		'</div>';

var VIDEO_URL_TEMPLATE_TOOLS = '<div class="videoURLTools">' +
		'<label class="videoURLToolsText" for="'+PLACEHOLDER_GUID_TOOLS+'-video-url"><h5>Path to video and filename (example: videos/my_video.mp4)</h5><input type="text" maxlength="3000" id="'+PLACEHOLDER_GUID_TOOLS+'-video-url" value="'+PLACEHOLDER_VALUE+'"></input>'+
		'<div class="characterLimitContainer"><span class="charactersRemaining">0</span> characters remaining</div></label>'+
		'</div>';

var POSTER_URL_TEMPLATE_TOOLS = '<div class="posterURLTools">' +
		'<label class="posterURLToolsText" for="'+PLACEHOLDER_GUID_TOOLS+'-poster-url"><h5>Path to poster image and filename (example: images/my_video_poster.png)</h5><input type="text" maxlength="3000" id="'+PLACEHOLDER_GUID_TOOLS+'-poster-url" value="'+PLACEHOLDER_VALUE+'"></input>'+
		'<div class="characterLimitContainer"><span class="charactersRemaining">0</span> characters remaining</div></label>'+
		'</div>';
var CAPTION_URL_TEMPLATE_TOOLS = '<div class="captionURLTools">' +
		'<label class="captionURLToolsText" for="'+PLACEHOLDER_GUID_TOOLS+'-caption-url"><h5>Path to video caption file and filename (example: captions/my_video_caption.vtt)</h5><input type="text" maxlength="3000" id="'+PLACEHOLDER_GUID_TOOLS+'-caption-url" value="'+PLACEHOLDER_VALUE+'"></input>'+
		'<div class="characterLimitContainer"><span class="charactersRemaining">0</span> characters remaining</div></label>'+
		'</div>';
var VIDEO_WIDTH_TEMPLATE_TOOLS = '<div class="videoWidthTools">' +
		'<label class="videoWidthToolsText" for="'+PLACEHOLDER_GUID_TOOLS+'-video-width"><h5>Video width (in pixels)</h5><input type="text" maxlength="4" id="'+PLACEHOLDER_GUID_TOOLS+'-video-width" value="'+PLACEHOLDER_VALUE+'"></input>'+
		'<div class="characterLimitContainer"><span class="charactersRemaining">0</span> characters remaining</div></label>'+
		'</div>';
var VIDEO_HEIGHT_TEMPLATE_TOOLS = '<div class="videoHeightTools">' +
		'<label class="videoHeightToolsText" for="'+PLACEHOLDER_GUID_TOOLS+'-video-height"><h5>Video height (in pixels)</h5><input type="text" maxlength="4" id="'+PLACEHOLDER_GUID_TOOLS+'-video-height" value="'+PLACEHOLDER_VALUE+'"></input>'+
		'<div class="characterLimitContainer"><span class="charactersRemaining">0</span> characters remaining</div></label>'+
		'</div>';

//AUDIO
var PLACEHOLDER_AUDIO_TITLE = "PLACEHOLDER_AUDIO_TITLE";
var PLACEHOLDER_AUDIO_SUBTITLE = "PLACEHOLDER_AUDIO_SUBTITLE";
var PLACEHOLDER_AUDIO_URL = "PLACEHOLDER_AUDIO_URL";




var AUDIO_CONTAINER_TEMPLATE = '<div class="audio-container">' +
	'<h3>'+PLACEHOLDER_AUDIO_TITLE+'</h3>' +
	'<p>'+PLACEHOLDER_AUDIO_SUBTITLE+'</p>' +
	'<audio preload="none" controls>' +
	'<source src="'+PLACEHOLDER_AUDIO_URL+'" type="audio/mp3">' +
	'</audio>' +
	'</div>';

	var AUDIO_TRANSCRIPT_LINK = '<a href="#" class="view-transcript">Show Transcript <span class="caret"></span></a>';

	var AUDIO_TRANSCRIPT_TEXT = '<div class="transcript" style="display:none;">'+PLACEHOLDER_VALUE+'</div>';

var ADD_AUDIOS_BUTTON = '<button class="btnAddAudios button button-white addDelete-Secondary"><span class="fa fa-plus-circle" aria-hidden="true"></span> Add Audios</button>';
var DELETE_AUDIOS_BUTTON = '<button class="btnDeleteAudios button button-white addDelete-Secondary"><span class="fa fa-trash" aria-hidden="true"></span> Delete all audios for this question</button>';

var ADD_AUDIO_BUTTON = '<button class="btnAddAudio button button-white addDelete-Secondary"><span class="fa fa-plus-circle" aria-hidden="true"></span> Add Audio</button>';
var DELETE_AUDIO_BUTTON = '<button class="btnDeleteAudio button button-white addDelete-Secondary"><span class="fa fa-trash" aria-hidden="true"></span> Delete Audio</button>';

var AUDIOS_CONTAINER_TOOLS = '<div class="audiosContainerTools">' +
	'<div class="audiosContainerTextTools"><h5>Audios</h5>' +
	'</div>';

var AUDIO_CONTAINER_TOOLS = '<div class="audioContainerTools">' +
	'<div class="audioContainerTextTools"><h5>Audio</h5>' +
	'</div>';

var AUDIO_TITLE_TEMPLATE_TOOLS = '<div class="audioTitleTools">' +
		'<label class="audioTitleToolsText" for="'+PLACEHOLDER_GUID_TOOLS+'-audio-title"><h5>Title</h5><input type="text" maxlength="3000" id="'+PLACEHOLDER_GUID_TOOLS+'-audio-title" value="'+PLACEHOLDER_VALUE+'"></input>'+
		'<div class="characterLimitContainer"><span class="charactersRemaining">0</span> characters remaining</div></label>'+
		'</div>';

var AUDIO_SUBTITLE_TEMPLATE_TOOLS = '<div class="audioSubtitleTools">' +
		'<label class="audioSubtitleToolsText" for="'+PLACEHOLDER_GUID_TOOLS+'-audio-subtitle"><h5>Subtitle</h5><input type="text" maxlength="3000" id="'+PLACEHOLDER_GUID_TOOLS+'-audio-subtitle" value="'+PLACEHOLDER_VALUE+'"></input>'+
		'<div class="characterLimitContainer"><span class="charactersRemaining">0</span> characters remaining</div></label>'+
		'</div>';

var AUDIO_URL_TEMPLATE_TOOLS = '<div class="audioURLTools">' +
		'<label class="audioURLToolsText" for="'+PLACEHOLDER_GUID_TOOLS+'-audio-url"><h5>Path to audio and filename (example: audio/my_audio.mp4)</h5><input type="text" maxlength="3000" id="'+PLACEHOLDER_GUID_TOOLS+'-audio-url" value="'+PLACEHOLDER_VALUE+'"></input>'+
		'<div class="characterLimitContainer"><span class="charactersRemaining">0</span> characters remaining</div></label>'+
		'</div>';

var AUDIO_TRANSCRIPT_TEXT_TEMPLATE_TOOLS = '<div class="audioTranscriptTextTools">' +
		'<label class="audioTranscriptTextToolsText" for="'+PLACEHOLDER_GUID_TOOLS+'-audio-transcript-text"><h5>Transcript text</h5><input type="text" maxlength="10000" id="'+PLACEHOLDER_GUID_TOOLS+'-audio-transcript-text" value="'+PLACEHOLDER_VALUE+'"></input>'+
		'<div class="characterLimitContainer"><span class="charactersRemaining">0</span> characters remaining</div></label>'+
		'</div>';
		
var TOAST_TEMPLATE = '<div class="savedToast">Data Saved</div>';	

var BANNER_TEMPLATE = '<div class="banner"><span>'+PLACEHOLDER_BANNER_TEXT+'</span></div>';
		
//MODALS
// reset question group
var MODAL_RESET_QUESTION_GROUP = '<div class="hidden" id="modalResetQuestionGroup">'+    
    '<div class="container">'+
        '<h1>Are you sure you want to try this page again? &hellip;</h1>'+
         '<p>If you click <strong>Confirm</strong>, this page will reset and your previous answers will be removed.</p>'+
          '<div class="modalButtonGroupContainer">'+
          	'<button class="modaal-confirm-btn modaal-cancel btnCancel">Cancel</button>'+
          	'<button class="modaal-confirm-btn modaal-ok btnConfirmResetQuestionGroup">Confirm</button>'+            
          '</div>'+
          '<button class="close modaal-close button button-secondary" data-dismiss="modal">Close <span aria-hidden="true"><span class="fa fa-times-circle"></span></span></button>'+
    '</div>'+
'</div>';

// reset quiz
var MODAL_RESET_QUIZ = '<div class="hidden" id="modalResetQuiz">'+
        '<h1>Are you sure you want to try again? &hellip;</h1>'+
        '<p>If you click <strong>Confirm</strong>, the activity will reset and your previous answers will be removed.</p>'+
        '<div class="modalButtonGroupContainer">'+
        	'<button class="modaal-confirm-btn modaal-cancel btnCancel">Cancel</button>'+
        	'<button class="modaal-confirm-btn modaal-ok btnConfirmResetQuiz">Confirm</button>'+
        '</div>'+
       '<button class="close modaal-close button button-secondary" data-dismiss="modal">Close <span aria-hidden="true"><span class="fa fa-times-circle"></span></span></button>'+
'</div>';

// intro
var MODAL_INTRO = '<div id="introModal" class="hidden">'+
    	'<h1 class="modaal-intro-heading">Introduction</h1>'+        
       	'<h2 class="modaal-intro-subheading">Activity Title</h2>'+
        '<div class="modaal-intro-description">'+
            '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>'+ 
            '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>'+
        '</div>'+
        '<button class="modaal-close modaal-close-intro" data-dismiss="modal">Begin <span class="fa fa-chevron-circle-right fa-lg" aria-hidden="true"></span></button>'+ 
    	'<button class="close modaal-close button button-secondary" data-dismiss="modal">Close <span aria-hidden="true"><span class="fa fa-times-circle"></span></span></button>'+ 
'</div>';

var INTRO_MODAL_LINK = '<li><a href="#introModal" class="button-modaal-intro"><span class="fa fa-info fa-lg" aria-hidden="true"></span> Intro</a></li>';

//notes
var MODAL_USER_NOTES = '<div id="userNotesModal" class="hidden">'+
    	'<h1 class="modaal-intro-heading">Notes</h1>'+        
       	'<h2 class="modaal-intro-subheading">Add your notes here...</h2>'+
        '<textarea type="text" maxlength="30000" id="userNotes"></textarea>'+
        '<button class="modaal-close modaal-close-intro" data-dismiss="modal">Begin <span class="fa fa-chevron-circle-right fa-lg" aria-hidden="true"></span></button>'+ 
    	'<button class="close modaal-close button button-secondary" data-dismiss="modal">Close <span aria-hidden="true"><span class="fa fa-times-circle"></span></span></button>'+ 
'</div>';

//tool accordion for question groups
var QUESTION_GROUP_ACCORDION_PANEL_TOOLS = '<div class="accordion-panel">'+
            '<div class="accordion-panel-title">'+
                '<h2><a id="heading'+PLACEHOLDER_QUESTION_GROUP_GUID+'" role="tab" aria-expanded="false" aria-selected="false" aria-controls="collapse'+PLACEHOLDER_QUESTION_GROUP_GUID+'" href="#collapse'+PLACEHOLDER_QUESTION_GROUP_GUID+'">'+
                '<span class="fa fa-plus-circle"></span> <span class="accordion-panel-title-text">Question Group</span></a></h2>'+
                '<span class="aside"></span>'+
            '</div>'+
            '<div class="accordion-panel-content" id="collapse'+PLACEHOLDER_QUESTION_GROUP_GUID+'" role="tabpanel" aria-labelledby="heading'+PLACEHOLDER_QUESTION_GROUP_GUID+'" aria-hidden="true">'+
                '<div class="accordion-panel-item">'+
                    '<div class="accordion-panel-item-text">'+
                   '<p>TEST TEST TEST</p>'+
                    '</div>'+ 
                '</div>'+
            '</div>'+
       '</div>';
       
//TABS
var PLACEHOLDER_TABSET_GUID = "PLACEHOLDER_TABSET_GUID";
var PLACEHOLDER_TAB_PANEL_GUID = "PLACEHOLDER_TAB_PANEL_GUID";
var PLACEHOLDER_TAB_PANEL_TITLE = "PLACEHOLDER_TAB_PANEL_TITLE";

var TAB_MENU_COLLAPSE_TEMPLATE = '<main id="tabset'+PLACEHOLDER_TABSET_GUID+'" class="tab-menu-collapse">';
var TAB_MENU_COLLAPSE_CONTROLLER_TEMPLATE = '<a href="javascript:void(0);" class="tab-menu-collapse-controller" aria-label="View Menu"><span class="fa fa-bars fa-2x"></span></a>';
var TAB_CONTAINER_GRID_TEMPLATE = '<ul class="container-grid" role="tablist" aria-orientation="horizontal"></ul>';
var TAB_PANEL_LINK_TEMPLATE = '<li id="tab'+PLACEHOLDER_TAB_PANEL_GUID+'" class="tab" aria-controls="panel'+PLACEHOLDER_TAB_PANEL_GUID+'" role="tab" aria-selected="false" tabindex="0">'+PLACEHOLDER_TAB_PANEL_TITLE+'</li>';
var TAB_PANEL_LINK_FIRST_TEMPLATE = '<li id="tab'+PLACEHOLDER_TAB_PANEL_GUID+'" class="tab tab-is-selected" aria-controls="panel'+PLACEHOLDER_TAB_PANEL_GUID+'" role="tab" aria-selected="true" tabindex="0">'+PLACEHOLDER_TAB_PANEL_TITLE+'</li>';


var TAB_PANEL_TEMPLATE = '<div id="panel'+PLACEHOLDER_TAB_PANEL_GUID+'" class="container" aria-labelledby="tab'+PLACEHOLDER_TAB_PANEL_GUID+'" role="tabpanel"></div>';

var MEDIA_HEADER_BORDER_TEMPLATE = '<div class="media-header-border container"></div>';
var TAB_MENU_BACKGROUND_TEMPLATE = '<div class="tab-menu-background"></div>';

var TAB_SWITCHER_TEMPLATE = '<div class="tab-switcher-container"></div>';
//NEXT TAB BUTTON
//var PLACEHOLDER_CONTINUE_TO_NEXT_TAB_TEXT = "PLACEHOLDER_CONTINUE_TO_NEXT_TAB_TEXT";
var PLACEHOLDER_TARGET_TAB_GUID = "PLACEHOLDER_TARGET_TAB_GUID";

//var CONTINUE_TO_NEXT_TAB_TEMPLATE = '<h4 class="text-center continueToNextTab">'+PLACEHOLDER_CONTINUE_TO_NEXT_TAB_TEXT+'</h4>';
var CONTINUE_TO_NEXT_TAB_BUTTON_TEMPLATE = '<button class="button-large button-primary tab-switcher" data-newtabid="'+PLACEHOLDER_TARGET_TAB_GUID+'">Continue <span class="fa fa-chevron-circle-right fa-lg" aria-hidden="true"></span></button>';

//PREVIOUS TAB BUTTON
//var PLACEHOLDER_RETURN_TO_PREVIOUS_TAB_TEXT = "PLACEHOLDER_RETURN_TO_PREVIOUS_TAB_TEXT";

//var RETURN_TO_PREVIOUS_TAB_TEMPLATE = '<h4 class="text-center returnToPreviousTab">'+PLACEHOLDER_RETURN_TO_PREVIOUS_TAB_TEXT+'</h4>';
var RETURN_TO_PREVIOUS_TAB_BUTTON_TEMPLATE = '<button class="button-large button-secondary tab-switcher" data-newtabid="'+PLACEHOLDER_TARGET_TAB_GUID+'"><span class="fa fa-chevron-circle-left fa-lg" aria-hidden="true"></span> Previous</button>';

//SCORE BAR (LIKERT SCALE)
var PLACEHOLDER_SCORE_BAR_LABEL = "PLACEHOLDER_SCORE_BAR_LABEL";
var PLACEHOLDER_SCORE_BAR_VALUE = "PLACEHOLDER_SCORE_BAR_VALUE";
var SCORE_BAR_CONTAINER_GUID = "SCORE_BAR_CONTAINER_GUID";
var SCORE_BAR_GUID = "SCORE_BAR_GUID";
var PLACEHOLDER_SCORE_BAR_DESCRIPTION = "PLACEHOLDER_SCORE_BAR_DESCRIPTION";
var PLACEHOLDER_WIDTH = "PLACEHOLDER_WIDTH";
var PLACEHOLDER_SCORE_BAR_QUESTION_COUNT = "PLACEHOLDER_SCORE_BAR_QUESTION_COUNT";


var CATEGORY_SCORE_BAR_CONTAINER_TEMPLATE = '<div class="categoryScoreBarContainer" id="'+SCORE_BAR_CONTAINER_GUID+'">'+
									'<div class="scoreBarLabel">'+PLACEHOLDER_SCORE_BAR_LABEL+'<span class="scoreBarQuestionCount">'+PLACEHOLDER_SCORE_BAR_QUESTION_COUNT+'</span></div>'+
									'<div class="scoreBarContainer">'+
									'<div class="scoreBar" role="status" id="'+SCORE_BAR_CONTAINER_GUID+'-bar" aria-describedby="'+SCORE_BAR_CONTAINER_GUID+'-description" tabindex="0" style="width:'+PLACEHOLDER_WIDTH+'">'+
									'<span id="'+SCORE_BAR_CONTAINER_GUID+'-description">'
									'<span class="status-value">'+PLACEHOLDER_SCORE_BAR_VALUE+'</span>'+
									'</span>'+
									'</div>'+
									'</div>';
									
var CATEGORY_SCORE_BAR_CONTAINER_PARENT_TEMPLATE = '<div class="categoryScoreBarContainerParent" id="'+SCORE_BAR_CONTAINER_GUID+'">'+
									'<div class="scoreBarLabel">'+PLACEHOLDER_SCORE_BAR_LABEL+'<span class="scoreBarQuestionCount">'+PLACEHOLDER_SCORE_BAR_QUESTION_COUNT+'</span></div>'+
									'<div class="scoreBarContainer">'+
									'<div class="scoreBar" role="status" id="'+SCORE_BAR_CONTAINER_GUID+'-bar" aria-describedby="'+SCORE_BAR_CONTAINER_GUID+'-description" tabindex="0" style="width:'+PLACEHOLDER_WIDTH+'">'+
									'<span id="'+SCORE_BAR_CONTAINER_GUID+'-description">'
									'<span class="status-value">'+PLACEHOLDER_SCORE_BAR_VALUE+'</span>'+
									'</span>'+
									'</div>'+
									'</div>';






//TRANSCRIPT
var PLACEHOLDER_MEDIA_ID = 'PLACEHOLDER_MEDIA_ID';
var PLACEHOLDER_QUIZ_TITLE = 'PLACEHOLDER_QUIZ_TITLE';
var PLACEHOLDER_QUIZ_SUBTITLE = 'PLACEHOLDER_QUIZ_TITLE';
var PLACEHOLDER_QUIZ_INTRO_TITLE = 'PLACEHOLDER_QUIZ_INTRO_TITLE';
var PLACEHOLDER_QUIZ_INTRO_DESCRIPTION = 'PLACEHOLDER_QUIZ_INTRO_DESCRIPTION';
var PLACEHOLDER_QUIZ_INSTRUCTIONS_HEADER = 'PLACEHOLDER_QUIZ_INSTRUCTIONS_HEADER';
var PLACEHOLDER_QUIZ_INSTRUCTIONS_DESCRIPTION = 'PLACEHOLDER_QUIZ_INSTRUCTIONS_DESCRIPTION';
var PLACEHOLDER_CORRECT_ANSWER = 'PLACEHOLDER_CORRECT_ANSWER';
var PLACEHOLDER_SELECTED_ANSWER = 'PLACEHOLDER_SELECTED_ANSWER';
var PLACEHOLDER_QUESTION_FEEDBACK = "PLACEHOLDER_QUESTION_FEEDBACK";
var PLACEHOLDER_QUESTION_GROUP_FEEDBACK = "PLACEHOLDER_QUESTION_FEEDBACK";
var PLACEHOLDER_ANSWER_FEEDBACK = "PLACEHOLDER_ANSWER_FEEDBACK";
var PLACEHOLDER_QUIZ_FEEDBACK = "PLACEHOLDER_QUIZ_FEEDBACK";
var PLAHOLDER_QUIZ_SCORE = "PLAHOLDER_QUIZ_SCORE";
var PLACEHOLDER_QUIZ_TOTAL_POSSIBLE_POINTS = "PLACEHOLDER_QUIZ_TOTAL_POSSIBLE_POINTS";
var PLACEHOLDER_NUMBER_OF_ATTEMPTS = "PLACEHOLDER_NUMBER_OF_ATTEMPTS";	
var PLACEHOLDER_QUESTION_POINTS = "PLACEHOLDER_QUESTION_POINTS";
var PLACEHOLDER_TOTAL_QUESTION_POINTS = "PLACEHOLDER_TOTAL_QUESTION_POINTS";

var TRANSCRIPT_SECTION_HEADER_TEMPLATE = '<section>'+
										'</section>/';
										
var TRANSCRIPT_TITLE = 	'<h1 id="mediaId">'+PLACEHOLDER_QUIZ_TITLE+'</h1>'+
										'<h2>'+PLACEHOLDER_QUIZ_SUBTITLE+'</h2>';
										
var TRANSCRIPT_INTRO = 	'<h3>Introduction</h3>'+
						'<p>'+PLACEHOLDER_QUIZ_INTRO_DESCRIPTION+'</p>';
						
var TRANSCRIPT_INSTRUCTIONS = '<p>'+PLACEHOLDER_QUIZ_INSTRUCTIONS_HEADER+'</p>' +
								'<p>'+PLACEHOLDER_QUIZ_INSTRUCTIONS_DESCRIPTION+'</p>';
										
var TRANSCRIPT_SECTION_MAIN_TEMPLATE = '<section id="main" aria-labelledby="mainContent"></section>';

var TRANSCRIPT_MAIN_CONTENT_HEADER_TEMPLATE = '<h2 id="mainContent"></h2>';
var TRANSCRIPT_QUESTION_GROUP_TITLE = '<h3 class="transcriptQuestionGroupTitle">'+PLACEHOLDER_QUESTION_GROUP_TITLE+'</h3>';
var TRANSCRIPT_QUESTION_GROUP_DESCRIPTION = '<p class="transcriptQuestionGroupDescription">'+PLACEHOLDER_QUESTION_GROUP_DESCRIPTION+'</p>';										

var TRANSCRIPT_QUESTION_TEXT = '<h4>'+PLACEHOLDER_QUESTION_QUESTION_TEXT+'</h4>';
var TRANSCRIPT_ANSWERS_LIST_CONTAINER = '<ol class="lower-alpha"></ol>';
var TRANSCRIPT_ANSWER_TEXT = '<li>'+PLACEHOLDER_ANSWER_DATA_ANSWER_TEXT+'</li>'
var TRANSCRIPT_QUESTION_NOT_ANSWERED = '<p><strong>This question has not yet been answered.</strong></p>';
var TRANSCRIPT_ANSWER_CORRECT_TEXT = '<p><strong>The correct answer is '+PLACEHOLDER_CORRECT_ANSWER+'.</strong></p>';
var TRANSCRIPT_SELECTED_ANSWER_TEXT = '<p><strong>Your answer is '+PLACEHOLDER_SELECTED_ANSWER+'.</strong></p>';
var TRANSCRIPT_ANSWERS_CORRECT_TEXT = '<p><strong>The correct answers are '+PLACEHOLDER_CORRECT_ANSWER+'.</strong></p>';
var TRANSCRIPT_SELECTED_ANSWERS_TEXT = '<p><strong>Your answers are '+PLACEHOLDER_SELECTED_ANSWER+'.</strong></p>';

var TRANSCRIPT_CONCLUSION_CONTAINER = '<section id="conclusion" aria-labelledby="conclusionContent">';
var TRANSCRIPT_CONCLUSION_CONTENT = '<h3 id="conclusionContent" class="section-title">Feedback</h3>';
var TRANSCRIPT_QUESTION_FEEDBACK = '<p class="transcriptQuestionFeedback">'+PLACEHOLDER_QUESTION_FEEDBACK+'</p>';
var TRANSCRIPT_QUESTION_GROUP_FEEDBACK = '<p class="transcriptQuestionGroupFeedback">'+PLACEHOLDER_QUESTION_GROUP_FEEDBACK+'</p>';
var TRANSCRIPT_ANSWER_FEEDBACK = '<p class="transcriptAnswerFeedback">'+PLACEHOLDER_ANSWER_FEEDBACK+'<p>';
var TRANSCRIPT_QUIZ_FEEDBACK = '<p class="transcriptQuizFeedback"><span class="transcriptQuizFeedbackHeader">Congratulations!<br/><br/></span>'+PLACEHOLDER_QUIZ_FEEDBACK+'</p>';
var TRANSCRIPT_QUIZ_SCORE = '<p class="transcriptQuizScore">You correctly answered <span class="transcriptTotalScore"><strong>'+PLAHOLDER_QUIZ_SCORE+'</strong></span> out of a possible <span class="transcriptTotalPossiblePoints">'+PLACEHOLDER_QUIZ_TOTAL_POSSIBLE_POINTS+'</span></p>';

var TRANSCRIPT_NUMBER_OF_QUESTION_ATTEMPTS = '<p class="transcriptQuestionAttempts"><strong>You took '+PLACEHOLDER_NUMBER_OF_ATTEMPTS+' attempts to answer this question correctly.</strong></p>';
var TRANSCRIPT_NUMBER_OF_QUESTION_ATTEMPT = '<p class="transcriptQuestionAttempts"><strong>You took '+PLACEHOLDER_NUMBER_OF_ATTEMPTS+' attempt to answer this question correctly.</strong></p>';

var TRANSCRIPT_QUESTION_POINTS = '<p class="transcriptQuestionPoints"><strong>You scored '+PLACEHOLDER_QUESTION_POINTS+' points out of a possible '+PLACEHOLDER_TOTAL_QUESTION_POINTS+'.</strong></p>';
var TRANSCRIPT_QUESTION_POINT = '<p class="transcriptQuestionPoints"><strong>You scored '+PLACEHOLDER_QUESTION_POINTS+' point out of a possible '+PLACEHOLDER_TOTAL_QUESTION_POINTS+'.</strong></p>';
//PROGRESS (for Flashcards)
var PLACEHOLDER_PROGRESS_VALUE = "PLACEHOLDER_PROGRESS_VALUE";
var PROGRESS_CONTAINER_TEMPLATE = '<div class="quizProgressContainer">' +
									'<div>You have completed <strong><span class="progressValue">0</span></strong> percent of the exercise.</div>' +
									'<div class="progressButtonsContainer button-group-justified">'+
            							'<a class="btnShowProgress button button-primary" href="#modalProgress">Show Progress</a>'+
            						'</div>'+
								  '</div>';
								  
var MODAL_PROGRESS = '<div id="modalProgress" class="hidden">'+
    	'<h1 class="modaal-progress-heading">Activity Progress</h1>'+        
       	'<h4 class="modaal-progress-subheading">Click an item to go to that question.</h4>'+
        /*'<div class="modaal-intro-description">'+
            '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>'+ 
            '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>'+
        '</div>'+*/
    	'<div class="modalProgressDataContainer"></div>'+
    	 '<button class="modaal-close modaal-close-intro" data-dismiss="modal">Close </button>'+
    	'<button class="close modaal-close button button-secondary" data-dismiss="modal">Close <span aria-hidden="true"><span class="fa fa-times-circle"></span></span></button>'+ 
'</div>'
    	
var PLACEHOLDER_QUESTION_STATUS = "PLACEHOLDER_QUESTION_STATUS";    	
    	
/*var MODAL_PROGRESS_DATA_ITEM = '<div class="modalProgressDataItem">'+
	'<span class="modalProgressDataItemLabel"><strong>'+PLACEHOLDER_QUESTION_QUESTION_TEXT+':</strong> </span>'+
	'<span class="modalProgressDataItemData">'+PLACEHOLDER_QUESTION_STATUS+'</span>'+
'</div>';
*/


var MODAL_PROGRESS_DATA_ITEM_CONTAINER = '<div class="modalProgressDataItemContainer"></div>';
var MODAL_PROGRESS_DATA_ITEM_CONTAINER_ACTIVE = '<div class="modalProgressDataItemContainer active"></div>';

var MODAL_PROGRESS_STATUS_ICON_CORRECT = '<div class="modalProgressIcon modalProgressIconCorrect fa fa-square fa-3x"></div>';
var MODAL_PROGRESS_STATUS_ICON_INCORRECT = '<div class="modalProgressIcon modalProgressIconIncorrect fa fa-square fa-3x"></div>';
var MODAL_PROGRESS_STATUS_ICON_INCOMPLETE = '<div class="modalProgressIcon modalProgressIconIncomplete fa fa-circle fa-3x"></div>';

var MODAL_PROGRESS_QUESTION_LINK = '<a class="modalProgressQuestionLink" href="javascript:void(0);">'+PLACEHOLDER_QUESTION_NUMBER+'</a>';


var QUESTION_GROUP_FEEDBACK_TEXT_PLACEHOLDER = "QUESTION_GROUP_FEEDBACK_TEXT_PLACEHOLDER";

var QUESTION_GROUP_FEEDBACK_CONTAINER_TEMPLATE = '<div class="questionGroupFeedback">' +
		'<div class="questionGroupFeedbackTextContainer">' +
             '<div class="questionGroupFeedbackHeader">Feedback</div>' +
              '<div class="questionGroupFeedbackText">'+QUESTION_GROUP_FEEDBACK_TEXT_PLACEHOLDER+'</div>' +
       '</div>' +
 '</div>';
 
 var BOOKMARK = '<div class="bookmark fa fa-bookmark fa-2x"></div>';
 
 var PROGRESS_BOOKMARK = '<div class="progressBookmark bookmark fa fa-bookmark fa-2x"></div>';
 

