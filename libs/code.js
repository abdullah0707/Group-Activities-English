var canvas, stage, exportRoot, anim_container, dom_overlay_container, fnStartAnimation;


var soundsArr;
var video, video_div;
var timeOutPlay;
var clickSd, goodSd, errorSd,
    rightFbSd, wrongFbSd, timeFbSd, psvBbSfx,timeOutSd,timeOutSdFB,
    infoSd, intro, nashat, timeOutFBSd, tryFbSd;

    numOfPlaces = 5;

    timerOut = 0;

    score = 0;

    allAnswer = [];

    questionsScore = [ 'a1', 'a5', 'a7', 'a10', 'a12'];

    countQuestion= 0;

    answerName = '';

    retryV = false;

    soundPlaying = false;
    soundMuted = false,
    correctAns = false;
    sounding = false;

    attempts = 0;

    maxAttempts = 3;

    overAll = [];

    l = console.log;

/*========Start=======*/

var correctAnswersCountV = 0;

/*========End=======*/

function init() {
    canvas = document.getElementById("canvas");
    anim_container = document.getElementById("animation_container");
    dom_overlay_container = document.getElementById("dom_overlay_container");
    var comp = AdobeAn.getComposition("E4F19BB66F67C44DB576643A0E5ED002");
    var lib = comp.getLibrary();
    var loader = new createjs.LoadQueue(false);
    loader.addEventListener("fileload", function (evt) {
        handleFileLoad(evt, comp)
    });
    loader.addEventListener("complete", function (evt) {
        handleComplete(evt, comp)
    });
    var lib = comp.getLibrary();
    loader.loadManifest(lib.properties.manifest);
}

function handleFileLoad(evt, comp) {
    var images = comp.getImages();
    if (evt && (evt.item.type == "image")) {
        images[evt.item.id] = evt.result;
    }
}

// All Answers Questions
function initExportRoot(exportRoot){
	allAnswer = [
		exportRoot["a1"],
		exportRoot["a2"],
		exportRoot["a3"],
		exportRoot["a4"],
		exportRoot["a5"],
		exportRoot["a6"],
		exportRoot["a7"],
		exportRoot["a8"],
		exportRoot["a9"],
		exportRoot["a10"],
		exportRoot["a11"],
		exportRoot["a12"],
		exportRoot["a13"],
		
	]
	
}

