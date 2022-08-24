import * as Display from './display.js'
import * as Panel from './panel.js'
import * as Settings from './settings.js'
import * as NoteButtons from './note-buttons.js'

const displayButtons = [{
        "id": "displayDarkMode",
        "text": "Dark: Off",
        "position": [
            [2, 0],
            [3, 0]
        ],
        "eventListeners": {
            'click': displayDarkClick
        }
    },
    {
        "id": "displayHighlights",
        "text": "Highlights: On",
        "position": [
            [0, 0],
            [1, 0]
        ],
        "eventListeners": {
            'click': displayHighlightsClick
        }
    },
    {
        "id": "displayRaisedLowered",
        "text": "Sharps",
        "position": [
            [0, 1],
            [1, 1]
        ],
        "eventListeners": {
            'click': displayRaisedLoweredClick
        }
    },
    {
        "id": "displaySoSol",
        "text": "So/Sol:",
        "position": [
            [2, 1],
            [3, 1]
        ],
        "eventListeners": {
            'click': displaySoSolClick
        }
    },
    {
        "id": "displayMinor",
        "text": "Minor:",
        "position": [
            [0, 2],
            [1, 2]
        ],
        "eventListeners": {
            'click': displayMinorClick
        }
    },
    {
        "id": "displayLabels",
        "text": "Labels:",
        "position": [
            [2, 2],
            [3, 2]
        ],
        "eventListeners": {
            'click': displayLabelsClick
        }
    },
    {
        "id": "displayClose",
        "text": 'Back',
        "position": [
            [0, 3],
            [3, 3]
        ],
        "eventListeners": { "click": function() { Panel.showPanel("settings"); } }
    },
];

const panelDefinitions = {
    "display": { "buttons": displayButtons }
}

function displayDarkClick() {
    Settings.setSetting("darkMode", !Settings.getSetting("darkMode"));
    updateSettingsButtons();
    Display.applyColours();
}

function displayHighlightsClick() {
    const options = ["on", "off", "on-c"];
    Settings.setSetting("highlights", options[(options.indexOf(Settings.getSetting("highlights")) + 1) % options.length]);
    updateSettingsButtons();
    NoteButtons.displayNotes();
}

function displayRaisedLoweredClick() {
    const options = ["raised", "lowered", "both"];
    Settings.setSetting("raisedLowered", options[(options.indexOf(Settings.getSetting("raisedLowered")) + 1) % options.length]);
    updateSettingsButtons();
    NoteButtons.displayNotes();
}

function displayMinorClick() {
    const options = ["do-based", "la-based"];
    if (Settings.getSetting("tonality") === "Minor") {
        if (Settings.getSetting("minor") === "do-based") {
            Settings.setSetting("configuredDo", (Settings.getSetting("configuredDo") + 3) % 12);
        } else {
            Settings.setSetting("configuredDo", (Settings.getSetting("configuredDo") + 9) % 12);
        }
    }
    Settings.setSetting("minor", options[(options.indexOf(Settings.getSetting("minor")) + 1) % options.length]);
    Settings.updateSettingsButtons(); // needs to update displayed do on main panel, so update all
    NoteButtons.displayNotes();
}

function displayLabelsClick() {
    const options = ["on", "off", "held-note"];
    Settings.setSetting("labels", options[(options.indexOf(Settings.getSetting("labels")) + 1) % options.length]);
    updateSettingsButtons();
    NoteButtons.displayNotes();
}

function displaySoSolClick() {
    const options = ["So", "Sol"];
    Settings.setSetting("soSol", options[(options.indexOf(Settings.getSetting("soSol")) + 1) % options.length]);
    updateSettingsButtons();
    NoteButtons.displayNotes();
}

function init() {
    Panel.createPanels(panelDefinitions);
}

function updateSettingsButtons() {
    document.getElementById("displayDarkMode").innerHTML = "Dark: " + ((Settings.getSetting("darkMode")) ? "On" : "Off");
    document.getElementById("displayHighlights").innerHTML = "Highlights: " + { "on": "On<br/>Current Key", "off": "Off", "on-c": "On<br/>(C Major)" }[Settings.getSetting("highlights")];
    document.getElementById("displayRaisedLowered").innerHTML = "Solfa:<br/>" + { "raised": "Raised", "lowered": "Lowered", "both": "Both" }[Settings.getSetting("raisedLowered")];
    document.getElementById("displayMinor").innerHTML = "Minor:<br/>" + { "do-based": "Do-Based", "la-based": "La-Based" }[Settings.getSetting("minor")];
    document.getElementById("displayLabels").innerHTML = "Labels:<br/>" + { "on": "On", "off": "Off", "held-note": "Held Note" }[Settings.getSetting("labels")];
    document.getElementById("displaySoSol").innerHTML = "So/Sol: " + { "Sol": "Sol", "So": "So" }[Settings.getSetting("soSol")];
}

export {
    init,
    updateSettingsButtons
}