import * as Settings from './settings.js';
import * as Utils from './utils.js';
import * as MelodyPanels from './melody-panels.js'
import * as MelodyPlay from './melody-play.js'
import * as Panel from './panel.js'
import * as NoteButtons from './note-buttons.js'

function melodyMouseDown(e) {
    let musicSettingsVisible = document.querySelectorAll(":not(.hiddenPanel)#stopRepeat").length !== 0;
    if (!MelodyPlay.isPlayingMelody()) {
        let melodyVisible = document.querySelectorAll(":not(.hiddenPanel)#melody").length !== 0;
        if (!melodyVisible) {
            MelodyPanels.updateButtons();
            Panel.showPanel("melody");
            MelodyPanels.updateMelodyText();
        } else {
            Panel.hideAllPanels();
        }
    } else if (!musicSettingsVisible) {
        Panel.showPanel("stopRepeat");
        MelodyPanels.updateMelodyText();
    } else {
        Panel.hideAllPanels();
    }
}

function getModeButtonClickHandler(selectDisplayMode) {
    const handler = function(e) {
        if (Settings.getSetting("displayMode") !== selectDisplayMode) {
            Settings.setSetting("displayMode", selectDisplayMode);
            updateFeatureButtons();
        }

        Panel.hideAllPanels();
        NoteButtons.displayNotes();
    };

    return handler;
}

function createFeatureButton(id, text, mouseDownHandler, extraClasses) {
    let thisButton = document.createElement("div");
    thisButton.className = "button";
    thisButton.classList.add("featureButton");
    if (extraClasses) {
        for (let i = 0; i < extraClasses.length; i++) {
            thisButton.classList.add(extraClasses[i]);
        }
    }
    thisButton.addEventListener('click', mouseDownHandler);
    thisButton.addEventListener('touchend', Utils.touchWrapper(mouseDownHandler));
    thisButton.id = id;

    if (id === "settingsButton") {
        drawLogo(thisButton);
    } else {
        thisButton.innerHTML = text;
    }
    document.body.appendChild(thisButton);

    return thisButton;
}

function createFeatureBar() {
    let thisButton = document.createElement("div");
    thisButton.className = "button";
    thisButton.classList.add("featureBar");

    document.body.addEventListener('mousedown', Utils.onClickWrapper(Utils.backgroundMouseDown));
    document.body.addEventListener('touchstart', Utils.touchWrapper(Utils.onClickWrapper(Utils.backgroundMouseDown)), { "passive": false });
    thisButton.id = "featureBar";

    document.body.appendChild(thisButton);

    // Add the feature buttons
    let intervalMouseDown = getModeButtonClickHandler("intervals");
    let solfegeMouseDown = getModeButtonClickHandler("solfege");
    let noteNameMouseDown = getModeButtonClickHandler("noteNames");
    createFeatureButton("intervalsButton", "Intervals", Utils.onClickWrapper(intervalMouseDown), ["longText"]);
    createFeatureButton("solfegeButton", "Solfa", Utils.onClickWrapper(solfegeMouseDown), ["longText", "highlightedFeature"]);
    createFeatureButton("noteNamesButton", "Notes", Utils.onClickWrapper(noteNameMouseDown), ["longText"]);
    createFeatureButton("musicButton", "&#9835;", Utils.onClickWrapper(melodyMouseDown), []);
    createFeatureButton("settingsButton", "&#9881;", Utils.onClickWrapper(Settings.settingsMouseDown), []);

    updateFeatureButtons();
}

