import * as Music from './music.js'
import * as Settings from './settings.js'
import * as Melodies from './melodies.js'
import * as Audio from './audio.js'
import * as Panel from './panel.js'
import * as NoteButtons from './note-buttons.js'
import * as MelodyUtils from './melody-utils.js'

var lastEventDetails = {
    "event": null,
    "eventFunction": null,
    "timeMeasuredFrom": 0,
    "scheduledTime": 0
};
var queuedEvents = []; // We track queued events in here so we can cancel them
let playerSequence = []; // Sequence of notes that has been played by the user

var playingMelody = false; // Is the user currently copying a melody?
var melodyDifficulty = "easy";

var melodyPhrase = 0; // The part of the melody we're working on

function getMelodySequence() {
    return MelodyUtils.getMelodySequence(Settings.getSetting("melodyNumber"), melodyPhrase);
}

function processPlayedNote(playedNote) {
    if (playingMelody) {
        let melodySequence = getMelodySequence();
        playerSequence.push(playedNote);
        if (melodySequence.length > 0) { // is the user currently repeating a phrase?
            if (playerSequence.length > melodySequence.length) {
                // Trim the sequence of notes played by the user so it matches the length of the phrase we are copying
                playerSequence = playerSequence.slice(playerSequence.length - melodySequence.length, playerSequence.length);
            }
            if (playerSequence.length == melodySequence.length) {
                var match = true;
                for (let i = 0; i < playerSequence.length; i++) {
                    if (playerSequence[i] != melodySequence[i]) {
                        match = false;
                        break;
                    }
                }
                if (match) {
                    advanceMelody(); // true means move on to next phrase
                }
            }
        }
        highlightNextNote();
    }
}

function scheduleNextEvent() {
    if (queuedEvents.length > 0) {
        const nextEvent = queuedEvents.shift();
        const scheduleTime = nextEvent[1] / Settings.getSetting("playSpeed");
        const event = setTimeout(nextEvent[0], scheduleTime);
        lastEventDetails.timeMeasuredFrom = (new Date()).getTime();
        lastEventDetails.scheduledTime = nextEvent[1];
        lastEventDetails.event = event;
        lastEventDetails.eventFunction = nextEvent[0];
    } else {
        lastEventDetails.event = null;
    }
}

// We have this so play speed changes can be more responsive
function rescheduleNextEvent() {
    if (lastEventDetails.event != null) {
        let newScheduleTime = lastEventDetails.timeMeasuredFrom - (new Date()).getTime() +
            lastEventDetails.scheduledTime / Settings.getSetting("playSpeed");
        newScheduleTime = Math.max(newScheduleTime, 0);
        clearTimeout(lastEventDetails.event);
        const event = setTimeout(lastEventDetails.eventFunction, newScheduleTime);
        lastEventDetails.event = event;
        lastEventDetails.timeMeasuredFrom = (new Date()).getTime();
        // Note that lastEventDetails.scheduledTime and lastEventDetails.eventFunction don't change
    }
}

function getNotePlayFunction(selectedNote, noteNumber, noteText) {
    let x = selectedNote;
    let n = noteNumber;
    let t = noteText;
    return function() {
        Panel.showPanel("playing");
        Audio.playNote(x);
        if (t !== undefined) {
            // First event for each phrase will update text when previewing melody
            document.getElementById("playingText").innerHTML = "<div>" + t + "</div>";
        }
        if (n !== undefined) {
            highlightPlayingNote(n);
        }
        scheduleNextEvent();
    };
}

function getNoteStopFunction(selectedNote) {
    let x = selectedNote;
    return function() {
        Audio.stopPlaying(x);
        scheduleNextEvent();
    }
}

function highlightPlayingNote(n) {
    let currentHighlightedNotes = document.querySelectorAll(".playingNote");
    for (let i = 0; i < currentHighlightedNotes.length; i++) {
        currentHighlightedNotes[i].classList.remove("playingNote");
    }
    let playingNote = document.getElementById("playingNote" + n);
    if (playingNote !== null) {
        document.getElementById("playingNote" + n).classList.add("playingNote");
    }
}

