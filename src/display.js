import * as Settings from './settings.js'
import * as Panel from './panel.js'

// Decide the best width and height (in terms of number of buttons) for the given pixel dimensions
function selectLayout(workingWidth, workingHeight) {

    // When layouts don't have good button size, we only care about button size when comparing them
    function compareLayoutSizes(a, b) {
        let aSize = Math.min(workingHeight / a.height, workingWidth / a.width);
        let bSize = Math.min(workingHeight / b.height, workingWidth / b.width);
        if (bSize != aSize) {
            return bSize - aSize;
        } else {
            return (b.width * b.height) - (a.width * a.height);
        }
    }

    // Any layout that gives more than this much space for each button will automatically beat any 
    // layout that doesn't
    const idealWidth = 65;

    let sizes = [{ "width": 5, height: 10, score: 3 }, { "width": 10, height: 5, score: 3 },
        { "width": 5, height: 9, score: 2 }, { "width": 9, height: 5, score: 2 },
        { "width": 5, height: 8, score: 1 }, { "width": 8, height: 5, score: 1 },
        { "width": 6, height: 8, score: 3 }, { "width": 8, height: 6, score: 3 },
        { "width": 6, height: 7, score: 2 }, { "width": 7, height: 6, score: 2 },
        { "width": 7, height: 7, score: 3 }
    ]

    let goodLayouts = [];
    let acceptableLayouts = []
    for (let i = 0; i < sizes.length; i++) {
        let squareSize = Math.min(workingHeight / sizes[i].height, workingWidth / sizes[i].width);
        if (squareSize > idealWidth) {
            goodLayouts.push(sizes[i]);
        }
        if (squareSize > Settings.getSetting("minWidth")) {
            acceptableLayouts.push(sizes[i]);
        }
    }
    var selectedLayout;
    if (goodLayouts.length > 0) {
        goodLayouts.sort(function(a, b) {
            // Format = 1 means landscape, 0 = portrait
            const bFormat = Math.floor(b.width / b.height);
            const aFormat = Math.floor(a.width / a.height);
            const displayFormat = Math.floor(workingWidth / workingHeight);
            if (aFormat != bFormat) {
                // Different aspect ratios, the one that matches display format we're fitting into wins
                return (bFormat == displayFormat) ? 1 : -1;
            } else if (a.score != b.score) {
                // Different scores, highest scoring wins
                return b.score - a.score;
            } else {
                // If all else the same, most buttons wins
                return b.width * b.height > a.width * a.height;
            }
        });
        selectedLayout = goodLayouts[0];
    } else if (acceptableLayouts.length > 0) {
        acceptableLayouts.sort(compareLayoutSizes);
        selectedLayout = acceptableLayouts[0];
    } else {
        // We're going to limit to min size anyway but let's pick the layout (out of all of them) that
        // gives the best button size
        sizes.sort(compareLayoutSizes);
        selectedLayout = sizes[0];
    }

    return selectedLayout;
}

function getWorkingDimensions() {
    let workingHeight = document.documentElement.clientHeight;
    let workingWidth = document.documentElement.clientWidth;

    // Figure out the safe area properties that help us avoid drawing buttons over phone notches etc
    let sat = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--sat"));
    let sab = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--sab"));
    let sal = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--sal"));
    let sar = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--sar"));
    sat = !isNaN(sat) ? sat : 0;
    sab = !isNaN(sab) ? sab : 0;
    sal = !isNaN(sal) ? sal : 0;
    sar = !isNaN(sar) ? sar : 0;

    workingWidth -= (sal + sar);
    workingHeight -= (sat + sab);

    // We're returning the area we can draw in and it's offset in the client area
    return [workingWidth, workingHeight, sat, sal];
}

// Apply current selected light/dark style
function applyColours() {
    let panels = document.querySelectorAll(".darkMode, body, html, .button, .settingsButton, .panel");
    const darkMode = Settings.getSetting("darkMode");
    for (let i = 0; i < panels.length; i++) {
        let element = panels[i];
        if (darkMode) {
            element.classList.add("darkMode");
            element.classList.remove("lightMode");
        } else {
            element.classList.remove("darkMode");
            element.classList.add("lightMode");
        }
    }
    applyNoteOpacity();
}

// Reduce opacity of notes when panel is shown on top
function applyNoteOpacity() {
    let opacity;
    if (Panel.isPanelShowing()) {
        opacity = 0.25;
    } else {
        opacity = 1.0;
    }
    let notes = document.querySelectorAll(".noteButton")
    for (let i = 0; i < notes.length; i++) {
        notes[i].style.opacity = opacity;
    }
}

export {
    getWorkingDimensions,
    selectLayout,
    applyColours
};