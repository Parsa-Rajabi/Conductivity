/**
 * BCLearningNetwork.com
 * Conductivity - Chemistry 12   
 * @author Parsa Rajabi - ParsaRajabiPR@gmail.com
 * July 2018
 */

//// VARIABLES ////

var mute = false;
var FPS = 20;
var STAGE_WIDTH, STAGE_HEIGHT;
var gameStarted = false;

var solutionLabel;
var solutionName = 'HCl';
var result_HC, inner_HC;
var result_NAOH, inner_NAOH;
var result_Mix, inner_Mix;
var result_TapReg, inner_TapReg;
var result_TapSen, inner_TapSen;

var result_PureReg, inner_PureReg;
var result_PureSen, result_PureSen;

var resultX, resultY;

var question_HC, innerQ_HC;
var question_NAOH, innerQ_NAOH;
var question_Mix, innerQ_Mix;
var question_TapReg, innerQ_TapReg;
var question_TapSen, innerQ_TapSen;

var question_PureReg, innerQ_PureReg;
var question_PureSen, innerQ_PureSen;

var solutionOptionValues = [];
solutionOptionValues['HCl'];
solutionOptionValues['NaOH'];
solutionOptionValues['Equimolar mixture of HCl and NaOH'];
solutionOptionValues['Tap H2O'];
solutionOptionValues['Pure H2O'];

var solutionOption, solutionSelectHTML;

// Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;

/*
 * Initialize the stage and some createJS settings
 */
function init() {
    STAGE_WIDTH = parseInt(document.getElementById("gameCanvas").getAttribute("width"));
    STAGE_HEIGHT = parseInt(document.getElementById("gameCanvas").getAttribute("height"));

    // init state object
    stage = new createjs.Stage("gameCanvas"); // canvas id is gameCanvas
    stage.mouseEventsEnabled = true;
    stage.enableMouseOver(); // Default, checks the mouse 20 times/second for hovering cursor changes

    setupManifest(); // preloadJS
    startPreload();

    stage.update();
}
/*
 * Main update loop.
 */


function update(event) {
    if (gameStarted) {
        //Solution lable
        stage.removeChild(solutionLabel);
        solutionLabel = new createjs.Text(solutionName, "13px DejaVu Sans", "#e00b24");
        //    solutionLabel.outline = 1.2;
        solutionLabel.x = 565;
        solutionLabel.y = 495;
        stage.addChild(solutionLabel);


        if (solutionSelect.htmlElement.value == "Tap H2O" || solutionSelect.htmlElement.value == "Pure H2O") {
            senButton.visible = true;
        } else
            senButton.visible = false;



    }
    stage.update(event);
}

/*
 * Ends the game.
 */
function endGame() {
    gameStarted = false;
}



/*
 * Place graphics and add them to the stage.
 */
