import * as Utils from './utils.js'
import * as Settings from './settings.js'
import * as Melodies from './melodies.js'
import * as Panel from './panel.js'
import * as MelodyPlay from './melody-play.js'

var melodyNextIntervalId = null;
var melodyPreviousIntervalId = null;

const melodyButtons = [{
        "id": "melodyText",
        "text": "",
        "position": [
            [0, 0],
            [3, 1]
        ]
    },
    {
        "id": "melodyPrevious",
        "text": "&larr;",
        "position": [
            [0, 2],
            [0, 2]
        ],
        "eventListeners": {
            'mousedown': melodyPreviousMouseDown,
            'mouseup': melodyPreviousMouseUp,
            'touchstart': Utils.touchWrapper(melodyPreviousMouseDown),
            'touchend': Utils.touchWrapper(melodyPreviousMouseUp),
            'touchcancel': Utils.touchWrapper(melodyPreviousMouseUp)
        }
    },
    {
        "id": "melodyNext",
        "text": "&rarr;",
        "position": [
            [1, 2],
            [1, 2]
        ],
        "eventListeners": {
            'mousedown': melodyNextMouseDown,
            'mouseup': melodyNextMouseUp,
            'touchstart': Utils.touchWrapper(melodyNextMouseDown),
            'touchend': Utils.touchWrapper(melodyNextMouseUp),
            'touchcancel': Utils.touchWrapper(melodyNextMouseUp)
        }
    },
    {
        "id": "melodyRandom",
        "text": "&#127922",
        "position": [
            [2, 2],
            [2, 2]
        ],
        "eventListeners": {
            "click": function() {
                melodyRandomClick();
                updateButtons();
            }
        }
    },
    {
        "id": "melodyListen",
        "text": "&#128066",
        "position": [
            [3, 2],
            [3, 2]
        ],
        "eventListeners": {
            "click": function() {
                melodyListenClick();
                updateButtons();
            }
        }
    },
    {
        "id": "melodyEasy",
        "text": "Easy",
        "position": [
            [0, 3],
            [(1 / 3), 3]
        ],
        "eventListeners": {
            "click": function() {
                playMelodyClick("easy");
            }
        }
    },
    {
        "id": "melodyMedium",
        "text": "Medium",
        "position": [
            [1 + (1 / 3), 3],
            [1 + (2 / 3), 3]
        ],
        "eventListeners": {
            "click": function() {
                playMelodyClick("medium");
            }
        }
    },
    {
        "id": "melodyHard",
        "text": "Hard",
        "position": [
            [2 + (2 / 3), 3],
            [3, 3]
        ],
        "eventListeners": {
            "click": function() {
                playMelodyClick("hard");
            }
        }
    }
];

const stopRepeatButtons = [{
        "id": "stopRepeatText",
        "text": "",
        "position": [
            [0, 0],
            [3, 2]
        ]
    },
    {
        "id": "stopRepeatStop",
        "text": "Stop",
        "position": [
            [0, 3],
            [1, 3]
        ],
        "eventListeners": {
            "click": function() {
                MelodyPlay.clearPlayingMelody();
                MelodyPlay.highlightNextNote();
                Panel.showPanel("melody");
            }
        }
    },
    {
        "id": "stopRepeatRepeat",
        "text": "Repeat",
        "position": [
            [2, 3],
            [3, 3]
        ],
        "eventListeners": {
            "click": function() {
                Panel.hideAllPanels();
                repeatMelody();
            }
        }
    }
];

