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

var checkSwitch;

var solutionOption, solutionSelectHTML;
var solutionOptionValues = [];
solutionOptionValues['HCl'];
solutionOptionValues['NaOH'];
solutionOptionValues['Equimolar mixture of HCl and NaOH'];
solutionOptionValues['Tap H2O'];
solutionOptionValues['Pure H2O'];

var bulbOption, bulbSelectHTML;
var bulbOptionValues = [];
bulbOptionValues['Regular'];
bulbOptionValues['Sensitive'];


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
        solutionLabel = new createjs.Text(solutionName, "22px DejaVu Sans", "#e33e18");
        //    solutionLabel.outline = 1.2;
        solutionLabel.x = 595;
        solutionLabel.y = 470;
        stage.addChild(solutionLabel);

        changeBulb();
        updateSelectPositions();

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

    /////// solution selection start //////////
    //Box Selection
    solutionSelectHTML = document.createElement('select');
    solutionSelectHTML.id = "solutionSelect";
    solutionSelectHTML.class = "overlayed";
    solutionOption = ["HCl", "NaOH", "Equimolar Mixture of HCl and NaOH", "Tap H2O", "Pure H2O"];
    addOptionsToSelect(solutionSelectHTML, solutionOption);
    solutionSelectHTML.style.position = "absolute";
    solutionSelectHTML.style.top = 0;
    solutionSelectHTML.style.left = 0;
    solutionSelectHTML.style.width = "121px";
    solutionSelectHTML.onchange = updateSolution;
    document.body.appendChild(solutionSelectHTML);
    solutionSelect = new createjs.DOMElement(solutionSelectHTML);

    //adds the solution selection to the screen
    stage.addChild(solutionSelect);
    /////// solution selection over //////////

    /////// bulb selection start //////////
    //Box Selection
    bulbSelectHTML = document.createElement('select');
    bulbSelectHTML.id = "bulbSelect";
    bulbSelectHTML.class = "overlayed";
    bulbOption = ["Regular", "Sensitive"];
    addOptionsToSelect(bulbSelectHTML, bulbOption);
    bulbSelectHTML.style.position = "absolute";
    bulbSelectHTML.style.top = 0;
    bulbSelectHTML.style.left = 0;
    bulbSelectHTML.style.width = "121px";
    bulbSelectHTML.onchange = updateSolution;
    document.body.appendChild(bulbSelectHTML);
    bulbSelect = new createjs.DOMElement(bulbSelectHTML);

    //adds the solution selection to the screen
    stage.addChild(bulbSelect);
    bulbSelect.visible = false;

    updateSelectPositions();
    /////// bulb selection over //////////

    //Bulbs x/y
    offBulb.x = dimBulb.x = onBulb.x = bulbSenDim.x = 500; bulbSenOn.x = 500;
    offBulb.y = dimBulb.y = onBulb.y = bulbSenDim.y = 70; bulbSenOn.y = 70;

    stage.addChild(offBulb);
    stage.addChild(onBulb);
    stage.addChild(dimBulb);
    stage.addChild(bulbSenDim);
    stage.addChild(bulbSenOn);
    
    onBulb.visible = dimBulb.visible = bulbSenDim.visible = bulbSenOn.visible = false;

    //battery x/y
    battery.x = batteryOn.x = 120;
    battery.y = batteryOn.y = 300;
    stage.addChild(battery, batteryOn);
    batteryOn.visible = false;

    //on button x/y
    openSwitch.x = closedSwitch.x = 300;
    openSwitch.y = closedSwitch.y = 337;
    stage.addChild(closedSwitch);

    //summary Pop up x/y
    bulbType.x = 0;
    bulbType.y = 0;
    stage.addChild(bulbType);
    bulbType.visible = false;

    //add other stuff
    initMuteUnMuteButtons();
    initListeners();

    // start the game
    gameStarted = true;
    stage.update();
}

//This function updates the solutionName & label on the beaker
// and it also brings up the bylbType selection if Tap/Pure H20 are selected
function updateSolution() {
    if (solutionSelect.htmlElement.value == "HCl") {
        solutionName = 'HCl';
        bulbType.visible = bulbSelect.visible = false;

    } else if (solutionSelect.htmlElement.value == "NaOH") {
        solutionName = 'NaOH';
        bulbType.visible = bulbSelect.visible = false;

    } else if (solutionSelect.htmlElement.value == "Equimolar Mixture of HCl and NaOH") {
        solutionName = 'HCl & NaOH';
        bulbType.visible = bulbSelect.visible = false;

    } else if (solutionSelect.htmlElement.value == "Tap H2O") {
        solutionName = 'Tap H2O';
        bulbType.visible = bulbSelect.visible = true;

    } else if (solutionSelect.htmlElement.value == "Pure H2O") {
        solutionName = 'Pure H2O';
        bulbType.visible = bulbSelect.visible = true;
    }
}

