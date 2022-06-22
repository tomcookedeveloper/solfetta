import * as Settings from './settings.js'

let context = null;
var playingOscillators = {};
var noteOnsets = {};
var playingGainNodes = {};

const sounds = { "square": "Loud Tone", "triangle": "Soft Tone", "sawtooth": "Buzz" };

// Solfetta used to have the ability to add extra latency to note starts to help avoid initial clicks
// on devices where this was a problem. This seems not to be an issue now on devices I have tested on
// so it's no longer exposed in the UI as a config option but the "audioSpeed" setting can still
// be set programmatically to one of the other options
const audioLatencies = { "Slow": 0.2, "Fast": 0.01, "Medium": 0.1 };
const twelfthRootOfTwo = 1.05946309436;

function getContext() {
    if (context == null) {
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        context = new AudioContext();
        return context;
    } else {
        return context;
    }
}

function initContext() {
    getContext();
}

function resetContext() {
    if (context != null) {
        context.close();
    }
    context = null;
}

function getOscillator() {
    var context = getContext();
    var oscillator = context.createOscillator();
    oscillator.type = Settings.getSetting("sound");
    var gain = context.createGain();
    oscillator.connect(gain);
    gain.connect(context.destination);

    return [oscillator, gain];
}

function updateFrequencyOfPlayingNote(playingNote) {
    if (playingOscillators.hasOwnProperty(playingNote)) {
        playingOscillators[playingNote].frequency.setValueAtTime(Settings.getSetting("aFrequency") * Math.pow(twelfthRootOfTwo, playingNote - 9), context.currentTime);
    }
}

function playNote(noteValue) {
    var oscStruct = getOscillator();
    var oscillator = oscStruct[0];
    var gain = oscStruct[1];

    if (!playingOscillators.hasOwnProperty(noteValue)) {
        let context = getContext();
        const audioSpeed = Settings.getSetting("audioSpeed");

        // -9 because our note 0 is middle C not A
        oscillator.frequency.setValueAtTime(Settings.getSetting("aFrequency") * Math.pow(twelfthRootOfTwo, noteValue - 9), context.currentTime); // value in hertz    
        const latency = audioLatencies[audioSpeed];
        const volume = Settings.getSetting("volume");

        oscillator.start(context.currentTime + latency);
        noteOnsets[noteValue] = context.currentTime + latency;
        gain.gain.setValueAtTime(0, context.currentTime);
        gain.gain.setTargetAtTime(volume * volume, context.currentTime + latency, 0.01);

        playingOscillators[noteValue] = oscillator;
        playingGainNodes[noteValue] = gain;
    }
}

function stopAllPlaying() {
    let keys = Object.keys(playingOscillators);
    for (let i = 0; i < keys.length; i++) {
        stopPlaying(keys[i]);
    }
}

function stopPlayingAux(oscillator, gainNode, onset) {
    let context = getContext();
    let nowTime = context.currentTime;
    const endLatency = 0.2;

    // Use the gain node to stop the sound of the node
    gainNode.gain.setValueAtTime(gainNode.gain.value, context.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.08);

    // Keep the oscillator going long enough to allow the note to end without a click
    const duration = nowTime - onset + endLatency;
    oscillator.stop(onset + duration);
}

function getStopPlayingAux(oscillator, gainNode, onset) {
    return function() {
        stopPlayingAux(oscillator, gainNode, onset);
    }
}

function stopPlaying(noteValue) {
    const onset = noteOnsets[noteValue];
    const minDuration = 0.1;
    let context = getContext();
    let nowTime = context.currentTime;
    if ((nowTime - onset) < minDuration) {
        // We enforce a minimum duration to prevent unpleasant clicks from very short touches
        if (playingOscillators[noteValue]) {
            setTimeout(getStopPlayingAux(playingOscillators[noteValue], playingGainNodes[noteValue],
                noteOnsets[noteValue]), (minDuration - (nowTime - onset)) * 1000);
        }
    } else {
        if (playingOscillators.hasOwnProperty(noteValue)) {
            stopPlayingAux(playingOscillators[noteValue], playingGainNodes[noteValue],
                noteOnsets[noteValue]);
        }
    }

    // Clean up
    delete playingOscillators[noteValue];
    delete playingGainNodes[noteValue];
};

// Expose the sound options so the settings dialogue can use them
function getSounds() {
    return sounds;
}

function noteIsPlaying(note) {
    return playingOscillators.hasOwnProperty(note);
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