function initGraphics() {

    /////// selection start //////////
    //Box Selection
    solutionSelectHTML = document.createElement('select');
    solutionSelectHTML.id = "solutionSelect";
    solutionSelectHTML.class = "overlayed";
    solutionOption = ["HCl", "NaOH", "Equimolar Mixture of HCl and NaOH", "Tap H2O", "Pure H2O"];
    addOptionsToSelect(solutionSelectHTML, solutionOption);
    solutionSelectHTML.style.position = "absolute";
    solutionSelectHTML.style.top = 0;
    solutionSelectHTML.style.left = 0;
    solutionSelectHTML.style.width = "120px";
    solutionSelectHTML.onchange = updateSolution;
    document.body.appendChild(solutionSelectHTML);
    solutionSelect = new createjs.DOMElement(solutionSelectHTML);

    //adds the solution selection to the screen
    stage.addChild(solutionSelect);

    updateSelectPositions();
    /////// selection over //////////

    //play button x/y
    playButton.x = playButtonPressed.x = 320;
    playButton.y = playButtonPressed.y = 55;
    stage.addChild(playButton);

    //sen button x/y
    senButton.x = senButtonPressed.x = 460;
    senButton.y = senButtonPressed.y = 55;
    stage.addChild(senButton);
    senButton.visible = false;

    //results x/y
    resultX = 272.5;
    resultY = 227;

    //////////////// HCl Question Place Holder ////////////////
    question_HC = new createjs.Text("             ???", "18px DejaVu Sans", "#EED98D");
    question_HC.outline = 7;
    //clone the text for outline
    innerQ_HC = question_HC.clone();
    innerQ_HC.outline = false;
    innerQ_HC.color = "#FB6542";
    
    //position
    question_HC.x = innerQ_HC.x = resultX;
    question_HC.y = innerQ_HC.y = resultY;

    stage.addChild(question_HC, innerQ_HC);
    
    
    //////////////// NAOH Question Place Holder ////////////////
    question_NAOH = question_HC.clone();
    innerQ_NAOH = innerQ_HC.clone();

    question_NAOH.x = innerQ_NAOH.x = resultX;
    question_NAOH.y = innerQ_NAOH.y = resultY + 48;

    stage.addChild(question_NAOH, innerQ_NAOH);

    //////////////// Mix Question Place Holder ////////////////
    question_Mix = question_HC.clone();
    innerQ_Mix = innerQ_HC.clone();

    question_Mix.x = innerQ_Mix.x = resultX;
    question_Mix.y = innerQ_Mix.y = resultY + 109;

    stage.addChild(question_Mix, innerQ_Mix);
    
    
    //////////////// Tap Regular Question Place Holder ////////////////
    question_TapReg = question_HC.clone();
    innerQ_TapReg = innerQ_HC.clone();

    question_TapReg.x = innerQ_TapReg.x = resultX - 125;
    question_TapReg.y = innerQ_TapReg.y = resultY + 237;
    
    stage.addChild(question_TapReg, innerQ_TapReg);
    
    
    //////////////// Tap Senstive Question Place Holder ////////////////
    question_TapSen = question_HC.clone();
    innerQ_TapSen = innerQ_HC.clone();
    
    question_TapSen.x = innerQ_TapSen.x = resultX + 70;
    question_TapSen.y = innerQ_TapSen.y = resultY + 237;

    stage.addChild(question_TapSen, innerQ_TapSen);
    

    
     //////////////// Pure Regular Question Place Holder ////////////////
    question_PureReg = question_HC.clone();
    innerQ_PureReg = innerQ_HC.clone();

    question_PureReg.x = innerQ_PureReg.x = resultX - 125;
    question_PureReg.y = innerQ_PureReg.y = resultY + 279;
    
    stage.addChild(question_PureReg, innerQ_PureReg);
    
    
    //////////////// Pure Senstive Question Place Holder ////////////////
    question_PureSen = question_HC.clone();
    innerQ_PureSen = innerQ_HC.clone();
    
    question_PureSen.x = innerQ_PureSen.x = resultX + 70;
    question_PureSen.y = innerQ_PureSen.y = resultY + 279;

    stage.addChild(question_PureSen, innerQ_PureSen);
    
    
    //////////////// HCl ////////////////
    result_HC = new createjs.Text("Lamp Burns Brightly", "18px DejaVu Sans", "#EED98D");
    result_HC.outline = 7;
    //clone the text for outline
    inner_HC = result_HC.clone();
    inner_HC.outline = false;
    inner_HC.color = "#FB6542";

    //HCl Position
    result_HC.x = inner_HC.x = resultX;
    result_HC.y = inner_HC.y = resultY;

    stage.addChild(result_HC, inner_HC);

    //visibility off all text wil be false
    result_HC.visible = false;
    inner_HC.visible = false;

    //////////////// NaOH ////////////////
    result_NAOH = result_HC.clone();
    inner_NAOH = inner_HC.clone();

    result_NAOH.x = inner_NAOH.x = resultX;
    result_NAOH.y = inner_NAOH.y = resultY + 48;

    stage.addChild(result_NAOH, inner_NAOH);

    //////////////// Mix ////////////////
    result_Mix = result_HC.clone();
    inner_Mix = inner_HC.clone();

    result_Mix.x = inner_Mix.x = resultX;
    result_Mix.y = inner_Mix.y = resultY + 109;

    stage.addChild(result_Mix, inner_Mix);

    ////////////////Tap H2O Regular////////////////
    result_TapReg = new createjs.Text("Lamp Glows Dimly", "16px DejaVu Sans", "#EED98D");
    result_TapReg.outline = 5;
    //clone the text for outline
    inner_TapReg = result_TapReg.clone();
    inner_TapReg.outline = false;
    inner_TapReg.color = "#FB6542";

    result_TapReg.x = inner_TapReg.x = resultX - 125;
    result_TapReg.y = inner_TapReg.y = resultY + 237;

    stage.addChild(result_TapReg, inner_TapReg);
    //visibility off all text wil be false
    result_TapReg.visible = false;
    inner_TapReg.visible = false;



    ////////////////Tap H2O SENSITIVE////////////////
    result_TapSen = new createjs.Text("Lamp Glows Bright", "16px DejaVu Sans", "#EED98D");
    result_TapSen.outline = 5;
    //clone the text for outline
    inner_TapSen = result_TapSen.clone();
    inner_TapSen.outline = false;
    inner_TapSen.color = "#FB6542";

    result_TapSen.x = inner_TapSen.x = resultX + 70;
    result_TapSen.y = inner_TapSen.y = resultY + 237;

    stage.addChild(result_TapSen, inner_TapSen);
    //visibility off all text wil be false
    result_TapSen.visible = false;
    inner_TapSen.visible = false;


    ////////////////Pure H2O Regular////////////////
    result_PureReg = new createjs.Text("Lamp Doesn't Glow", "16px DejaVu Sans", "#EED98D");
    result_PureReg.outline = 5;
    //clone the text for outline
    inner_PureReg = result_PureReg.clone();
    inner_PureReg.outline = false;
    inner_PureReg.color = "#FB6542";

    result_PureReg.x = inner_PureReg.x = resultX - 125;
    result_PureReg.y = inner_PureReg.y = resultY + 279;

    stage.addChild(result_PureReg, inner_PureReg);
    //visibility off all text wil be false
    result_PureReg.visible = false;
    inner_PureReg.visible = false;

    ////////////////Pure H2O SENSITIVE////////////////
    result_PureSen = new createjs.Text("Lamp Glows Dimly", "16px DejaVu Sans", "#EED98D");
    result_PureSen.outline = 5;
    //clone the text for outline
    inner_PureSen = result_PureSen.clone();
    inner_PureSen.outline = false;
    inner_PureSen.color = "#FB6542";

    result_PureSen.x = inner_PureSen.x = resultX + 70;
    result_PureSen.y = inner_PureSen.y = resultY + 279;

    stage.addChild(result_PureSen, inner_PureSen);
    //visibility off all text wil be false
    result_PureSen.visible = false;
    inner_PureSen.visible = false;



    //add other stuff
    initMuteUnMuteButtons();
    initListeners();

    // start the game
    gameStarted = true;
    stage.update();
}


