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

var stillHover;


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
        solutionLabel = new createjs.Text(solutionName, "22px DejaVu Sans", "#0825ff");
        //    solutionLabel.outline = 1.2;
        solutionLabel.x = 595;
        solutionLabel.y = 470;
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
    solutionSelectHTML.style.width = "122px";
    solutionSelectHTML.onchange = updateSolution;
    document.body.appendChild(solutionSelectHTML);
    solutionSelect = new createjs.DOMElement(solutionSelectHTML);

    //adds the solution selection to the screen
    stage.addChild(solutionSelect);

    updateSelectPositions();
    /////// selection over //////////

    //Bulbs x/y
    offBulb.x = dimBulb.x = onBulb.x = 500;
    offBulb.y = dimBulb.y = onBulb.y = 70;
    stage.addChild(offBulb);
    stage.addChild(onBulb);
    stage.addChild(dimBulb);

    onBulb.visible = dimBulb.visible = false;

    //senBulbs x/y
    senBulb_off.x = 400;
    senBulb_off.y = 100;
    stage.addChild(senBulb_off);
    senBulb_off.visible = false;

    
    //battery x/y
    battery.x = 120;
    battery.y = 300;
    stage.addChild(battery);

    //on button x/y
    onSwitch.x = offSwitch.x = 300;
    onSwitch.y = offSwitch.y = 337;
    stage.addChild(onSwitch);


    //hint button x/y
    hintButton.x = hintButtonPressed.x = 595;
    hintButton.y = hintButtonPressed.y = 60;
    stage.addChild(hintButton);

    //summary Pop up x/y
    summaryPop.x = -5;
    summaryPop.y = 125;
    stage.addChild(summaryPop);
    summaryPop.visible = false;

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

    ////////////HINT BUTTON////////////////
    hintButton.on("mouseover", function () {
        stage.addChild(hintButtonPressed);
        stage.removeChild(hintButton);
        summaryPop.visible = true;
        //        playSound("click");
    });
    hintButtonPressed.on("mouseout", function () {
        stage.addChild(hintButton);
        stage.removeChild(hintButtonPressed);
        summaryPop.visible = false;
    });
    //once pressed, the fire function will be called 
    hintButtonPressed.on("click", hintPop);



    //////////////ON SWITCH///////////////
    onSwitch.on("mouseover", function (){});
//    {
//        stage.addChild(onSwitchHover);
//        stage.removeChild(onSwitch);
//    });
    onSwitch.on("mouseout", function (){});
//        stage.addChild(onSwitch);
//        stage.removeChild(onSwitchHover);
//    });
    //once pressed, the fire function will be called 
    onSwitch.on("click", switchOFF);


    //////////////OFF SWITCH///////////////
    offSwitch.on("mouseover", function (){});
//        stage.addChild(offSwitchHover);
//        stage.removeChild(offSwitch);
//    });
    offSwitch.on("mouseout", function (){});
//        stage.addChild(offSwitch);
//        stage.removeChild(offSwitchHover);
//    });
    //once pressed, the fire function will be called 
    offSwitch.on("click", switchON);

}


//turns it on
function switchON(){
    playSound("click");
    stage.addChild(onSwitch);
    stage.removeChild(offSwitch);
}

//turns it off
function switchOFF(){
    playSound("click");
    stage.addChild(offSwitch);
    stage.removeChild(onSwitch);
}

function hintPop() {
    var popVisible = false;
    console.log("Hint button was pressed");
}

//////////////////////// PRELOADJS FUNCTIONS

// bitmap variables
var muteButton, unmuteButton;
var background;
var hintButton, hintButtonPressed;
var summaryPop;
var battery;
var onSwitch;
var offSwitch;

var offBulb, dimBulb, onBulb;
var senBulb_off, senBulb_dim, senBulb_on;
/*
 * Add files to be loaded here.
 */
function setupManifest() {
    manifest = [
        {
            src: "images/senBulb_on.png",
            id: "senBulb_on"
    },
//        {
//            src: "images/senBulb_dim.png",
//            id: "senBulb_dim"
//    }, 
        {
            src: "images/senBulb_off.png",
            id: "senBulb_off"
    }, {
            src: "images/onBulb.png",
            id: "onBulb"
    }, {
            src: "images/dimBulb.png",
            id: "dimBulb"
    }, {
            src: "images/offBulb.png",
            id: "offBulb"
    }, {
            src: "images/offSwitchHover.png",
            id: "offSwitch"
    }, {
            src: "images/onSwitchHover.png",
            id: "onSwitch"
    }, 
//        {
//            src: "images/offSwitch.png",
//            id: "offSwitch"
//    }, {
//            src: "images/onSwitch.png",
//            id: "onSwitch"
//    }, 
        {
            src: "images/battery.png",
            id: "battery"
    }, {
            src: "images/hintPressed.png",
            id: "hintButtonPressed"
    }, {
            src: "images/hint.png",
            id: "hintButton"
    }, {
            src: "images/sumSolution.png",
            id: "summaryPop"
    }, {
            src: "sounds/click.mp3",
            id: "click"
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
    if (event.item.id == "senBulb_on") {
        senBulb_on = new createjs.Bitmap(event.result);
    } else if (event.item.id == "senBulb_dim") {
        senBulb_dim = new createjs.Bitmap(event.result);
    } else if (event.item.id == "senBulb_off") {
        senBulb_off = new createjs.Bitmap(event.result);
    } else if (event.item.id == "onBulb") {
        onBulb = new createjs.Bitmap(event.result);
    } else if (event.item.id == "dimBulb") {
        dimBulb = new createjs.Bitmap(event.result);
    } else if (event.item.id == "offBulb") {
        offBulb = new createjs.Bitmap(event.result);
    } else if (event.item.id == "offSwitchHover") {
        offSwitchHover = new createjs.Bitmap(event.result);
    } else if (event.item.id == "onSwitchHover") {
        onSwitchHover = new createjs.Bitmap(event.result);
    } else if (event.item.id == "offSwitch") {
        offSwitch = new createjs.Bitmap(event.result);
    } else if (event.item.id == "onSwitch") {
        onSwitch = new createjs.Bitmap(event.result);
    } else if (event.item.id == "battery") {
        battery = new createjs.Bitmap(event.result);
    } else if (event.item.id == "hintButtonPressed") {
        hintButtonPressed = new createjs.Bitmap(event.result);
    } else if (event.item.id == "hintButton") {
        hintButton = new createjs.Bitmap(event.result);
    } else if (event.item.id == "summaryPop") {
        summaryPop = new createjs.Bitmap(event.result);
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