function handleComplete(evt, comp) {
    //This function is always called, irrespective of the content. You can use the variable "stage" after it is created in token create_stage.
    var lib = comp.getLibrary();
    var ss = comp.getSpriteSheet();
    var queue = evt.target;
    var ssMetadata = lib.ssMetadata;
    for (i = 0; i < ssMetadata.length; i++) {
        ss[ssMetadata[i].name] = new createjs.SpriteSheet({
            "images": [queue.getResult(ssMetadata[i].name)],
            "frames": ssMetadata[i].frames
        })
    }
    exportRoot = new lib.SpWP06();
	initExportRoot(exportRoot);
    stage = new lib.Stage(canvas);
    //Registers the "tick" event listener.
    fnStartAnimation = function () {
        stage.addChild(exportRoot);
        stage.enableMouseOver(10);
        createjs.Touch.enable(stage);
        document.ontouchmove = function (e) {
            e.preventDefault();
        }
        stage.mouseMoveOutside = true;
        stage.update();
        createjs.Ticker.setFPS(lib.properties.fps);
        createjs.Ticker.addEventListener("tick", stage);
        prepareTheStage();
    }
    //Code to support hidpi screens and responsive scaling.
    function makeResponsive(isResp, respDim, isScale, scaleType) {
        var lastW, lastH, lastS = 1;
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        function resizeCanvas() {
            var w = lib.properties.width,
                h = lib.properties.height;
            var iw = window.innerWidth,
                ih = window.innerHeight;
            var pRatio = window.devicePixelRatio || 1,
                xRatio = iw / w,
                yRatio = ih / h,
                sRatio = 1;
            if (isResp) {
                if ((respDim == 'width' && lastW == iw) || (respDim == 'height' && lastH == ih)) {
                    sRatio = lastS;
                } else if (!isScale) {
                    if (iw < w || ih < h)
                        sRatio = Math.min(xRatio, yRatio);
                } else if (scaleType == 1) {
                    sRatio = Math.min(xRatio, yRatio);
                } else if (scaleType == 2) {
                    sRatio = Math.max(xRatio, yRatio);
                }
            }
            canvas.width = w * pRatio * sRatio;
            canvas.height = h * pRatio * sRatio;
            canvas.style.width = dom_overlay_container.style.width = anim_container.style.width = w * sRatio + 'px';
            canvas.style.height = anim_container.style.height = dom_overlay_container.style.height = h * sRatio + 'px';
            stage.scaleX = pRatio * sRatio;
            stage.scaleY = pRatio * sRatio;
            lastW = iw;
            lastH = ih;
            lastS = sRatio;
            stage.tickOnUpdate = false;
            stage.update();
            stage.tickOnUpdate = true;
        }
    }
    makeResponsive(true, 'both', true, 1);
    AdobeAn.compositionLoaded(lib.properties.id);
    fnStartAnimation();
    exportRoot["playBtn"].cursor = "pointer";
    exportRoot["playBtn"].addEventListener("click", playFlash);

    exportRoot["starBtn"].cursor = "pointer";
    exportRoot["starBtn"].addEventListener("click", playFlash);
    exportRoot["starBtn"].addEventListener("mouseover", over);
    exportRoot["starBtn"].addEventListener("mouseout", out);

    exportRoot["muteBtn"].cursor = "pointer";
    exportRoot["muteBtn"].addEventListener("click", muteFn);

    // exportRoot["playBtn2"].cursor = "pointer";
    // exportRoot["playBtn2"].addEventListener("click", playFlash);
    // exportRoot["playBtn2"].addEventListener("mouseover", over);
    // exportRoot["playBtn2"].addEventListener("mouseout", out);

}

function stopAllSounds() {
    for (var s = 0; s < soundsArr.length; s++) {
        soundsArr[s].stop();
    }
}

function playFlash() {
    stopAllSounds();
    clickSd.play();
    exportRoot.play();
    
}

function playVideo(){
    

    exportRoot["playBtn"].alpha=0;
    exportRoot["playBtn"].removeEventListener("click", playVideo);
    video_div = document.getElementById("videoPlay").style.display = "inline-block";
    
    video = document.getElementById('videoPlay').play();
    setTimeout(function(){
        exportRoot.gotoAndStop(2);
    }, 300);
    document.getElementById("videoPlay").onended = function() {videoStart()};

    // exportRoot.play();
}

function videoStart() {
    document.getElementById("videoPlay").style.display = "none";
    exportRoot.play();
    intro.play();
    console.log("Play");
};

