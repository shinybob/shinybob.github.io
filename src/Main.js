var FireworkDisplay = require('../src/FireworkDisplay');

window.onload = init;

function init() {
    this.originalWindowSize = {width:window.innerWidth, height:window.innerHeight};

    this.loader = PIXI.loader
        .add('ripple', '../resources/ripple.png')
        .add('smoke1', '../resources/smoke1.png')
        .add('smoke2', '../resources/smoke2.png')
        .add('smoke3', '../resources/smoke3.png')
        .add('smoke4', '../resources/smoke4.png')
        .load(texturesLoaded);
}

function texturesLoaded (loader, resources) {
    setupStage();
    setupFireworkDisplay();
    update();
}

function setupStage() {
    var canvas = document.getElementById('game');
    canvas.style.width = String(window.innerWidth) + 'px';
    canvas.style.height = String(window.innerHeight) + 'px';

    var rendererOptions = {
        antialiasing:false,
        resolution:1,
        backgroundColor:0x000000,
        view:canvas
    };

    this.renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, rendererOptions);
    this.stage = new PIXI.Container();
}

function setupFireworkDisplay() {
    this.fireworkDisplay = new FireworkDisplay();
    this.stage.addChild(this.fireworkDisplay);
}

function update() {
    TWEEN.update();

    this.fireworkDisplay.update();
    this.renderer.render(this.stage);

    if(this.originalWindowSize.width !== window.innerWidth || this.originalWindowSize.height !== window.innerHeight) {
        window.location = window.location;
    }

    window.requestAnimationFrame(update);
}