function resize(selectedLayout, buttonWidth, margin, canvasLeft, canvasTop) {
    // Reposition the feature bar
    var featureBar = document.getElementById("featureBar");
    featureBar.style.width = 4 * (buttonWidth + (margin * 2)) + buttonWidth + "px";
    featureBar.style.top = (canvasTop + (selectedLayout.height - 1) * (buttonWidth + (margin * 2))) + "px";
    featureBar.style.left = (canvasLeft) + "px";

    let fontSize = buttonWidth / 3;
    let featureButtonElements = document.querySelectorAll(".featureButton");
    for (let i = 0; i < featureButtonElements.length; i++) {
        featureButtonElements[i].style.fontSize = fontSize + "px";
    }
    document.body.style.fontSize = fontSize + "px";
    document.getElementById("settingsButton").style.fontSize = fontSize * 2 + "px";
    document.getElementById("musicButton").style.fontSize = fontSize * 1.5 + "px";
    document.getElementById("melodyRandom").style.fontSize = fontSize * 1.5 + "px";
    document.getElementById("melodyListen").style.fontSize = fontSize * 1.5 + "px";
    document.getElementById("melodyPrevious").style.fontSize = fontSize * 1.5 + "px";
    document.getElementById("melodyNext").style.fontSize = fontSize * 1.5 + "px";

    // Reposition the feature buttons
    const featureButtons = ["intervalsButton", "solfegeButton", "noteNamesButton", "musicButton", "settingsButton"];
    const featureButtonWidths = [1.10, 0.875, 0.875, 1, 1];
    const featureBarWidth = 4 * (buttonWidth + (margin * 2)) + buttonWidth;
    const featureButtonWidth = featureBarWidth / 5;
    let nextButtonLeft = canvasLeft + 0.15 * featureButtonWidth;
    for (let i = 0; i < featureButtons.length; i++) {
        document.getElementById(featureButtons[i]).style.top = (canvasTop + (selectedLayout.height - 1) * (buttonWidth + (margin * 2))) + "px";
        document.getElementById(featureButtons[i]).style.left = nextButtonLeft + "px";
        document.getElementById(featureButtons[i]).style.width = featureButtonWidth * featureButtonWidths[i] + "px";
        nextButtonLeft += featureButtonWidth * featureButtonWidths[i];
    }

    // Fix the logo
    resizeFeatureLogo(buttonWidth);
}

function updateFeatureButtons() {
    // Highlight selected mode button
    let buttons = document.querySelectorAll(".featureButton");
    const selectedModeButtonName = Settings.getSetting("displayMode") + "Button";
    for (let i = 0; i < buttons.length; i++) {
        let button = buttons[i];
        if (button.id === selectedModeButtonName) {
            button.classList.add("highlightedFeature");
        } else {
            button.classList.remove("highlightedFeature");
        }
    }
}

// Draw the logo that appears on the Solfetta button
function drawLogo(parent) {
    let appName = "SOLFE♥TTA";
    let parentDiv = document.createElement("div");
    parentDiv.id = "featureLogoContainer";
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let thisElement = document.createElement("div");
            thisElement.className = "featureLogo";
            thisElement.id = 'featureLogo' + (i * 3 + j);
            thisElement.innerHTML = appName[i * 3 + j];
            parentDiv.appendChild(thisElement);
        }
    }

    parent.appendChild(parentDiv);
}

// Resize the logo that appears on the Solfetta button
function resizeFeatureLogo(size) {
    let spaceBetweenElements = 0;
    let borderWidth = 1;
    let borders = borderWidth * 6; // 6 borders
    let outerMargin = 6;
    // Inner width/height of a logo element
    let innerWidth = (size - spaceBetweenElements * 2 - borders - outerMargin * 2) / 3;

    document.getElementById("featureLogoContainer").width = size;
    document.getElementById("featureLogoContainer").height = size;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let thisElement = document.getElementById("featureLogo" + (i * 3 + j));
            thisElement.style.width = innerWidth + "px";
            thisElement.style.height = innerWidth + "px";
            thisElement.style.left = outerMargin + (innerWidth + borderWidth * 2 + spaceBetweenElements) * j + "px";
            thisElement.style.top = outerMargin + (innerWidth + borderWidth * 2 + spaceBetweenElements) * i + "px";
            thisElement.style.fontSize = (innerWidth) + "px";
        }
    }
}

export {
    createFeatureBar,
    resize
}