function prepareTheStage() {
    overAll = [
		exportRoot["confirmBtn"],
		exportRoot["showAnsBtn"],
		exportRoot["retryBtn"],
		// exportRoot["startBtn"],
	];

	overAll.forEach(function(el) {
			el.cursor = "pointer";
			el.addEventListener("mouseover", over);
			el.addEventListener("mouseout", out);
	});

    clickSd = new Howl({
        src: ['sounds/click.mp3']
    });
    goodSd = new Howl({
        src: ['sounds/good.mp3']
    });
    errorSd = new Howl({
        src: ['sounds/error.mp3']
    });
    rightFbSd = new Howl({
        src: ['sounds/rightFbSd.mp3']
    });
    wrongFbSd = new Howl({
        src: ['sounds/wrongFbSd.mp3']
    });
    tryFbSd = new Howl({
        src: ['sounds/tryFbSd.mp3']
    });
    nashat = new Howl({
        src: ['sounds/nashat.mp3']
    });
    intro = new Howl({
        src: ['sounds/intro.mp3']
    });
    quizSd = new Howl({
        src: ['sounds/quizSd.mp3']
    });
    timeFbSd = new Howl({
        src: ['sounds/timeFbSd.mp3']
    });
    infoSd = new Howl({
        src: ['sounds/infoSd.mp3']
    });
    timeOutSd = new Howl({
        src: ['sounds/timeOutSd.mp3']
    });
    timeOutSdFB = new Howl({
        src: ['sounds/timeOutSdFB.mp3']
    });

    soundsArr = [clickSd, goodSd, errorSd, quizSd, timeFbSd, infoSd,
                 rightFbSd, timeOutSd,timeOutSdFB, wrongFbSd, intro, nashat, tryFbSd];
    fbSdArr = [infoSd];
    stopAllSounds();

    // exportRoot["startBtn"].addEventListener("click", function () {
        /*========Start=======*/
        // startTimeFn();
        /*========End=======*/
        // playFn();
    // });
    exportRoot["nextBtn"].addEventListener("click", nextQFn);
    exportRoot["retryBtn"].addEventListener("click", retryFN);
    exportRoot["showAnsBtn"].addEventListener("click", function () {
        stopAllSounds();
        exportRoot["showAnsBtn"].alpha = 0;
        exportRoot["answers"].alpha = 1;
        exportRoot["answers"].gotoAndPlay(0);
    });

    hideFB();

    for (var s = 0; s < fbSdArr.length; s++) {
        fbSdArr[s].on("end", function () {
            exportRoot["muteBtn"].gotoAndStop(2);
            unmuteAllSounds();
            soundMuted = false;
            soundPlaying = false;
            console.log("soundPlaying = false");
            //activateButtons();
        });
    }
}

function unmuteAllSounds() {
    for (var s = 0; s < fbSdArr.length; s++) {
        fbSdArr[s].mute(false);
    }
}

function playFn() {

    exportRoot.play();

}

function hideFB() {

    exportRoot["wrongFB"].alpha = 0;
    exportRoot["wrongFB"].playV = false;

    exportRoot["rightFB"].alpha = 0;
    exportRoot["rightFB"].playV = false;

    exportRoot["tryFB"].alpha = 0;
    exportRoot["tryFB"].playV = false;

    // exportRoot["timeOutFB"].alpha = 0;
    // exportRoot["timeOutFB"].playV = false;

    exportRoot["hideSymb"].alpha = 0;
    exportRoot["hideSymb"].playV = false;

    exportRoot["answers"].alpha = 0;
    exportRoot["answers"].playV = false;

    exportRoot["retryBtn"].alpha = 0;
    exportRoot["retryBtn"].gotoAndStop(0);

    exportRoot["nextBtn"].alpha = 0;
    exportRoot["nextBtn"].gotoAndStop(0); 

    exportRoot["showAnsBtn"].alpha = 0;
    exportRoot["showAnsBtn"].gotoAndStop(0);

    exportRoot["confirmBtn"].alpha = 0;
    exportRoot["confirmBtn"].gotoAndStop(0);

}

function muteFn(e) {
//hideFB();
//stopAllSounds();
clickSd.play();

if (soundPlaying == false) {

    infoSd.mute(true);
    console.log("infoSd.mute");
    exportRoot["muteBtn"].gotoAndStop(1);
        soundPlaying = true;
} else {
    exportRoot["muteBtn"].gotoAndStop(0);
    // e.currentTarget.gotoAndStop(0);
    infoSd.mute(false);
    soundPlaying = false;
}

}

function activateButtons() {
    
	//ForEach on array and add events mouse and stop all buttons.
	allAnswer.forEach(function(el) {
		el.gotoAndStop(0);
		el.cursor = "pointer";
		el.addEventListener("mouseover", over2);
		el.addEventListener("mouseout", out);
        el.addEventListener("click", showFB);
		
	});
}

