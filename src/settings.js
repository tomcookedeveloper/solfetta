import * as Utils from './utils.js'
import * as NoteButtons from './note-buttons.js'
import * as Music from './music.js'
import * as Audio from './audio.js'
import * as Panel from './panel.js'
import * as AudioSettings from './audio-settings.js'
import * as DisplaySettings from './display-settings.js'
import * as MelodyPlay from './melody-play.js'

// Non-stored settings
let sessionSettings = {};

// Choosing Do or La
var chooseDoLa = "Do";

const storedSettings = ["audioSpeed", "volume", "raisedLowered", "highlights", "darkMode", "aFrequency",
    "configuredDo", "tonality", "sound", "minor", "soSol", "melodyNumber", "lastRun", "playSpeed"
];

function getSetting(key) {

    const defaults = {
        "appVersion": "1.0.0",
        "audioSpeed": "Fast",
        "volume": 0.5,
        "displayMode": "solfege",
        "raisedLowered": "lowered",
        "configuredDo": 0,
        "highlights": true,
        "darkMode": false,
        "aFrequency": 440,
        "tonality": "Major",
        "sound": "square",
        "minor": "do-based",
        "melodyNumber": 0,
        "soSol": "Sol",
        "noteGap": 20,
        "minWidth": 42,
        "lastRun": 0,
        "playSpeed": 0.75
    };

    if (key === "majorMinor") {
        if (getSetting("tonality") === "Major") {
            return "Major";
        } else {
            return (getSetting("minor") === "do-based") ? "Do-based Minor" : "La-based Minor";
        }
    }

    let val;
    if (storedSettings.indexOf(key) !== -1) {
        val = window.localStorage.getItem(key);
    } else {
        val = sessionSettings[key];
    }
    if (val !== undefined && val !== "undefined" && val !== null) {
        return JSON.parse(val);
    } else {
        setSetting(key, defaults[key]);
        return defaults[key];
    }
}

function setSetting(key, value) {
    if (storedSettings.indexOf(key) !== -1) {
        window.localStorage.setItem(key, JSON.stringify(value));
    } else {
        sessionSettings[key] = JSON.stringify(value);
    }
}

// We have a 4x4 0-based grid, position from 0,0 to 3,3
const settingsButtons = [{
        "id": "settingsDoButton",
        "text": "Set Do",
        "position": [
            [0, 0],
            [1, 0]
        ],
        "eventListeners": {
            "click": function(e) {
                chooseDoLa = getSetting("majorMinor") == "La-based Minor" ? "La" : "Do";
                updateSettingsButtons();
                Panel.showPanel("chooseDo");
            }
        }
    },
    {
        "id": "majorMinorButton",
        "text": "Major",
        "position": [
            [2, 0],
            [3, 0]
        ],
        "eventListeners": {
            "click": function(e) {
                updateSettingsButtons();
                majorMinorClick();
            }
        }
    },
    {
        "id": "settingsAudioButton",
        "text": "Audio&hellip;",
        "position": [
            [0, 1],
            [1, 1]
        ],
        "eventListeners": {
            "click": function(e) { Panel.showPanel("audio"); }
        }
    },
    {
        "id": "settingsDisplayButtons",
        "text": "Display&hellip;",
        "position": [
            [2, 1],
            [3, 1]
        ],
        "eventListeners": {
            "click": function(e) { Panel.showPanel("display"); }
        }
    },
    {
        "id": "settingsDefaultsButton",
        "text": "Reset&hellip;",
        "position": [
            [0, 2],
            [1, 2]
        ],
        "eventListeners": {
            "click": function(e) { Panel.showPanel("defaults"); }
        }
    },
    {
        "id": "settingsAboutButton",
        "text": "About&hellip;",
        "position": [
            [2, 2],
            [3, 2]
        ],
        "eventListeners": {
            "click": function(e) { Panel.showPanel("about"); }
        }
    },
    {
        "id": "settingsHelpButton",
        "text": "How to use Solfetta",
        "position": [
            [0, 3],
            [3, 3]
        ],
        "eventListeners": {
            "click": function(e) {
                window.open('https://github.com/tomcookedeveloper/solfetta#readme', '_blank');
            }
        }
    },
];

const defaultsButtons = [{
        "id": "confirmText",
        "text": "Reset all settings to defaults and reload?",
        "position": [
            [0, 0],
            [3, 2]
        ]
    },
    {
        "id": "defaultsOK",
        "text": "OK",
        "position": [
            [0, 3],
            [1, 3]
        ],
        "eventListeners": {
            "click": defaultsOKClick
        }
    },
    {
        "id": "defaultsCloseButton",
        "text": "Cancel",
        "position": [
            [2, 3],
            [3, 3]
        ],
        "eventListeners": {
            "click": settingsMouseDown
        }
    }
];

