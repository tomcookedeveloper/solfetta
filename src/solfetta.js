import * as Settings from './settings.js';
import * as Utils from './utils.js';
import * as Audio from './audio.js';
import * as Display from './display.js';
import * as MelodyPanels from './melody-panels.js'
import * as Panel from './panel.js'
import * as NoteButtons from './note-buttons.js'
import * as FeatureBar from './feature-bar.js'
import * as MelodyPlay from './melody-play.js'

// We have to poll to make sure we don't miss a size change, we track the last size
// here and only rebuild if we see a different size
var lastWidth;
var lastHeight;

function backgroundFunction() {
    browserResized();
}

function visibilityChanged() {
    // Ios 15 suspend kills audio context
    if (Utils.isIOS() && document.visibilityState === 'visible') {
        Audio.resetContext();
    }
}

function browserResized(force) {
    // Figure out the screen size including e.g. iPhone adjustments
    var workingDimensions = Display.getWorkingDimensions();
    var workingWidth = workingDimensions[0];
    var workingHeight = workingDimensions[1];
    var workingTop = workingDimensions[2];
    var workingLeft = workingDimensions[3];

    const margin = 3;

    // If no change to dimensions since we last attempted resize, don't do anything
    if (force || (lastWidth !== workingWidth || lastHeight !== workingHeight)) {
        lastWidth = workingWidth;
        lastHeight = workingHeight;
    } else {
        return;
    }

    // Figure out what layout best matches the dimensions we have
    let selectedLayout = Display.selectLayout(workingWidth, workingHeight);

    // Create the note buttons
    const numberOfFeatureButtons = 5;
    NoteButtons.createNoteButtons(selectedLayout.width, selectedLayout.height, numberOfFeatureButtons);

    // Calculate button width and font size
    let buttonWidth = Math.max(Math.min(workingHeight / selectedLayout.height, workingWidth / selectedLayout.width), Settings.getSetting("minWidth"));
    buttonWidth -= (margin * 2); // allow for margins between squares

    // Calculate width and height of content we are going to display
    var calculatedWidth = selectedLayout.width * buttonWidth + (selectedLayout.width * 2 - 1) * margin;
    var calculatedHeight = selectedLayout.height * buttonWidth + (selectedLayout.height * 2 - 1) * margin;

    // Centre content within display window
    var contentTop = ((workingHeight - calculatedHeight) / 2) + workingTop;
    var contentLeft = ((workingWidth - calculatedWidth) / 2) + workingLeft;

    // Resize all the buttons including feature buttons and set font size
    NoteButtons.resize(selectedLayout, buttonWidth, margin, contentLeft, contentTop);
    FeatureBar.resize(selectedLayout, buttonWidth, margin, contentLeft, contentTop);

    // Resize all the panels and update the note button contents
    Panel.resizePanels(workingWidth, workingHeight, workingTop, workingLeft, buttonWidth);
    NoteButtons.displayNotes();
    MelodyPlay.highlightNextNote();
}

function showSplash() {
    let lastRun = Settings.getSetting("lastRun");
    if (((new Date()).getTime() - lastRun) > 7 * 24 * 60 * 60 * 1000) {
        Panel.showPanel("splash");
    }
    Settings.setSetting("lastRun", (new Date()).getTime());
}

function initGame() {
    // Receive resize events
    window.addEventListener('resize', browserResized);

    document.body.addEventListener('mousedown', Utils.onClickWrapper(Utils.backgroundMouseDown));
    document.body.addEventListener('touchstart', Utils.touchWrapper(Utils.onClickWrapper(Utils.backgroundMouseDown)), { "passive": false });
    document.addEventListener("visibilitychange", visibilityChanged);

    // Create the settings panels
    Settings.init();

    // Create the melody panels
    MelodyPanels.init()

    // Add the feature bar
    FeatureBar.createFeatureBar();

    // Do initial display and start timer
    browserResized();
    NoteButtons.setLastNoteValue(0);
    NoteButtons.displayNotes();
    Display.applyColours();
    setInterval(backgroundFunction, 100);

    // Show splash screen if we haven't run in a while
    showSplash();
}

initGame();

export {
    initGame,
    browserResized
}