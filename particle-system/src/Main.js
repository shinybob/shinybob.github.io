var FireworkDisplay = require('../src/FireworkDisplay');
var originalWindowSize, fireworkDisplay, stage;

require("perf.js");

window.onload = init;

function init() {
    originalWindowSize = {width:window.innerWidth, height:window.innerHeight};
    this.fpsStats = new Perf(Perf.TOP_LEFT);

    this.loader = PIXI.loader
        .add('ripple', '../resources/ripple.png')
        .add('smoke1', '../resources/smoke1.png')
        .add('smoke2', '../resources/smoke2.png')
        .add('smoke3', '../resources/smoke3.png')
        .add('smoke4', '../resources/smoke4.png')
        .add('bodyPart1', '../resources/bodyPart1.png')
        .load(texturesLoaded);
}

function texturesLoaded (loader, resources) {
    setupStage();
    setupFireworkDisplay();
    update();
}

function setupStage() {
    this.app = new PIXI.Application(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.app.view);
    this.app.ticker.add(update);
}

function setupFireworkDisplay() {
    fireworkDisplay = new FireworkDisplay();
    this.app.stage.addChild(fireworkDisplay);
}

function update() {
    TWEEN.update();

    fireworkDisplay.update();

    if(originalWindowSize.width !== window.innerWidth || originalWindowSize.height !== window.innerHeight) {
        window.location = window.location;
    }
}