// Show Next Questions And Select Answer
function showFB(e){

	clickSd.play(); // Sounds Click

    exportRoot["nextBtn"].alpha = 1;
    exportRoot["nextBtn"].cursor = "pointer";
    exportRoot["nextBtn"].addEventListener("mouseover", over);
    exportRoot["nextBtn"].addEventListener("mouseout", out);
    exportRoot["nextBtn"].addEventListener("click", nextQFn);

    exportRoot["confirmBtn"].alpha = 1;
    exportRoot["confirmBtn"].cursor = "pointer";
    exportRoot["confirmBtn"].addEventListener("click", confirmFN);

	activateButtons(); // Add Event Mouse Button After Select
	
	e.currentTarget.gotoAndStop(2); // Active Button click After Select
	e.currentTarget.cursor = "default"; // Active Button Cursor Default After Select
	e.currentTarget.removeEventListener("mouseover", over2); // Remove Mouse Event Over After Select
	e.currentTarget.removeEventListener("mouseout", out); // Remove Mouse Event Out After Select
	e.currentTarget.removeEventListener("click", showFB); // Remove Mouse Event Click After Select

	answerName = e.currentTarget.name; //Export Name Answers After Next

}

function deactivateButtons() {
    //ForEach on array and add events mouse and stop all buttons.
	allAnswer.forEach(function(el) {
		el.gotoAndStop(0)
		el.cursor = "default";
		el.removeEventListener("click", showFB);
		el.removeEventListener("mouseover", over2);
		el.removeEventListener("mouseout", out);
	});

    exportRoot["confirmBtn"].cursor = "auto";
    exportRoot["confirmBtn"].removeEventListener("click", confirmFN);

}


// function confirmFN() {

//     // clearInterval(timeOutPlay);
//     hideFB();
//     clickSd.play();
//     deactivateButtons();
//     counterAnswer();
    
//     if (countQuestion == numOfPlaces) {
        
//         if (score == numOfPlaces) {
//             /*========Start=======*/
//             correctAnswersCountV++;
//             /*========End=======*/
//             exportRoot["rightFB"].playV = true;
//             exportRoot["rightFB"].alpha = 1;
//             exportRoot["rightFB"].gotoAndPlay(0);
//             console.log("rightFB");
//             /*========Start=======*/
//             finalSendMessageFn();
//             /*========End=======*/
//         } else {
//             exportRoot["tryFB"].playV = true;
//             exportRoot["tryFB"].alpha = 1;
//             exportRoot["tryFB"].gotoAndPlay(0);
//             console.log("tryFB"); 
//         }
//     }else if (countQuestion < numOfPlaces) {

//     	createjs.Tween.get(exportRoot["hideSymb"], {
//             override: true
//         }).to({
//             alpha: 1
//         }, 400, createjs.Ease.easeOut).call(function(){
//             exportRoot.play();
//             countQuestion++;
//             createjs.Tween.get(exportRoot["hideSymb"], {
//                 override: true
//             }).to({
//                 alpha: 0
//             }, 200, createjs.Ease.easeOut);
//         });
//             // exportRoot["timerSymb"].gotoAndStop(0);
//             // timerOut= 0;
//             // timeOutFB();
//             activateButtons();
// }

// } 

function confirmFN() {
    
    hideFB();
    countQuestion++;
    deactivateButtons();
    counterAnswer();
    if (countQuestion == numOfPlaces) {
        clearInterval(timeOutPlay);
    if (score == numOfPlaces) {
        /*========Start=======*/
        correctAnswersCountV++;
        /*========End=======*/
        exportRoot["rightFB"].playV = true;
        exportRoot["rightFB"].alpha = 1;
        exportRoot["rightFB"].gotoAndPlay(0);
        console.log("rightFB");
        /*========Start=======*/
        finalSendMessageFn();
        /*========End=======*/
    } else {
        attempts++;
		if (attempts == maxAttempts) {
			exportRoot["wrongFB"].playV = true;
			exportRoot["wrongFB"].alpha = 1;
			exportRoot["wrongFB"].gotoAndPlay(0);
         //  setTimeout(function(){exportRoot.showAnsBtn.alpha=1;},6500);      

		} else {
			exportRoot["tryFB"].playV = true;
			exportRoot["tryFB"].alpha = 1;
			exportRoot["tryFB"].gotoAndPlay(0);
          // setTimeout(function(){exportRoot.retryBtn.alpha=1;},5500);
		}
    }
} else {
    nextQFn()
}

}

