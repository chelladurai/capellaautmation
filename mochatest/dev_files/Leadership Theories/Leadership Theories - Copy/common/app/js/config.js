var locale="en/US";
IS_DEBUG = true;

var SAVE_DATA_TEMPLATE = {
	'multiplechoicequestions' : [],
	'multipleselectquestions' : [],
	'fillintheblankquestions' : [],
	'expertresponsequestions': []
}

var DATA_PATH = "/CourseMedia/QuizEngine/data/";

var NEW_QUIZ_TEMPLATE = {
	'usePagination': false,
	'isFlashcards': false,
	'useAttemptsScore': false,
	'usePassPercentage': false,
	'passPercentage': 0,
	'useGradebook': false,
	'sendScoreToGradebook': false,
	'showScore': true,
	'feedbackType':'Question',
	'quizTitle': '',
	'quizDescription': '',
	'quizCompleteFeedback': '',
	'questionGroups': [
	],
	'notes':''
};

//properties that should only be set by a member of course media. Not exposed through the tool
var mediaFeatures = {
	'useWrapperForModals':false,
	'useWrapperForContainers':false
}

//IME_OVERRIDE_USER_ID = "MTAYLOR87";

//Max number of each answerallowed by UI, rest will be discarded
//var MAX_NUMBER_OF_MULTIPLE_CHOICE_ANSWERS_ALLOWED = 4;
//var MAX_NUMBER_OF_MULTIPLE_SELECT_ANSWERS_ALLOWED = 4;
//var MAX_NUMBER_OF_FILL_IN_THE_BLANK_ANSWERS_ALLOWED = 4;
//