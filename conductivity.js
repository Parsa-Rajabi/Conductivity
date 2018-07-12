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

var solutionOptionValues = [];
solutionOptionValues['HCl'];
solutionOptionValues['NaOH'];
solutionOptionValues['Equimolar mixture of HCl and NaOH'];
solutionOptionValues['Tap H2O'];
solutionOptionValues['Pure H2O'];

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
    if (gameStarted) {}

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


    //Box Selection
    var solutionSelectHTML = document.createElement('select');
    solutionSelectHTML.id = "solutionSelect";
    solutionSelectHTML.class = "overlayed";
    var solutionOption = ["HCl", "NaOH", "Equimolar Mixture of HCl and NaOH", "Tap H2O", "Pure H2O"];
    addOptionsToSelect(solutionSelectHTML, solutionOption);
    solutionSelectHTML.style.position = "absolute";
    solutionSelectHTML.style.top = 0;
    solutionSelectHTML.style.left = 0;
    solutionSelectHTML.style.width = "122px";
    solutionSelectHTML.onchange = updateSolution;
    document.body.appendChild(solutionSelectHTML);
    solutionSelect = new createjs.DOMElement(solutionSelectHTML);

    //adds the solution selection to the screen
    stage.addChild(solutionSelect);

    updateSelectPositions();

    playButton.x = playButtonPressed.x = 320;
    playButton.y = playButtonPressed.y = 55;
    
    initMuteUnMuteButtons();
    initListeners();
    
    stage.addChild(playButton);
//    stage.addChild(playButtonPressed);
    // start the game
    gameStarted = true;
    stage.update();
}


function updateSolution() {

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

function play(){
    
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