function updateSolution() {
    console.log("Solution was updated!");
    if (solutionSelect.htmlElement.value == "HCl") {
        solutionName = 'HCl';

    } else if (solutionSelect.htmlElement.value == "NaOH") {
        solutionName = 'NaOH';

    } else if (solutionSelect.htmlElement.value == "Equimolar Mixture of HCl and NaOH") {
        solutionName = 'HCl & NaOH';

    } else if (solutionSelect.htmlElement.value == "Tap H2O") {
        solutionName = 'Tap H2O';

    } else if (solutionSelect.htmlElement.value == "Pure H2O") {
        solutionName = 'Pure H2O';
    }
}


//Adds the options to the drop down lists

function addOptionsToSelect(select, options) {
    for (var i = 0; i < options.length; i++) {
        var option = document.createElement('option');
        option.value = options[i];
        option.text = options[i];
        select.appendChild(option);
    }
}

//updates the positions
function updateSelectPositions() {
    if (isChrome) {
        selectY = 85;
    }
    solutionSelect.x = gameCanvas.getBoundingClientRect().left + 180;
    solutionSelect.y = gameCanvas.getBoundingClientRect().top + 100;
}

/*
 * Adds the mute and unmute buttons to the stage and defines listeners
 */
function initMuteUnMuteButtons() {
    var hitArea = new createjs.Shape();
    hitArea.graphics.beginFill("#000").drawRect(0, 0, muteButton.image.width, muteButton.image.height);
    muteButton.hitArea = unmuteButton.hitArea = hitArea;

    muteButton.x = unmuteButton.x = 5;
    muteButton.y = unmuteButton.y = 5;

    muteButton.cursor = "pointer";
    unmuteButton.cursor = "pointer";

    muteButton.on("click", toggleMute);
    unmuteButton.on("click", toggleMute);

    stage.addChild(unmuteButton);
}

/*
 * Add listeners to objects.
 */