const chooseDoEventListeners = {
    'mousedown': chooseDoNoteMouseDown,
    'mouseup': chooseDoNoteMouseUp,
    'mouseout': chooseDoNoteMouseUp,
    'touchstart': Utils.touchWrapper(chooseDoNoteMouseDown),
    'touchend': Utils.touchWrapper(chooseDoNoteMouseUp),
    'touchcancel': Utils.touchWrapper(chooseDoNoteMouseUp)
};

const chooseDoButtons = [{
        "id": "chooseDoGSharp",
        "text": "G#/Ab",
        "position": [
            [0, 0],
            [0, 0]
        ],
        "eventListeners": chooseDoEventListeners,
        "classes": ["chooseDoNote"]
    },
    {
        "id": "chooseDoA",
        "text": "A",
        "position": [
            [1, 0],
            [1, 0]
        ],
        "eventListeners": chooseDoEventListeners,
        "classes": ["chooseDoNote"]
    },
    {
        "id": "chooseDoASharp",
        "text": "A#/Bb",
        "position": [
            [2, 0],
            [2, 0]
        ],
        "eventListeners": chooseDoEventListeners,
        "classes": ["chooseDoNote"]
    },
    {
        "id": "chooseDoB",
        "text": "B",
        "position": [
            [3, 0],
            [3, 0]
        ],
        "eventListeners": chooseDoEventListeners,
        "classes": ["chooseDoNote"]
    },
    {
        "id": "chooseDoE",
        "text": "E",
        "position": [
            [0, 1],
            [0, 1]
        ],
        "eventListeners": chooseDoEventListeners,
        "classes": ["chooseDoNote"]
    },
    {
        "id": "chooseDoF",
        "text": "F",
        "position": [
            [1, 1],
            [1, 1]
        ],
        "eventListeners": chooseDoEventListeners,
        "classes": ["chooseDoNote"]
    },
    {
        "id": "chooseDoFSharp",
        "text": "F#/Gb",
        "position": [
            [2, 1],
            [2, 1]
        ],
        "eventListeners": chooseDoEventListeners,
        "classes": ["chooseDoNote"]
    },
    {
        "id": "chooseDoG",
        "text": "G",
        "position": [
            [3, 1],
            [3, 1]
        ],
        "eventListeners": chooseDoEventListeners,
        "classes": ["chooseDoNote"]
    },
    {
        "id": "chooseDoC",
        "text": "C",
        "position": [
            [0, 2],
            [0, 2]
        ],
        "eventListeners": chooseDoEventListeners,
        "classes": ["chooseDoNote"]
    },
    {
        "id": "chooseDoCSharp",
        "text": "C#/Db",
        "position": [
            [1, 2],
            [1, 2]
        ],
        "eventListeners": chooseDoEventListeners,
        "classes": ["chooseDoNote"]
    },
    {
        "id": "chooseDoD",
        "text": "D",
        "position": [
            [2, 2],
            [2, 2]
        ],
        "eventListeners": chooseDoEventListeners,
        "classes": ["chooseDoNote"]
    },
    {
        "id": "chooseDoDSharp",
        "text": "D#/Eb",
        "position": [
            [3, 2],
            [3, 2]
        ],
        "eventListeners": chooseDoEventListeners,
        "classes": ["chooseDoNote"]
    },
    {
        "id": "chooseDoClose",
        "text": 'Back',
        "position": [
            [0, 3],
            [1, 3]
        ],
        "eventListeners": { "click": settingsMouseDown }
    },
    {
        "id": "random",
        "text": 'Random',
        "position": [
            [2, 3],
            [3, 3]
        ],
        "eventListeners": { "click": randomDoClick }
    }
];

const messageButtons = [{
    "id": "messageText",
    "text": "Melody completed!",
    "position": [
        [0, 0],
        [3, 3]
    ],
    "eventListeners": {
        'click': function() { Panel.hideAllPanels(); }
    }
}];

const aboutButtons = [{
    "id": "aboutText",
    "text": "<p>Solfetta Version " + getSetting("appVersion") + "</p><p>&copy; 2022 Tom Cooke</p><p>License: MIT</p>" +
        "<p><a href=\"https://github.com/tomcookedeveloper/solfetta\" target=\"_blank\">Solfetta on GitHub</a>" +
        "<p><a href=\"mailto:TomCookeDeveloper@gmail.com\">Email Me</a>",
    "position": [
        [0, 0],
        [3, 3]
    ],
    "eventListeners": {
        'click': function() { Panel.showPanel("settings"); }
    }
}];