function melodyCompleted() {
    playingMelody = false;
    document.getElementById("messageText").innerHTML = "Melody completed!";
    Panel.showPanel("message");
    setTimeout(function() { Panel.hidePanel("message"); }, 1000);
    clearMelodyHighlight();
}

function startMelody(difficulty) {
    let melodyNumber = Settings.getSetting("melodyNumber");
    melodyDifficulty = difficulty;
    melodyPhrase = 0;
    clearPlayerSequence();
    // Set tonality to match song
    let tonality = Melodies.melodies[melodyNumber].tonality;
    if (tonality && tonality !== Settings.getSetting("tonality")) {
        Settings.setSetting("tonality", tonality);
        NoteButtons.displayNotes();
    }

    playMelody();
}

// Doesn't actually schedule notes to be played, just places them on a queue to be pulled from
// when we want to schedule the next event.
// Text will be supplied only by the first note of a phrase
function queueNotes(notesToQueue, lastEventOnset, initialText) {
    for (let i = 0; i < notesToQueue.length; i++) {
        if (i === 0) {
            queuedEvents.push([getNotePlayFunction(notesToQueue[i][0], i, initialText), notesToQueue[i][1] - lastEventOnset]);
        } else {
            queuedEvents.push([getNotePlayFunction(notesToQueue[i][0], i), notesToQueue[i][1] - lastEventOnset]);
        }
        const noteEnd = notesToQueue[i][2] - notesToQueue[i][1];
        queuedEvents.push([getNoteStopFunction(notesToQueue[i][0]), noteEnd]);
        lastEventOnset = notesToQueue[i][2];
    }
    return lastEventOnset;
}

function buildMelodyPlayData(melodyNumber, melodyPhrase, delay) {
    const noteGap = Settings.getSetting("noteGap"); // stop note x ms before next
    const baseDuration = MelodyUtils.getSelectedMelodyTempo();
    let currentTime = (delay > 0) ? delay : 0; // the time the last note or rest finished
    let text = ""; // accumulate text to show to user for phrase in here
    // lastNote is the last note we played before starting this phrase
    let lastNote = MelodyUtils.getPreviousNote(melodyNumber, melodyPhrase);
    const phraseString = Melodies.melodies[melodyNumber].notes[melodyPhrase];
    const noteStrings = phraseString.split(" ");
    let noteNumber = 0;
    let notesToQueue = [];
    for (let i = 0; i < noteStrings.length; i++) {
        let note = MelodyUtils.parseNoteString(noteStrings[i]);
        if (note) {
            let duration = note.duration * baseDuration;
            if (note.noteName) {
                let currentNote = Music.nearestNoteToThisValue(lastNote, note.noteName, note.sign);
                // We need to peek at the next note to support using the correct version of a solfa accidental e.g.
                // ri vs me
                let peekNote = MelodyUtils.peekNextNote(melodyNumber, melodyPhrase, i);
                let nextNote = (peekNote !== null) ? Music.nearestNoteToThisValue(currentNote, peekNote.noteName, peekNote.sign) : currentNote;
                // Each queued note is [note value, start time, end time[
                notesToQueue.push([currentNote, currentTime, currentTime + duration - noteGap]);
                text += "<span id=\"playingNote" + noteNumber + "\">" +
                    Music.getNoteText(currentNote, lastNote, nextNote, Melodies.melodies[melodyNumber].tonality) + "</span> ";
                lastNote = currentNote;
                noteNumber++;
            }
            currentTime += duration;
        }
    }

    return { "text": text, "notesToQueue": notesToQueue, "endTime": currentTime }
}

// Start playing by scheduling first event on the queue
function scheduleFirstEvent() {
    if (queuedEvents.length > 0) {
        let firstEvent = queuedEvents.shift();
        setTimeout(firstEvent[0], firstEvent[1]);
    }
}

