import * as Settings from "./settings.js"
import * as Utils from './utils.js'

const noteInfoSolfa = [
    { "both": "Do", "raised": "Do", "lowered": "Do", "value": 1 },
    { "both": "Di/Ra", "raised": "Di", "lowered": "Ra", "value": 2 },
    { "both": "Re", "raised": "Re", "lowered": "Re", "value": 3 },
    { "both": "Ri/Me", "raised": "Ri", "lowered": "Me", "value": 4, "inNaturalMinor": true },
    { "both": "Mi", "raised": "Mi", "lowered": "Mi", "value": 5 },
    { "both": "Fa", "raised": "Fa", "lowered": "Fa", "value": 6 },
    { "both": "Fi/Se", "raised": "Fi", "lowered": "Se", "value": 7 },
    { "both": "Sol", "raised": "Sol", "lowered": "Sol", "value": 8 },
    { "both": "Si/Le", "raised": "Si", "lowered": "Le", "value": 9, "inNaturalMinor": true },
    { "both": "La", "raised": "La", "lowered": "La", "value": 10 },
    { "both": "Li/Te", "raised": "Li", "lowered": "Te", "value": 11, "inNaturalMinor": true },
    { "both": "Ti", "raised": "Ti", "lowered": "Ti", "value": 12 }
];

const intervalInfo = [
    { "name": "P1", "type": "perfect" },
    { "name": "m2", "type": "minor" },
    { "name": "M2", "type": "major" },
    { "name": "m3", "type": "minor" },
    { "name": "M3", "type": "major" },
    { "name": "P4", "type": "perfect" },
    { "name": "d5", "type": "diminished/augmented" },
    { "name": "P5", "type": "perfect" },
    { "name": "m6", "type": "minor" },
    { "name": "M6", "type": "major" },
    { "name": "m7", "type": "minor" },
    { "name": "M7", "type": "major" },
    { "name": "P8", "type": "perfect" },
    { "name": "m9", "type": "minor" },
    { "name": "M9", "type": "major" },
    { "name": "m10", "type": "minor" },
    { "name": "M10", "type": "major" },
    { "name": "P11", "type": "perfect" },
    { "name": "d12", "type": "diminished/augmented" },
    { "name": "P12", "type": "perfect" },
    { "name": "m13", "type": "minor" },
    { "name": "M13", "type": "major" },
    { "name": "m14", "type": "minor" },
    { "name": "M14", "type": "major" },
    { "name": "P15", "type": "perfect" }
];

const noteNameInfo = [
    { "sharp": "C", "flat": "C", "both": "C" },
    { "sharp": "C#", "flat": "Db", "both": "C#/Db" },
    { "sharp": "D", "flat": "D", "both": "D" },
    { "sharp": "D#", "flat": "Eb", "both": "D#/Eb" },
    { "sharp": "E", "flat": "E", "both": "E" },
    { "sharp": "F", "flat": "F", "both": "F" },
    { "sharp": "F#", "flat": "Gb", "both": "F#/Gb" },
    { "sharp": "G", "flat": "G", "both": "G" },
    { "sharp": "G#", "flat": "Ab", "both": "G#/Ab" },
    { "sharp": "A", "flat": "A", "both": "A" },
    { "sharp": "A#", "flat": "Bb", "both": "A#/Bb" },
    { "sharp": "B", "flat": "B", "both": "B" }
];