const splashButtons = [{
    "id": "splashText",
    "text": "<p>Welcome to Solfetta!</p><p>Use the note buttons to play what you like - or try the melody button for ideas</p>",
    "position": [
        [0, 0],
        [3, 3]
    ],
    "eventListeners": {
        'click': function() { Panel.hideAllPanels(); }
    }
}];

const panelDefinitions = {
    "settings": { "buttons": settingsButtons },
    "chooseDo": { "buttons": chooseDoButtons },
    "defaults": { "buttons": defaultsButtons },
    "message": { "buttons": messageButtons },
    "about": { "buttons": aboutButtons },
    "splash": { "buttons": splashButtons }
};

const buttonToDo = {
    "chooseDoGSharp": 8,
    "chooseDoA": 9,
    "chooseDoASharp": 10,
    "chooseDoB": 11,
    "chooseDoE": 4,
    "chooseDoF": 5,
    "chooseDoFSharp": 6,
    "chooseDoG": 7,
    "chooseDoC": 0,
    "chooseDoCSharp": 1,
    "chooseDoD": 2,
    "chooseDoDSharp": 3
};

function chooseDoNoteMouseDown(e) {
    let selectedDo = buttonToDo[this.id];
    // If we're actually choosing La we need to make an adjustment
    setSetting("configuredDo", (chooseDoLa === "Do") ? selectedDo : ((selectedDo + 3) % 12));
    NoteButtons.displayNotes();
    updateSettingsButtons();
    Audio.playNote(selectedDo - 12);
    MelodyPlay.clearPlayerSequence(); // Doesn't make sense to keep this once we've changed key
    MelodyPlay.highlightNextNote();
}

function chooseDoNoteMouseUp(e) {
    let selectedDo = buttonToDo[this.id];
    Audio.stopPlaying(selectedDo - 12);
}

function randomDoClick() {
    const lastDo = getSetting("configuredDo");
    while (lastDo == getSetting("configuredDo")) {
        setSetting("configuredDo", Math.floor(Math.random() * 12));
    }
    NoteButtons.displayNotes();
    updateSettingsButtons();
}

function majorMinorClick() {
    const options = ["Major", "Minor"];
    setSetting("tonality", options[(options.indexOf(getSetting("tonality")) + 1) % options.length]);
    if (getSetting("minor") === "la-based") {
        if (getSetting("tonality") === "Minor") {
            setSetting("configuredDo", (getSetting("configuredDo") + 3) % 12);
        } else {
            setSetting("configuredDo", (getSetting("configuredDo") + 9) % 12);
        }
    }
    updateSettingsButtons();
    NoteButtons.displayNotes();
}

function updateSettingsButtons() {
    const configuredDo = getSetting("configuredDo");

    let doText;
    if (getSetting("majorMinor") === "La-based Minor") {
        doText = "La: " + Music.minorKeyFromDo((configuredDo + 9) % 12);
    } else if (getSetting("tonality") === "Major") {
        doText = "Do: " + Music.majorKeyFromDo(configuredDo);
    } else {
        doText = "Do: " + Music.minorKeyFromDo(configuredDo);
    }
    document.getElementById("settingsDoButton").innerHTML = doText;
    document.getElementById("majorMinorButton").innerHTML = document.getElementById("majorMinorButton").innerHTML = "Tonality: " + getSetting("tonality");

    let notes = document.querySelectorAll(".chooseDoNote");
    const selectedNote = (chooseDoLa === "Do") ? configuredDo : (configuredDo + 9) % 12;

    for (let i = 0; i < notes.length; i++) {
        let element = notes[i];
        if (getSetting("tonality") === "Major") {
            element.innerHTML = Music.majorKeyFromDo(buttonToDo[element.id]);
        } else {
            element.innerHTML = Music.minorKeyFromDo(buttonToDo[element.id]);
        }

        if (buttonToDo[element.id] == selectedNote) {
            element.classList.add("highlighted");
        } else {
            element.classList.remove("highlighted");
        }
    }

    AudioSettings.updateSettingsButtons();
    DisplaySettings.updateSettingsButtons();
}

function defaultsOKClick(e) {
    window.localStorage.clear();
    window.location.reload();
}

function settingsMouseDown(e) {
    updateSettingsButtons();
    if (document.getElementById("settings").classList.contains("hiddenPanel")) {
        Panel.showPanel("settings");
    } else {
        Panel.hideAllPanels();
    }
}

function init() {
    Panel.createPanels(panelDefinitions);
    AudioSettings.init();
    DisplaySettings.init();

}

export {
    setSetting,
    getSetting,
    settingsMouseDown,
    updateSettingsButtons,
    init
};