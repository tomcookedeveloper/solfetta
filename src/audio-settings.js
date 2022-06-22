import * as Utils from './utils.js'
import * as Audio from './audio.js'
import * as Panel from './panel.js'
import * as Settings from './settings.js'

const fixAudioButtons = [{
        "id": "fixAudioConfirmText",
        "text": "Reload app to fix audio issues?",
        "position": [
            [0, 0],
            [3, 2]
        ]
    },
    {
        "id": "fixAudioOK",
        "text": "OK",
        "position": [
            [0, 3],
            [1, 3]
        ],
        "eventListeners": {
            "click": fixAudio
        }
    },
    {
        "id": "fixAudioClose",
        "text": "Cancel",
        "position": [
            [2, 3],
            [3, 3]
        ],
        "eventListeners": {
            "click": function() { Panel.showPanel("audio"); }
        }
    }
];

const audioButtons = [{
        "id": "tuningValue",
        "text": "Tuning:",
        "position": [
            [0, 0],
            [1, 0]
        ],
        "eventListeners": {
            'click': function() {
                Panel.redrawPanel("tuning");
                Panel.showPanel("tuning");
            }
        }
    },
    {
        "id": "testAudio",
        "text": "Test Audio",
        "position": [
            [2, 0],
            [3, 0]
        ],
        "eventListeners": {
            'mousedown': tuningNoteMouseDown,
            'mouseup': tuningNoteMouseUp,
            'touchstart': Utils.touchWrapper(tuningNoteMouseDown),
            'touchend': Utils.touchWrapper(tuningNoteMouseUp),
            'touchcancel': Utils.touchWrapper(tuningNoteMouseUp)
        }
    },
    {
        "id": "sound",
        "text": "",
        "position": [
            [0, 2],
            [3, 2]
        ],
        "eventListeners": {
            'click': soundClick
        }
    },
    {
        "id": "volume",
        "text": "",
        "position": [
            [0, 1],
            [1, 1]
        ],
        "eventListeners": {}
    },
    {
        "id": "volumeDown",
        "text": "-",
        "position": [
            [2, 1],
            [2, 1]
        ],
        "eventListeners": {
            'click': volumeDownClick

        }
    },
    {
        "id": "volumeUp",
        "text": "+",
        "position": [
            [3, 1],
            [3, 1]
        ],
        "eventListeners": {
            'click': volumeUpClick
        }
    },
    {
        "id": "fixAudio",
        "text": "Fix Audio",
        "position": [
            [2, 3],
            [3, 3]
        ],
        "eventListeners": {
            'click': function() { Panel.showPanel("fixAudio"); }
        }
    },
    {
        "id": "audioClose",
        "text": 'Back',
        "position": [
            [0, 3],
            [1, 3]
        ],
        "eventListeners": {
            "click": function() { Panel.showPanel("settings"); }
        }
    }
];

const tuningButtons = [{
        "id": "tuningTuningValue",
        "text": "Tuning:",
        "position": [
            [0, 0],
            [2, 0]
        ],
        "eventListeners": {
            'mousedown': tuningNoteMouseDown,
            'mouseup': tuningNoteMouseUp,
            'touchstart': Utils.touchWrapper(tuningNoteMouseDown),
            'touchend': Utils.touchWrapper(tuningNoteMouseUp),
            'touchcancel': Utils.touchWrapper(tuningNoteMouseUp)
        }
    },
    {
        "id": "tuningDown",
        "text": "-",
        "position": [
            [0, 1],
            [0.5, 1]
        ],
        "eventListeners": {
            'mousedown': tuningDownMouseDown,
            'mouseup': tuningDownMouseUp,
            'touchstart': Utils.touchWrapper(tuningDownMouseDown),
            'touchend': Utils.touchWrapper(tuningDownMouseUp),
            'touchcancel': Utils.touchWrapper(tuningDownMouseUp)
        }
    },
    {
        "id": "resetTuning",
        "text": "Reset to A=440",
        "position": [
            [0, 2],
            [2, 2]
        ],
        "eventListeners": {
            'click': resetTuning
        }
    },
    {
        "id": "tuningUp",
        "text": "+",
        "position": [
            [1.5, 1],
            [2, 1]
        ],
        "eventListeners": {
            'mousedown': tuningUpMouseDown,
            'mouseup': tuningUpMouseUp,
            'touchstart': Utils.touchWrapper(tuningUpMouseDown),
            'touchend': Utils.touchWrapper(tuningUpMouseUp),
            'touchcancel': Utils.touchWrapper(tuningUpMouseUp)
        }
    },
    {
        "id": "tuningControl",
        "text": "&#11021;",
        "position": [
            [3, 0],
            [3, 0]
        ],
        "eventListeners": {
            'mousedown': tuningControlMouseDown,
            'mouseup': tuningControlMouseUp,
            'touchstart': Utils.touchWrapper(tuningControlMouseDown),
            'touchend': Utils.touchWrapper(tuningControlMouseUp),
            'touchcancel': Utils.touchWrapper(tuningControlMouseUp)
        }
    },
    {
        "id": "tuningClose",
        "text": 'Back',
        "position": [
            [0, 3],
            [2, 3]
        ],
        "eventListeners": { "click": function() { Panel.showPanel("audio"); } }
    }
];

const panelDefinitions = {
    "audio": { "buttons": audioButtons },
    "fixAudio": { "buttons": fixAudioButtons },
    "tuning": { "buttons": tuningButtons }
};

var tuningDownIntervalId = null;
var tuningUpIntervalId = null;