//this function changes the visible light bulb based on the solution selection 
function changeBulb() {
    //checkSwitch is determined by if the switch is on or off
    if (checkSwitch) {
        if (solutionSelect.htmlElement.value == "HCl") {
            //remove the rest
            offBulb.visible = false;
            dimBulb.visible = false;

            //remove sensitive bulbs
            bulbSenOn.visible = false;
            bulbSenDim.visible = false;
            //add the bulb for this solution
            onBulb.visible = true;

        } else if (solutionSelect.htmlElement.value == "NaOH") {
            //remove the rest
            offBulb.visible = false;
            dimBulb.visible = false;

            //remove sensitive bulbs
            bulbSenOn.visible = false;
            bulbSenDim.visible = false;
            //add the bulb for this solution
            onBulb.visible = true;

        } else if (solutionSelect.htmlElement.value == "Equimolar Mixture of HCl and NaOH") {
            //remove the rest
            offBulb.visible = false;
            dimBulb.visible = false;

            //remove sensitive bulbs
            bulbSenOn.visible = false;
            bulbSenDim.visible = false;
            //add the bulb for this solution
            onBulb.visible = true;

        } else if (solutionSelect.htmlElement.value == "Tap H2O") {
            //remove the rest
            offBulb.visible = false;
            onBulb.visible = false;

            if (bulbSelect.htmlElement.value == "Regular") {
                bulbSenDim.visible = false;
                bulbSenOn.visible = false;
                
                dimBulb.visible = true;

            } else if (bulbSelect.htmlElement.value == "Sensitive") {
                bulbSenOn.visible = true;
                bulbSenDim.visible = false;
            }

        } else if (solutionSelect.htmlElement.value == "Pure H2O") {
            //remove the rest
            dimBulb.visible = false;
            onBulb.visible = false;

            //remove sensitive bulbs
            bulbSenOn.visible = false;
            bulbSenDim.visible = false;
            
            if (bulbSelect.htmlElement.value == "Regular") {
                bulbSenDim.visible = false;
                bulbSenOn.visible = false;
                
                offBulb.visible = true;


            } else if (bulbSelect.htmlElement.value == "Sensitive") {
                bulbSenOn.visible = false;
                bulbSenDim.visible = true;
            }
        }
        
    // if the switch is off, all bulbs are removed except the offBulb 
    } else if (!checkSwitch) {
        dimBulb.visible = false;
        onBulb.visible = false;

        //remove sensitive bulbs
        bulbSenOn.visible = false;
        bulbSenDim.visible = false;
        //add the bulb for this solution    
        offBulb.visible = true;
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

//updates the positions - make sure to call this function in the updateGame to make sure the positioning of the boxes are checked every FPS
function updateSelectPositions() {
    solutionSelect.x = gameCanvas.getBoundingClientRect().left + 420;
    solutionSelect.y = gameCanvas.getBoundingClientRect().top + 160;

    bulbSelect.x = gameCanvas.getBoundingClientRect().left + 420;
    bulbSelect.y = gameCanvas.getBoundingClientRect().top + 230;
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

    //////////////ON SWITCH///////////////
    openSwitch.on("mouseover", function () {});
    openSwitch.on("mouseout", function () {});
    openSwitch.on("click", switchOFF);


    //////////////OFF SWITCH///////////////
    closedSwitch.on("mouseover", function () {});
    closedSwitch.on("mouseout", function () {});
    closedSwitch.on("click", switchON);

}


//turns light OFF
function switchOFF() {
    checkSwitch = false;
    playSound("click");
    batteryOn.visible = false;
    stage.addChild(closedSwitch);
    stage.removeChild(openSwitch);
}

//turns light ON
function switchON() {
    checkSwitch = true;
    playSound("click");
    batteryOn.visible = true;
    stage.addChild(openSwitch);
    stage.removeChild(closedSwitch);
}

//////////////////////// PRELOADJS FUNCTIONS

// bitmap variables
var muteButton, unmuteButton;
var background;
var battery, batteryOn;
var openSwitch, closedSwitch;
var bulbType;
var offBulb, dimBulb, onBulb;
var bulbSenDim, bulbSenOn;
/*
 * Add files to be loaded here.
 */
function setupManifest() {
    manifest = [
        {
            src: "images/bulbSenOn.png",
            id: "bulbSenOn"
    }, {
            src: "images/bulbSenDim.png",
            id: "bulbSenDim"
    },{
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
            id: "closedSwitch"
    }, {
            src: "images/onSwitchHover.png",
            id: "openSwitch"
    }, {
            src: "images/batteryOn.png",
            id: "batteryOn"
    }, {
            src: "images/battery.png",
            id: "battery"
    }, {
            src: "images/BulbType.png",
            id: "bulbType"
    },{
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
    if (event.item.id == "bulbSenDim") {
        bulbSenDim = new createjs.Bitmap(event.result);
    } else if (event.item.id == "bulbSenOn") {
        bulbSenOn = new createjs.Bitmap(event.result);
    } else if (event.item.id == "onBulb") {
        onBulb = new createjs.Bitmap(event.result);
    } else if (event.item.id == "dimBulb") {
        dimBulb = new createjs.Bitmap(event.result);
    } else if (event.item.id == "offBulb") {
        offBulb = new createjs.Bitmap(event.result);
    } else if (event.item.id == "closedSwitch") {
        closedSwitch = new createjs.Bitmap(event.result);
    } else if (event.item.id == "openSwitch") {
        openSwitch = new createjs.Bitmap(event.result);
    } else if (event.item.id == "battery") {
        battery = new createjs.Bitmap(event.result);
    } else if (event.item.id == "batteryOn") {
        batteryOn = new createjs.Bitmap(event.result);
    } else if (event.item.id == "bulbType") {
        bulbType = new createjs.Bitmap(event.result);
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
