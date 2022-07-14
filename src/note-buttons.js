import * as Settings from './settings.js';
import * as Utils from './utils.js';
import * as Audio from './audio.js';
import * as Display from './display.js';
import * as Panel from './panel.js'
import * as Music from './music.js'
import * as MelodyPlay from './melody-play.js'

// Music playing area elements
var noteButtons = [];

let lowestNoteValue;
let lastNoteValue; // note value, starts at zero
let holdNoteValue; // don't change text for this note until it's released

function setLowestNoteValue(number) {
    lowestNoteValue = number;
}

// We need to know what the last note value was to be able to bold the note and show
// relative interval values
function setLastNoteValue(last) {
    lastNoteValue = last;
}

function getLastNoteValue() {
    return lastNoteValue;
}

function idToNumber(id) {
    return Number(id.replace(/\D/g, ''));
}

function playSelectedNoteButton(selectedButton) {
    let noteValue = buttonIndexToNoteValue(selectedButton);
    Audio.playNote(noteValue);
    displayNotes();
}

function noteButtonMouseDown(e) {
    if (Panel.isPanelShowing()) {
        Panel.hideAllPanels();
    } else {
        let selectedButton = idToNumber(this.id);
        if (Settings.getSetting("displayMode") === "intervals") {
            holdNoteValue = buttonIndexToNoteValue(selectedButton);
        }
        setLastNoteValue(buttonIndexToNoteValue(selectedButton));
        MelodyPlay.clearMelodyHighlight();
        playSelectedNoteButton(selectedButton);
    }
};

function noteButtonMouseUp(e) {
    let selectedButton = idToNumber(this.id);
    let noteValue = buttonIndexToNoteValue(selectedButton);
    if (Audio.noteIsPlaying(noteValue)) {
        Audio.stopPlaying(noteValue);
        MelodyPlay.processPlayedNote(noteValue);
        if (holdNoteValue != null) {
            holdNoteValue = null;
        }
        displayNotes();
    }
}

function createNoteButtons(squaresWidth, squaresHeight, numberOfFeatureButtons) {
    // Wipe out any existing buttons
    let existingNoteButtons = document.querySelectorAll(".noteButton");
    for (let i = 0; i < existingNoteButtons.length; i++) {
        existingNoteButtons[i].remove();;
    }

    for (let i = 0; i < squaresHeight; i++) {
        for (let j = 0; j < squaresWidth; j++) {
            if ((i * squaresWidth + j) < numberOfFeatureButtons) {
                continue;
            }
            let thisButton = document.createElement("div");
            thisButton.id = 'noteButton' + (i * squaresWidth + j - numberOfFeatureButtons);
            noteButtons[i * squaresWidth + j - numberOfFeatureButtons] = thisButton;
            thisButton.className = "button";
            thisButton.classList.add("noteButton");
            thisButton.addEventListener('mousedown', Utils.onClickWrapper(noteButtonMouseDown));
            thisButton.addEventListener('touchstart', Utils.touchWrapper(Utils.onClickWrapper(noteButtonMouseDown)), { "passive": false });
            thisButton.addEventListener('mouseup', Utils.onClickWrapper(noteButtonMouseUp));
            thisButton.addEventListener('mouseout', noteButtonMouseUp);
            thisButton.addEventListener('touchend', Utils.touchWrapper(Utils.onClickWrapper(noteButtonMouseUp)));
            thisButton.addEventListener('touchcancel', Utils.touchWrapper(Utils.onClickWrapper(noteButtonMouseUp)));
            document.body.appendChild(thisButton);
        }
    }
    const lowestNoteValue = 0 - (Math.floor((squaresWidth * squaresHeight - numberOfFeatureButtons) / 2));
    setLowestNoteValue(lowestNoteValue);
    Settings.setSetting("numberOfNotes", squaresHeight * squaresWidth - numberOfFeatureButtons);
}

function buttonIndexToNoteValue(i) {
    return lowestNoteValue + i;
}

function noteValueToNoteButtonNumber(noteValue) {
    return noteValue - lowestNoteValue;
}

// This actually resizes the feature buttons as well
function resize(selectedLayout, buttonWidth, margin, canvasLeft, canvasTop) {
    let buttons = document.querySelectorAll(".button");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].style.width = buttonWidth + "px";
        buttons[i].style.height = buttonWidth + "px";
        var idx = parseInt(buttons[i].id.replace("noteButton", "")) + 5;
        buttons[i].style.left = canvasLeft + (idx % selectedLayout.width) * (buttonWidth + (margin * 2)) + "px";
        buttons[i].style.top = canvasTop + ((selectedLayout.height - 1) - Math.floor(idx / selectedLayout.width)) * (buttonWidth + (margin * 2)) + "px";
    }
}

// Update text and styles for note buttons
function displayNotes() {
    let notes = document.querySelectorAll(".noteButton");

    for (let i = 0; i < notes.length; i++) {
        let thisButtonIndex = idToNumber(notes[i].id);

        // Figure out which note this is from the element ID
        let thisNoteValue;
        let matches = notes[thisButtonIndex].id.match(/noteButton([0-9]+)/);
        if (matches) {
            thisNoteValue = buttonIndexToNoteValue(parseInt(matches[1]));
        } else {
            continue;
        }

        // Highlight if last note button clicked
        if (buttonIndexToNoteValue(thisButtonIndex) === lastNoteValue) {
            notes[thisButtonIndex].classList.add("highlighted");
        } else {
            notes[thisButtonIndex].classList.remove("highlighted");
        }

        // Apply styles
        if (Music.noteIsInKey(thisNoteValue, Settings.getSetting("configuredDo"), Settings.getSetting("majorMinor")) || !Settings.getSetting("highlights")) {
            notes[thisButtonIndex].classList.add("diatonic");
            notes[thisButtonIndex].classList.remove("chromatic");
            notes[thisButtonIndex].classList.remove("octave");
            if (Music.noteIsTonic(thisNoteValue, Settings.getSetting("configuredDo"), Settings.getSetting("majorMinor")) &&
                Settings.getSetting("highlights")) {
                notes[thisButtonIndex].classList.add("tonic");
            } else {
                notes[thisButtonIndex].classList.remove("tonic");
            }
        } else {
            notes[thisButtonIndex].classList.add("chromatic");
            notes[thisButtonIndex].classList.remove("diatonic");
            notes[thisButtonIndex].classList.remove("octave");
            notes[thisButtonIndex].classList.remove("tonic");
        }

        // Set note text
        if (Settings.getSetting("labels") === "on" ||
            (Settings.getSetting("labels") === "held-note" && Audio.noteIsPlaying(thisNoteValue))) {
            if (thisNoteValue !== holdNoteValue || notes[thisButtonIndex].innerHTML === "") {
                let noteText = Music.getNoteText(thisNoteValue, getLastNoteValue());
                notes[thisButtonIndex].innerHTML = noteText;
            }
        } else {
            notes[thisButtonIndex].innerHTML = "";
        }
    }

    // Make sure correct colours (light/dark) are being applied
    Display.applyColours();
}

export {
    createNoteButtons,
    resize,
    displayNotes,
    setLastNoteValue,
    getLastNoteValue,
    noteValueToNoteButtonNumber,
    buttonIndexToNoteValue,
}