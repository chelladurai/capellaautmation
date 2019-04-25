<!--#include virtual="/CourseMedia/includes/SSOHeader.asp" -->
<!--#include virtual="/Courseroom/api/lti/setLTIParams.asp" -->

<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">

<!-- can also be set dymamically from quizData.quizTitle -->
<title></title>

<!--#include virtual="/CourseMedia/includes/web/2.0/header-responsive.asp" -->

<!-- QUIZ COMMON -->
<link rel="stylesheet" type="text/css" href="/CourseMedia/QuizEngine/common/app/css/main.css" /> 
<!-- <link rel="stylesheet" type="text/css" href="/common/coursemedia-patterns/css/transcript.min.css"> -->

<!-- APP -->
<link rel="stylesheet" type="text/css" href="css/main-app.css" />

<!-- MEDIA PLAYER -->
<link rel="stylesheet" type="text/css" href="/js/capella/media/4.0/mejs-capella4.2.4/mediaelementplayer.min.css">
<link rel="stylesheet" type="text/css" href="/js/capella/media/4.0/mejs-capella4.2.4/mejs-skins.css">
<link rel="stylesheet" type="text/css" href="/js/capella/media/4.0/mejs-capella4.2.4/mejs-capella.css">


</head>

<body class="capella-media">
    
    <header class="media-header">
        <div class="container-grid">
            <div class="media-header-title">
                <h1 id="wcagHeading1"><span class="secondary-text"></span></h1>
            </div>
            <div class="media-header-logo">
                <img src="/common/coursemedia-patterns/images/capella_logo.svg" alt="Capella Logo" />
            </div>
        </div>
    </header>

    <div id="mainContent" class="module" aria-labelledby="wcagHeading1"></div>

    <footer class="media-footer">
        <div class="media-footer-container">
            <ul class="media-footer-links">
                <!-- Note: use the .modal-intro-button class if you need an introduction modal. -->
                <!-- Remove following links below if not needed.  -->
                <!-- <li><a href="#introModal" class="button-modaal-intro"><span class="fa fa-info fa-lg" aria-hidden="true"></span> Intro</a></li> -->
            </ul>
            <ul class="media-footer-links">
                <li><a href="transcript.asp" rel="alternate" target="_blank"><span class="fa fa-file-text fa-lg" aria-hidden="true"></span> Transcript</a></li>
                <li><a href="Javascript:Feedback();"><span class="fa fa-comments fa-lg" aria-hidden="true"></span> Was this media helpful?</a></li>
            </ul>
        </div>
    
        <p class="media-footer-license">Licensed under a <a href="https://creativecommons.org/licenses/by-nc-nd/3.0/" rel="license">Creative Commons Attribution 3.0 License</a>.</p>
    </footer>
    <!-- ##### This is an include for the default script tags.  ##### -->
    <!--#include virtual="/CourseMedia/includes/web/2.0/footer-responsive.asp" -->
    
    <!-- CONFIGS -->
    <script type="text/javascript" src="/CourseMedia/QuizEngine/common/app/js/config.js"></script>
    <script type="text/javascript" src="js/config-app.js"></script>
    
    <!-- GLOBAL UTILS -->
    <script src="/js/utils/logging.js"></script>
    <script src="/js/utils/helpers.js"></script> 
    
    <!-- INTEGRATIONS -->
    <!-- need config files before data calls -->
    <script src="/Hubble/hubbleServices.js"></script>
    <script src="/IME/v2/IME.2.10.js"></script>
    
    <!-- MEDIA PLAYER -->
    <script src="/js/capella/media/4.0/mejs-capella4.2.4/mediaelement-and-player.min.js"></script>
    
    <!-- COURSEROOM -->
    <script src="/Courseroom/api/courseroomServices.js"></script>
    
    <!-- PATTERNS -->
    <script src="/common/coursemedia-patterns/js/tab-menu-collapse.min.js"></script>
    <script src="/common/coursemedia-patterns/js/pagination.min.js"></script>
    
    <!-- QUIZ COMMON -->
    <script type="text/javascript" src="/CourseMedia/QuizEngine/common/app/js/enum.js"></script>
    <script type="text/javascript" src="/CourseMedia/QuizEngine/common/app/js/helpers.js"></script>
    <script type="text/javascript" src="/CourseMedia/QuizEngine/common/app/js/templates.js"></script>
    <script type="text/javascript" src="js/main.js"></script>
    
    <!-- APP -->
    <script type="text/javascript" src="js/main-app.js"></script>

</body>
</html>