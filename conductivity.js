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

    
    //results 
    resultX = 272.5;
    resultY = 227;
    
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
//    result_HC.visible = false;
//    inner_HC.visible = false;

    result_NAOH = result_HC.clone();
    inner_NAOH = inner_HC.clone();
    
    result_NAOH.x = inner_NAOH.x = resultX;
    result_NAOH.y = inner_NAOH.y = resultY + 48;
    
    stage.addChild(result_NAOH, inner_NAOH);
    
    
    result_Mix = result_HC.clone();
    inner_Mix = inner_HC.clone();
    
    result_Mix.x = inner_Mix.x = resultX;
    result_Mix.y = inner_Mix.y = resultY + 109;
    
    stage.addChild(result_Mix, inner_Mix);

    
    result_PureReg = new createjs.Text("Lamp Doesn't Glow", "16px DejaVu Sans", "#EED98D");
    result_PureReg.outline = 5;
    //clone the text for outline
    inner_PureReg = result_PureReg.clone();
    inner_PureReg.outline = false;  
    inner_PureReg.color = "#FB6542";
    
    result_PureReg.x =  inner_PureReg.x = resultX - 100;
    result_PureReg.y = inner_PureReg.y = resultY + 248;
    
    stage.addChild(result_PureReg, inner_PureReg);
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

    playButton.on("mouseover", function () {
        stage.addChild(playButtonPressed);
        stage.removeChild(playButton);
        playSound("click");
    });
    playButtonPressed.on("mouseout", function () {
        stage.addChild(playButton);
        stage.removeChild(playButtonPressed);
    });
    //once pressed, the fire function will be called 
    playButtonPressed.on("click", play);
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
//        result_Tap.visible = true;
//        inner_Tap.visible = true;


    } else if (solutionSelect.htmlElement.value == "Pure H2O") {
//        result_Pure.visible = true;
//        inner_Pure.visible = true;

    }

}


//////////////////////// PRELOADJS FUNCTIONS

// bitmap variables
var muteButton, unmuteButton;
var background;
var playButton, playButtonPressed;
/*
 * Add files to be loaded here.
 */
function setupManifest() {
    manifest = [
        {
            src: "sounds/click.mp3",
            id: "click"
    },{
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
    },
        {
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
    if (event.item.id == "playButtonPressed") {
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