const keyInfo = {
    "Cmajor": {
        "sharps": []
    },
    "Gmajor": {
        "sharps": ["F"]
    },
    "Dmajor": {
        "sharps": ["F", "C"]
    },
    "Amajor": {
        "sharps": ["F", "C", "G"]
    },
    "Emajor": {
        "sharps": ["F", "C", "G", "D"]
    },
    "Bmajor": {
        "sharps": ["F", "C", "G", "D", "A"]
    },
    "F#major": {
        "sharps": ["F", "C", "G", "D", "A", "E"]
    },
    "C#major": {
        "sharps": ["F", "C", "G", "D", "A", "E", "B"]
    },
    "Fmajor": {
        "flats": ["B"]
    },
    "Bbmajor": {
        "flats": ["B", "E"]
    },
    "Ebmajor": {
        "flats": ["B", "E", "A"]
    },
    "Abmajor": {
        "flats": ["B", "E", "A", "D"]
    },
    "Dbmajor": {
        "flats": ["B", "E", "A", "D", "G"]
    },
    "Gbmajor": {
        "flats": ["B", "E", "A", "D", "G", "C"]
    },
    "Cbmajor": {
        "flats": ["B", "E", "A", "D", "G", "C", "F"]
    }
}

function majorKeyFromDo(thisDo) {
    const keyList = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
    return keyList[thisDo];
}

function minorKeyFromDo(thisDo) {
    const keyList = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "G#", "A", "Bb", "B"];
    return keyList[thisDo];
}

function getEquivalentMajorKey(doValue) {
    let selectedKey;
    switch (Settings.getSetting("majorMinor")) {
        case "Major":
            selectedKey = majorKeyFromDo(doValue) + "major";
            break;
        case "Do-based Minor":
            selectedKey = majorKeyFromDo(Utils.mod(doValue + 3, 12)) + "major";
            break;
        case "La-based Minor":
            selectedKey = majorKeyFromDo(doValue) + "major";
            break;
    }
    return selectedKey;
}

function noteIsInKey(noteValue, doValue, tonality) {
    let positionInKey; // Major or relative major
    switch (tonality) {
        case "Major":
            positionInKey = Utils.mod(noteValue - doValue, 12);
            break;
        case "Do-based Minor":
            positionInKey = Utils.mod(noteValue - doValue - 3, 12);
            break;
        case "La-based Minor":
            positionInKey = Utils.mod(noteValue - doValue, 12);
            break;
    }
    return [true, false, true, false, true, true, false, true, false, true, false, true][positionInKey];
}

function noteIsTonic(noteValue, doValue, tonality) {
    let isTonic; // Major or relative major
    switch (tonality) {
        case "Major":
        case "Do-based Minor":
            isTonic = Utils.mod(noteValue - doValue, 12) === 0;
            break;
        case "La-based Minor":
            isTonic = Utils.mod(noteValue - doValue + 3, 12) === 0;
            break;
    }
    return isTonic;
}

function simpleNoteText(noteValue) {
    let info = noteNameInfo[Utils.mod(noteValue, 12)];
    const selectedKey = getEquivalentMajorKey(Settings.getSetting("configuredDo"));
    let isFlatKey = (keyInfo[selectedKey].hasOwnProperty("flats"));
    return isFlatKey ? info["flat"] : info["sharp"];
}

function noteNameText(noteValue) {
    let info = noteNameInfo[Utils.mod(noteValue, 12)];
    const selectedKey = getEquivalentMajorKey(Settings.getSetting("configuredDo"));
    let noteText;
    let isFlatKey = (keyInfo[selectedKey].hasOwnProperty("flats"));
    if (noteIsInKey(noteValue, Settings.getSetting("configuredDo"), Settings.getSetting("majorMinor"))) {
        let thisNoteText = isFlatKey ? info["flat"] : info["sharp"];
        if (isFlatKey && keyInfo[selectedKey].flats.find(element => element === info["flat"]) &&
            thisNoteText.indexOf("b") == -1) {
            // We're in a flat key, and it's supposed to be flattened but isn't already, e.g. we're in Gb
            // major so we want B to be called Cb
            noteText = simpleNoteText(noteValue + 1) + "b";
        } else if (!isFlatKey && keyInfo[selectedKey].sharps.find(element => element === info["sharp"]) &&
            thisNoteText.indexOf("#") == -1) {
            // We're in a sharp key and it's supposed to be sharpened but isn't already. I don't think we
            // actually end up in here
            noteText = simpleNoteText(noteValue - 1) + "#";
        } else {
            noteText = isFlatKey ? info["flat"] : info["sharp"];
        }
    } else {
        // Accidentals are always sharpened or flattened version of an adjacent note
        noteText = isFlatKey ? noteNameText(noteValue + 1) + "b" : noteNameText(noteValue - 1) + "#";
    }

    noteText = noteText.replace("##", "x");

    return noteText;
}