const playingButtons = [{
        "id": "playingText",
        "text": "Playing...",
        "position": [
            [0, 0],
            [3, 1]
        ],
        "eventListeners": {}
    },
    {
        "id": "playingSpeed",
        "text": "Speed: 100%",
        "position": [
            [0, 2],
            [1, 2]
        ],
        "eventListeners": {}
    },
    {
        "id": "decreasePlayingSpeed",
        "text": "-",
        "position": [
            [2, 2],
            [2, 2]
        ],
        "eventListeners": {
            'click': decreaseMelodySpeed
        }
    },
    {
        "id": "increasePlayingSpeed",
        "text": "+",
        "position": [
            [3, 2],
            [3, 2]
        ],
        "eventListeners": {
            'click': increaseMelodySpeed
        }
    },
    {
        "id": "stopPlaying",
        "text": "Stop",
        "position": [
            [0, 3],
            [3, 3]
        ],
        "eventListeners": {
            'click': function() {
                MelodyPlay.clearPlayingMelody();
                MelodyPlay.highlightNextNote();
                MelodyPlay.stopMelodyPlaying();
            }
        }
    }
];

const panelDefinitions = {
    "melody": { "buttons": melodyButtons },
    "stopRepeat": { "buttons": stopRepeatButtons },
    "playing": { "buttons": playingButtons }
};

function updateButtons() {
    updateMelodyText();
    document.getElementById("playingSpeed").innerHTML = "Speed: " + (Settings.getSetting("playSpeed") * 100) + "%";
}

function melodyPrevious() {
    Settings.setSetting("melodyNumber", (Settings.getSetting("melodyNumber") - 1 + Melodies.melodies.length) % Melodies.melodies.length);
    updateMelodyText();
}

function melodyNext() {
    Settings.setSetting("melodyNumber", (Settings.getSetting("melodyNumber") + 1) % Melodies.melodies.length);
    updateMelodyText();
}

function melodyNextMouseDown() {
    melodyNext();
    melodyNextIntervalId = setInterval(function() {
        clearInterval(melodyNextIntervalId);
        melodyNextIntervalId = setInterval(melodyNext, 100);
    }, 500);
}

function melodyNextMouseUp() {
    if (melodyNextIntervalId) {
        clearInterval(melodyNextIntervalId);
    }
}

function melodyPreviousMouseDown() {
    melodyPrevious();
    melodyPreviousIntervalId = setInterval(function() {
        clearInterval(melodyPreviousIntervalId);
        melodyPreviousIntervalId = setInterval(melodyPrevious, 100);
    }, 500);
}

function melodyPreviousMouseUp() {
    if (melodyPreviousIntervalId) {
        clearInterval(melodyPreviousIntervalId);
    }
}

function melodyRandomClick() {
    const current = Settings.getSetting("melodyNumber");
    let next;
    do {
        next = Math.floor(Math.random() * Melodies.melodies.length);
    } while (current == next)
    Settings.setSetting("melodyNumber", next);
    updateMelodyText();
}

// Updates the displayed melody text in the melody picker dialog
function updateMelodyText() {
    const melodyNumber = Settings.getSetting("melodyNumber");
    let newMelodyText = "<div style=\"float:left\">" + Melodies.melodies[melodyNumber].name + "</div>";
    let tonality = Melodies.melodies[melodyNumber].tonality;
    if (tonality) {
        newMelodyText += "<div style=\"float:left;font-size:smaller; \"></br>" + tonality + "</div>";
    }
    document.getElementById("melodyText").innerHTML = newMelodyText;
    document.getElementById("stopRepeatText").innerHTML = newMelodyText;
}

function melodyListenClick() {
    MelodyPlay.previewMelody();
}

function playMelodyClick(difficulty) {
    MelodyPlay.startMelody(difficulty);
}

function repeatMelody() {
    Panel.hideAllPanels();
    MelodyPlay.playMelody();
}

function increaseMelodySpeed() {
    Settings.setSetting("playSpeed", Math.round(Math.min(Settings.getSetting("playSpeed") + 0.25, 2.0) * 100) / 100);
    updateButtons();
    MelodyPlay.rescheduleNextEvent();
}

function decreaseMelodySpeed() {
    Settings.setSetting("playSpeed", Math.round(Math.max(Settings.getSetting("playSpeed") - 0.25, 0.25) * 100) / 100);
    updateButtons();
    MelodyPlay.rescheduleNextEvent();
}

function init() {
    Panel.createPanels(panelDefinitions);
}

export {
    init,
    updateMelodyText,
    updateButtons,
    repeatMelody,
}