function initListeners() {

    //////////////PLAY BUTTON///////////////
    playButton.on("mouseover", function () {
        stage.addChild(playButtonPressed);
        stage.removeChild(playButton);
        //        playSound("click");
    });
    playButtonPressed.on("mouseout", function () {
        stage.addChild(playButton);
        stage.removeChild(playButtonPressed);
    });
    //once pressed, the fire function will be called 
    playButtonPressed.on("click", play);



    ////////////SEN BUTTON////////////////
    senButton.on("mouseover", function () {
        stage.addChild(senButtonPressed);
        stage.removeChild(senButton);
        //        playSound("click");
    });
    senButtonPressed.on("mouseout", function () {
        stage.addChild(senButton);
        stage.removeChild(senButtonPressed);
    });
    //once pressed, the fire function will be called 
    senButtonPressed.on("click", senTest);


}


function senTest() {
    playSound("click");
    if (solutionSelect.htmlElement.value == "Tap H2O") {
        result_TapSen.visible = true;
        inner_TapSen.visible = true;


    } else if (solutionSelect.htmlElement.value == "Pure H2O") {
        result_PureSen.visible = true;
        inner_PureSen.visible = true;

    }
}



function play() {
    console.log("Button Pressed!");
    playSound("click");
    if (solutionSelect.htmlElement.value == "HCl") {
        result_HC.visible = true;
        inner_HC.visible = true;

    } else if (solutionSelect.htmlElement.value == "NaOH") {
        result_NAOH.visible = true;
        inner_NAOH.visible = true;

    } else if (solutionSelect.htmlElement.value == "Equimolar Mixture of HCl and NaOH") {
        result_Mix.visible = true;
        inner_Mix.visible = true;

    } else if (solutionSelect.htmlElement.value == "Tap H2O") {
        result_TapReg.visible = true;
        inner_TapReg.visible = true;


    } else if (solutionSelect.htmlElement.value == "Pure H2O") {
        result_PureReg.visible = true;
        inner_PureReg.visible = true;

    }

}


//////////////////////// PRELOADJS FUNCTIONS

// bitmap variables
var muteButton, unmuteButton;
var background;
var playButton, playButtonPressed;
var senButton, senButtonPressed;
/*
 * Add files to be loaded here.
 */
function setupManifest() {
    manifest = [
        {
            src: "images/senTest.png",
            id: "senButton"
    }, {
            src: "images/senTestPressed.png",
            id: "senButtonPressed"
    }, {
            src: "sounds/click.mp3",
            id: "click"
    }, {
            src: "images/play.png",
            id: "playButton"
    }, {
            src: "images/playPressed.png",
            id: "playButtonPressed"
    }, {
            src: "images/chemBackground.png",
            id: "background"
    }, {
            src: "images/mute.png",
            id: "mute"
    }, {
            src: "images/unmute.png",
            id: "unmute"
    }
 	];
}


function startPreload() {
    preload = new createjs.LoadQueue(true);
    preload.installPlugin(createjs.Sound);
    preload.on("fileload", handleFileLoad);
    preload.on("progress", handleFileProgress);
    preload.on("complete", loadComplete);
    preload.on("error", loadError);
    preload.loadManifest(manifest);
}

/*
 * Specify how to load each file.
 */
function handleFileLoad(event) {
    console.log("A file has loaded of type: " + event.item.type);
    // create bitmaps of images
    if (event.item.id == "senButtonPressed") {
        senButtonPressed = new createjs.Bitmap(event.result);
    } else if (event.item.id == "senButton") {
        senButton = new createjs.Bitmap(event.result);
    } else if (event.item.id == "playButtonPressed") {
        playButtonPressed = new createjs.Bitmap(event.result);
    } else if (event.item.id == "playButton") {
        playButton = new createjs.Bitmap(event.result);
    } else if (event.item.id == "background") {
        background = new createjs.Bitmap(event.result);
    } else if (event.item.id == "mute") {
        muteButton = new createjs.Bitmap(event.result);
    } else if (event.item.id == "unmute") {
        unmuteButton = new createjs.Bitmap(event.result);
    }
}

function loadError(evt) {
    console.log("Error!", evt.text);
}

// not currently used as load time is short
function handleFileProgress(event) {

}

/*
 * Displays the start screen.
 */
function loadComplete(event) {
    console.log("Finished Loading Assets");

    // ticker calls update function, set the FPS
    createjs.Ticker.setFPS(FPS);
    createjs.Ticker.addEventListener("tick", update); // call update function

    stage.addChild(background);
    stage.update();
    initGraphics();
}

///////////////////////////////////// END PRELOADJS FUNCTIONS