function getNoteSolfa(thisNoteValue) {
    let thisNoteType = Utils.mod(thisNoteValue - Settings.getSetting("configuredDo"), 12);
    return noteInfoSolfa[thisNoteType]["lowered"];
}

function intervalToNote(noteValue, lastNoteValue) {
    return (Math.abs(noteValue - lastNoteValue));
}

function getNoteText(thisNoteValue, lastNoteValue, nextNoteValue, tonality) {
    // tonality is an override for configured tonality used for melody preview mode
    let noteText = "";
    const displayMode = Settings.getSetting("displayMode");
    let thisNoteType = Utils.mod(thisNoteValue - Settings.getSetting("configuredDo"), 12);

    if (displayMode === "solfege") {
        if (Settings.getSetting("raisedLowered") == "both" && nextNoteValue !== undefined) {
            if (nextNoteValue < thisNoteValue || (tonality == "Minor" && noteInfoSolfa[thisNoteType].inNaturalMinor)) {
                noteText = noteInfoSolfa[thisNoteType]["lowered"];
            } else {
                noteText = noteInfoSolfa[thisNoteType]["raised"];
            }
        } else {
            noteText = noteInfoSolfa[thisNoteType][Settings.getSetting("raisedLowered")];
        }
        if (noteText === "Sol") {
            noteText = Settings.getSetting("soSol");
        }
    } else if (displayMode === "intervals") {
        let interval = intervalToNote(thisNoteValue, lastNoteValue)
        if (interval <= 24) {
            let info = intervalInfo[interval];
            noteText = info.name;
        } else {
            noteText = "";
        }
    } else if (displayMode === "noteNames") {
        noteText = noteNameText(thisNoteValue);
    }

    return noteText;
}

// The format of melody strings uses the nearest note to the previous one with the supplied solfa syllable
// name by default, this can be shifted up or down a given number of octaves if needed with the sign string
function nearestNoteToThisValue(noteValue, solfaName, sign) {
    let currentNoteName = getNoteSolfa(noteValue);
    let currentNoteIdx, newNoteIdx;
    for (let i = 0; i < noteInfoSolfa.length; i++) {
        if (noteInfoSolfa[i].lowered.toLowerCase() === currentNoteName.toLowerCase()) {
            currentNoteIdx = i;
        }
        if (noteInfoSolfa[i].lowered.toLowerCase() === solfaName.toLowerCase()) {
            newNoteIdx = i;
        }
    }
    let ascendingDistance, descendingDistance;
    if (newNoteIdx > currentNoteIdx) {
        ascendingDistance = newNoteIdx - currentNoteIdx;
        descendingDistance = (currentNoteIdx + 12) - newNoteIdx;
    } else {
        ascendingDistance = (newNoteIdx + 12) - currentNoteIdx;
        descendingDistance = currentNoteIdx - newNoteIdx;
    }

    let newNote;
    if (ascendingDistance <= descendingDistance) {
        newNote = noteValue + ascendingDistance;
    } else {
        newNote = noteValue - descendingDistance;
    }

    // Deal with the fact that we might actually want a given number of octaves lower or
    // higher than the nearest note
    if (sign) {
        for (let i = 0; i < sign.length; i++) {
            if (sign[i] === '-') {
                newNote -= 12;
            } else if (sign[i] === '+') {
                newNote += 12;
            }
        }
    }

    return newNote;
}

export {
    getNoteText,
    noteIsInKey,
    noteIsTonic,
    majorKeyFromDo,
    minorKeyFromDo,
    nearestNoteToThisValue,
}