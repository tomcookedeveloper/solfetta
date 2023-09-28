import * as Settings from './settings.js'

let synth = null;
var playingNotes = {};

const sounds = {
    "0": "Grand Piano",
    "2": "Electric Piano",
    "8": "Celesta",
    "11": "Vibraphone",
    "12": "Marimba",
    "18": "Rock Organ",
    "24": "Nylon Guitar",
    "29": "Overdrive",
    "33": "Finger Bass",
    "46": "Harp",
    "56": "Trumpet",
    "73": "Flute",
    "112": "Tinkle Bell"
};

// Solfetta used to have the ability to add extra latency to note starts to help avoid initial clicks
// on devices where this was a problem. This seems not to be an issue now on devices I have tested on
// so it's no longer exposed in the UI as a config option but the "audioSpeed" setting can still
// be set programmatically to one of the other options
const twelfthRootOfTwo = 1.05946309436;

function getSynth() {

    if (synth != null) {
        if (synth.getAudioContext().state === "interrupted" || synth.getAudioContext().state === "suspended") {
            synth.getAudioContext().resume();
        } else if (synth.getAudioContext.state === "closed") {
            synth = null;
        }
    }

    if (synth == null) {
        synth = new WebAudioTinySynth({});
        synth.setBendRange(1, 0x80);
        synth.getAudioContext().onstateChange = () => {
            if (synth.getAudioContext().state === "interrupted") {
                synth.allSoundOff(1);
            }
        };
    }

    synth.setProgram(1, Number.parseInt(Settings.getSetting("program")));

    return synth;
}

function initContext() {
    getSynth();
}

function resetContext() {
    // synth = null;
}

function updateBendLevel() {
    let aFrequency = Settings.getSetting("aFrequency");
    let bendLevel = 8192; // no bend
    if (aFrequency > 440.0) {
        let frequencyRatio = (Settings.getSetting("aFrequency") - 440.0) / 440.0;
        let fractionOfSemitone = frequencyRatio / (twelfthRootOfTwo - 1);
        bendLevel = Math.ceil(8192 * fractionOfSemitone) + 8192;
    } else if (aFrequency < 440.0) {
        let frequencyRatio = (440.0 - Settings.getSetting("aFrequency")) / 440.0;
        let fractionOfSemitone = frequencyRatio / (twelfthRootOfTwo - 1);
        bendLevel = 8192 - Math.ceil(8192 * fractionOfSemitone);
    }
    synth.setBend(1, bendLevel);
}

function updateFrequencyOfPlayingNote(playingNote) {
    if (playingNotes.hasOwnProperty(playingNote)) {
        updateBendLevel();
        // playingNotes[playingNote].frequency.setValueAtTime(Settings.getSetting("aFrequency") * Math.pow(twelfthRootOfTwo, playingNote - 9), context.currentTime);
    }
}

function playNote(noteValue) {

    getSynth();

    const volume = Math.ceil(Settings.getSetting("volume") * 127);
    updateBendLevel();
    synth.noteOn(1, noteValue + 60, volume);

    playingNotes[noteValue] = true;
}

function stopAllPlaying() {
    let keys = Object.keys(playingNotes);
    for (let i = 0; i < keys.length; i++) {
        stopPlaying(Number.parseInt(keys[i]));
    }
}

function stopPlaying(noteValue) {
    synth.noteOff(1, noteValue + 60);
    delete playingNotes[noteValue];
};

// Expose the sound options so the settings dialogue can use them
function getSounds() {
    return sounds;
}

function noteIsPlaying(note) {
    return playingNotes.hasOwnProperty(note);
}

export {
    playNote,
    stopPlaying,
    stopAllPlaying,
    updateFrequencyOfPlayingNote,
    resetContext,
    getSounds,
    noteIsPlaying,
    initContext
}