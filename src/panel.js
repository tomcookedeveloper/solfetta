import * as Display from './display.js';

let panelDefinitions = [];
let savedPanelWidth;

function createPanel(id, buttons) {
    let panel = document.createElement("div");
    panel.id = id;
    panel.classList.add("hiddenPanel");
    panel.classList.add("panel");

    if (buttons && buttons.length > 0) {
        let panelContainer = document.createElement("div");
        panelContainer.id = id + "Container";

        for (let i = 0; i < buttons.length; i++) {
            let buttonParent = document.createElement("div");
            let button = document.createElement("div");
            button.className = "settingsButton";
            button.innerHTML = "<span>" + buttons[i].text + "</span>";
            button.id = buttons[i].id;

            for (var event in buttons[i].eventListeners) {
                if (buttons[i].eventListeners.hasOwnProperty(event)) {
                    button.addEventListener(event, buttons[i].eventListeners[event], { "passive": false });
                }
                if (event === 'click') {
                    // If we're handling click we don't want to inherit the touchstart from body
                    button.addEventListener('touchstart', x => { x.stopPropagation(); }, { "passive": true });
                    button.addEventListener('touchend', Utils.touchWrapper(buttons[i].eventListeners[event]));
                }
            }

            let numberOfClasses = (buttons[i].classes) ? buttons[i].classes.length : 0;
            for (let j = 0; j < numberOfClasses; j++) {
                button.classList.add(buttons[i].classes[j]);
            }
            button.classList.add("diatonic");

            buttonParent.appendChild(button);
            panelContainer.appendChild(buttonParent);
        }
        panel.appendChild(panelContainer);
    }

    document.body.appendChild(panel);
}

// Panels are all constructed ahead of time so we can e.g. update button text whenever
// we like
function createPanels(panelDefinitionsToCreate) {
    for (let panelId in panelDefinitionsToCreate) {
        if (panelDefinitionsToCreate.hasOwnProperty(panelId)) {
            createPanel(panelId, panelDefinitionsToCreate[panelId].buttons);
            panelDefinitions[panelId] = panelDefinitionsToCreate[panelId];
        }
    }
}

// It's a 4x4 units box
// If the end coordinate is the same as the start coordinate, the width/height is 1 unit
// Will need to be changed if css is changed and vice versa
function updatePanelElements(panelId, panelWidth) {
    const lineWidth = 1;
    const spacing = 5;
    const padding = 5;

    // Amount of space for element including border and padding
    let outerWidth = (panelWidth - 5 * spacing) / 4;
    // What we actually set width/height to for a one unit button
    let innerWidth = outerWidth - padding * 2 - lineWidth * 2;

    let buttons = panelDefinitions[panelId].buttons;
    for (let i = 0; i < buttons.length; i++) {
        let button = document.getElementById(buttons[i].id);
        button.style.height = innerWidth + (outerWidth + spacing) * (buttons[i].position[1][1] - buttons[i].position[0][1]) + "px";
        button.style.width = innerWidth + (outerWidth + spacing) * (buttons[i].position[1][0] - buttons[i].position[0][0]) + "px";
        button.style.top = spacing + (outerWidth + spacing) * buttons[i].position[0][1] + "px";
        button.style.left = spacing + (outerWidth + spacing) * buttons[i].position[0][0] + "px";
    }

    savedPanelWidth = panelWidth;
}

function redrawPanel(panelId) {
    updatePanelElements(panelId, savedPanelWidth);
}

// Resize and position all the panels and their buttons to fit our current working area. Changing this
// code will probably require fiddling with CSS as well
function resizePanels(workingWidth, workingHeight, workingTop, workingLeft, buttonWidth) {
    const panelHeight = 4 * (buttonWidth + 12);
    const panelWidth = 4 * (buttonWidth + 12);

    let panels = document.querySelectorAll(".panel");
    for (let i = 0; i < panels.length; i++) {
        let panel = panels[i];
        panel.style.top = (workingHeight - panelHeight) / 2 + workingTop + "px";
        panel.style.left = (workingWidth - panelWidth) / 2 + workingLeft + "px";
        panel.style.width = panelWidth + "px";
        panel.style.height = panelHeight + "px";
    }

    for (let panelId in panelDefinitions) {
        if (panelDefinitions.hasOwnProperty(panelId)) {
            updatePanelElements(panelId, panelWidth);
        }
    }
}

function hideAllPanels() {
    let panels = document.querySelectorAll(".panel");
    for (let i = 0; i < panels.length; i++) {
        let panel = panels[i];
        panel.classList.add("hiddenPanel");
    }
    Display.applyColours();
}

// True if any panel is showing
function isPanelShowing() {
    let panels = document.querySelectorAll(".panel");
    let panelShowing = false;
    for (let i = 0; i < panels.length; i++) {
        let panel = panels[i];
        if (!panel.classList.contains("hiddenPanel")) {
            panelShowing = true;
        }
    }
    return panelShowing;
}

function hidePanel(panel) {
    let panels = document.querySelectorAll(":not(.hiddenPanel).panel");
    for (let i = 0; i < panels.length; i++) {
        let element = panels[i];
        if (element.id === panel) {
            element.classList.add("hiddenPanel");
        }
    }
    Display.applyColours();
}

function showPanel(panel) {
    let panels = document.querySelectorAll(".panel");
    for (let i = 0; i < panels.length; i++) {
        let element = panels[i];
        if (element.id === panel) {
            element.classList.remove("hiddenPanel");
        } else {
            element.classList.add("hiddenPanel");
        }
    }
    Display.applyColours();
}

export {
    createPanels,
    resizePanels,
    hideAllPanels,
    isPanelShowing,
    hidePanel,
    showPanel,
    redrawPanel
}