function nextQFn(){
    countQuestion++;
    counterAnswer();
    exportRoot.addChild(exportRoot["hideSymb"]);
    createjs.Tween.get(exportRoot["hideSymb"], {
        override: true
    }).to({
        alpha: 1
    }, 300, createjs.Ease.easeOut).call(function(){
        exportRoot.play();
      //  exportRoot["timerSymb"].gotoAndStop(timerFrame);
        createjs.Tween.get(exportRoot["hideSymb"], {
            override: true
        }).to({
            alpha: 0
        }, 100, createjs.Ease.easeOut);
        setTimeout(activateButtons, 100);
       // setTimeout(Timer, 150);  
    });
    hideFB();
}


function counterAnswer(){
    var i = countQuestion;
	score += questionsScore[--i] == answerName? 1:0;

}


function showBtnsFn(){
    if ( score == numOfPlaces || attempts == maxAttempts ) {
        exportRoot["showAnsBtn"].alpha = 1;
    }else{
        exportRoot["retryBtn"].alpha = 1;
    }
}

function retryFN() {
    stopAllSounds();
    if (countQuestion == 0) {
        hideFB();
    } else {
        exportRoot.gotoAndPlay("question");
    }
    
    exportRoot["timerSymb"].gotoAndStop(0);
    clickSd.play();
    timerOut = 0;
    countQuestion = 0;
    score = 0;
    hideFB();
    retryV = true;
    activateButtons();
    retryV = false;
    Timer();
}


function over(e) {
    e.currentTarget.gotoAndStop(1);
}

function over2(e) {
    e.currentTarget.gotoAndStop(2);
}

function out(e) {
    e.currentTarget.gotoAndStop(0);
}

// Timer Answers
function Timer() {
	timeOutPlay = [setInterval( timeOutFB , 1000)];  
}

// Show Time Out Answers in Console Log And Show FB End Time
function timeOutFB() {
timerOut++;
exportRoot["timerSymb"].gotoAndStop(timerOut);


if( timerOut === 60 ){
    clearInterval(timeOutPlay);
    hideFB();
    deactivateButtons();
    attempts++;
    if (attempts == maxAttempts) {
        console.log("wrongFB");
        timeOutSdFB.play();
        timeOutSdFB.on('end',function(){
        exportRoot["wrongFB"].playV = true;
        exportRoot["wrongFB"].alpha = 1;
        exportRoot["wrongFB"].gotoAndPlay(0);
    });
    } else if (attempts < maxAttempts) {
        console.log("tryFB");
        
        timeOutSd.play();
        timeOutSd.on('end',function(){
        exportRoot["tryFB"].playV = true;
        exportRoot["tryFB"].alpha = 1;
        exportRoot["tryFB"].gotoAndPlay(0);
	});
    }

    } 
	
}


// Stop Time Answers
function stopTime(){
	
	clearInterval(timeOutPlay);
		
}

function exitFullscreen() {
    //toggle full screen
    var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null);

    //var docElm = document.documentElement;
    /*if (!isInFullScreen) {
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
        } else if (docElm.msRequestFullscreen) {
            docElm.msRequestFullscreen();
        }
    } else {*/
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
    //}
}

/*========Start=======*/

function sendMessageToParent(message) {
    window.parent.postMessage(message, '*');
}

function startTimeFn() {
    sendMessageToParent({
        action: 'start',
        data: {
            startDateTime: (new Date()).toISOString()
        }
    });
}

function finalSendMessageFn() {
    sendMessageToParent({
        action: 'end',
        data: {
            endDateTime: (new Date()).toISOString(),
            retryTimes: ( correctAnswersCountV),
            wrongAnswersCount: attempts,
            correctAnswersCount: correctAnswersCountV
        }
    });
}

/*========End=======*/
