import * as Music from './music.js'
import * as Settings from './settings.js'
import * as Melodies from './melodies.js'

// Actually returns duration of a whole note in ms
function getSelectedMelodyTempo() {
    const tempo = Melodies.melodies[Settings.getSetting("melodyNumber")].tempo;
    const defaultTempo = 100; // BPM
    let baseDuration = (60000 / defaultTempo) * 4;
    if (tempo !== undefined) {
        baseDuration = (60000 / tempo) * 4;
    }
    return baseDuration;
}

// Find the next note, even if it's in the next phrase, so we can show the correct solfa syllable for an accidental
function peekNextNote(selectedMelody, currentPhrase, currentNoteInPhrase) {
    let allNotes = Melodies.melodies[selectedMelody].notes;
    let phrase = allNotes[currentPhrase];
    let phraseArray = phrase.split(" ");
    let currentNoteName = parseNoteString(phraseArray[currentNoteInPhrase]).noteName;
    while (true) {
        currentNoteInPhrase++;
        if (currentNoteInPhrase >= phraseArray.length) {
            if (currentPhrase >= allNotes.length - 1) {
                return null;
            } else {
                currentPhrase++;
                phrase = allNotes[currentPhrase];
                phraseArray = phrase.split(" ");
                currentNoteInPhrase = 0;
            }
        }
        let note = parseNoteString(phraseArray[currentNoteInPhrase]);
        if (note.noteName && (note.noteName != currentNoteName || note.sign !== "")) {
            // It's not a rest so we can return the note name
            return note;
        }
    }
}

// Try to "centre" the melody around middle C so that it will fit in the range of notes played by
// Solfetta. This returns an adjustment to the initial note number that will be a multiple of 12
// (an integer number of octaves)
function getStartAdjustment(melodyNumber) {
    let currentNote = Settings.getSetting("configuredDo");
    let lowestNote = Number.MAX_VALUE;
    let highestNote = -Number.MAX_VALUE;
    let firstNote = null;

    for (let x = 0; x < Melodies.melodies[melodyNumber].notes.length; x++) {
        let notes = Melodies.melodies[melodyNumber].notes[x].split(" ");

        for (let y = 0; y < notes.length; y++) {
            let note = parseNoteString(notes[y]);
            if (note != null) {
                if (note.noteName) {
                    currentNote = Music.nearestNoteToThisValue(currentNote, note.noteName, note.sign);
                    if (firstNote === null) {
                        firstNote = currentNote;
                    }
                    lowestNote = Math.min(lowestNote, currentNote);
                    highestNote = Math.max(highestNote, currentNote);
                }
            }
        }
    }

    let midpoint = (highestNote + lowestNote) / 2;
    let adjustment = Math.round(midpoint / 12);
    return -adjustment * 12;
}

// Figure out the note before the first note of a phrase. We work this out every time so that
// if we change key when following a melody and repeat a phrase it will repeat as though
// we started in the current key
function getPreviousNote(melodyNumber, melodyPhrase) {
    let currentNote = Settings.getSetting("configuredDo") + getStartAdjustment(melodyNumber);
    if (melodyPhrase === 0) {
        let notes = Melodies.melodies[melodyNumber].notes[0].split(" ");
        for (let y = 0; y < notes.length; y++) {
            let note = parseNoteString(notes[y]);
            if (note != null) {
                if (note.noteName) {
                    currentNote = Music.nearestNoteToThisValue(currentNote, note.noteName, note.sign);
                    break;
                }
            }
        }
    } else {
        for (let x = 0; x < melodyPhrase; x++) {
            let notes = Melodies.melodies[melodyNumber].notes[x].split(" ");
            for (let y = 0; y < notes.length; y++) {
                let note = parseNoteString(notes[y]);
                if (note != null) {
                    if (note.noteName) {
                        currentNote = Music.nearestNoteToThisValue(currentNote, note.noteName, note.sign);
                    }
                }
            }
        }
    }
    return currentNote;
}

// Returns an array of note values which can be used to match against notes played by the user
function getMelodySequence(melodyNumber, melodyPhrase) {
    let melodySequence = [];
    let currentNote = Settings.getSetting("configuredDo") + getStartAdjustment(melodyNumber);
    for (let x = 0; x <= melodyPhrase; x++) {
        let notes = Melodies.melodies[melodyNumber].notes[x].split(" ");
        for (let y = 0; y < notes.length; y++) {
            let note = parseNoteString(notes[y]);
            if (note != null) {
                if (note.noteName) {
                    currentNote = Music.nearestNoteToThisValue(currentNote, note.noteName, note.sign);
                    if (x === melodyPhrase) {
                        melodySequence.push(currentNote);
                    }
                }
            }
        }
    }
    return melodySequence;
}

// Would be nice to support tied notes, haven't added this yet. Could also do with some validation
function parseNoteString(noteString) {
    let matches = noteString.match(/([a-z]+)?([+-]+)?([0-9]+)([.]?)/);
    if (matches) {
        let durationStr = matches[3];
        let dot = matches[4];
        let duration = (1 / parseInt(durationStr)) * (dot === '.' ? 1.5 : 1);

        return {
            "noteName": matches[1],
            "sign": matches[2],
            "duration": duration
        };
    } else {
        return null;
    }
}

export {
    getSelectedMelodyTempo,
    peekNextNote,
    getPreviousNote,
    getMelodySequence,
    parseNoteString
}