function playMelody(delay) {
    let melodyPlayData = buildMelodyPlayData(Settings.getSetting("melodyNumber"), melodyPhrase, delay);

    queuedEvents = []; // clear global queue of events to be scheduled

    // Queue events for the current phrase
    queueNotes(melodyPlayData.notesToQueue, 0, (melodyDifficulty !== "hard") ? melodyPlayData.text : "Playing...");

    // Show the panel, queue an event to show the hide the panel, and schedule the first event
    if (queuedEvents.length > 0) {
        queuedEvents.push([function() { Panel.hidePanel("playing"); }, 0]);
        scheduleFirstEvent();
    }

    if (Settings.getSetting("displayMode") === "intervals" && melodyPhrase === 0) {
        // We want to make sure the first note is displayed as P1
        NoteButtons.setLastNoteValue(getMelodySequence()[0]);
        NoteButtons.displayNotes();
    }

    playingMelody = true; // global variable that indicates the user is now repeating a played melody
    highlightNextNote();
}

function previewMelody() {
    const melodyNumber = Settings.getSetting("melodyNumber");
    let lastEventOnset = 0;
    let startTime = 0;

    queuedEvents = []; // clear global queue of events to be scheduled

    // Queue all events for this melody
    for (let phrase = 0; phrase < Melodies.melodies[melodyNumber].notes.length; phrase++) {
        let melodyPlayData = buildMelodyPlayData(Settings.getSetting("melodyNumber"), phrase, startTime);
        lastEventOnset = queueNotes(melodyPlayData.notesToQueue, lastEventOnset, melodyPlayData.text);
        startTime = melodyPlayData.endTime;
    }

    // Show the panel, queue an event to show the melody panel again, and schedule the first event
    Panel.showPanel("playing");
    if (queuedEvents.length > 0) {
        queuedEvents.push([function() { Panel.showPanel("melody"); }, 0]);
        scheduleFirstEvent();
    }
}

// Highlight next note of melody currently being repeated by user
function setMelodyHighlight(noteValue) {
    document.getElementById("noteButton" + NoteButtons.noteValueToNoteButtonNumber(noteValue)).classList.add("melodyHighlight");
}

function clearMelodyHighlight() {
    // Shouldn't actually be more than one but allow for more
    let noteButtons = document.querySelectorAll(".melodyHighlight");
    for (let i = 0; i < noteButtons.length; i++) {
        let noteButton = noteButtons[i];
        noteButton.classList.remove("melodyHighlight");
    }
}

function highlightNextNote() {
    clearMelodyHighlight();
    // Always highlight first note in sequence when it's the next note that should be played,
    // only highlight others in easy mode
    if (playingMelody && (melodyDifficulty === "easy" || bestMatchingLength === 0)) {
        let melodySequence = getMelodySequence();
        let bestMatchingLength = 0;

        // We want to work out the overlap between the end of the player sequence and the beginning
        // of the melody sequence
        var maxLengthToTest = Math.min(melodySequence.length, playerSequence.length);
        for (let i = 1; i <= maxLengthToTest; i++) {
            let matchOk = true;
            for (let j = 0; j < i; j++) {
                if (!(melodySequence[j] === playerSequence[playerSequence.length - i + j])) {
                    matchOk = false;
                    break;
                }
            }
            if (matchOk) {
                bestMatchingLength = i;
            }
        }

        setMelodyHighlight(melodySequence[bestMatchingLength]);
    }
}

function clearPlayerSequence() {
    playerSequence = [];
}

function advanceMelody() {
    Panel.hideAllPanels();
    playerSequence = [];
    if (melodyPhrase >= (Melodies.melodies[Settings.getSetting("melodyNumber")].notes.length - 1)) {
        melodyCompleted();
    } else {
        melodyPhrase += 1;
        playMelody(250);
    }
}

function stopMelodyPlaying() {
    Audio.stopAllPlaying();
    queuedEvents = [];
    if (lastEventDetails.event != null) {
        clearTimeout(lastEventDetails.event);
        lastEventDetails.event = null;
    }
    Panel.showPanel("melody");
}

function isPlayingMelody() {
    return playingMelody;
}

function clearPlayingMelody() {
    playingMelody = false;
}

export {
    highlightNextNote,
    processPlayedNote,
    clearMelodyHighlight,
    clearPlayerSequence,
    isPlayingMelody,
    startMelody,
    previewMelody,
    playMelody,
    stopMelodyPlaying,
    clearPlayingMelody,
    rescheduleNextEvent
}