function tuningNoteMouseDown() {
    Audio.playNote(Settings.getSetting("configuredDo"));
}

function tuningNoteMouseUp() {
    Audio.stopPlaying(Settings.getSetting("configuredDo"));
}

function tuningUpMouseDown() {
    tuneUp();
    tuningUpIntervalId = setInterval(function() {
        clearInterval(tuningUpIntervalId);
        tuningUpIntervalId = setInterval(tuneUp, 100);
    }, 500);
}

function tuningControlMouseDown(e) {
    previousTuningTouch = null;
    window.addEventListener("mousemove", tuningControlMouseMove, { "passive": false });
    window.addEventListener("touchmove", tuningControlTouchMove, { "passive": false });
    window.addEventListener("mouseup", tuningControlMouseUp, { "passive": false });
    Audio.playNote(Settings.getSetting("configuredDo"));
}

function tuningControlMouseUp(e) {
    previousTuningTouch = null;
    window.removeEventListener("mousemove", tuningControlMouseMove, { "passive": false });
    window.removeEventListener("touchmove", tuningControlTouchMove, { "passive": false });
    window.removeEventListener("mouseup", tuningControlMouseUp, { "passive": false });
    Audio.stopPlaying(Settings.getSetting("configuredDo"));
}

let previousTuningTouch = null;

function tuningControlTouchMove(e) {
    const touch = e.touches[0];
    if (previousTuningTouch != null) {
        e.movementY = (touch.pageY - previousTuningTouch);
        tuningControlMouseMove(e);
    }
    previousTuningTouch = touch.pageY;
    e.preventDefault();
}

function tuningControlMouseMove(e) {
    let newPosition = parseFloat(document.getElementById("tuningControl").style.top) + e.movementY;

    let minPosition = parseFloat(document.getElementById("tuningTuningValue").style.top);
    let maxPosition = parseFloat(document.getElementById("tuningClose").style.top);

    newPosition = Math.max(minPosition, newPosition);
    newPosition = Math.min(maxPosition, newPosition);

    document.getElementById("tuningControl").style.top = newPosition + "px";

    let newFrequency = ((newPosition - minPosition) / (maxPosition - minPosition)) * (427 - 453) + 453;

    Settings.setSetting("aFrequency", Math.round(newFrequency * 10) / 10);
    updateDoFrequency();
    document.getElementById("tuningTuningValue").innerHTML = "A: " + Settings.getSetting("aFrequency").toFixed(1) + "Hz";
    document.getElementById("tuningValue").innerHTML = "A: " + Settings.getSetting("aFrequency").toFixed(1) + "Hz";
}

function updateDoFrequency() {
    Audio.updateFrequencyOfPlayingNote(Settings.getSetting("configuredDo"));
}

function resetTuning() {
    Settings.setSetting("aFrequency", 440);
    updateSettingsButtons();
    updateDoFrequency();
}

function tuneUp() {
    Settings.setSetting("aFrequency", Math.round(Math.min(Settings.getSetting("aFrequency") + 0.1, 453) * 10) / 10);
    updateSettingsButtons();
    updateDoFrequency();
}

function tuningUpMouseUp() {
    if (tuningUpIntervalId) {
        clearInterval(tuningUpIntervalId);
    }
}

function tuneDown() {
    Settings.setSetting("aFrequency", Math.round(Math.max(Settings.getSetting("aFrequency") - 0.1, 427) * 10) / 10);
    updateSettingsButtons();
    updateDoFrequency();
}

function tuningDownMouseDown() {
    tuneDown();
    tuningDownIntervalId = setInterval(function() {
        clearInterval(tuningDownIntervalId);
        tuningDownIntervalId = setInterval(tuneDown, 100);
    }, 500);
}

function tuningDownMouseUp() {
    if (tuningDownIntervalId) {
        clearInterval(tuningDownIntervalId);
    }
}

function volumeUpClick() {
    Settings.setSetting("volume", Math.round(Math.min(Settings.getSetting("volume") + 0.1, 1) * 10) / 10);
    updateSettingsButtons();
}

function volumeDownClick() {
    Settings.setSetting("volume", Math.round(Math.max(Settings.getSetting("volume") - 0.1, 0.1) * 10) / 10);
    updateSettingsButtons();
}

function soundClick() {
    const soundKeys = Object.keys(Audio.getSounds());
    Settings.setSetting("sound", soundKeys[(soundKeys.indexOf(Settings.getSetting("sound")) + 1) % soundKeys.length]);
    updateSettingsButtons();
}

function fixAudio() {
    window.location.reload();
}

function init() {
    Panel.createPanels(panelDefinitions);
}

function updateSettingsButtons() {
    document.getElementById("sound").innerHTML = "Sound: " + Audio.getSounds()[Settings.getSetting("sound")];
    document.getElementById("volume").innerHTML = "Volume: " + Math.round(Settings.getSetting("volume") * 10);
    document.getElementById("tuningValue").innerHTML = "A: " + Settings.getSetting("aFrequency").toFixed(1) + "Hz";
    document.getElementById("tuningTuningValue").innerHTML = "A: " + Settings.getSetting("aFrequency").toFixed(1) + "Hz";

    for (let i = 0; i < tuningButtons.length; i++) {
        if (tuningButtons[i].id == "tuningControl") {
            let x = ((453 - Settings.getSetting("aFrequency")) / (453 - 427)) * 3;
            tuningButtons[i].position[0][1] = tuningButtons[i].position[1][1] = x;
            Panel.redrawPanel("tuning");
        }
    }
}

export {
    init,
    updateSettingsButtons
}